{
    "name": "Morio Web App Launcher",
    "summary": "Show accessible Odoo apps in a responsive tile launcher",
    "author": "Morio",
    "version": "19.0.1.4.0",
    "category": "Productivity",
    "license": "LGPL-3",
    "depends": ["web", "mail"],
    "data": [
        "views/actions.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "morio_web_app_launcher/static/src/js/home_launcher.js",
            "morio_web_app_launcher/static/src/xml/app_launcher.xml",
            "morio_web_app_launcher/static/src/scss/app_launcher.scss",
        ],
    },
    "installable": True,
    "application": True,
}
