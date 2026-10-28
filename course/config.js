// Réglages d'équilibrage de « Dogzy Burnout » : tout se modifie ici.
const CONFIG = {
  segLongueur: 200,        // longueur d'un segment de route
  largeurRoute: 2000,      // demi-largeur de la route
  distanceAffichage: 140,  // nombre de segments dessinés
  vitesseMax: 12000,       // vitesse max normale
  multBoost: 1.45,         // vitesse max pendant le boost
  accel: 0.55,             // accélération (part de vitesseMax par seconde)
  freinNaturel: 0.25,
  adherenceCourbe: 2.6,    // force centrifuge dans les virages
  braquage: 2.1,           // vitesse latérale du volant
  tours: 3,
  nbRivaux: 5,
  nbTrafic: 38,
  vitesseTrafic: 0.33,     // part de vitesseMax
  difficulte: 0.93,        // vitesse moyenne des rivaux (part de vitesseMax)
  boost: {
    drainParSeconde: 0.30,
    gainDrift: 0.22,       // par seconde de drift
    gainFrolement: 0.18,   // frôlement du trafic
    gainTakedown: 0.55,
    seuilActivation: 0.08
  },
  points: { frolement: 100, takedown: 1000, driftParSeconde: 150 },
  // Tracé : [segments, courbure]
  trace: [[40,0],[30,2],[30,0],[25,-3],[20,0],[40,3.5],[25,0],[35,-2.5],[20,0],[30,-4],[30,0],[25,2.5],[40,0]]
};
