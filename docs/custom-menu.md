# Prompt de développement — lanceur d’applications Odoo 19 Community

Copie le prompt ci-dessous dans ton environnement de développement pour démarrer le module.

---

## Rôle

Agis comme un développeur senior spécialisé dans Odoo 19 Community, son framework web OWL, son système d’assets et la maintenance de modules installés par paquets APT. Avant de coder, vérifie les API et composants réellement présents dans la version Odoo 19 ciblée. Ne transpose pas de code Odoo 16, 17 ou 18 sans validation.

## Contexte du projet

- Édition : Odoo Community 19.0, installé par APT sur Ubuntu 24.04.
- Service : `odoo` géré par systemd.
- Base de production : `morio_hold_prod_db`.
- La personnalisation doit être un addon indépendant, rangé dans un répertoire dédié aux addons personnalisés. Ne modifie jamais les fichiers du cœur Odoo ni les fichiers des addons APT.
- La configuration actuelle fixe la base et le sous-domaine. Ne change aucune option sans nécessité démontrée et sans documenter une sauvegarde et un retour arrière.
- Les sociétés, établissements et activités n’ont pas encore été définis. Les exemples précédemment donnés (restaurants, commerces, hôtels et villes) étaient fictifs et ne doivent pas devenir des données ou des hypothèses du module.

## Besoin fonctionnel

Dans Odoo Community, le bouton d’applications en haut à gauche ouvre actuellement une liste déroulante principalement textuelle. Le besoin est de remplacer cette expérience par un lanceur en grille de tuiles, avec une icône et le nom de chaque application, dans l’esprit de la capture de référence fournie par l’utilisateur.

Le module doit :

1. Ouvrir le lanceur depuis le bouton d’applications déjà présent dans la barre supérieure.
2. Présenter les applications racines sous forme de tuiles cliquables avec icône et libellé.
3. Ouvrir, pour chaque tuile, la même application et la même action que le menu racine Odoo correspondant.
4. Afficher uniquement les applications que l’utilisateur connecté peut déjà voir et ouvrir selon les menus, groupes et droits Odoo existants.
5. Conserver le fonctionnement normal des sous-menus et de la navigation une fois une application ouverte.
6. Prévoir un état vide compréhensible si l’utilisateur n’a aucune application disponible.

Le périmètre est uniquement l’interface de sélection des applications. Ne crée ni ne renomme de société, de branche, de point de vente ou d’application métier. Ne change ni les ACL, ni les règles d’enregistrement, ni les données, ni les workflows comptables ou opérationnels. Ce lanceur ne doit jamais servir de mécanisme de sécurité.

## Étape préalable obligatoire : analyser Odoo 19

Avant toute modification :

1. Relever la version exacte du paquet Odoo installé et vérifier la branche/version 19.0 correspondante.
2. Lire le code Odoo 19 réellement installé ou la source officielle correspondante pour identifier le composant du bouton d’applications, le service de menus, la forme des menus racines et leurs icônes.
3. Identifier les points d’extension publics et les pratiques documentées en Odoo 19. Préférer une extension OWL/API officielle.
4. Si un `patch` du client web est vraiment indispensable, le limiter au composant nécessaire, expliquer pourquoi aucun point d’extension plus stable ne convient, et couvrir le patch par des tests.
5. Ne pas déduire les noms de propriétés JavaScript du seul souvenir d’une version précédente. Vérifier chaque import et champ dans la source 19.0 ciblée.
6. Présenter brièvement l’architecture retenue et ses risques de compatibilité avant d’implémenter.

## Architecture attendue du module

- Nom technique proposé : `morio_web_app_launcher` (préfixe de projet obligatoire pour éviter les collisions).
- Addon autonome, versionné pour Odoo 19, avec un `__manifest__.py` complet et une dépendance minimale (`web` si suffisante après vérification).
- Déclarer JavaScript, templates OWL et SCSS/CSS dans le bundle backend officiel approprié via la clé `assets` du manifeste.
- Utiliser les modules JavaScript natifs Odoo (`/** @odoo-module **/`) et les API de composants, services et registries documentées pour Odoo 19.
- Garder la logique UI séparée du style et des tests. N’ajouter Python, contrôleur, modèle ou accès SQL que si une nécessité fonctionnelle vérifiée l’exige.
- Ne jamais recopier, distribuer ou appeler des composants propriétaires Enterprise. Le code doit fonctionner sur Community.
- Choisir explicitement une licence compatible avec la politique de distribution du projet. Ne pas reprendre du code tiers sans vérifier sa licence.

