import re

from odoo import http
from odoo.exceptions import AccessError, ValidationError
from odoo.http import request


_PARAMETER_KEY = "morio_web_app_launcher.background_color"
_DEFAULT_COLOR = "#f2f3f5"
_COLOR_PATTERN = re.compile(r"^#[0-9a-fA-F]{6}$")


class MorioLauncherConfigController(http.Controller):
    @http.route("/morio_web_app_launcher/config", type="jsonrpc", auth="user")
    def launcher_config(self, background_color=None):
        parameters = request.env["ir.config_parameter"].sudo()
        if background_color is None:
            return {
                "background_color": parameters.get_param(_PARAMETER_KEY, _DEFAULT_COLOR),
            }

        if not request.env.user.has_group("base.group_system"):
            raise AccessError("Only system administrators can change launcher settings.")
        if not isinstance(background_color, str) or not _COLOR_PATTERN.fullmatch(background_color):
            raise ValidationError("The launcher background color must be a six-digit hex color.")

        background_color = background_color.lower()
        parameters.set_param(_PARAMETER_KEY, background_color)
        return {"background_color": background_color}
