from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile with additional fields"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"


class ServiceArea(models.Model):
    """Service areas for electricity distribution"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    coverage_cities = models.TextField(help_text="Comma-separated list of cities")
    total_users = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class PowerOutage(models.Model):
    """Power outage reports"""
    STATUS_CHOICES = [
        ('REPORTED', 'Reported'),
        ('INVESTIGATING', 'Investigating'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
    ]
    
    SEVERITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    area = models.ForeignKey(ServiceArea, on_delete=models.CASCADE, related_name='outages')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_outages')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REPORTED')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='MEDIUM')
    affected_users = models.IntegerField(default=0)
    estimated_resolution = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.location}"
    
    class Meta:
        ordering = ['-created_at']


class Notification(models.Model):
    """User notifications"""
    TYPE_CHOICES = [
        ('OUTAGE_REPORTED', 'Outage Reported'),
        ('OUTAGE_UPDATED', 'Outage Updated'),
        ('OUTAGE_RESOLVED', 'Outage Resolved'),
        ('SYSTEM', 'System'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='SYSTEM')
    outage = models.ForeignKey(PowerOutage, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']


class MaintenanceSchedule(models.Model):
    """Scheduled maintenance activities"""
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    area = models.ForeignKey(ServiceArea, on_delete=models.CASCADE, related_name='maintenance')
    scheduled_start = models.DateTimeField()
    scheduled_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    affected_users = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.scheduled_start.date()}"
    
    class Meta:
        ordering = ['-scheduled_start']


class EmergencyContact(models.Model):
    """Emergency contact information"""
    CATEGORY_CHOICES = [
        ('EMERGENCY', 'Emergency Services'),
        ('TECHNICAL', 'Technical Support'),
        ('CUSTOMER', 'Customer Service'),
        ('ADMIN', 'Administration'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0, help_text="Higher number = higher priority")
    
    def __str__(self):
        return f"{self.name} - {self.category}"
    
    class Meta:
        ordering = ['-priority', 'name']
