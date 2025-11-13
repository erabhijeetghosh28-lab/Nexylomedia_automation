"""Backend package initializer."""

from flask import Flask

from config import Config

from backend.api.super_admin import super_admin_bp

def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register API blueprints
    app.register_blueprint(super_admin_bp, url_prefix="/api/super-admin")

    @app.route("/", methods=["GET"])
    def index():
        """Simple landing route to verify server status."""
        return (
            "<h1>Tool Automation Platform</h1>"
            "<p>Backend skeleton is running.</p>",
            200,
            {"Content-Type": "text/html; charset=utf-8"},
        )

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app


