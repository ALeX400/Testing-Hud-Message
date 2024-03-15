import binascii
from PIL import Image
import io

def extract_image_data(dfm_path):
    try:
        with open(dfm_path, 'r', encoding='utf-8') as file:
            content = file.read()

        start_marker = 'Picture.Data = {'
        end_marker = '}'
        start_index = content.find(start_marker) + len(start_marker)
        end_index = content.find(end_marker, start_index)
        hex_data = content[start_index:end_index]

        hex_data_clean = "".join(hex_data.split()).replace("\n", "").replace(" ", "")
        return hex_data_clean
    except Exception as e:
        print(f"Eroare la extragerea datelor din DFM: {e}")
        return None

def write_image(hex_data, output_path):
    try:
        binary_data = binascii.unhexlify(hex_data)
        image = Image.open(io.BytesIO(binary_data))
        image.save(output_path)
        print(f"Imaginea a fost salvată ca {output_path}")
    except Exception as e:
        print(f"Eroare la scrierea imaginii: {e}")

# Calea către fișierul DFM și unde să se salveze imaginea
dfm_path = 'UnitfrmHudMsgGenerator.dfm'
output_path = 'imaginea_extrasa.bmp'

# Extragerea și scrierea datelor
hex_data = extract_image_data(dfm_path)
if hex_data:
    write_image(hex_data, output_path)
