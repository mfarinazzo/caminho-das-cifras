#!/usr/bin/env python3
"""
Corrige os 17 cantos gerados incorretamente a partir do todos.json.
Parse correto do HTML base64 para extrair acordes e letras separadamente.
"""

import json
import os
import re
import base64
import html
from typing import Dict, Any, List, Tuple, Optional

try:
    from detect_keys import detect_song_key
except ImportError:  # fallback quando script estiver fora do PYTHONPATH
    detect_song_key = None

WORD_PATTERN = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ0-9'’\-]+", re.UNICODE)
CHORD_PATTERN = re.compile(r"(?:Do|Re|Mi|Fa|Sol|La|Si|C|D|E|F|G|A|B)[^\s]*", re.IGNORECASE)
INDICATOR_PATTERN = re.compile(r"^(S\.|A\.|T\.|B\.|Refrão|R\.)([\s:]+)(.*)$", re.IGNORECASE)

def normalize_filename(title: str) -> str:
    """Normaliza o título para criar um nome de arquivo."""
    import unicodedata
    title = unicodedata.normalize('NFD', title)
    title = ''.join(c for c in title if unicodedata.category(c) != 'Mn')
    title = title.lower().strip()
    title = re.sub(r'[^\w\s-]', '', title)
    title = re.sub(r'[-\s]+', '-', title)
    return title.strip('-')

def get_category_folder(categoria: int) -> str:
    """Mapeia o ID da categoria para o nome da pasta."""
    mapping = {1: "pre-catecumenato", 2: "catecumenato", 3: "eleicao", 4: "liturgia"}
    return mapping.get(categoria, "pre-catecumenato")

def strip_html_preserve(line: str) -> str:
    """Remove tags HTML preservando espaços e retorna a linha decodificada."""
    text = re.sub(r'<[^>]+>', '', line)
    text = html.unescape(text)
    text = text.replace('\xa0', ' ')
    return text.rstrip('\r\n')

def parse_lyric_line(raw_text: str) -> Tuple[str, str, int]:
    """Extrai indicador, texto da letra e posição inicial na linha original."""
    # Remove quebras extras mas mantém espaços para alinhamento
    raw_text = raw_text.rstrip()
    leading_offset = len(raw_text) - len(raw_text.lstrip(' '))
    working = raw_text.lstrip(' ')

    indicador = "S."
    start_index = raw_text.find(working)
    lyric_text = working

    match = INDICATOR_PATTERN.match(working)
    if match:
        indicador = match.group(1).upper()
        remainder = match.group(3)
        remainder_leading = len(remainder) - len(remainder.lstrip(' '))
        lyric_text = remainder.strip()
        start_index = start_index + match.start(3) + remainder_leading
    else:
        lyric_text = working.strip()
        start_index = raw_text.find(lyric_text)

    if start_index < 0:
        start_index = leading_offset

    return indicador, lyric_text, start_index

def pick_word_for_chord(lyric_text: str, column: int) -> Tuple[str, int]:
    """Seleciona a palavra alvo e sua ocorrência com base na coluna do acorde."""
    if not lyric_text:
        return lyric_text, 1

    spans = [(m.group(0), m.start(), m.end()) for m in WORD_PATTERN.finditer(lyric_text)]
    if not spans:
        return lyric_text, 1

    selected = None
    for word, start, end in spans:
        if start <= column < end:
            selected = (word, start, end)
            break

    if selected is None:
        # Escolhe a palavra mais próxima da coluna
        selected = min(spans, key=lambda item: min(abs(column - item[1]), abs(column - item[2])))

    word, start, _ = selected
    occurrence = 1
    for other_word, other_start, _ in spans:
        if other_start >= start:
            break
        if other_word.lower() == word.lower():
            occurrence += 1

    return word, occurrence

