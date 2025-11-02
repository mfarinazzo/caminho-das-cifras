import json

# Load the todos.json file
with open('src/data/songs/todos.json', 'r', encoding='utf-8') as f:
    songs = json.load(f)

# Check for duplicate titles
titles = {}
duplicates = []

for song in songs:
    title = song['titulo'].strip().upper()
    if title in titles:
        duplicates.append((title, song['id'], titles[title]))
    else:
        titles[title] = song['id']

print(f"Total songs: {len(songs)}")
print(f"Unique titles: {len(titles)}")
print(f"Duplicate titles: {len(duplicates)}")

if duplicates:
    print("\nDuplicate songs:")
    for dup in duplicates[:10]:  # Show first 10
        print(f"Title: {dup[0]}, IDs: {dup[1]}, {dup[2]}")
    if len(duplicates) > 10:
        print(f"... and {len(duplicates) - 10} more")
else:
    print("No duplicate titles found.")

# Check for duplicate IDs
ids = {}
duplicate_ids = []

for song in songs:
    song_id = song['id']
    if song_id in ids:
        duplicate_ids.append((song_id, ids[song_id], song['titulo']))
    else:
        ids[song_id] = song['titulo']

print(f"\nDuplicate IDs: {len(duplicate_ids)}")
if duplicate_ids:
    print("Duplicate IDs found:")
    for dup in duplicate_ids:
        print(f"ID: {dup[0]}, Titles: '{dup[1]}' and '{dup[2]}'")

# Check for songs with empty or missing titles
empty_titles = [song for song in songs if not song.get('titulo', '').strip()]
print(f"\nSongs with empty titles: {len(empty_titles)}")

# Check for songs with invalid JSON structure (missing required fields)
required_fields = ['id', 'titulo', 'categoria']
invalid_songs = []
for song in songs:
    if not all(field in song for field in required_fields):
        invalid_songs.append(song['id'])

print(f"Songs with missing required fields: {len(invalid_songs)}")
if invalid_songs:
    print("IDs with missing fields:", invalid_songs[:10])