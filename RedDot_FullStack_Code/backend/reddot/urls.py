from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'REDDOT Backend'})

def custom_error_500(request):
    import sys, traceback
    exc_type, exc_value, exc_traceback = sys.exc_info()
    error_details = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback)) if exc_value else "Unknown server error"
    print("\n" + "=" * 60)
    print(" [DJANGO 500 ERROR DETECTED]")
    print(error_details)
    print("=" * 60 + "\n")
    return JsonResponse({
        "error": "Internal Server Error",
        "details": str(exc_value) if exc_value else "Unknown",
        "traceback": error_details
    }, status=500)

handler500 = 'reddot.urls.custom_error_500'

urlpatterns = [
    path('', health_check, name='root_health'),
    path('health/', health_check, name='health'),
    path('api/health/', health_check, name='api_health'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('api.urls')),
]