def extract_chords_and_lyrics(html_content: str) -> Tuple[str, Dict[str, Any], List[Dict[str, Any]]]:
    """
    Extrai acordes (linhas vermelhas) e letras (linhas pretas) do HTML.
    Retorna (referencia, capo_info, estrofes)
    """
    # Decodifica HTML entities
    html_content = html.unescape(html_content)
    
    # Extrai referência (primeira linha em negrito após o título)
    ref_match = re.search(r'<b>([^<]+?(?:\d+[,\s]*\d+-\d+|SALMO|CÂNTICO)[^<]*?)</b>', html_content, re.IGNORECASE)
    referencia = ref_match.group(1).strip() if ref_match else None
    
    # Extrai informações de capo/bracadeira
    capo_info = {"tem": False, "casa": None}
    capo_match = re.search(r'Braçadeira\s+(\d+)[ªº]?\s*(?:Traste|Casa)', html_content, re.IGNORECASE)
    if capo_match:
        capo_info["tem"] = True
        capo_info["casa"] = f"{capo_match.group(1)}ª"
    
    # Remove <head> e tudo antes de <body>
    body_match = re.search(r'<body[^>]*>(.*)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if body_match:
        html_content = body_match.group(1)
    
    # Remove título (primeiro H1)
    html_content = re.sub(r'<H1>.*?</H1>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove spans invisíveis (@capot@, @transp@)
    html_content = re.sub(r'<span class="inv">.*?</span>', '', html_content, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove tags div mas preserva quebras
    html_content = re.sub(r'</?div[^>]*>', '\n', html_content, flags=re.IGNORECASE)

    raw_lines = html_content.split('\n')
    processed_lines: List[Dict[str, Any]] = []
    current_color = None

    for raw_line in raw_lines:
        if not raw_line.strip():
            continue

        color_match = re.search(r'<FONT COLOR=["\']#([0-9A-F]{6})["\']>', raw_line, re.IGNORECASE)
        if color_match:
            current_color = color_match.group(1).upper()

        line_without_tags = strip_html_preserve(raw_line)
        if not line_without_tags or not line_without_tags.strip():
            continue

        if referencia and line_without_tags.strip() == referencia.strip():
            continue

        processed_lines.append({
            "raw": line_without_tags,
            "is_chord": current_color == 'FF0000'
        })

    estrofes: List[Dict[str, Any]] = []
    current_estrofe: Optional[Dict[str, Any]] = None
    i = 0

    while i < len(processed_lines):
        entry = processed_lines[i]
        if entry["is_chord"]:
            chord_line = entry["raw"]
            if i + 1 < len(processed_lines) and not processed_lines[i + 1]["is_chord"]:
                lyric_entry = processed_lines[i + 1]
                indicador, lyric_text, start_index = parse_lyric_line(lyric_entry["raw"])
                lyric_text = lyric_text.strip()

                if not lyric_text:
                    i += 2
                    continue

                if current_estrofe is None or current_estrofe["indicador"] != indicador:
                    if current_estrofe and current_estrofe["linhas"]:
                        estrofes.append(current_estrofe)
                    current_estrofe = {
                        "indicador": indicador,
                        "repeticao": None,
                        "linhas": []
                    }

                acordes_obj: List[Dict[str, Any]] = []
                for match in CHORD_PATTERN.finditer(chord_line):
                    cifra = match.group(0).strip()
                    if not cifra:
                        continue
                    relative_column = match.start() - start_index
                    if relative_column < 0:
                        relative_column = 0
                    palavra_alvo, occurrence = pick_word_for_chord(lyric_text, relative_column)
                    acordes_obj.append({
                        "cifra": cifra,
                        "palavra_alvo": palavra_alvo,
                        "ocorrencia_palavra": occurrence,
                        "posicao": relative_column
                    })

                current_estrofe["linhas"].append({
                    "letra": lyric_text,
                    "acordes": acordes_obj
                })
                i += 2
                continue
        else:
            indicador, lyric_text, _ = parse_lyric_line(entry["raw"])
            lyric_text = lyric_text.strip()

            if not lyric_text:
                i += 1
                continue

            if current_estrofe is None or current_estrofe["indicador"] != indicador:
                if current_estrofe and current_estrofe["linhas"]:
                    estrofes.append(current_estrofe)
                current_estrofe = {
                    "indicador": indicador,
                    "repeticao": None,
                    "linhas": []
                }

            current_estrofe["linhas"].append({
                "letra": lyric_text,
                "acordes": []
            })

        i += 1

    if current_estrofe and current_estrofe["linhas"]:
        estrofes.append(current_estrofe)

    return referencia, capo_info, estrofes

def fix_song(song: Dict[str, Any], songs_dir: str) -> bool:
    """Corrige um canto individual."""
    titulo = song.get('titulo', '').strip().upper()
    categoria_id = song.get('categoria', 1)
    category_folder = get_category_folder(categoria_id)
    
    # Gera nome do arquivo
    filename = normalize_filename(titulo) + '.json'
    output_path = os.path.join(songs_dir, category_folder, filename)
    
    if not os.path.exists(output_path):
        print(f"  ⊗ Arquivo não existe: {filename}")
        return False
    
    # Lê arquivo atual
    with open(output_path, 'r', encoding='utf-8') as f:
        current_data = json.load(f)
    
    # Parse o HTML base64
    html_base64 = song.get('html_base64', '')
    if not html_base64:
        print(f"  ⊗ Sem HTML base64: {filename}")
        return False
    
    try:
        html_content = base64.b64decode(html_base64).decode('utf-8')
        referencia, capo_info, estrofes = extract_chords_and_lyrics(html_content)
        
        # Atualiza dados
        if referencia:
            current_data['referencia'] = referencia
        current_data['bracadeira'] = capo_info
        current_data['colunas'] = [{
            "id": 1,
            "estrofes": estrofes
        }]

        if detect_song_key:
            detected_tom = detect_song_key(current_data)
            if detected_tom:
                existing_tom = current_data.get('tom')
                if not isinstance(existing_tom, str) or not existing_tom.strip():
                    current_data['tom'] = detected_tom
                elif existing_tom.strip().lower() != detected_tom.lower():
                    current_data['tom'] = detected_tom
        
        # Salva arquivo corrigido
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(current_data, f, ensure_ascii=False, indent=2)
        
        print(f"  ✓ Corrigido: {filename} ({len(estrofes)} estrofes)")
        return True
        
    except Exception as e:
        print(f"  ✗ Erro ao processar {filename}: {e}")
        return False

def main():
    # Lista dos 17 cantos gerados (títulos exatos como estão no todos.json)
    cantos_gerados = [
        "A ESPADA",
        "À VÍTIMA PASCAL",  # com crase
        "ALELUIA INTERLECCIONAL",
        "AS ARMAS DA LUZ",
        "BENDITA ÉS TÚ, MARIA",  # TÚ com acento
        "CHEGUE À TUA PRESENÇA O MEU CLAMOR",
        "DAYENÚ",  # com acento no U
        "ELÍ, ELÍ, LAMÁ SABATANI",  # ELÍ com acento, SABATANI sem C
        "IDE E ANUNCIAI A MEUS IRMÃOS",
        "IMPROPERIOS",  # sem acento
        "LEVANTO MEUS OLHOS PARA OS MONTES",
        "O MESSIAS LEÃO PARA VENCER",
        "Ó MORTE, ONDE ESTÁ TUA VITÓRIA",  # sem A antes de TUA
        "ORAÇÃO EUCARISTICA II",  # sem acento em EUCARISTICA
        "OS MENINOS DE BELEM",  # sem acento em BELEM
        "ROUBASTE MEU CORAÇÃO",
        "SENHOR, NÃO ME CORRIJAS NA SUA CÓLERA"
    ]
    
    # Carrega todos.json
    todos_path = '../app-react-native/src/data/songs/todos.json'
    with open(todos_path, 'r', encoding='utf-8') as f:
        todos = json.load(f)
    
    # Cria mapa de cantos
    songs_map = {}
    for song in todos:
        titulo = song.get('titulo', '').strip().upper()
        songs_map[titulo] = song
    
    # Processa cada canto gerado
    songs_dir = '../app-react-native/src/data/songs'
    fixed_count = 0
    
    print("Corrigindo cantos gerados...\n")
    
    for titulo in cantos_gerados:
        titulo_upper = titulo.upper()
        if titulo_upper in songs_map:
            print(f"Processando: {titulo}")
            if fix_song(songs_map[titulo_upper], songs_dir):
                fixed_count += 1
        else:
            print(f"⊗ Não encontrado no todos.json: {titulo}")
    
    print(f"\n{'='*60}")
    print(f"Cantos corrigidos: {fixed_count} de {len(cantos_gerados)}")
    print(f"{'='*60}")
    
    if fixed_count > 0:
        print("\n⚠ Execute sync_cantos_to_app.py para atualizar os índices!")

if __name__ == "__main__":
    main()
