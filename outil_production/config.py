"""Configuration : lecture des clés API depuis le fichier .env (jamais dans le code)."""
import os
from pathlib import Path

from dotenv import load_dotenv

# Charge le .env situé à côté de ce fichier (ou celui du dossier courant)
load_dotenv(Path(__file__).parent / ".env")
load_dotenv()


def cle(nom: str) -> str:
    """Retourne la valeur d'une variable d'environnement, ou lève une erreur claire."""
    valeur = os.getenv(nom)
    if not valeur:
        raise RuntimeError(f"Clé manquante : ajoutez {nom} dans votre fichier .env")
    return valeur


def dossier_sortie() -> Path:
    """Dossier où sont écrits tous les fichiers générés."""
    d = Path(os.getenv("DOSSIER_SORTIE", "sorties"))
    d.mkdir(parents=True, exist_ok=True)
    return d
