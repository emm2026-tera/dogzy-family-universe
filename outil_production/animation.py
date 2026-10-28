"""Animation : image-clé -> clip vidéo (Kling ou Runway Gen-4)."""
import base64
import time
from pathlib import Path

import jwt  # PyJWT
import requests

from config import cle, dossier_sortie


def _data_uri(image: str) -> str:
    mime = "image/jpeg" if image.lower().endswith((".jpg", ".jpeg")) else "image/png"
    return f"data:{mime};base64,{base64.b64encode(Path(image).read_bytes()).decode()}"


def _telecharger(url: str, sortie: str) -> Path:
    chemin = dossier_sortie() / sortie
    chemin.write_bytes(requests.get(url, timeout=300).content)
    return chemin


def _jeton_kling() -> str:
    """Kling utilise un jeton JWT signé avec access key / secret key."""
    now = int(time.time())
    return jwt.encode({"iss": cle("KLING_ACCESS_KEY"), "exp": now + 1800, "nbf": now - 5},
                      cle("KLING_SECRET_KEY"), algorithm="HS256")


def clip_kling(image: str, prompt_mouvement: str, duree: int = 5, sortie: str = "clip.mp4") -> Path:
    """Image-to-video Kling. duree en secondes (5 ou 10)."""
    base = "https://api.klingai.com/v1/videos/image2video"
    h = {"Authorization": "Bearer " + _jeton_kling()}
    brut = base64.b64encode(Path(image).read_bytes()).decode()  # Kling attend du base64 sans préfixe
    r = requests.post(base, headers=h, timeout=120, json={
        "model_name": "kling-v2-master", "image": brut,
        "prompt": prompt_mouvement, "duration": str(duree)})
    r.raise_for_status()
    tache = r.json()["data"]["task_id"]
    while True:
        time.sleep(10)
        h = {"Authorization": "Bearer " + _jeton_kling()}  # jeton rafraîchi
        d = requests.get(f"{base}/{tache}", headers=h, timeout=60).json()["data"]
        if d["task_status"] == "succeed":
            return _telecharger(d["task_result"]["videos"][0]["url"], sortie)
        if d["task_status"] == "failed":
            raise RuntimeError(f"Kling a échoué : {d.get('task_status_msg')}")


def clip_runway(image: str, prompt_mouvement: str, duree: int = 5, sortie: str = "clip.mp4") -> Path:
    """Variante Runway Gen-4 Turbo (durée 5 ou 10 s)."""
    h = {"Authorization": "Bearer " + cle("RUNWAY_API_KEY"), "X-Runway-Version": "2024-11-06"}
    r = requests.post("https://api.dev.runwayml.com/v1/image_to_video", headers=h, timeout=120, json={
        "model": "gen4_turbo", "promptImage": _data_uri(image),
        "promptText": prompt_mouvement, "ratio": "720:1280", "duration": duree})
    r.raise_for_status()
    tache = r.json()["id"]
    while True:
        time.sleep(8)
        d = requests.get(f"https://api.dev.runwayml.com/v1/tasks/{tache}", headers=h, timeout=60).json()
        if d["status"] == "SUCCEEDED":
            return _telecharger(d["output"][0], sortie)
        if d["status"] in ("FAILED", "CANCELLED"):
            raise RuntimeError(f"Runway a échoué : {d.get('failure')}")
