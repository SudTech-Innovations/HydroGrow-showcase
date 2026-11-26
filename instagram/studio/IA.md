# Travailler à deux : vous et une IA dans le studio

Le studio accepte plusieurs éditeurs en même temps : vous dans le navigateur, et une IA (Claude ou une autre) qui crée, relit et modifie les posts à côté de vous.

- **Rien n'est écrasé.** Chaque éditeur n'envoie que ses changements (des « opérations »). Le serveur les applique sur la dernière version. Si vous tapez un titre pendant que l'IA change la légende, les deux restent.
- **Tout est en direct.** Les changements de l'IA apparaissent tout de suite dans votre navigateur : les vignettes touchées clignotent en vert, et le curseur reste là où vous tapiez.
- **Vous voyez l'IA.** Une pastille verte en haut de l'écran indique ce qu'elle fait (« Claude · ajoute un chiffre clé · diapo 3 »). Sa vignette de travail est entourée de vert. L'onglet **Activité** détaille chaque modification.
- **L'IA vous voit.** Elle sait quel projet vous avez ouvert, sur quelle diapo vous êtes et quel champ vous éditez, pour ne pas y toucher en même temps.
- **« Annuler » n'annule que votre travail.** Ctrl+Z ne défait pas les changements de l'IA.

## Avec Claude Code (ce dépôt)

Le serveur MCP est déclaré dans [`.mcp.json`](../../.mcp.json) à la racine. Ouvrez Claude Code dans le dépôt et acceptez le serveur `studio-instagram` quand il le propose. Vous pouvez ensuite demander par exemple :

- « Regarde le carrousel que j'ai ouvert et propose des titres plus courts. »
- « Prépare un post sur la récolte du basilic, format carré, pour vendredi. »
- « Fais la légende et les hashtags du projet ouvert. »
- « Vérifie que tout est dans la charte et corrige ce qui déborde. »

Si le studio n'est pas lancé, le serveur MCP le démarre lui-même. Ouvrez alors http://localhost:4400 pour suivre.

## Avec une autre IA

### Un client MCP (Claude Desktop, Cursor, etc.)

Ajoutez ce serveur dans la configuration MCP du client, avec le chemin complet :

```json
{
  "mcpServers": {
    "studio-instagram": {
      "command": "node",
      "args": ["C:/Users/<vous>/Desktop/HydroGrow-showcase/instagram/studio/mcp.mjs"],
      "env": { "STUDIO_IA_NOM": "Claude" }
    }
  }
}
```

`STUDIO_IA_NOM` est le nom affiché dans le studio. Pour deux IA en même temps, donnez à chacune un nom différent.

Outils disponibles :

| Outil | Rôle |
|---|---|
| `etat_studio` | Ce que vous regardez et la liste des projets. |
| `catalogue` | Modèles, champs, fonds, icônes, syntaxe du plan, opérations et règles de la charte. |
| `lire_projet` | Contenu complet d'un projet. |
| `creer_projet` | Nouveau projet depuis un plan écrit, un article du blog ou une liste de diapos. |
| `modifier_projet` | Applique des opérations, avec un message qui vous est affiché. |
| `apercu` | Image du rendu réel (une diapo ou la planche complète). |
| `verifier_projet` | Les vérifications de l'onglet Vérifier, débordements compris. |
| `exporter_projet` | Export des PNG et de la légende. |
| `envoyer_message` | Un message affiché dans le studio. |
| `signaler` | Ce que l'IA est en train de faire. |
| `lister_articles`, `lister_images` | Articles du blog et images disponibles. |

### N'importe quel programme : l'API HTTP

Le studio tourne sur `http://127.0.0.1:4400`.

| Méthode | Chemin | Rôle |
|---|---|---|
| GET | `/api/projets` | Liste des projets. |
| POST | `/api/projets` | Crée un projet : `{ titre, format?, plan? \| article? \| diapos?, legende?, date?, auteur }`. |
| GET | `/api/projets/<projet>` | Le projet complet (`version` et un `id` par diapo). |
| POST | `/api/projets/<projet>/operations` | `{ ops: [...], auteur, message }` : modifie le projet sans rien écraser. |
| GET | `/api/projets/<projet>/apercu?diapo=3&echelle=0.5` | PNG d'une diapo, ou de la planche avec `diapo=planche`. |
| GET | `/api/projets/<projet>/verifier` | Liste des points à revoir. |
| POST | `/api/exporter/<projet>` | Export PNG et légende. |
| GET | `/api/modeles` | Catalogue des modèles et de leurs champs. |
| GET / POST | `/api/presence` | Qui fait quoi. En POST : `{ qui, ia: true, activite, projet, diapo }`. |
| GET | `/api/evenements` | Flux en direct (Server-Sent Events) de tous les changements. |
| POST | `/api/evenements` | `{ auteur, texte, projet? }` : affiche un message dans le studio. |
| GET | `/api/blog`, `/api/images` | Articles du blog et images disponibles. |

Les opérations sont décrites en tête de [`public/operations.js`](public/operations.js). En voici un exemple :

```json
{
  "auteur": "Claude",
  "message": "Titre raccourci et chiffre clé ajouté.",
  "ops": [
    { "op": "champ", "diapo": "k3j9x2ab", "champ": "titre", "valeur": "Le *pH*" },
    { "op": "ajouter", "apres": "k3j9x2ab", "modele": "chiffre", "champs": { "chiffre": "6,0", "unite": "pH" } },
    { "op": "hashtags", "valeur": ["hydroponie", "HydroGrow", "capteurs"] }
  ]
}
```

Les diapos se désignent par leur `id`, qui ne change pas quand on les réordonne, plutôt que par leur position.

### Modifier directement les fichiers

Une IA peut aussi modifier `instagram/projets/<projet>.json` à la main : le studio le voit et se met à jour. Dans ce cas, la fusion fine n'a pas lieu. Si vous éditez le même projet au même moment, l'API reste préférable.
