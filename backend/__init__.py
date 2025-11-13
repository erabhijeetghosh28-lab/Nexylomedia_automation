"""Backend package initializer."""

from flask import Flask

from config import Config


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints here (placeholders for now)
    # from backend.api.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix="/api/auth")

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


