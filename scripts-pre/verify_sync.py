import json

# Load todos.json
with open('../app-react-native/src/data/songs/todos.json', 'r', encoding='utf-8') as f:
    todos = json.load(f)

# Load all.json
with open('../app-react-native/src/data/indexes/all.json', 'r', encoding='utf-8') as f:
    all_songs = json.load(f)

# Get titles from both sources
todos_titles = {song.get('titulo', '').strip().upper() for song in todos}
all_titles = {song.get('title', '').strip().upper() for song in all_songs}

# Find songs in todos.json but not in all.json
missing_from_all = todos_titles - all_titles

print('='*60)
print('RELATÓRIO DE SINCRONIZAÇÃO')
print('='*60)
print(f'\nTotal de cantos em todos.json: {len(todos)}')
print(f'Total de cantos em all.json: {len(all_songs)}')
print(f'Cantos únicos em todos.json: {len(todos_titles)}')
print(f'Cantos únicos em all.json: {len(all_titles)}')

print(f'\n{"="*60}')
print('CANTOS FALTANDO NO APP (em todos.json mas não em all.json)')
print(f'{"="*60}')
if missing_from_all:
    print(f'\n❌ {len(missing_from_all)} canto(s) faltando:')
    for title in sorted(missing_from_all):
        print(f'   - {title}')
else:
    print('\n✅ NENHUM! Todos os cantos de todos.json estão no app.')

print(f'\n{"="*60}')
print('CANTOS ADICIONAIS NO APP (em all.json mas não em todos.json)')
print(f'{"="*60}')
extra_in_all = all_titles - todos_titles
if extra_in_all:
    print(f'\nℹ️  {len(extra_in_all)} canto(s) adicional(is):')
    for title in sorted(extra_in_all):
        print(f'   - {title}')
else:
    print('\nNenhum canto adicional.')

print(f'\n{"="*60}')
print('RESUMO')
print(f'{"="*60}')
if not missing_from_all:
    print('✅ SINCRONIZAÇÃO COMPLETA!')
    print('   Todos os cantos de todos.json estão disponíveis no app.')
    if extra_in_all:
        print(f'   + {len(extra_in_all)} canto(s) adicional(is) no app (OK)')
else:
    print('❌ SINCRONIZAÇÃO INCOMPLETA')
    print(f'   {len(missing_from_all)} canto(s) ainda faltando no app.')
