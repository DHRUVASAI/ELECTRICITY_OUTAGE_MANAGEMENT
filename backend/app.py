from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.outages import outages_bp
from routes.areas import areas_bp
from routes.notifications import notifications_bp
from routes.analytics import analytics_bp
from routes.maintenance import maintenance_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)
    JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(outages_bp, url_prefix='/api/outages')
    app.register_blueprint(areas_bp, url_prefix='/api/areas')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(maintenance_bp, url_prefix='/api/maintenance')
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'message': 'Server is running'})
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
