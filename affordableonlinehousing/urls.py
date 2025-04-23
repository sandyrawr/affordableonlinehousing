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
    # path('location/', views.locationApi),  # Add this new endpoint
    # path('location/<int:id>/', views.locationApi),  # Add this new endpoint
    # path('api/properties/', views.property_list, name='property-list'),
    # path('api/tenants/register/', views.register_tenant, name='register_tenant'),
    # path('api/tenant/login/', views.tenant_login, name='tenant-login'),
    path('add-location/', views.LocationCreateView.as_view(), name='add-location'),
    path('locations/', views.locationApi, name='location-list'),  
    path('locations/<int:pk>/', views.location_detail),
    # path('api/register/user/', views.UserRegistrationView.as_view(), name='user_register'),
    # path('api/register/owner/', views.OwnerRegistrationView.as_view(), name='owner_register'),
    # path('api/register/tenant/', views.TenantRegistrationView.as_view(), name='tenant_register'),
    # path('api/register/admin/', views.AdminRegistrationView.as_view(), name='admin_register'),
    # path('api/login/', views.LoginView.as_view(), name='login'),
    # path('properties/', views.PropertyCreateView.as_view(), name='create-property'),
    # path('ownerdetail/<int:user_id>/', views.OwnerDetailView.as_view(), name='owner-detail'),
    # path('add-property/', views.PropertyCreateView.as_view(), name='add-property'),
    # path('properties/', views.PropertyListView.as_view(), name='property-list'),
    path('my-properties/', views.MyPropertiesView.as_view(), name='my-properties'),
    path('api/register/user/', views.RegisterUserView.as_view(), name='register-user'),
    path('api/register/tenant/', views.RegisterTenantView.as_view(), name='register-tenant'),
    path('api/register/owner/', views.RegisterOwnerView.as_view(), name='register-owner'),
    path('api/register/admin/', views.RegisterAdminView.as_view(), name='register-admin'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('add-property/', views.AddPropertyView.as_view(), name='add-property'),
    # path('my-properties/', views.MyPropertiesView.as_view(), name='my-properties'),
    path('properties/', views.FilteredPropertiesView.as_view(), name='properties-list'), 
    path('owner-profile/', views.OwnerProfileView.as_view(), name='owner-profile'), 
    # path('properties/<int:pk>/', PropertyUpdateView.as_view(), name='property-update'),
    path('searchproperties/', views.SearchPropertyView.as_view(), name='search-property'),  
    path('tenant-profile/', views.TenantProfileView.as_view(), name='tenant-profile'), 
    path('my-properties/', views.MyPropertiesView.as_view(), name='my-properties'), 
    path('property/<int:pk>/', views.PropertyDetailUpdateDeleteView.as_view(), name='property-detail'),
    path("propertydetail/<int:pk>/", views.PropertyDetailView.as_view(), name="property-detail"), 
    path('relatedproperties/', views.PropertyListView.as_view(), name='property-list'), 
    path('bookings/', views.BookingCreateView.as_view(), name='create-booking'),
    path('tour-requests/', views.TourRequestCreateView.as_view(), name='create-tour-request'),
    path('owner-bookings/', views.BookingListView.as_view(), name='all-bookings'),
    path('updatebookings/<int:booking_id>/', views.BookingListView.as_view()),  # for PATCH 
    path('tenantdet/<int:tenant_id>/', views.TenantDetailView.as_view(), name='tenant-detail'), 
    path('all-tours/', views.TourRequestListView.as_view(), name='tour-requests'),
    path('updatetours/<int:tourrequest_id>/', views.TourRequestListView.as_view()),  # for PATCH 
    path('owner-detail/<int:owner_id>/', views.OwnerDetailView.as_view(), name='owner-detail'),
    path('owner/<int:id>/', views.get_owner), 
    path('check-booking-status/<int:property_id>/', views.CheckBookingStatusView.as_view(), name='check_booking_status'),
    path('check-tour-request-status/<int:property_id>/', views.CheckTourRequestStatusView.as_view(), name='check_tour_request_status'),
    path('tenant-bookings/', views.TenantBookingList.as_view(), name='tenant-bookings'),
    path('bookings/<int:id>/', views.BookingUpdateDeleteView.as_view(), name='booking-update-delete'),
    path('tenant-tour-requests/', views.TenantTourRequestList.as_view(), name='tenant-tour-requests'),  
    path('tour-requests/<int:id>/', views.TourRequestUpdateDeleteView.as_view(), name='tour-request-update-delete'),
    path('api/property-tenants/<int:property_id>/', views.PropertyTenantsAPIView.as_view(), name='property-tenants'),
    # path('api/tenants/', views.TenantListAPIView.as_view(), name='tenants-by-ids'),
    ]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