## Règles d’accès et de sécurité

- Réutiliser les menus racines déjà chargés par le client Odoo et filtrés pour l’utilisateur courant, en suivant l’API Odoo 19 confirmée dans le code.
- Ne pas interroger directement PostgreSQL depuis le navigateur et ne pas créer de route publique.
- Ne pas charger des menus cachés en contournant les groupes ou les droits d’accès.
- Ne pas accorder de droits supplémentaires, changer de société active, ou révéler des entrées d’applications inaccessibles.
- Traiter les contrôles côté client comme de l’affichage seulement. La sécurité doit rester celle des ACL, groupes et règles Odoo existants.
- Ne pas inclure de secrets, identifiants de production ni données clients dans le dépôt, les fixtures ou les captures de test.

## Exigences de design et d’ergonomie

- Interface simple, cohérente avec le style natif Odoo 19 ; ne pas créer un thème global.
- Grille de tuiles claire, avec espacement régulier et hiérarchie visuelle lisible.
- Utiliser l’icône fournie par le menu racine Odoo lorsque disponible. Vérifier la structure d’icône réelle dans Odoo 19. Prévoir une icône de repli propre lorsqu’elle manque ou ne peut pas être chargée.
- Afficher le libellé traduit du menu, sans coder en dur une liste française d’applications.
- Mise en page responsive : écran large, tablette et mobile, sans défilement horizontal.
- Chaque tuile doit avoir une zone cliquable suffisante, un état hover/focus/active visible et une indication accessible du nom de l’application.
- Assurer la navigation clavier, un ordre de tabulation prévisible, une sémantique HTML adaptée, un contraste lisible et le respect de `prefers-reduced-motion`.
- Gérer les libellés longs sans chevauchement ; permettre la localisation et les langues RTL si la disposition native Odoo les prend en charge.
- N’ajouter aucune animation décorative lourde, image distante, police distante ou dépendance visuelle externe.
- S’inspirer de la capture de référence pour l’écran en tuiles, sans réutiliser les logos, alertes ou éléments de marque d’un autre serveur/base.

## Performance et compatibilité

- Réutiliser les données de menus déjà disponibles dans le web client ; éviter toute requête réseau par tuile ou au rendu.
- Ne pas ajouter de bibliothèque JS ou CSS externe ni de gros paquet pour une grille simple.
- Charger les assets uniquement dans le backend, pas dans le site public ni le point de vente, sauf preuve d’une nécessité.
- Garder le coût de rendu proportionnel au nombre réel d’applications racines ; utiliser des clés stables dans les boucles OWL.
- Éviter les accès répétés au DOM, les observateurs globaux permanents, les timers et les listeners qui ne sont pas nettoyés.
- Vérifier le comportement avec cache d’assets, mode `debug=assets`, écran étroit et navigation entre plusieurs applications.
- Documenter les points susceptibles de changer lors d’une mise à jour mineure ou majeure Odoo 19, et les vérifier à chaque mise à jour du paquet.

## Qualité de code

- Suivre les conventions officielles Odoo 19 : structure lisible, noms explicites, petites fonctions, commentaires sur les décisions non évidentes, pas de code mort.
- Garder le diff isolé dans le nouvel addon ; pas de monkey-patch de prototypes globaux, modification de fichiers Odoo, CSS global agressif ou sélecteurs fragiles basés sur la structure accidentelle du DOM.
- Ne pas masquer simplement la liste native avec `display: none` sans remplacer correctement son comportement, son accessibilité et son intégration avec la navigation.
- Toute API interne utilisée doit être identifiée comme telle, justifiée et isolée pour faciliter son adaptation.
- Fournir un README avec le but, les dépendances, l’installation en environnement APT, les tests, les limites et la désinstallation.
- Fournir un changelog et incrémenter la version du module selon les règles Odoo lorsque les changements le justifient.

## Tests et critères d’acceptation

