# """
# URL configuration for affordableonlinehousing project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.1/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]


# urlpatterns = [
#     url(r'^student$',views.studentApi),
#     url(r'^student$',views.studentApi),
#     url(r'^student/([0-9]+)$',views.studentApi),
#     path('admin/', admin.site.urls),
# ]

from django.contrib import admin
from django.urls import path, re_path
from onlinehousingapp import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # path('property/', views.propertyApi),  # Add trailing slash
    # path('property/<int:id>/', views.propertyApi),  # Add trailing slash
    # path('admin/', admin.site.urls),
    path('location/', views.locationApi),  # Add this new endpoint
    path('location/<int:id>/', views.locationApi),  # Add this new endpoint
    # path('api/properties/', views.property_list, name='property-list'),
    # path('api/tenants/register/', views.register_tenant, name='register_tenant'),
    # path('api/tenant/login/', views.tenant_login, name='tenant-login'),
    path('add-location/', views.LocationCreateView.as_view(), name='add-location'),
    path('api/register/user/', views.UserRegistrationView.as_view(), name='user_register'),
    path('api/register/owner/', views.OwnerRegistrationView.as_view(), name='owner_register'),
    path('api/register/tenant/', views.TenantRegistrationView.as_view(), name='tenant_register'),
    path('api/login/', views.LoginView.as_view(), name='login'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

