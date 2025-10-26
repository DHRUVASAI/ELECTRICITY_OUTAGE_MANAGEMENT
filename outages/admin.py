from django.contrib import admin
from .models import (
    UserProfile, ServiceArea, PowerOutage, 
    Notification, MaintenanceSchedule, EmergencyContact
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'is_admin', 'created_at']
    list_filter = ['is_admin', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_users', 'created_at']
    search_fields = ['name', 'coverage_cities']


@admin.register(PowerOutage)
class PowerOutageAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'area', 'status', 'severity', 'reported_by', 'created_at']
    list_filter = ['status', 'severity', 'area', 'created_at']
    search_fields = ['title', 'location', 'description']
    date_hierarchy = 'created_at'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__username']


@admin.register(MaintenanceSchedule)
class MaintenanceScheduleAdmin(admin.ModelAdmin):
    list_display = ['title', 'area', 'scheduled_start', 'scheduled_end', 'status', 'created_by']
    list_filter = ['status', 'area', 'scheduled_start']
    search_fields = ['title', 'description']
    date_hierarchy = 'scheduled_start'


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'phone', 'email', 'priority', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'phone', 'email']
