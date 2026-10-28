"""3D : image d'un personnage -> modèle GLB (API Meshy image-to-3D)."""
import base64
import time
from pathlib import Path

import requests

from config import cle, dossier_sortie

BASE = "https://api.meshy.ai/openapi/v1/image-to-3d"


def image_vers_glb(image: str, sortie: str = "personnage.glb") -> Path:
    """Convertit l'image d'un personnage en modèle 3D au format GLB."""
    h = {"Authorization": "Bearer " + cle("MESHY_API_KEY")}
    mime = "image/jpeg" if image.lower().endswith((".jpg", ".jpeg")) else "image/png"
    uri = f"data:{mime};base64,{base64.b64encode(Path(image).read_bytes()).decode()}"
    r = requests.post(BASE, headers=h, timeout=120, json={
        "image_url": uri, "enable_pbr": True, "should_texture": True})
    r.raise_for_status()
    tache = r.json()["result"]
    while True:
        time.sleep(10)
        d = requests.get(f"{BASE}/{tache}", headers=h, timeout=60).json()
        if d["status"] == "SUCCEEDED":
            chemin = dossier_sortie() / sortie
            chemin.write_bytes(requests.get(d["model_urls"]["glb"], timeout=300).content)
            return chemin
        if d["status"] in ("FAILED", "CANCELED"):
            raise RuntimeError(f"Meshy a échoué : {d.get('task_error')}")
