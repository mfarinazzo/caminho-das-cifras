import json
import base64
import html

# Read todos.json
with open('../app-react-native/src/data/songs/todos.json', encoding='utf-8') as f:
    todos = json.load(f)

# Find "A ESPADA"
espada = None
for song in todos:
    if 'ESPADA' in song['titulo'].upper():
        espada = song
        break

if espada:
    print(f"ID: {espada['id']}")
    print(f"Titulo: {espada['titulo']}")
    print(f"Categoria: {espada['categoria']}")
    print(f"Referencia: {espada.get('referencia', 'N/A')}")
    print(f"\n--- HTML Base64 (first 500 chars decoded) ---")
    
    if 'html_base64' in espada:
        decoded = base64.b64decode(espada['html_base64']).decode('utf-8')
        decoded = html.unescape(decoded)
        print(decoded[:1000])
    
    print(f"\n--- Conteudo (normalized lyrics) ---")
    if 'conteudo' in espada:
        print(espada['conteudo'][:500])
else:
    print("Song not found")
