"""Montage FFmpeg : clips + voix + musique -> MP4 vertical (1080x1920) ou 16:9."""
import subprocess
from pathlib import Path

from config import dossier_sortie

FORMATS = {"vertical": (1080, 1920), "16:9": (1920, 1080)}


def monter(clips: list[str], voix: str | None = None, musique: str | None = None,
           format: str = "vertical", sortie: str = "final.mp4", volume_musique: float = 0.25) -> Path:
    """Assemble les clips dans l'ordre, ajoute la voix et la musique."""
    if format not in FORMATS:
        raise ValueError(f"Format inconnu : {format} (choix : {list(FORMATS)})")
    if not clips:
        raise ValueError("Aucun clip à assembler")
    l, h = FORMATS[format]
    out = dossier_sortie()

    # Fichier concat de FFmpeg (chemins absolus, apostrophes échappées)
    liste = out / "concat.txt"
    liste.write_text("".join(
        "file '{}'\n".format(str(Path(c).resolve()).replace("'", "'\\''")) for c in clips))

    # Recadrage/remplissage vers la résolution cible, appliqué à la vidéo concaténée
    vf = f"scale={l}:{h}:force_original_aspect_ratio=decrease,pad={l}:{h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30"
    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(liste)]
    entrees = []
    for piste in (voix, musique):
        if piste:
            cmd += ["-i", piste]
            entrees.append(piste)

    filtre = [f"[0:v]{vf}[v]"]
    if voix and musique:
        filtre.append(f"[2:a]volume={volume_musique}[m];[1:a][m]amix=inputs=2:duration=longest[a]")
    elif voix:
        filtre.append("[1:a]anull[a]")
    elif musique:
        filtre.append(f"[1:a]volume={volume_musique}[a]")
    cmd += ["-filter_complex", ";".join(filtre), "-map", "[v]"]
    if entrees:
        cmd += ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    cmd += ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-shortest" if entrees else "-an",
            str(out / sortie)]
    subprocess.run(cmd, check=True)
    return out / sortie
