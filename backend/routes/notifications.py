from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    
    notifications = Notification.query.filter_by(user_id=user_id).order_by(
        Notification.created_at.desc()
    ).all()
    
    return jsonify([notif.to_dict() for notif in notifications]), 200

@notifications_bp.route('/<int:notification_id>', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    user_id = get_jwt_identity()
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({
        'message': 'Notification marked as read',
        'notification': notification.to_dict()
    }), 200

@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    user_id = get_jwt_identity()
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(notification)
    db.session.commit()
    
    return jsonify({'message': 'Notification deleted successfully'}), 200

@notifications_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_read():
    user_id = get_jwt_identity()
    
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    
    return jsonify({'message': 'All notifications marked as read'}), 200
