import { Component, onMounted, onWillStart, onWillUnmount, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { rpc } from "@web/core/network/rpc";
import { user } from "@web/core/user";
import { WebClient } from "@web/webclient/webclient";
import { MessagingMenu } from "@mail/core/public_web/messaging_menu";

const DEFAULT_BACKGROUND_COLOR = "#f2f3f5";
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

async function loadBackgroundColor() {
    const config = await rpc("/morio_web_app_launcher/config", {});
    const color = config?.background_color;
    return typeof color === "string" && HEX_COLOR_PATTERN.test(color)
        ? color.toLowerCase()
        : DEFAULT_BACKGROUND_COLOR;
}

export class MorioHomeLauncher extends Component {
    static template = "morio_web_app_launcher.Home";
    static props = {};
    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");
        this.state = useState({ backgroundColor: DEFAULT_BACKGROUND_COLOR });
        onWillStart(async () => {
            this.state.backgroundColor = await loadBackgroundColor().catch(
                () => DEFAULT_BACKGROUND_COLOR
            );
        });
        onMounted(() => {
            document.body.classList.add("morio_launcher_active", "morio_launcher_home");
        });
        onWillUnmount(() => {
            document.body.classList.remove("morio_launcher_active", "morio_launcher_home");
        });
    }

    get apps() {
        return this.menuService.getApps();
    }

    get canManageSettings() {
        return user.isSystem;
    }

    openSettings() {
        return this.actionService.doAction("morio_web_app_launcher.action_launcher_settings");
    }

    getMenuItemHref(app) {
        return `/odoo/${app.actionPath || "action-" + app.actionID}`;
    }

    onAppClick(ev, app) {
        if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) {
            return;
        }
        ev.preventDefault();
        return this.menuService.selectMenu(app);
    }
}

registry.category("actions").add("morio_web_app_launcher.home", MorioHomeLauncher);

export class MorioLauncherSettings extends Component {
    static template = "morio_web_app_launcher.Settings";
    static props = {};

    setup() {
        this.actionService = useService("action");
        this.notification = useService("notification");
        this.state = useState({
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            isLoading: true,
            isSaving: false,
        });
        onWillStart(async () => {
            this.state.backgroundColor = await loadBackgroundColor().catch(
                () => DEFAULT_BACKGROUND_COLOR
            );
            this.state.isLoading = false;
        });
        onMounted(() => document.body.classList.add("morio_launcher_active"));
        onWillUnmount(() => document.body.classList.remove("morio_launcher_active"));
    }

    get canManageSettings() {
        return user.isSystem;
    }

    onColorChange(ev) {
        this.state.backgroundColor = ev.target.value.toLowerCase();
    }

    async saveColor() {
        if (!this.canManageSettings || this.state.isSaving) {
            return;
        }
        this.state.isSaving = true;
        try {
            const result = await rpc("/morio_web_app_launcher/config", {
                background_color: this.state.backgroundColor,
            });
            this.state.backgroundColor = result.background_color;
            this.notification.add("La couleur du menu a été enregistrée.", { type: "success" });
        } catch {
            this.notification.add("Impossible d’enregistrer la couleur du menu.", {
                type: "danger",
            });
        } finally {
            this.state.isSaving = false;
        }
    }

    resetColor() {
        this.state.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        return this.saveColor();
    }

    backToHome() {
        return this.actionService.doAction("morio_web_app_launcher.action_app_launcher_home");
    }
}

registry.category("actions").add("morio_web_app_launcher.settings", MorioLauncherSettings);

patch(MessagingMenu.prototype, {
    setup() {
        super.setup(...arguments);
        this.user = user;
    },
});

patch(WebClient.prototype, {
    _loadDefaultApp() {
        return this.actionService.doAction("morio_web_app_launcher.action_app_launcher_home");
    },
});
