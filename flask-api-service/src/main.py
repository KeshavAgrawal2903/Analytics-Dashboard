from flask import Blueprint, jsonify, request, current_app
from .logger import setup_logger

# Initialize blueprint and logger
main_bp = Blueprint('main', __name__)
logger = setup_logger()

@main_bp.before_request
def log_request_info():
    """Log information about incoming requests."""
    logger.info(f'Request: {request.method} {request.path}')
    logger.info(f'Headers: {dict(request.headers)}')
    if request.is_json:
        logger.info(f'JSON Body: {request.get_json()}')

@main_bp.route('/status', methods=['GET'])
def status():
    """Returns the status of the service."""
    logger.info('Status endpoint accessed')
    return jsonify({'status': 'running'})

@main_bp.route('/welcome', methods=['GET'])
def welcome():
    """Returns a welcome message."""
    logger.info(f'Welcome endpoint accessed: {request.method} {request.path}')
    return jsonify({'message': 'Welcome to the Flask API Service!'})

@main_bp.route('/users', methods=['GET'])
def get_users():
    """Returns list of users."""
    logger.info('Users endpoint accessed')
    return jsonify(current_app.config['SAMPLE_DATA']['users'])

@main_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Returns analytics data."""
    logger.info('Analytics endpoint accessed')
    return jsonify(current_app.config['SAMPLE_DATA']['analytics'])

@main_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Returns complete dashboard data."""
    logger.info('Dashboard endpoint accessed')
    return jsonify({
        'users': current_app.config['SAMPLE_DATA']['users'],
        'analytics': current_app.config['SAMPLE_DATA']['analytics']
    })

@main_bp.errorhandler(Exception)
def handle_error(error):
    """Global error handler for the blueprint."""
    logger.error(f'Error occurred: {str(error)}')
    return jsonify({
        'error': str(error),
        'status': 'error'
    }), 500
