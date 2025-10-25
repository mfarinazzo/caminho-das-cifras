#!/usr/bin/env python3
r"""
Detecta o tom (maior/menor) de cada canto analisando os acordes
nos arquivos JSON em app-react-native/src/data/songs/<categoria>.

Heurística simples (rápida e sem dependências externas):
- Extrai a tônica de cada acorde (nota base) e se é maior/menor (ex.: "La-" -> A menor, "Mi7" -> E maior).
- Conta a frequência por nota raiz e qualidade (maior/menor) e também a presença do V (dominante) e IV (subdominante).
- Escolhe como tom a nota mais recorrente com desempate pela presença do dominante (V, especialmente com 7) e subdominante (IV).
- Define modo "menor" se a maioria dos acordes dessa tônica for menor ou se existir V7 consistente apontando para um centro menor.

Uso:
    python scripts-pre/detect_keys.py [SONGS_DIR]
Onde:
    SONGS_DIR = e:\\igrejaproject\\app-react-native\\src\\data\\songs (padrão)

Resultado:
- Escreve/atualiza o campo "tom": "<Nota> <maior|menor>" no JSON de cada canto.
"""

from __future__ import annotations
import json
import os
import re
import sys
from typing import Dict, Any, List, Tuple, Optional

DEFAULT_SONGS_DIR = r"e:\\igrejaproject\\app-react-native\\src\\data\\songs"
CATEGORIES = [
    "pre-catecumenato",
    "catecumenato",
    "eleicao",
    "liturgia",
]

# Mapeamentos de notas (português e anglo) para semitons (C = 0)
NOTE_TO_SEMITONE = {
    # Português
    "do": 0, "do#": 1, "dob": 11,
    "re": 2, "re#": 3, "reb": 1,
    "mi": 4, "mib": 3,
    "fa": 5, "fa#": 6, "fab": 4,
    "sol": 7, "sol#": 8, "solb": 6,
    "la": 9, "la#": 10, "lab": 8,
    "si": 11, "sib": 10,
    # Anglo
    "c": 0, "c#": 1, "cb": 11,
    "d": 2, "d#": 3, "db": 1,
    "e": 4, "eb": 3,
    "f": 5, "f#": 6, "fb": 4,
    "g": 7, "g#": 8, "gb": 6,
    "a": 9, "a#": 10, "ab": 8,
    "b": 11, "bb": 10,
}

SEMITONE_TO_PT = [
    "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"
]

CHORD_RE = re.compile(
    r"^\s*((?:Do|Re|Mi|Fa|Sol|La|Si|[A-G]))([#b]?)(.*)$",
    re.IGNORECASE,
)


def parse_chord(ch: str) -> Optional[Tuple[int, bool, bool]]:
    """Retorna (root_semitone, is_minor, has_7) ou None se não reconhecer."""
    if not ch:
        return None
    s = ch.strip()
    m = CHORD_RE.match(s)
    if not m:
        return None
    note = (m.group(1) or "").lower()
    acc = (m.group(2) or "").lower()
    rest = (m.group(3) or "").strip().lower()
    key = note + acc
    if key not in NOTE_TO_SEMITONE:
        return None
    root = NOTE_TO_SEMITONE[key]
    # menor se contiver '-' logo após a nota ou 'm' (mas não 'maj')
    is_minor = False
    if rest.startswith("-"):
        is_minor = True
    elif rest.startswith("m") and not rest.startswith("maj"):
        is_minor = True
    has7 = "7" in rest
    return (root, is_minor, has7)


def V_of(root: int) -> int:
    return (root + 7) % 12


def IV_of(root: int) -> int:
    return (root + 5) % 12


def choose_key(stats: Dict[int, Dict[str, int]]) -> Tuple[int, str]:
    """Escolhe tônica e modo (maior/menor) a partir das contagens.
    stats[root] = {total, minor, major, seven, v_total, v_seven, iv_total}
    """
    best_root = None
    best_score = -1.0
    for r, st in stats.items():
        v = V_of(r)
        iv = IV_of(r)
        score = (
            st.get("total", 0)
            + 0.7 * stats.get(v, {}).get("total", 0)
            + 0.5 * stats.get(v, {}).get("seven", 0)
            + 0.4 * stats.get(iv, {}).get("total", 0)
        )
        if score > best_score:
            best_score = score
            best_root = r
    if best_root is None:
        return (9, "menor")  # fallback La menor

    st = stats[best_root]
    v = V_of(best_root)
    # Heurística de modo
    minor_votes = st.get("minor", 0)
    major_votes = st.get("major", 0)
    v_seven = stats.get(v, {}).get("seven", 0)

    mode = "menor" if (minor_votes > major_votes or (minor_votes > 0 and v_seven > 0)) else "maior"
    return (best_root, mode)


def semitone_to_pt(root: int) -> str:
    return SEMITONE_TO_PT[root % 12]


def detect_song_key(song_obj: Dict[str, Any]) -> Optional[str]:
    colunas = song_obj.get("colunas") or []
    stats: Dict[int, Dict[str, int]] = {}
    def inc(root: int, field: str, amount: int = 1):
        stats.setdefault(root, {}).setdefault(field, 0)
        stats[root][field] += amount

    any_found = False
    for col in colunas:
        for est in col.get("estrofes", []):
            for ln in est.get("linhas", []):
                for ac in (ln.get("acordes") or []):
                    cifra = ac.get("cifra")
                    parsed = parse_chord(cifra)
                    if not parsed:
                        continue
                    any_found = True
                    root, is_minor, has7 = parsed
                    inc(root, "total")
                    inc(root, "minor" if is_minor else "major")
                    if has7:
                        inc(root, "seven")
    if not any_found:
        return None

    # Augment with V and IV totals for scoring convenience
    for r in list(stats.keys()):
        v = V_of(r)
        iv = IV_of(r)
        stats.setdefault(v, {}).setdefault("total", 0)
        stats.setdefault(v, {}).setdefault("seven", 0)
        stats.setdefault(iv, {}).setdefault("total", 0)

    root, mode = choose_key(stats)
    return f"{semitone_to_pt(root)} {'menor' if mode=='menor' else 'maior'}"


def process_song_file(path: str) -> Optional[str]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            obj = json.load(f)
    except Exception:
        return None
    tom = detect_song_key(obj)
    if not tom:
        return None
    if obj.get("tom") == tom:
        return tom
    obj["tom"] = tom
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        return tom
    except Exception:
        return None


def main() -> int:
    songs_root = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SONGS_DIR
    if not os.path.isdir(songs_root):
        print(f"Diretório não encontrado: {songs_root}")
        return 1
    total = 0
    updated = 0
    no_chords = 0
    for cat in CATEGORIES:
        cat_dir = os.path.join(songs_root, cat)
        if not os.path.isdir(cat_dir):
            continue
        for fname in os.listdir(cat_dir):
            if not fname.lower().endswith(".json") or fname.lower() == "index.json":
                continue
            total += 1
            path = os.path.join(cat_dir, fname)
            res = process_song_file(path)
            if res is None:
                no_chords += 1
            else:
                updated += 1
                print(f"✔ {cat}/{fname}: tom = {res}")
    print(f"Resumo: total={total}, atualizados={updated}, sem_acordes_ou_erro={no_chords}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
