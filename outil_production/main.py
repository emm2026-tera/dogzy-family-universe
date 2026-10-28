"""Ligne de commande de l'outil de production. Exemples : voir README.md."""
import argparse

import animation
import images
import montage
import trois_d
import voix


def main():
    p = argparse.ArgumentParser(description="Outil de production vidéo et 3D")
    s = p.add_subparsers(dest="cmd", required=True)

    a = s.add_parser("image", help="Image-clé d'une scène")
    a.add_argument("image"); a.add_argument("directive")
    a.add_argument("--moteur", choices=["openai", "gemini"], default="openai")

    a = s.add_parser("clip", help="Animer une image-clé")
    a.add_argument("image"); a.add_argument("mouvement")
    a.add_argument("--duree", type=int, default=5)
    a.add_argument("--moteur", choices=["kling", "runway"], default="kling")
    a.add_argument("--sortie", default="clip.mp4")

    a = s.add_parser("voix", help="Dialogue -> MP3")
    a.add_argument("texte"); a.add_argument("--voice-id", required=True)

    a = s.add_parser("montage", help="Assembler le MP4 final")
    a.add_argument("clips", nargs="+")
    a.add_argument("--voix"); a.add_argument("--musique")
    a.add_argument("--format", choices=["vertical", "16:9"], default="vertical")

    a = s.add_parser("3d", help="Image -> modèle GLB")
    a.add_argument("image")

    n = p.parse_args()
    if n.cmd == "image":
        f = images.image_cle_openai if n.moteur == "openai" else images.image_cle_gemini
        print(f(n.image, n.directive))
    elif n.cmd == "clip":
        f = animation.clip_kling if n.moteur == "kling" else animation.clip_runway
        print(f(n.image, n.mouvement, n.duree, n.sortie))
    elif n.cmd == "voix":
        print(voix.synthese_voix(n.texte, n.voice_id))
    elif n.cmd == "montage":
        print(montage.monter(n.clips, n.voix, n.musique, n.format))
    else:
        print(trois_d.image_vers_glb(n.image))


if __name__ == "__main__":
    main()
