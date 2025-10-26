from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Outage, User, Area, Notification
from datetime import datetime

outages_bp = Blueprint('outages', __name__)

@outages_bp.route('', methods=['GET'])
@jwt_required()
def get_outages():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    status = request.args.get('status')
    area_id = request.args.get('area_id')
    user_filter = request.args.get('user_id')
    
    query = Outage.query
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    if area_id:
        query = query.filter_by(area_id=area_id)
    if user_filter:
        query = query.filter_by(user_id=user_filter)
    
    # Non-admin users can only see their own outages or all outages
    if user.role != 'admin' and user_filter and int(user_filter) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    outages = query.order_by(Outage.created_at.desc()).all()
    
    return jsonify([outage.to_dict() for outage in outages]), 200

@outages_bp.route('/<int:outage_id>', methods=['GET'])
@jwt_required()
def get_outage(outage_id):
    outage = Outage.query.get(outage_id)
    
    if not outage:
        return jsonify({'error': 'Outage not found'}), 404
    
    return jsonify(outage.to_dict()), 200

@outages_bp.route('', methods=['POST'])
@jwt_required()
def create_outage():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('title') or not data.get('description') or not data.get('location') or not data.get('area_id'):
        return jsonify({'error': 'Title, description, location, and area_id are required'}), 400
    
    # Create new outage
    outage = Outage(
        title=data['title'],
        description=data['description'],
        location=data['location'],
        status='REPORTED',
        priority=data.get('priority', 'MEDIUM'),
        affected_users=data.get('affected_users', 0),
        user_id=user_id,
        area_id=data['area_id']
    )
    
    db.session.add(outage)
    db.session.commit()
    
    # Create notification for user
    notification = Notification(
        title='Outage Reported',
        message=f'Your outage report "{outage.title}" has been submitted successfully.',
        type='SUCCESS',
        user_id=user_id
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Outage reported successfully',
        'outage': outage.to_dict()
    }), 201

@outages_bp.route('/<int:outage_id>', methods=['PUT'])
@jwt_required()
def update_outage(outage_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    outage = Outage.query.get(outage_id)
    
    if not outage:
        return jsonify({'error': 'Outage not found'}), 404
    
    # Check permissions
    if user.role != 'admin' and outage.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update fields
    if data.get('title'):
        outage.title = data['title']
    if data.get('description'):
        outage.description = data['description']
    if data.get('location'):
        outage.location = data['location']
    if data.get('status'):
        outage.status = data['status']
        if data['status'] == 'RESOLVED':
            outage.resolved_at = datetime.utcnow()
    if data.get('priority'):
        outage.priority = data['priority']
    if data.get('affected_users') is not None:
        outage.affected_users = data['affected_users']
    if data.get('estimated_resolution'):
        outage.estimated_resolution = datetime.fromisoformat(data['estimated_resolution'])
    
    db.session.commit()
    
    # Create notification
    notification = Notification(
        title='Outage Updated',
        message=f'Outage "{outage.title}" has been updated. Status: {outage.status}',
        type='INFO',
        user_id=outage.user_id
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Outage updated successfully',
        'outage': outage.to_dict()
    }), 200

@outages_bp.route('/<int:outage_id>', methods=['DELETE'])
@jwt_required()
def delete_outage(outage_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    outage = Outage.query.get(outage_id)
    
    if not outage:
        return jsonify({'error': 'Outage not found'}), 404
    
    # Check permissions
    if user.role != 'admin' and outage.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(outage)
    db.session.commit()
    
    return jsonify({'message': 'Outage deleted successfully'}), 200
