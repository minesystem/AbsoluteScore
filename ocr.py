import re
import pytesseract
from PIL import Image


def read_scoreboard(image_path):
    """
    Reads text from a scoreboard image.

    Expected examples:
        NXS MPZ 120
        AERI 135
        DB 50
    """

    image = Image.open(image_path)

    text = pytesseract.image_to_string(image)

    results = []

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        # Find a score at the end of the line
        match = re.search(r"(.+?)\s+(\d+)\s*$", line)

        if not match:
            continue

        team = match.group(1).strip()
        score = int(match.group(2))

        results.append({
            "team": team,
            "score": score
        })

    return results
