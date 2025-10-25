#!/usr/bin/env python3
r"""
Sincroniza os cantos do diretório de origem para dentro do app,
gerando/atualizando os indexes por categoria e o índice agregado "all.json".
Também copia todos os arquivos de canto (.json) para src/data/songs/<categoria>.

Uso:
    python scripts-pre/sync_cantos_to_app.py [SOURCE_DIR] [APP_DIR]
Onde:
    SOURCE_DIR = e:\\igrejaproject\\app-react-native\\src\\data\\songs (padrão)
    APP_DIR    = e:\\igrejaproject\\app-react-native (padrão)
"""

import json
import os
import shutil
import sys
from typing import List, Dict, Any

DEFAULT_SOURCE = r"e:\\igrejaproject\\app-react-native\\src\\data\\songs"
DEFAULT_APP = r"e:\\igrejaproject\\app-react-native"

CATEGORIES = [
    "pre-catecumenato",
    "catecumenato",
    "eleicao",
    "liturgia",
]


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def read_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: str, data: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def same_path(a: str, b: str) -> bool:
    """Compara caminhos de forma segura no Windows."""
    return os.path.normcase(os.path.abspath(a)) == os.path.normcase(os.path.abspath(b))


def safe_copy2(src: str, dst: str, retries: int = 3, delay: float = 0.2) -> None:
    """Copia arquivo com pequenas tentativas em caso de WinError 32 (arquivo em uso)."""
    import time
    for attempt in range(retries):
        try:
            shutil.copy2(src, dst)
            return
        except PermissionError as e:
            # WinError 32 = arquivo em uso
            if getattr(e, "winerror", None) == 32 and attempt < retries - 1:
                time.sleep(delay)
                continue
            raise


def normalize_title(s: str) -> str:
    try:
        import unicodedata
        s2 = unicodedata.normalize("NFD", s or "").lower()
        s2 = "".join(c for c in s2 if unicodedata.category(c) != "Mn")
        return s2
    except Exception:
        return (s or "").lower()


def normalize_compare(s: str) -> str:
    """Normaliza para comparação: remove acentos, espaços e pontuação, minúsculas."""
    try:
        import unicodedata, re
        s2 = unicodedata.normalize("NFD", s or "").lower()
        s2 = "".join(c for c in s2 if unicodedata.category(c) != "Mn")
        s2 = re.sub(r"[^a-z0-9]+", "", s2)
        return s2
    except Exception:
        return (s or "").lower().replace(" ", "")


def slug_from_filename(fname: str) -> str:
    base = os.path.splitext(os.path.basename(fname))[0]
    return base


def any_chords(obj: Dict[str, Any]) -> bool:
    colunas = obj.get("colunas") or []
    for col in colunas:
        for est in col.get("estrofes", []):
            for ln in est.get("linhas", []):
                acordes = ln.get("acordes") or []
                if acordes:
                    return True
    return False


def collect_lyrics_normalized(obj: Dict[str, Any]) -> str:
    """Coleta todo o texto de letras das linhas e normaliza (sem acentos, minúsculas)."""
    parts: List[str] = []
    try:
        colunas = obj.get("colunas") or []
        for col in colunas:
            for est in col.get("estrofes", []):
                for ln in est.get("linhas", []):
                    letra = (ln.get("letra") or "").strip()
                    if letra:
                        parts.append(letra)
    except Exception:
        pass
    raw = " \n ".join(parts)
    # normalizar (sem acento, minúsculas)
    try:
        import unicodedata
        s2 = unicodedata.normalize("NFD", raw or "").lower()
        s2 = "".join(c for c in s2 if unicodedata.category(c) != "Mn")
        return s2
    except Exception:
        return (raw or "").lower()


