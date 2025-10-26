from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # Dashboard
    path('dashboard/', views.dashboard_view, name='dashboard'),
    
    # Outages
    path('outages/', views.outages_list_view, name='outages_list'),
    path('outages/<int:pk>/', views.outage_detail_view, name='outage_detail'),
    path('outages/report/', views.report_outage_view, name='report_outage'),
    path('outages/<int:pk>/update/', views.update_outage_view, name='update_outage'),
    path('outages/<int:pk>/delete/', views.delete_outage_view, name='delete_outage'),
    
    # Areas
    path('areas/', views.areas_view, name='areas'),
    
    # Notifications
    path('notifications/', views.notifications_view, name='notifications'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark_notification_read'),
    path('notifications/<int:pk>/delete/', views.delete_notification, name='delete_notification'),
    
    # Analytics
    path('analytics/', views.analytics_view, name='analytics'),
    
    # Maintenance
    path('maintenance/', views.maintenance_view, name='maintenance'),
    path('maintenance/create/', views.create_maintenance_view, name='create_maintenance'),
    
    # Emergency
    path('emergency/', views.emergency_contacts_view, name='emergency_contacts'),
    
    # Map
    path('map/', views.outage_map_view, name='outage_map'),
]
