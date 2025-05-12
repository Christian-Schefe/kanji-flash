import os
import sys
import xml.etree.ElementTree as ET
import json


def transform_file_content(content: str) -> str:
    root = ET.fromstring(content)
    [strokes, numbers] = root.findall("{*}g")

    paths: list[str] = []
    transforms: list[str] = []

    for path in strokes.findall(".//{*}path"):
        d = path.attrib.get("d")
        if d is not None:
            paths.append(d)
        else:
            print("Error: Path element does not have a 'd' attribute.")

    texts = numbers.findall(".//{*}text")
    texts = sorted(texts, key=lambda t: int(t.text) if t.text is not None and t.text.isdigit() else float("inf"))

    for text in texts:
        t = text.attrib.get("transform")
        if t is not None:
            transforms.append(t)
        else:
            print("Error: Text element does not have a 'transform' attribute.")

    if any([p.find("#") != -1 or p.find("|") != -1 for p in paths]):
        print("Error: Path contains '#' or '|' characters, which are not allowed.")
    if any([t.find("#") != -1 or t.find("|") != -1 for t in transforms]):
        print("Error: Transform contains '#' or '|' characters, which are not allowed.")

    return "#".join(paths) + "|" + "#".join(transforms)


def main():
    if len(sys.argv) != 3:
        print("Usage: python transform_svg.py <input_directory_path> <output_file_path>")
        sys.exit(1)

    input_directory_path = sys.argv[1]
    output_file_path = sys.argv[2]

    if not os.path.isdir(input_directory_path):
        print(f"Error: {input_directory_path} is not a valid directory.")
        sys.exit(1)

    processed_files = {
        "version": "1.0",
    }

    for root, _, files in os.walk(input_directory_path):
        for file_name in files:
            input_file_path = os.path.join(root, file_name)
            kanji_codepoint = os.path.splitext(file_name)[0]
            kanji = chr(int(kanji_codepoint, 16))

            try:
                with open(input_file_path, "r", encoding="utf-8") as file:
                    content = file.read()

                transformed_content = transform_file_content(content)
                processed_files[kanji] = transformed_content

            except Exception as e:
                print(f"Failed to process {input_file_path}: {e}")

    try:
        with open(output_file_path, "w", encoding="utf-8") as json_file:
            json.dump(processed_files, json_file, ensure_ascii=False, indent=None)
        print(f"Processed data written to {output_file_path}")
    except Exception as e:
        print(f"Failed to write to {output_file_path}: {e}")


if __name__ == "__main__":
    main()
