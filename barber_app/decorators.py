from functools import wraps
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponseForbidden


def login_required_custom(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, 'Please log in to access this page.')
            return redirect('user_login')
        return view_func(request, *args, **kwargs)
    return wrapper


def user_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, 'Please log in to access this page.')
            return redirect('user_login')
        
        if not request.user.is_regular_user():
            messages.error(request, 'You do not have permission to access this page.')
            return redirect('user_login')
        
        return view_func(request, *args, **kwargs)
    return wrapper


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, 'Please log in as an administrator.')
            return redirect('admin_login')
        
        if not request.user.is_admin():
            messages.error(request, 'You do not have permission to access this page.')
            return redirect('admin_login')
        
        return view_func(request, *args, **kwargs)
    return wrapper
