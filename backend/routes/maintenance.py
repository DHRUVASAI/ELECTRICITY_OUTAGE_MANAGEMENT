from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Maintenance, User
from datetime import datetime

maintenance_bp = Blueprint('maintenance', __name__)

@maintenance_bp.route('', methods=['GET'])
@jwt_required()
def get_maintenance():
    status = request.args.get('status')
    
    query = Maintenance.query
    
    if status:
        query = query.filter_by(status=status)
    
    maintenance = query.order_by(Maintenance.start_time.desc()).all()
    
    return jsonify([m.to_dict() for m in maintenance]), 200

@maintenance_bp.route('/<int:maintenance_id>', methods=['GET'])
@jwt_required()
def get_maintenance_by_id(maintenance_id):
    maintenance = Maintenance.query.get(maintenance_id)
    
    if not maintenance:
        return jsonify({'error': 'Maintenance not found'}), 404
    
    return jsonify(maintenance.to_dict()), 200

@maintenance_bp.route('', methods=['POST'])
@jwt_required()
def create_maintenance():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ['title', 'description', 'location', 'start_time', 'end_time']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    maintenance = Maintenance(
        title=data['title'],
        description=data['description'],
        location=data['location'],
        start_time=datetime.fromisoformat(data['start_time']),
        end_time=datetime.fromisoformat(data['end_time']),
        status='SCHEDULED',
        affected_areas=','.join(map(str, data.get('affected_areas', []))) if isinstance(data.get('affected_areas'), list) else data.get('affected_areas', '')
    )
    
    db.session.add(maintenance)
    db.session.commit()
    
    return jsonify({
        'message': 'Maintenance scheduled successfully',
        'maintenance': maintenance.to_dict()
    }), 201

@maintenance_bp.route('/<int:maintenance_id>', methods=['PUT'])
@jwt_required()
def update_maintenance(maintenance_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    maintenance = Maintenance.query.get(maintenance_id)
    
    if not maintenance:
        return jsonify({'error': 'Maintenance not found'}), 404
    
    data = request.get_json()
    
    if data.get('title'):
        maintenance.title = data['title']
    if data.get('description'):
        maintenance.description = data['description']
    if data.get('location'):
        maintenance.location = data['location']
    if data.get('start_time'):
        maintenance.start_time = datetime.fromisoformat(data['start_time'])
    if data.get('end_time'):
        maintenance.end_time = datetime.fromisoformat(data['end_time'])
    if data.get('status'):
        maintenance.status = data['status']
    if data.get('affected_areas'):
        maintenance.affected_areas = ','.join(map(str, data['affected_areas'])) if isinstance(data['affected_areas'], list) else data['affected_areas']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Maintenance updated successfully',
        'maintenance': maintenance.to_dict()
    }), 200

@maintenance_bp.route('/<int:maintenance_id>', methods=['DELETE'])
@jwt_required()
def delete_maintenance(maintenance_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    maintenance = Maintenance.query.get(maintenance_id)
    
    if not maintenance:
        return jsonify({'error': 'Maintenance not found'}), 404
    
    db.session.delete(maintenance)
    db.session.commit()
    
    return jsonify({'message': 'Maintenance deleted successfully'}), 200
