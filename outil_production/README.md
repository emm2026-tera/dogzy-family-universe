# Outil de production vidéo et 3D

1. `pip install -r requirements.txt` (FFmpeg doit être installé)
2. Copiez `.env.example` en `.env` et remplissez vos clés (jamais dans le code).
3. Exemples :
```
python main.py image perso.png "Le personnage dans une forêt" --moteur gemini
python main.py clip sorties/image_cle.png "Elle tourne la tête" --duree 5 --moteur kling
python main.py voix "Bonjour tout le monde" --voice-id VOTRE_ID
python main.py montage sorties/clip.mp4 --voix sorties/voix.mp3 --musique musique.mp3 --format vertical
python main.py 3d perso.png
```
Modules : config, images, animation, voix, montage, trois_d.