Utiliser les outils de test disponibles dans Odoo 19. Ajouter des tests JavaScript OWL/unitaires et/ou un tour d’intégration si cela permet de vérifier le client réel. Ne pas écrire de tests Python artificiels pour du code exclusivement frontal.

Vérifier au minimum :

1. Le bouton ouvre et referme le lanceur sans erreur console.
2. Chaque application accessible apparaît une seule fois, avec libellé et icône ou icône de repli.
3. Cliquer une tuile ouvre la bonne application ; retour au lanceur reste possible.
4. Un utilisateur de test avec un ensemble différent de groupes ne voit que ses applications autorisées.
5. Les applications sans icône, les noms longs, le petit écran et l’état vide sont traités proprement.
6. Navigation clavier, focus visible et lecteur d’écran restent utilisables.
7. Les menus internes, changement de société natif et autres éléments de barre supérieure ne régressent pas.
8. Le code passe les vérifications statiques disponibles et le test d’installation/mise à jour du module sur une base de test Odoo 19.

Ne pas installer ni tester d’abord sur la base de production. Utiliser une base de développement ou une copie restaurée et anonymisée. Ne jamais lancer une mise à jour globale `-u all` pour déployer ce module.

## Déploiement APT et retour arrière

Le déploiement devra respecter l’installation actuelle par paquet APT :

1. Installer le code dans un chemin dédié, séparé des addons fournis par le paquet.
2. Si `addons_path` doit être modifié, relever sa valeur effective, préserver tous les chemins existants, sauvegarder `/etc/odoo/odoo.conf`, ajouter uniquement le chemin personnalisé et vérifier les droits de lecture pour l’utilisateur système `odoo`.
3. Vérifier la syntaxe de configuration, redémarrer le service seulement au moment prévu et contrôler son état ainsi que ses journaux.
4. Installer/mettre à jour uniquement ce module sur une base de test, puis valider la navigation dans le navigateur.
5. Préparer une procédure de retour arrière : sauvegarde DB et fichiers, désactivation ou désinstallation propre du module, restauration du paramètre `addons_path` si ajouté, redémarrage et vérifications.
6. Ne pas modifier la base `morio_hold_prod_db` sans validation explicite après revue du module et des résultats de test.

## Livrables demandés

À la fin du développement, fournir :

- le dossier complet de l’addon, prêt à copier dans le répertoire d’addons personnalisés ;
- un résumé de l’architecture et du point d’extension Odoo 19 utilisé ;
- les tests exécutés et leurs résultats, en distinguant ce qui a été testé localement de ce qui reste à vérifier sur le VPS ;
- les étapes d’installation/mise à jour adaptées à Odoo APT et les vérifications navigateur ;
- la procédure de retour arrière ;
- les limites connues et les risques lors des mises à jour Odoo.

Ne prétends pas qu’un test ou un déploiement a réussi s’il n’a pas réellement été exécuté. Si l’environnement ne permet pas d’exécuter Odoo 19, indique précisément les vérifications en attente au lieu de les simuler.

## Références officielles à consulter

- Odoo 19 — structure des menus et app switcher : <https://www.odoo.com/documentation/19.0/developer/tutorials/server_framework_101/05_firstui.html>
- Odoo 19 — personnalisation du client web et OWL : <https://www.odoo.com/documentation/19.0/developer/tutorials/web.html>
- Odoo 19 — assets frontend et bundles : <https://www.odoo.com/documentation/19.0/developer/reference/frontend/assets.html>
- Odoo 19 — tests : <https://www.odoo.com/documentation/19.0/developer/reference/backend/testing.html>
- Odoo 19 — conventions de développement : <https://www.odoo.com/documentation/19.0/contributing/development/coding_guidelines.html>
- Odoo 19 — CLI, `--addons-path`, installation et mise à jour : <https://www.odoo.com/documentation/19.0/developer/cli.html>

---

Commence par l’analyse du client web Odoo 19 et propose une conception courte, vérifiable et spécifique à cette version. Ensuite, développe le module dans une branche ou un répertoire de travail isolé, ajoute les tests pertinents, exécute-les, puis fournis les livrables demandés. N’applique rien directement sur la production pendant la phase de développement.
