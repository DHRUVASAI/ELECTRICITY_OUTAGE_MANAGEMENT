from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import PowerOutage, UserProfile, MaintenanceSchedule


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=False)
    address = forms.CharField(widget=forms.Textarea, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'phone', 'address']


class OutageReportForm(forms.ModelForm):
    class Meta:
        model = PowerOutage
        fields = ['title', 'description', 'location', 'area', 'severity', 'affected_users']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }


class OutageUpdateForm(forms.ModelForm):
    class Meta:
        model = PowerOutage
        fields = ['status', 'severity', 'estimated_resolution', 'affected_users']
        widgets = {
            'estimated_resolution': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }


class MaintenanceForm(forms.ModelForm):
    class Meta:
        model = MaintenanceSchedule
        fields = ['title', 'description', 'area', 'scheduled_start', 'scheduled_end', 'affected_users']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'scheduled_start': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'scheduled_end': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }


class UserProfileForm(forms.ModelForm):
    username = forms.CharField(max_length=150)
    email = forms.EmailField()
    
    class Meta:
        model = UserProfile
        fields = ['phone', 'address']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.user:
            self.fields['username'].initial = self.instance.user.username
            self.fields['email'].initial = self.instance.user.email
