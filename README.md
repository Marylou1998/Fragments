# Fragments
Fragments de Mistriss Henley - Édition numérique

Cette édition numérique en visualisation de données a été réalisée dans le cadre du Master de Spécialisation en histoire du livre et édition critique des textes - édition numérique, sous la direction d'Isaac Pante, printemps 2024.

Documentation de D3.js : https://www.d3indepth.com/force-layout/

Le code s'est construit par ces étapes :
1. Prise en main de D3.js (notamment pour formater les données JSON correctement) via l'exemple de D3.js Force layout.
2. Mise en place de l'environnement dans VSC, formattage du svg, ajout de données supplémentaires dans le JSON (type, groupe, texte...)
3. Ajout du sidePanel, connection entre les id des noeuds et le texte lié, qui s'affiche dans le sidePanel...
4. Ajout de l'overlay, connection avec les id des noeuds connectés au noeud principal, affichage dans l'overlay...
5. Ajout d'éléments interactifs (cliquer sur les noeuds plutôt que sur des h ref dans le sidePanel pour ouvrir l'overlay ; environnement sonore ; éléments graphiques ; ajouter les images en background...)
6. Finalisation (adaptation à la fenêtre (vw et vh au lieu de %, etc...)
7. Finalisation des fragments : nouvelle sélection des fragments pour écarter les textes dont le lien avec l'id principal n'est pas évident, raccourcir certains textes...

Code D3.js utilisé : 
https://observablehq.com/@d3/force-directed-graph-component
Inspirations :
https://isaacpante.net/if/index.html
https://github.com/maladesimaginaires

