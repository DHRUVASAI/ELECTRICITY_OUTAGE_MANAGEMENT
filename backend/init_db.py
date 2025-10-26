from app import create_app
from models import db, User, Area, Outage, Notification, Maintenance
from datetime import datetime, timedelta

def init_database():
    app = create_app()
    
    with app.app_context():
        # Drop all tables and recreate
        db.drop_all()
        db.create_all()
        
        print("Creating default users...")
        
        # Create admin user
        admin = User(
            username='admin',
            email='admin@power.com',
            phone='+1234567890',
            address='123 Admin Street',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create regular user
        user = User(
            username='john_doe',
            email='user@power.com',
            phone='+1987654321',
            address='456 User Avenue',
            role='user'
        )
        user.set_password('user123')
        db.session.add(user)
        
        db.session.commit()
        
        print("Creating service areas...")
        
        # Create areas
        areas_data = [
            {
                'name': 'Downtown District',
                'code': 'DD-001',
                'description': 'Central business district with high-rise buildings',
                'cities': 'Downtown,Central City,Business Park',
                'total_users': 15000
            },
            {
                'name': 'North Residential',
                'code': 'NR-002',
                'description': 'Residential area in the northern part of the city',
                'cities': 'North Hills,Greenwood,Maple Grove',
                'total_users': 25000
            },
            {
                'name': 'South Industrial',
                'code': 'SI-003',
                'description': 'Industrial zone with factories and warehouses',
                'cities': 'South Port,Industrial Park,Factory District',
                'total_users': 8000
            },
            {
                'name': 'East Suburbs',
                'code': 'ES-004',
                'description': 'Suburban residential area',
                'cities': 'Eastwood,Riverside,Parkside',
                'total_users': 30000
            },
            {
                'name': 'West Commercial',
                'code': 'WC-005',
                'description': 'Commercial and shopping district',
                'cities': 'West Mall,Shopping Center,Market Street',
                'total_users': 12000
            }
        ]
        
        for area_data in areas_data:
            area = Area(**area_data)
            db.session.add(area)
        
        db.session.commit()
        
        print("Creating sample outages...")
        
        # Create sample outages
        areas = Area.query.all()
        
        outages_data = [
            {
                'title': 'Transformer Failure',
                'description': 'Main transformer failed due to overload',
                'location': 'Main Street & 5th Avenue',
                'status': 'IN_PROGRESS',
                'priority': 'HIGH',
                'affected_users': 500,
                'user_id': user.id,
                'area_id': areas[0].id
            },
            {
                'title': 'Scheduled Maintenance',
                'description': 'Routine maintenance on power lines',
                'location': 'North Hills Substation',
                'status': 'RESOLVED',
                'priority': 'LOW',
                'affected_users': 200,
                'user_id': user.id,
                'area_id': areas[1].id,
                'resolved_at': datetime.utcnow()
            },
            {
                'title': 'Storm Damage',
                'description': 'Power lines damaged by severe storm',
                'location': 'Industrial Park Area',
                'status': 'REPORTED',
                'priority': 'CRITICAL',
                'affected_users': 1000,
                'user_id': admin.id,
                'area_id': areas[2].id
            }
        ]
        
        for outage_data in outages_data:
            outage = Outage(**outage_data)
            db.session.add(outage)
        
        db.session.commit()
        
        print("Creating sample notifications...")
        
        # Create sample notifications
        notifications_data = [
            {
                'title': 'Welcome!',
                'message': 'Welcome to the Power Outage Management System',
                'type': 'INFO',
                'user_id': user.id
            },
            {
                'title': 'Outage Reported',
                'message': 'Your outage report has been received and is being processed',
                'type': 'SUCCESS',
                'user_id': user.id
            }
        ]
        
        for notif_data in notifications_data:
            notification = Notification(**notif_data)
            db.session.add(notification)
        
        db.session.commit()
        
        print("Creating sample maintenance schedules...")
        
        # Create sample maintenance
        maintenance_data = [
            {
                'title': 'Substation Upgrade',
                'description': 'Upgrading electrical equipment at main substation',
                'location': 'Central Substation',
                'start_time': datetime.utcnow() + timedelta(days=7),
                'end_time': datetime.utcnow() + timedelta(days=7, hours=6),
                'status': 'SCHEDULED',
                'affected_areas': f'{areas[0].id},{areas[1].id}'
            },
            {
                'title': 'Cable Replacement',
                'description': 'Replacing old underground cables',
                'location': 'West Commercial District',
                'start_time': datetime.utcnow() + timedelta(days=14),
                'end_time': datetime.utcnow() + timedelta(days=14, hours=8),
                'status': 'SCHEDULED',
                'affected_areas': f'{areas[4].id}'
            }
        ]
        
        for maint_data in maintenance_data:
            maintenance = Maintenance(**maint_data)
            db.session.add(maintenance)
        
        db.session.commit()
        
        print("\n✅ Database initialized successfully!")
        print("\nDefault credentials:")
        print("Admin - Email: admin@power.com, Password: admin123")
        print("User - Email: user@power.com, Password: user123")

if __name__ == '__main__':
    init_database()
