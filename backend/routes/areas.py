from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Area, User, Outage

areas_bp = Blueprint('areas', __name__)

@areas_bp.route('', methods=['GET'])
@jwt_required()
def get_areas():
    search = request.args.get('search', '')
    
    query = Area.query
    
    if search:
        query = query.filter(
            (Area.name.ilike(f'%{search}%')) | 
            (Area.code.ilike(f'%{search}%'))
        )
    
    areas = query.order_by(Area.name).all()
    
    # Add active outages count for each area
    result = []
    for area in areas:
        area_dict = area.to_dict()
        area_dict['active_outages'] = Outage.query.filter_by(
            area_id=area.id, 
            status='REPORTED'
        ).count()
        result.append(area_dict)
    
    return jsonify(result), 200

@areas_bp.route('/<int:area_id>', methods=['GET'])
@jwt_required()
def get_area(area_id):
    area = Area.query.get(area_id)
    
    if not area:
        return jsonify({'error': 'Area not found'}), 404
    
    area_dict = area.to_dict()
    area_dict['active_outages'] = Outage.query.filter_by(
        area_id=area.id, 
        status='REPORTED'
    ).count()
    
    return jsonify(area_dict), 200

@areas_bp.route('', methods=['POST'])
@jwt_required()
def create_area():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    data = request.get_json()
    
    if not data.get('name') or not data.get('code'):
        return jsonify({'error': 'Name and code are required'}), 400
    
    # Check if code already exists
    if Area.query.filter_by(code=data['code']).first():
        return jsonify({'error': 'Area code already exists'}), 400
    
    area = Area(
        name=data['name'],
        code=data['code'],
        description=data.get('description', ''),
        cities=','.join(data.get('cities', [])) if isinstance(data.get('cities'), list) else data.get('cities', ''),
        total_users=data.get('total_users', 0)
    )
    
    db.session.add(area)
    db.session.commit()
    
    return jsonify({
        'message': 'Area created successfully',
        'area': area.to_dict()
    }), 201

@areas_bp.route('/<int:area_id>', methods=['PUT'])
@jwt_required()
def update_area(area_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    area = Area.query.get(area_id)
    
    if not area:
        return jsonify({'error': 'Area not found'}), 404
    
    data = request.get_json()
    
    if data.get('name'):
        area.name = data['name']
    if data.get('description'):
        area.description = data['description']
    if data.get('cities'):
        area.cities = ','.join(data['cities']) if isinstance(data['cities'], list) else data['cities']
    if data.get('total_users') is not None:
        area.total_users = data['total_users']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Area updated successfully',
        'area': area.to_dict()
    }), 200

@areas_bp.route('/<int:area_id>', methods=['DELETE'])
@jwt_required()
def delete_area(area_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    area = Area.query.get(area_id)
    
    if not area:
        return jsonify({'error': 'Area not found'}), 404
    
    # Check if area has outages
    if Outage.query.filter_by(area_id=area_id).first():
        return jsonify({'error': 'Cannot delete area with existing outages'}), 400
    
    db.session.delete(area)
    db.session.commit()
    
    return jsonify({'message': 'Area deleted successfully'}), 200
