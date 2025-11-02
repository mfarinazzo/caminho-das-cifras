import json
import base64
import html

with open('../app-react-native/src/data/songs/todos.json', encoding='utf-8') as f:
    todos = json.load(f)

espada = [s for s in todos if s['titulo'].upper() == 'A ESPADA'][0]
html_content = base64.b64decode(espada['html_base64']).decode('utf-8')
html_content = html.unescape(html_content)

# Print first 3000 chars of HTML
print(html_content[:3000])
