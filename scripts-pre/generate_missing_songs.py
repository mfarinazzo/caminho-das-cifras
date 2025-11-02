#!/usr/bin/env python3
"""
Gera os arquivos JSON individuais que estão faltando a partir do todos.json.
Converte o formato HTML/base64 do todos.json para o formato estruturado dos arquivos individuais.
"""

import json
import os
import re
import base64
import unicodedata
import html
from typing import Dict, Any, List, Optional

def normalize_filename(title: str) -> str:
    """Normaliza o título para criar um nome de arquivo."""
    # Remove acentos
    title = unicodedata.normalize('NFD', title)
    title = ''.join(c for c in title if unicodedata.category(c) != 'Mn')
    # Converte para minúsculas e substitui espaços por hífens
    title = title.lower().strip()
    title = re.sub(r'[^\w\s-]', '', title)
    title = re.sub(r'[-\s]+', '-', title)
    return title.strip('-')

def get_category_id(categoria: int) -> str:
    """Mapeia o ID da categoria para o nome da pasta."""
    mapping = {
        1: "pre-catecumenato",
        2: "catecumenato",
        3: "eleicao",
        4: "liturgia"
    }
    return mapping.get(categoria, "pre-catecumenato")

def parse_html_to_structure(html_base64: str, titulo: str) -> Dict[str, Any]:
    """Converte o HTML base64 para a estrutura JSON dos arquivos individuais."""
    try:
        # Decodifica o base64
        html_content = base64.b64decode(html_base64).decode('utf-8')
        
        # Remove tags HTML de forma simples
        text_content = re.sub(r'<[^>]+>', '\n', html_content)
        text_content = html.unescape(text_content)
        
        # Estrutura básica
        song_data = {
            "titulo_principal": titulo.upper(),
            "subtitulo": "",
            "referencia": None,
            "pagina": None,
            "bracadeira": {
                "tem": False,
                "casa": None
            },
            "colunas": [
                {
                    "id": 1,
                    "estrofes": []
                }
            ],
            "tom": None
        }
        
        # Procura por informações de bracadeira
        if '@capot@' in text_content.lower() or 'bracadeira' in text_content.lower():
            capo_match = re.search(r'Braçadeira\s+(\d+)[ªº]?\s*(?:Traste|Casa)', text_content, re.IGNORECASE)
            if capo_match:
                song_data["bracadeira"]["tem"] = True
                song_data["bracadeira"]["casa"] = f"{capo_match.group(1)}ª"
        
        # Extrai linhas não vazias
        lines = [line.strip() for line in text_content.split('\n') if line.strip()]
        
        # Filtra linhas que são provavelmente conteúdo (não tags ou metadados)
        content_lines = []
        for line in lines:
            if line and not line.startswith('@') and not line.startswith('<') and len(line) > 3:
                # Ignora linhas que são só números ou referências
                if not re.match(r'^\d+$', line) and 'margin' not in line.lower():
                    content_lines.append(line)
        
        # Cria uma estrofe básica com o conteúdo
        if content_lines:
            estrofe = {
                "indicador": "S.",
                "repeticao": None,
                "linhas": []
            }
            
            for line in content_lines[:20]:  # Limita a 20 linhas para evitar excesso
                if line.upper() != titulo.upper():  # Ignora o título
                    estrofe["linhas"].append({
                        "letra": line,
                        "acordes": []
                    })
            
            if estrofe["linhas"]:
                song_data["colunas"][0]["estrofes"].append(estrofe)
        
        return song_data
        
    except Exception as e:
        print(f"Erro ao processar HTML: {e}")
        # Retorna estrutura mínima
        return {
            "titulo_principal": titulo.upper(),
            "subtitulo": "",
            "referencia": None,
            "pagina": None,
            "bracadeira": {
                "tem": False,
                "casa": None
            },
            "colunas": [
                {
                    "id": 1,
                    "estrofes": []
                }
            ],
            "tom": None
        }

def main():
    # Carrega todos.json
    todos_path = '../app-react-native/src/data/songs/todos.json'
    with open(todos_path, 'r', encoding='utf-8') as f:
        todos = json.load(f)
    
    # Carrega títulos existentes
    songs_dir = '../app-react-native/src/data/songs'
    categories = ['pre-catecumenato', 'catecumenato', 'eleicao', 'liturgia']
    existing_titles = set()
    
    for cat in categories:
        cat_dir = os.path.join(songs_dir, cat)
        if os.path.isdir(cat_dir):
            for fname in os.listdir(cat_dir):
                if fname.endswith('.json') and fname != 'index.json':
                    try:
                        with open(os.path.join(cat_dir, fname), 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            title = data.get('titulo_principal', '').strip().upper()
                            if title:
                                existing_titles.add(title)
                    except:
                        pass
    
    # Processa cantos faltantes
    missing_count = 0
    created_count = 0
    
    for song in todos:
        titulo = song.get('titulo', '').strip().upper()
        if not titulo or titulo in existing_titles:
            continue
        
        missing_count += 1
        print(f"Processando: {titulo}")
        
        # Determina categoria
        categoria_id = song.get('categoria', 1)
        category_folder = get_category_id(categoria_id)
        
        # Cria estrutura do JSON
        html_base64 = song.get('html_base64', '')
        song_data = parse_html_to_structure(html_base64, titulo)
        
        # Adiciona campos adicionais se disponíveis
        if 'nr_2019' in song:
            song_data['referencia'] = song['nr_2019']
        
        # Gera nome do arquivo
        filename = normalize_filename(titulo) + '.json'
        output_dir = os.path.join(songs_dir, category_folder)
        output_path = os.path.join(output_dir, filename)
        
        # Garante que o diretório existe
        os.makedirs(output_dir, exist_ok=True)
        
        # Salva o arquivo
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(song_data, f, ensure_ascii=False, indent=2)
            print(f"✓ Criado: {category_folder}/{filename}")
            created_count += 1
        except Exception as e:
            print(f"✗ Erro ao criar {filename}: {e}")
    
    print(f"\n{'='*60}")
    print(f"Resumo:")
    print(f"  Cantos faltantes encontrados: {missing_count}")
    print(f"  Cantos criados com sucesso: {created_count}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
