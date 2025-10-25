import os
import requests
from bs4 import BeautifulSoup

# URL da página principal com a lista de cantos
BASE_URL = "https://cn.org.br/portal/ressuscitou-liturgia/"

# Pastas para salvar os arquivos
AUDIO_DIR = "./liturgia/audios"
IMAGE_DIR = "./liturgia/imagens"

def download_file(url, folder, filename):
    """
    Baixa um arquivo de uma URL e o salva em uma pasta local.
    """
    try:
        # Cria o diretório se ele não existir
        if not os.path.exists(folder):
            os.makedirs(folder)
            print(f"Pasta '{folder}' criada.")

        filepath = os.path.join(folder, filename)

        # Verifica se o arquivo já existe para não baixar novamente
        if os.path.exists(filepath):
            print(f"O arquivo '{filename}' já existe em '{folder}'. Pulando.")
            return

        print(f"Baixando '{filename}' para a pasta '{folder}'...")
        response = requests.get(url, stream=True)
        
        # Verifica se a requisição foi bem-sucedida
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"'{filename}' salvo com sucesso!")

    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar o arquivo de {url}: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")


def main():
    """
    Função principal para orquestrar o scraping.
    """
    print(f"Acessando a página principal: {BASE_URL}")
    
    try:
        response = requests.get(BASE_URL)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Não foi possível acessar a página principal. Erro: {e}")
        return

    # Analisa o HTML da página principal
    soup = BeautifulSoup(response.content, 'html.parser')

    # Encontra a lista de cantos
    song_list_container = soup.find('ul', class_='lcp_catlist')

    if not song_list_container:
        print("Não foi possível encontrar a lista de cantos na página.")
        return

    # --- CORREÇÃO APLICADA AQUI ---
    # Encontra cada item <li> da lista para evitar pegar links de tags
    song_list_items = song_list_container.find_all('li')
    total_songs = len(song_list_items)
    print(f"Encontrados {total_songs} cantos na lista. Iniciando downloads...")

    # Itera sobre cada item <li> da lista
    for index, item in enumerate(song_list_items):
        # Pega apenas o primeiro link <a> de cada item, que é o link do canto
        link = item.find('a')
        if not link:
            continue # Pula o item se, por algum motivo, não tiver um link

        song_title = link.get_text(strip=True)
        song_url = link['href']
        
        print("-" * 50)
        print(f"Processando canto {index + 1}/{total_songs}: '{song_title}'")

        # Extrai o nome base do arquivo a partir da URL
        filename_base = song_url.strip('/').split('/')[-1]
        
        try:
            song_page_response = requests.get(song_url)
            song_page_response.raise_for_status()
            
            song_soup = BeautifulSoup(song_page_response.content, 'html.parser')

            # --- Extração e download do Áudio ---
            audio_tag = song_soup.find('figure', class_='wp-block-audio')
            if audio_tag and audio_tag.find('audio') and audio_tag.find('audio').has_attr('src'):
                audio_url = audio_tag.find('audio')['src']
                audio_extension = os.path.splitext(audio_url)[1]
                # Usa o nome base da URL para o nome do arquivo
                audio_filename = f"{filename_base}{audio_extension if audio_extension else '.mp3'}"
                download_file(audio_url, AUDIO_DIR, audio_filename)
            else:
                print(f"-> Áudio não encontrado para '{song_title}'.")

            # --- Extração e download da Imagem ---
            image_tag = song_soup.find('figure', class_='wp-block-image')
            if image_tag and image_tag.find('img') and image_tag.find('img').has_attr('src'):
                image_url = image_tag.find('img')['src']
                image_extension = os.path.splitext(image_url)[1]
                # Usa o nome base da URL para o nome do arquivo
                image_filename = f"{filename_base}{image_extension}"
                download_file(image_url, IMAGE_DIR, image_filename)
            else:
                print(f"-> Imagem não encontrada para '{song_title}'.")

        except requests.exceptions.RequestException as e:
            print(f"Falha ao processar a página do canto '{song_title}'. Erro: {e}")
        except Exception as e:
            print(f"Ocorreu um erro inesperado ao processar '{song_title}': {e}")
    
    print("-" * 50)
    print("Scrapping concluído!")


if __name__ == "__main__":
    main()