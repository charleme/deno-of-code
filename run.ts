import { ContestResponse, initInput } from "./code.ts";
import { existsSync } from "@std/fs";

const NUMERO_DEPART_FICHIERS_TEST = 1;
const PREFIXE_FICHIER_INPUT = "input";
const PREFIXE_FICHIER_OUTPUT = "output";

const ICONE_SUCCES = "👍👌🎉🤘😎💪👊🤙🍾👏🙌🙏";

function cheminsFichiersDeTest(numero: number): [string, string] {
  return [
    `tests/${PREFIXE_FICHIER_INPUT}${numero}.txt`,
    `tests/${PREFIXE_FICHIER_OUTPUT}${numero}.txt`,
  ];
}

function iconeAleatoireSucces() {
  // Les emojis sont composés d'une paire de "code point", la position doit
  // être le début d'une paire, donc un chiffre pair.
  let positionAleatoire = 0;
  do {
    positionAleatoire = Math.floor(Math.random() * ICONE_SUCCES.length);
  } while (positionAleatoire % 2 === 1);
  return String.fromCodePoint(ICONE_SUCCES.codePointAt(positionAleatoire) ?? 0);
}

// Calcule le nombre de tests à passer
let nombreTotalDeTests = 0;
let numero = NUMERO_DEPART_FICHIERS_TEST;
let [fichierDeTest] = cheminsFichiersDeTest(numero);

while (existsSync(fichierDeTest)) {
  nombreTotalDeTests++;
  numero++;
  [fichierDeTest] = cheminsFichiersDeTest(numero);
}

if (nombreTotalDeTests > 0) {
  console.log(
    `> ${nombreTotalDeTests} fichier${
      nombreTotalDeTests > 1 ? "s" : ""
    } de test trouvés${nombreTotalDeTests > 1 ? "s" : ""}.`,
  );
  console.log("> Lancement des tests...");
} else {
  console.log(
    "Aucun test trouvé. Copiez vos fichiers dans le répertoire ./tests.",
  );
  throw new Error("Aucun fichier de test trouvé.");
}

let numeroTest = NUMERO_DEPART_FICHIERS_TEST;
let nombreDeTestsReussis = 0;
let succes = true;
let [fichierEntree, fichierSortie] = cheminsFichiersDeTest(numeroTest);

// On parcourt tous les tests, on s'arrête dès qu'un test ne passe pas
while (existsSync(fichierEntree) && existsSync(fichierSortie) && succes) {
  let contenuEntree = Deno.readTextFileSync(fichierEntree).split(/\r?\n/g);
  let contenuSortie = Deno.readTextFileSync(fichierSortie).split(/\r?\n/g);

  initInput(contenuEntree);

  // On affiche la sortie correcte attendue
  console.log(`-- Sortie attendue --\n${contenuSortie}`);

  let contenuConsole: unknown[] = [];
  const proxyDeConsole = new Proxy(console.log, {
    apply(cible, leThis, listeArgs) {
      contenuConsole.push(...listeArgs);
    },
  });

  // On stocke l'ancienne méthode log() pour la réutiliser plus tard
  const fonctionConsoleLog = console.log;

  // On met en place notre proxy à la place de console.log
  console.log = proxyDeConsole;

  // On appelle le code à tester qui fait appel à console.log (notre proxy !)
  // Tout ce qui sera affiché via console.log depuis code.js va être stocké dans contenuConsole
  ContestResponse();

  // On remet console.log normal (on retire le proxy) pour afficher les résultats
  console.log = fonctionConsoleLog;

  // On affiche la valeur reçue
  console.log("-- Valeur reçue (de code.js) --");
  if (contenuConsole.length <= 0) {
    console.log(
      "ERREUR: Aucune sortie reçue. Utilisez console.log() dans code.js pour soumettre votre réponse !",
    );
    succes = false;
  } else {
    // On affiche et on teste les lignes reçues
    contenuConsole.map((ligne) => console.log(ligne));
    contenuConsole.forEach((ligne, index) => {
      if (ligne != contenuSortie[index]) {
        console.log(`ERREUR: '${contenuSortie[index]}' != '${ligne}'`);
        succes = false;
      }
    });
  }

  if (succes) {
    nombreDeTestsReussis++;
    console.log(`✅ Test ${numeroTest} réussi`);
  }

  // On passe aux prochains fichiers de test
  numeroTest++;
  [fichierEntree, fichierSortie] = cheminsFichiersDeTest(numeroTest);
}

// Affiche le taux de réussite
console.log("");
const messagePourcentage = "Tests réussis : [" +
  "✅".repeat(nombreDeTestsReussis) +
  "❌".repeat(nombreTotalDeTests - nombreDeTestsReussis) +
  `] ${((nombreDeTestsReussis * 100) / nombreTotalDeTests).toFixed(2)} %`;

if (nombreDeTestsReussis === nombreTotalDeTests) {
  const emojiSucces = iconeAleatoireSucces();
  const messageSucces = "{ 100% des tests réussis }";
  console.log(emojiSucces.repeat(messageSucces.length / 2 + 2));
  console.log(messageSucces);
  console.log(emojiSucces.repeat(messageSucces.length / 2 + 2));
} else {
  console.log(messagePourcentage);
}
