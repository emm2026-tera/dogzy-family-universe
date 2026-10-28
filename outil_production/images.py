"""Préparation de l'image-clé d'une scène (OpenAI gpt-image-1 et Gemini)."""
import base64
from pathlib import Path

import requests

from config import cle, dossier_sortie


def image_cle_openai(image: str, directive: str, sortie: str = "image_cle.png") -> Path:
    """Édite l'image de l'artiste selon une directive écrite (endpoint images/edits)."""
    with open(image, "rb") as f:
        r = requests.post(
            "https://api.openai.com/v1/images/edits",
            headers={"Authorization": "Bearer " + cle("OPENAI_API_KEY")},
            files={"image": (Path(image).name, f)},
            data={"model": "gpt-image-1", "prompt": directive, "size": "1024x1536"},
            timeout=300,
        )
    r.raise_for_status()
    chemin = dossier_sortie() / sortie
    chemin.write_bytes(base64.b64decode(r.json()["data"][0]["b64_json"]))
    return chemin


def image_cle_gemini(image_personnage: str, directive: str, sortie: str = "image_gemini.png") -> Path:
    """Édition Gemini : garde le même personnage d'une scène à l'autre."""
    mime = "image/jpeg" if image_personnage.lower().endswith((".jpg", ".jpeg")) else "image/png"
    donnees = base64.b64encode(Path(image_personnage).read_bytes()).decode()
    corps = {"contents": [{"parts": [
        {"text": directive + " Conserve exactement le même personnage (visage, tenue, style)."},
        {"inline_data": {"mime_type": mime, "data": donnees}},
    ]}]}
    r = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
        headers={"x-goog-api-key": cle("GEMINI_API_KEY")},
        json=corps, timeout=300,
    )
    r.raise_for_status()
    for part in r.json()["candidates"][0]["content"]["parts"]:
        img = part.get("inlineData") or part.get("inline_data")
        if img:
            chemin = dossier_sortie() / sortie
            chemin.write_bytes(base64.b64decode(img["data"]))
            return chemin
    raise RuntimeError("Gemini n'a renvoyé aucune image")
