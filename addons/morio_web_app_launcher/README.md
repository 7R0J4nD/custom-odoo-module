# Morio Web App Launcher

Replaces Odoo's default landing content with a responsive application grid, matching the supplied tile reference, while preserving the standard navbar. The active company's logo replaces the Discuss icon in the systray; the unread counter and click-through to messages remain available. The navbar app button returns to the launcher rather than opening a dropdown or mobile sidebar. System administrators can open launcher settings from the gear button and change the shared background color.

## Requirements

- Odoo Community 19.0
- The `web` and `mail` modules

## Installation in an APT installation

1. Copy this addon directory to a dedicated custom-addons directory readable by the `odoo` system user.
2. Add that directory to the effective `addons_path` while preserving all existing paths. Back up the Odoo configuration before editing it.
3. Restart Odoo at the planned maintenance time, update the Apps list, and install **Morio Web App Launcher** on a development or anonymized test database first.
4. Check the desktop launcher in normal asset mode and `?debug=assets`, then verify keyboard navigation and narrow screens.

Do not install this addon on a production database before reviewing the addon and the test results. Do not use `-u all` to update it.

## Development with Docker Compose

Use the `docker-compose.dev.yml` override in this repository to mount the custom-addons directory at `/mnt/extra-addons`. The override uses separate database and Odoo data volumes so its development database is isolated from volumes declared by the root Compose file. Start the stack and install the addon on this disposable development database. The supplied root Compose file is left unchanged.

## Compatibility notes

The landing screen is a client action loaded by an isolated patch of `WebClient._loadDefaultApp()` because Odoo 19 has no public default-home registry. The navbar uses a contrasting plum background on launcher pages and hides its home button on the launcher itself. The Discuss systray icon uses the active company's logo from Odoo's existing company settings. The background color is stored globally in `ir.config_parameter` and can be changed by members of `base.group_system`. These web-client templates and the default-app method are internal implementation details, so verify them after Odoo updates.

## Uninstallation and rollback

1. Remove the addon from the Apps list on a development database and confirm normal navigation returns.
2. Remove the addon directory from the custom-addons path and revert any `addons_path` change using the saved configuration.
3. Restart Odoo and check its service status and logs. Restore a database backup if an installation or upgrade changed database state unexpectedly.

## License

LGPL-3.
