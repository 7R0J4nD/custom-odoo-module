# Odoo 19 — modules personnalisés

Les modules Odoo développés pour ce projet se trouvent dans addons/, avec un dossier par module. La documentation fonctionnelle est dans docs/.

## Environnement de développement

Copier .env.example vers .env et choisir un mot de passe local, puis lancer Odoo et PostgreSQL avec les volumes de développement :

docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

Odoo est disponible sur http://localhost:8069.
