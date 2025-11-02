import json
import base64
import re

with open('app-react-native/src/data/songs/todos.json', encoding='utf-8') as f:
    songs = json.load(f)

count = 0
examples = []
for song in songs:
    html = base64.b64decode(song['html_base64']).decode('utf-8', errors='ignore')
    match = re.search(r'(?:Tom|TOM|Tom:|TOM:)', html)
    if match:
        count += 1
        examples.append((song['titulo'], html[match.start():match.start()+200]))

print('songs with "Tom" reference:', count)
for title, excerpt in examples[:5]:
    print('\n===', title, '===')
    print(excerpt)
