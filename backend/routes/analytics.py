from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Outage, Area, User
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Total outages
    total_outages = Outage.query.count()
    
    # Active outages
    active_outages = Outage.query.filter(
        Outage.status.in_(['REPORTED', 'IN_PROGRESS'])
    ).count()
    
    # Resolved outages
    resolved_outages = Outage.query.filter_by(status='RESOLVED').count()
    
    # Total areas
    total_areas = Area.query.count()
    
    # Total users
    total_users = User.query.count()
    
    # Average resolution time (in hours)
    resolved = Outage.query.filter(
        Outage.status == 'RESOLVED',
        Outage.resolved_at.isnot(None)
    ).all()
    
    avg_resolution_time = 0
    if resolved:
        total_time = sum([
            (outage.resolved_at - outage.created_at).total_seconds() / 3600
            for outage in resolved
        ])
        avg_resolution_time = round(total_time / len(resolved), 2)
    
    # Outages by status
    outages_by_status = db.session.query(
        Outage.status, func.count(Outage.id)
    ).group_by(Outage.status).all()
    
    status_counts = {status: count for status, count in outages_by_status}
    
    # Outages by priority
    outages_by_priority = db.session.query(
        Outage.priority, func.count(Outage.id)
    ).group_by(Outage.priority).all()
    
    priority_counts = {priority: count for priority, count in outages_by_priority}
    
    # Recent outages (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_outages = Outage.query.filter(
        Outage.created_at >= seven_days_ago
    ).count()
    
    return jsonify({
        'total_outages': total_outages,
        'active_outages': active_outages,
        'resolved_outages': resolved_outages,
        'total_areas': total_areas,
        'total_users': total_users,
        'avg_resolution_time': avg_resolution_time,
        'outages_by_status': status_counts,
        'outages_by_priority': priority_counts,
        'recent_outages': recent_outages
    }), 200

@analytics_bp.route('/trends', methods=['GET'])
@jwt_required()
def get_trends():
    # Get outages for the last 30 days grouped by day
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    outages = Outage.query.filter(
        Outage.created_at >= thirty_days_ago
    ).all()
    
    # Group by date
    trends = {}
    for outage in outages:
        date_key = outage.created_at.strftime('%Y-%m-%d')
        if date_key not in trends:
            trends[date_key] = {'reported': 0, 'resolved': 0}
        
        trends[date_key]['reported'] += 1
        if outage.status == 'RESOLVED':
            trends[date_key]['resolved'] += 1
    
    # Convert to list format
    trend_list = [
        {
            'date': date,
            'reported': data['reported'],
            'resolved': data['resolved']
        }
        for date, data in sorted(trends.items())
    ]
    
    return jsonify(trend_list), 200

@analytics_bp.route('/areas-stats', methods=['GET'])
@jwt_required()
def get_areas_stats():
    areas = Area.query.all()
    
    stats = []
    for area in areas:
        total_outages = Outage.query.filter_by(area_id=area.id).count()
        active_outages = Outage.query.filter_by(
            area_id=area.id,
            status='REPORTED'
        ).count()
        
        stats.append({
            'area': area.to_dict(),
            'total_outages': total_outages,
            'active_outages': active_outages
        })
    
    return jsonify(stats), 200
