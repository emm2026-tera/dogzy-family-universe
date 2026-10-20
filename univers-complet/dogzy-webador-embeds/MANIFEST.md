# Dogzy Webador embeds : MANIFEST
Généré le 10 octobre 2026 à partir des fichiers locaux uniquement (script : `_build.py`, régénérable).
Site : thedogzyfamilyuniverse.ca (Webador). Couleurs : fond #0A0A0A, or #D4AF37.

## Comment coller
Dans Webador : ajouter un bloc **Code / Embed (HTML)** dans la page et coller **tout** le contenu du fichier.
Chaque fichier = un seul `<div class="dz">` avec son `<style>` inclus. Pas de JavaScript, pas d'image externe, aucune dépendance.
Les menus déroulants (accessoires) utilisent `<details>` (natif, sans script).

## Fichiers → pages Webador à créer
| Fichier | Page Webador à créer (suggestion) | Menu | Contenu | Sources |
|---|---|---|---|---|
| fiches-metiers.html | « Fiches métiers » | Dogzy Family Universe | 28 fiches : 26 au registre (0a–0c, 01–23) + 2 affiches en anglais (24 Teacher, 25 Sound Tech). 5 niveaux chacune. Accessoires et environnements pour les 5 fiches originales de Sania (Cuisinier, Serveuse, Barmaid, Policière, Commis). 25 affiches prêtes, 2 guides PDF. | dogzy-metiers/roster.csv, donnees-metiers.json (fiches originales seulement), noms des affiches, guides/ |
| commerces.html | « Commerces » | Dogzy Family Universe | 26 commerces (niveau 4 + niveau 5 de chaque métier au registre) + 5 lieux prévus (croisière, marina, aéroport, banque-échange, galerie d'art), tous « à venir / pas ouvert ». | roster.csv, dogzie-site-v2/metiers/index.html |
| missions.html | « Missions » | Dogzie Town | Statut « en développement » + gameplay envisagé (4 points) + rôle de 3 collections dans les missions + 3 règles de progression + clans (à venir). Aucune mission inventée. | dogzie-site-v2/dogzie-town.html, collections/*.html, donnees-metiers.json (regles_generales) |
| collections-index.html | « Les 9 collections » | Dogzie Town | 9 collections : Jet Set, Criminels, Marginaux (Outcasts) avec textes complets; Vedettes, Extravertis, Geeks, Mondes d'adrénaline, Justiciers, Adolescents = « à venir ». | dogzie-site-v2/dogzie-town.html, collections/jet-set, criminels, outcasts |
| documents-index.html | « Documents » (ou « Partenaires · Documents ») | Partenaires | 10 documents Dogzy/Acquisition + 2 guides du joueur. Bouton « Demander le document » = courriel prérempli vers lavalkirieartistepeintre@hotmail.com. | Dogzy/Acquisition/, dogzy-metiers/guides/ |
| valkyrians-hub.html | « Valkyrian » (page existante ou nouvelle) | Valkyrian | Mission, 4 fiches personnages (Lénaire, Chris, Super Heratzy, Osuryx), 4 modes de jeu, vidéos (6 ouverture + 6 clips + 7 TikTok, lien TikTok), 6 planches visuelles (liste), dérivés (possibilités seulement), offre 350 000 $ US, 4 documents sur demande, contact. | valkyrians-site/index.html, Valkyrian/Acquisition/, dogzie-site-v2/valkyrian.html |

## Ce qui n'est PAS dans les embeds (volontairement)
- **Images et vidéos** : un embed Webador ne peut pas lire les fichiers de l'ordinateur. Pour les afficher, téléverser dans Webador avec des blocs Image / Galerie / Vidéo :
  - Affiches métiers : `/workspace/dogzy-metiers/*.jpg` (23 FR) + `/workspace/dogzy-metiers/en/24-*.jpg`, `25-*.jpg`
  - Collections : `/workspace/dogzie-site-v2/assets/jet-set/` (11), `criminels/` (8), `outcasts/` (8)
  - Valkyrians : `/workspace/Valkyrian/Acquisition/visuels/` (6 planches), `videos-animees/` (7 mp4), `/workspace/valkyrians-site/media/` (6 ouvertures + 6 originaux, 2 mp3)
- **Liens directs de téléchargement des PDF** : les documents sont « sur demande » par courriel. Pour un lien direct, téléverser le PDF dans Webador et remplacer le `href` du bouton.
- **Brouillons de courriels** (Dogzy/Acquisition/courriels/*, Valkyrian/Acquisition/courriels/courriel-approche*.txt) : internes, non publiés.
- **Noms de personnages métiers** (Gustave, Justine…) : encore « proposés », à valider par Sania. Non affichés.
- **Accessoires des métiers 03–23** : « proposés » dans donnees-metiers.json, pas tirés des fiches de Sania. Non affichés.
- **Ancienne liste des 20 métiers** (Chefzy, Doczy…, dogzie-site-v2/metiers/*.html) : retirée de l'index le 8 octobre. Non reprise.
- **Fiches manquantes** : 12 personnages métiers sur 40 pas encore dessinés; 14 Valkyrians sur 18 pas encore présentés; 6 collections sur 9 sans page; missions pas encore écrites.

## À vérifier avant publication
- Le LISEZMOI de Dogzy/Acquisition dit : « À confirmer avant tout envoi : avocat divertissement ; listes destinataires ; publication Webador ». Le LISEZMOI Valkyrian dit : « Ne rien envoyer sans accord explicite de Sania / Valkyrie ». La page Documents ne donne pas les fichiers eux-mêmes : elle propose seulement d'en faire la demande.
- valkyrians-hub.html affiche le courriel et le téléphone de l'artiste (comme dans valkyrian.html v2).
