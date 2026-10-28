"""Voix : dialogue écrit -> MP3 (ElevenLabs, modèle multilingue FR/EN)."""
from pathlib import Path

import requests

from config import cle, dossier_sortie


def synthese_voix(texte: str, voice_id: str, sortie: str = "voix.mp3") -> Path:
    """Génère un MP3 à partir du texte avec la voix `voice_id`."""
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": cle("ELEVENLABS_API_KEY")},
        params={"output_format": "mp3_44100_128"},
        json={"text": texte, "model_id": "eleven_multilingual_v2"},
        timeout=300,
    )
    r.raise_for_status()
    chemin = dossier_sortie() / sortie
    chemin.write_bytes(r.content)
    return chemin