def build_category_index_from_songs(source_cat_dir: str, cat: str) -> List[Dict[str, Any]]:
    """
    Gera índice da categoria varrendo os arquivos de "songs/<cat>".
    Define:
      - slug: base do nome do arquivo
      - title: preferir titulo_principal; se titulo_principal coincide com o nome da categoria,
               usar subtitulo. Sempre deixar em caixa alta, se presente.
      - file: "<cat>/<fname>"
      - category: cat
      - reference: campo "referencia" do arquivo, se houver
      - hasCapo/capoHouse: de bracadeira.tem/bracadeira.casa
      - hasChords: true se existir ao menos um acorde em alguma linha
    """
    items: List[Dict[str, Any]] = []
    cat_norm = normalize_compare(cat)
    if not os.path.isdir(source_cat_dir):
        return items
    for fname in os.listdir(source_cat_dir):
        if not fname.lower().endswith(".json"):
            continue
        if fname.lower() == "index.json":
            continue
        path = os.path.join(source_cat_dir, fname)
        try:
            data = read_json(path)
        except Exception:
            # se um arquivo estiver inválido, apenas pula
            continue
        titulo_principal = (data.get("titulo_principal") or "").strip()
        subtitulo = (data.get("subtitulo") or "").strip()
        title_candidate = titulo_principal or subtitulo or slug_from_filename(fname).replace("-", " ")

        # Se titulo_principal parece ser o nome da categoria, preferir subtitulo
        if titulo_principal and normalize_compare(titulo_principal) == cat_norm and subtitulo:
            title_candidate = subtitulo

        title_upper = title_candidate.upper() if title_candidate else slug_from_filename(fname)

        brac = data.get("bracadeira") or {}
        has_capo = bool(brac.get("tem"))
        capo_house = brac.get("casa") if has_capo else None
        has_chords = any_chords(data)
        lyrics_norm = collect_lyrics_normalized(data)

        item = {
            "slug": slug_from_filename(fname),
            "title": title_upper,
            "file": f"{cat}/{fname}",
            "category": cat,
            "reference": data.get("referencia") or None,
            "subtitle": subtitulo or None,
            "lyrics": lyrics_norm or None,
            "hasCapo": has_capo,
            "capoHouse": capo_house,
            "hasChords": has_chords,
        }
        items.append(item)

    return items


def main() -> int:
    source_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SOURCE
    app_dir = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_APP

    if not os.path.isdir(source_dir):
        print(f"Fonte não encontrada: {source_dir}")
        return 1
    if not os.path.isdir(app_dir):
        print(f"App dir não encontrado: {app_dir}")
        return 1

    app_indexes_dir = os.path.join(app_dir, "src", "data", "indexes")
    app_songs_dir = os.path.join(app_dir, "src", "data", "songs")
    ensure_dir(app_indexes_dir)
    ensure_dir(app_songs_dir)

    aggregated: List[Dict[str, Any]] = []

    # Encontrar/gerar indexes por categoria e coletar para agregado
    for cat in CATEGORIES:
        src_index_option1 = os.path.join(source_dir, cat, "index.json")
        dst_index = os.path.join(app_indexes_dir, f"{cat}.json")
        data = None

        # Preferir index vindo do SOURCE (se existir);
        # senão gerar a partir dos arquivos em songs/<cat>;
        # senão usar o já presente no app
        if os.path.isfile(src_index_option1):
            data = read_json(src_index_option1)
            # Padroniza escrita no app (idempotente)
            write_json(dst_index, data)
            print(f"✔ index copiado: {dst_index} ({len(data)} itens)")
        else:
            # tentar gerar a partir de songs/<cat>
            songs_cat_dir = os.path.join(source_dir, cat)
            generated = build_category_index_from_songs(songs_cat_dir, cat)
            if generated:
                data = generated
                write_json(dst_index, data)
                print(f"✔ index gerado de songs: {dst_index} ({len(data)} itens)")

        if data is None and os.path.isfile(dst_index):
            data = read_json(dst_index)
            print(f"✔ index lido do app: {dst_index} ({len(data)} itens)")
        if data is None:
            print(f"Aviso: não existe index.json para {cat} nem em SOURCE, nem no app")
            data = []

        aggregated.extend(data)

    # Ordenar agregado por título normalizado
    aggregated.sort(key=lambda it: normalize_title(it.get("title") or it.get("slug") or ""))

    # Escrever all.json
    all_path = os.path.join(app_indexes_dir, "all.json")
    write_json(all_path, aggregated)
    print(f"✔ agregado gerado: {all_path} ({len(aggregated)} itens)")

    # Copiar todos os arquivos de canto (caso SOURCE seja diferente do diretório do app)
    for cat in CATEGORIES:
        src_cat_dir = os.path.join(source_dir, cat)
        dst_cat_dir = os.path.join(app_songs_dir, cat)
        ensure_dir(dst_cat_dir)

        if same_path(src_cat_dir, dst_cat_dir):
            # Mesma pasta de origem e destino: não há necessidade de copiar
            print(f"↷ mesma origem e destino, pulando cópias: {dst_cat_dir}")
            continue

        if not os.path.isdir(src_cat_dir):
            continue
        for fname in os.listdir(src_cat_dir):
            if not fname.lower().endswith(".json"):
                continue
            if fname.lower() == "index.json":
                continue
            src_file = os.path.join(src_cat_dir, fname)
            dst_file = os.path.join(dst_cat_dir, fname)
            if same_path(src_file, dst_file):
                # Evita tentar copiar arquivo sobre ele mesmo
                continue
            safe_copy2(src_file, dst_file)
        print(f"✔ copiados cantos: {dst_cat_dir}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
