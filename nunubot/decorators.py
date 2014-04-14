from functools import wraps
from flask import request, redirect, current_app

def ssl_required(f):
    @wraps(f)
    def decorated_view(*args, **kwargs):
        if current_app.config.get("SSL"):
            if request.is_secure:
                return f(*args, **kwargs)
            else:
                return redirect(request.url.replace("http://", "https://"))

        return f(*args, **kwargs)

    return decorated_view