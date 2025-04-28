
from django.contrib import admin
from django.urls import path, re_path
from onlinehousingapp import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('add-location/', views.LocationCreateView.as_view(), name='add-location'),
    # path('locations/', views.locationApi, name='location-list'),  
    # path('locations/<int:pk>/', views.location_detail),
    path('locations/', views.LocationListView.as_view(), name='location-list'),
    path('locations/<int:pk>/', views.LocationDetailView.as_view(), name='location-detail'),
    path('my-properties/', views.MyPropertiesView.as_view(), name='my-properties'),
    path('api/register/user/', views.RegisterUserView.as_view(), name='register-user'),
    path('api/register/tenant/', views.RegisterTenantView.as_view(), name='register-tenant'),
    path('send-otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
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
    path('owner-rented-properties/', views.OwnerRentedPropertiesAPIView.as_view(), name='owner-rented-properties'),
    path('property-occupants/<int:property_id>/', views.PropertyOccupantsAPIView.as_view(), name='property-occupants'),
    path('occupancy/<int:occupancy_id>/', views.OccupancyDeleteAPIView.as_view(), name='delete-occupancy'),
    path('api/locationdetail/<int:pk>/', views.LocationDetailView.as_view(), name='location-detail'),
    path('tenants/', views.AllTenantsView.as_view(), name='tenant-list'),
    path('tenants/<int:pk>/delete/', views.TenantAdminView.as_view(), name='tenant-delete'),
    path('owners/', views.AllOwnersView.as_view(), name='owner-list'),
    path('owners/<int:pk>/delete/', views.OwnerAdminView.as_view(), name='owner-delete'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard-data'),
    ]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

