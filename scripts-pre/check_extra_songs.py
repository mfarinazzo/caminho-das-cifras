import json
import os

# Load todos.json
with open('../app-react-native/src/data/songs/todos.json', 'r', encoding='utf-8') as f:
    todos = json.load(f)

# Get all individual song files
songs_dir = '../app-react-native/src/data/songs'
categories = ['pre-catecumenato', 'catecumenato', 'eleicao', 'liturgia']
individual_songs = []

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
                            individual_songs.append({
                                'title': title,
                                'file': f'{cat}/{fname}'
                            })
                except:
                    pass

# Get titles from todos.json
todos_titles = {song.get('titulo', '').strip().upper() for song in todos}

# Find songs in individual files but not in todos.json
extra_songs = [s for s in individual_songs if s['title'] not in todos_titles]

print(f'Cantos em arquivos individuais mas nao em todos.json: {len(extra_songs)}')
if extra_songs:
    print('\nCantos extras:')
    for song in sorted(extra_songs, key=lambda x: x['title']):
        print(f'  - {song["title"]}')
        print(f'    Arquivo: {song["file"]}')
