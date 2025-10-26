from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from .models import (
    PowerOutage, ServiceArea, Notification, 
    MaintenanceSchedule, EmergencyContact, UserProfile
)
from .forms import (
    UserRegisterForm, OutageReportForm, OutageUpdateForm,
    MaintenanceForm, UserProfileForm
)


def login_view(request):
    """User login view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {user.username}!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'outages/login.html')


def register_view(request):
    """User registration view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create user profile
            UserProfile.objects.create(
                user=user,
                phone=form.cleaned_data.get('phone', ''),
                address=form.cleaned_data.get('address', '')
            )
            messages.success(request, 'Account created successfully! Please login.')
            return redirect('login')
    else:
        form = UserRegisterForm()
    
    return render(request, 'outages/register.html', {'form': form})


def logout_view(request):
    """User logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('login')


@login_required
def dashboard_view(request):
    """Main dashboard view"""
    user = request.user
    is_admin = hasattr(user, 'profile') and user.profile.is_admin
    
    # Get statistics
    total_outages = PowerOutage.objects.count()
    active_outages = PowerOutage.objects.filter(status__in=['REPORTED', 'INVESTIGATING', 'IN_PROGRESS']).count()
    resolved_outages = PowerOutage.objects.filter(status='RESOLVED').count()
    my_reports = PowerOutage.objects.filter(reported_by=user).count()
    
    # Recent outages
    recent_outages = PowerOutage.objects.select_related('area', 'reported_by').order_by('-created_at')[:5]
    
    # Unread notifications
    unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
    context = {
        'is_admin': is_admin,
        'total_outages': total_outages,
        'active_outages': active_outages,
        'resolved_outages': resolved_outages,
        'my_reports': my_reports,
        'recent_outages': recent_outages,
        'unread_notifications': unread_notifications,
    }
    
    return render(request, 'outages/dashboard.html', context)


@login_required
def outages_list_view(request):
    """List all outages with filters"""
    filter_type = request.GET.get('filter', 'all')
    search_query = request.GET.get('search', '')
    
    outages = PowerOutage.objects.select_related('area', 'reported_by')
    
    # Apply filters
    if filter_type == 'my':
        outages = outages.filter(reported_by=request.user)
    elif filter_type == 'active':
        outages = outages.filter(status__in=['REPORTED', 'INVESTIGATING', 'IN_PROGRESS'])
    elif filter_type == 'resolved':
        outages = outages.filter(status='RESOLVED')
    
    # Apply search
    if search_query:
        outages = outages.filter(
            Q(title__icontains=search_query) |
            Q(location__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    outages = outages.order_by('-created_at')
    
    context = {
        'outages': outages,
        'filter_type': filter_type,
        'search_query': search_query,
    }
    
    return render(request, 'outages/outages_list.html', context)


@login_required
def outage_detail_view(request, pk):
    """View outage details"""
    outage = get_object_or_404(PowerOutage, pk=pk)
    
    context = {
        'outage': outage,
        'is_admin': hasattr(request.user, 'profile') and request.user.profile.is_admin,
    }
    
    return render(request, 'outages/outage_detail.html', context)


@login_required
def report_outage_view(request):
    """Report a new outage"""
    if request.method == 'POST':
        form = OutageReportForm(request.POST)
        if form.is_valid():
            outage = form.save(commit=False)
            outage.reported_by = request.user
            outage.save()
            
            # Create notification for admins
            admin_users = UserProfile.objects.filter(is_admin=True).values_list('user', flat=True)
            for admin_id in admin_users:
                Notification.objects.create(
                    user_id=admin_id,
                    title='New Outage Reported',
                    message=f'{request.user.username} reported: {outage.title}',
                    notification_type='OUTAGE_REPORTED',
                    outage=outage
                )
            
            messages.success(request, 'Outage reported successfully!')
            return redirect('outages_list')
    else:
        form = OutageReportForm()
    
    return render(request, 'outages/report_outage.html', {'form': form})


@login_required
def update_outage_view(request, pk):
    """Update outage status (admin only)"""
    if not (hasattr(request.user, 'profile') and request.user.profile.is_admin):
        messages.error(request, 'You do not have permission to update outages.')
        return redirect('outages_list')
    
    outage = get_object_or_404(PowerOutage, pk=pk)
    
    if request.method == 'POST':
        form = OutageUpdateForm(request.POST, instance=outage)
        if form.is_valid():
            updated_outage = form.save()
            
            # Create notification for reporter
            Notification.objects.create(
                user=outage.reported_by,
                title='Outage Updated',
                message=f'Your reported outage "{outage.title}" has been updated to {updated_outage.status}',
                notification_type='OUTAGE_UPDATED',
                outage=updated_outage
            )
            
            messages.success(request, 'Outage updated successfully!')
            return redirect('outage_detail', pk=pk)
    else:
        form = OutageUpdateForm(instance=outage)
    
    return render(request, 'outages/update_outage.html', {'form': form, 'outage': outage})


@login_required
def delete_outage_view(request, pk):
    """Delete an outage"""
    outage = get_object_or_404(PowerOutage, pk=pk)
    
    # Check permissions
    is_admin = hasattr(request.user, 'profile') and request.user.profile.is_admin
    if not (is_admin or outage.reported_by == request.user):
        messages.error(request, 'You do not have permission to delete this outage.')
        return redirect('outages_list')
    
    if request.method == 'POST':
        outage.delete()
        messages.success(request, 'Outage deleted successfully!')
        return redirect('outages_list')
    
    return render(request, 'outages/delete_outage.html', {'outage': outage})


@login_required
def areas_view(request):
    """View service areas"""
    search_query = request.GET.get('search', '')
    
    areas = ServiceArea.objects.annotate(
        active_outages=Count('outages', filter=Q(outages__status__in=['REPORTED', 'INVESTIGATING', 'IN_PROGRESS']))
    )
    
    if search_query:
        areas = areas.filter(
            Q(name__icontains=search_query) |
            Q(coverage_cities__icontains=search_query)
        )
    
    context = {
        'areas': areas,
        'search_query': search_query,
    }
    
    return render(request, 'outages/areas.html', context)


@login_required
def notifications_view(request):
    """View user notifications"""
    notifications = Notification.objects.filter(user=request.user).select_related('outage')
    
    context = {
        'notifications': notifications,
    }
    
    return render(request, 'outages/notifications.html', context)


@login_required
def mark_notification_read(request, pk):
    """Mark notification as read"""
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.is_read = True
    notification.save()
    return redirect('notifications')


@login_required
def delete_notification(request, pk):
    """Delete a notification"""
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.delete()
    messages.success(request, 'Notification deleted!')
    return redirect('notifications')


@login_required
def analytics_view(request):
    """View analytics and statistics"""
    # Overall statistics
    total_outages = PowerOutage.objects.count()
    active_outages = PowerOutage.objects.filter(status__in=['REPORTED', 'INVESTIGATING', 'IN_PROGRESS']).count()
    resolved_outages = PowerOutage.objects.filter(status='RESOLVED').count()
    
    # Outages by status
    status_stats = PowerOutage.objects.values('status').annotate(count=Count('id'))
    
    # Outages by severity
    severity_stats = PowerOutage.objects.values('severity').annotate(count=Count('id'))
    
    # Outages by area
    area_stats = PowerOutage.objects.values('area__name').annotate(count=Count('id')).order_by('-count')[:5]
    
    # Recent trends (last 7 days)
    seven_days_ago = timezone.now() - timedelta(days=7)
    recent_outages = PowerOutage.objects.filter(created_at__gte=seven_days_ago).count()
    
    # Average resolution time
    resolved = PowerOutage.objects.filter(status='RESOLVED', resolved_at__isnull=False)
    avg_resolution_hours = 0
    if resolved.exists():
        total_hours = sum([(o.resolved_at - o.created_at).total_seconds() / 3600 for o in resolved])
        avg_resolution_hours = round(total_hours / resolved.count(), 1)
    
    context = {
        'total_outages': total_outages,
        'active_outages': active_outages,
        'resolved_outages': resolved_outages,
        'status_stats': status_stats,
        'severity_stats': severity_stats,
        'area_stats': area_stats,
        'recent_outages': recent_outages,
        'avg_resolution_hours': avg_resolution_hours,
    }
    
    return render(request, 'outages/analytics.html', context)


@login_required
def maintenance_view(request):
    """View maintenance schedule"""
    filter_type = request.GET.get('filter', 'upcoming')
    
    schedules = MaintenanceSchedule.objects.select_related('area', 'created_by')
    
    if filter_type == 'upcoming':
        schedules = schedules.filter(scheduled_start__gte=timezone.now(), status='SCHEDULED')
    elif filter_type == 'ongoing':
        schedules = schedules.filter(status='IN_PROGRESS')
    elif filter_type == 'completed':
        schedules = schedules.filter(status='COMPLETED')
    
    schedules = schedules.order_by('scheduled_start')
    
    context = {
        'schedules': schedules,
        'filter_type': filter_type,
        'is_admin': hasattr(request.user, 'profile') and request.user.profile.is_admin,
    }
    
    return render(request, 'outages/maintenance.html', context)


@login_required
def create_maintenance_view(request):
    """Create maintenance schedule (admin only)"""
    if not (hasattr(request.user, 'profile') and request.user.profile.is_admin):
        messages.error(request, 'You do not have permission to create maintenance schedules.')
        return redirect('maintenance')
    
    if request.method == 'POST':
        form = MaintenanceForm(request.POST)
        if form.is_valid():
            maintenance = form.save(commit=False)
            maintenance.created_by = request.user
            maintenance.save()
            messages.success(request, 'Maintenance schedule created successfully!')
            return redirect('maintenance')
    else:
        form = MaintenanceForm()
    
    return render(request, 'outages/create_maintenance.html', {'form': form})


@login_required
def emergency_contacts_view(request):
    """View emergency contacts"""
    contacts = EmergencyContact.objects.filter(is_active=True)
    
    context = {
        'contacts': contacts,
    }
    
    return render(request, 'outages/emergency_contacts.html', context)


@login_required
def outage_map_view(request):
    """View outage map"""
    areas = ServiceArea.objects.annotate(
        active_outages=Count('outages', filter=Q(outages__status__in=['REPORTED', 'INVESTIGATING', 'IN_PROGRESS'])),
        total_outages=Count('outages')
    )
    
    context = {
        'areas': areas,
    }
    
    return render(request, 'outages/outage_map.html', context)
