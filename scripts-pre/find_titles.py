import json

with open('../app-react-native/src/data/songs/todos.json', encoding='utf-8') as f:
    todos = json.load(f)

for s in todos:
    if 'DAYE' in s['titulo'].upper():
        print(s['titulo'])
