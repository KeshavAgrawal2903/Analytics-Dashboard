from flask import Flask, jsonify, render_template
from src.main import main_bp
from src.logger import setup_logger

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    logger = setup_logger()
    
    # Sample data
    app.config['SAMPLE_DATA'] = {
        'users': [
            {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
            {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'},
            {'id': 3, 'name': 'Bob Johnson', 'email': 'bob@example.com'},
            {'id': 4, 'name': 'Alice Brown', 'email': 'alice@example.com'}
        ],
        'analytics': {
            'total_visits': 1500,
            'unique_users': 750,
            'avg_session_time': '5m 30s',
            'popular_pages': [
                {'path': '/home', 'visits': 500},
                {'path': '/products', 'visits': 300},
                {'path': '/about', 'visits': 200},
                {'path': '/contact', 'visits': 150},
                {'path': '/blog', 'visits': 100}
            ]
        }
    }
    
    # Register blueprints
    app.register_blueprint(main_bp, url_prefix='/api')
    
    @app.route('/')
    def index():
        """Render the dashboard page."""
        return render_template('index.html')
    
    @app.errorhandler(404)
    def not_found_error(error):
        logger.error(f'Page not found: {error}')
        return jsonify({'error': 'Not Found', 'status': 404}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f'Server Error: {error}')
        return jsonify({'error': 'Internal Server Error', 'status': 500}), 500
    
    logger.info('Application initialized successfully')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=3000)
