from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
# from onlinehousingapp.serializers import PropertySerializer
from onlinehousingapp.serializers import LocationSerializer
# from onlinehousingapp.models import Property
from onlinehousingapp.models import Location
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from onlinehousingapp.serializers import TenantSerializer, TenantLoginSerializer
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.shortcuts import render
from django.http import JsonResponse
from onlinehousingapp.models import Tenant
from django.contrib.auth.hashers import make_password
import json
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Admin, Owner, Property, Booking, TourRequest, Occupancy
from .serializers import OwnerSerializer, TenantSerializer, UserSerializer, AdminSerializer, PropertySerializer, BookingSerializer, TourRequestSerializer, PropertyDetailSerializer
from .serializers import OwnerCSerializer, TenantCSerializer, UserSerializer, AdminSerializer, BookingCSerializer, TourRequestCSerializer
from .serializers import TenantASerializer, UserASerializer, OwnerASerializer, PropertyASerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.db import connection
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, ListAPIView, RetrieveDestroyAPIView
from django.db.models.functions import TruncMonth  # Add this import
import random
import string
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta




# def locationApi(request, id=0):
#     locations = Location.objects.all()
#     location_serializer = LocationSerializer(locations, many=True)
#     return JsonResponse(location_serializer.data, safe=False)

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from .models import Location
from .serializers import LocationSerializer
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def locationApi(request):
    locations = Location.objects.all()
    serializer = LocationSerializer(locations, many=True)
    return JsonResponse(serializer.data, safe=False)
        
class AddPropertyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            owner = Owner.objects.get(user=user)
        except Owner.DoesNotExist:
            return Response({"error": "Owner profile not found."}, status=404)

        data = request.data.copy()
        data['owner'] = owner.id  # inject owner ID

        serializer = PropertySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class OwnerProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OwnerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Owner.objects.get(user=self.request.user)

    def perform_destroy(self, instance):
        # Delete the associated user
        user = instance.user
        user.delete()
        super().perform_destroy(instance)

    def delete(self, request, *args, **kwargs):
        owner = self.get_object()
        self.perform_destroy(owner)
        return Response(status=status.HTTP_204_NO_CONTENT)

class TenantProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Tenant.objects.get(user=self.request.user)

    def perform_destroy(self, instance):
        user = instance.user
        user.delete()
        super().perform_destroy(instance)

    def delete(self, request, *args, **kwargs):
        tenant = self.get_object()
        self.perform_destroy(tenant)
        return Response(status=status.HTTP_204_NO_CONTENT)

class TenantDetailView(generics.RetrieveAPIView):
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get tenant object based on the tenant_id in the URL
        tenant_id = self.kwargs["tenant_id"]
        try:
            return Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            raise NotFound(detail="Tenant not found", code=404)


#displaying owner detail in tenant side
class OwnerDetailView(generics.RetrieveAPIView):
    serializer_class = OwnerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get owner object based on the owner_id in the URL
        owner_id = self.kwargs["owner_id"]
        try:
            return Owner.objects.get(id=owner_id)
        except Owner.DoesNotExist:
            raise NotFound(detail="Owner not found", code=404)


class PropertyListView(APIView):
    def get(self, request):
        location_id = request.GET.get('location')
        print(f"Filtering properties with location_id: {location_id}")  # Check location_id value
        status_filter = request.GET.get('status')  # get the gym parameter (e.g., gym=true)

        
        properties = Property.objects.filter(status=True)  # Only include available properties

        if location_id:
            properties = Property.objects.filter(location_id=location_id)
        # else:
        #     properties = Property.objects.all()

        if status_filter is not None:
            # Convert query param to boolean
            status_value = status_filter.lower() == 'true'
            properties = properties.filter(status=status_value)

        

        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class MyPropertiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(owner__user=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class PropertyDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner__user=self.request.user)

    def perform_update(self, serializer):
        try:
            owner = Owner.objects.get(user=self.request.user)
            serializer.save(owner=owner)
        except Owner.DoesNotExist:
            raise ValidationError("Owner profile not found for the current user.")

    def update(self, request, *args, **kwargs):
       
        # Handle file uploads separately from other data
        if request.FILES:
            request.data.update(request.FILES)
        return super().update(request, *args, **kwargs)

# views.py
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

class AdminPropertyDeleteView(generics.DestroyAPIView):
    """
    Admin-only endpoint to delete ANY property
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]  
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        try:
            property = self.get_object()
            property.delete()
            return Response(
                {"message": "Property forcibly deleted by admin"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    

from rest_framework import viewsets


#search filter and feature fitler
class FilteredPropertiesView(APIView):
    def get(self, request):
        location = request.GET.get('location')
        property_type = request.GET.get('property_type')
        price_type = request.GET.get('price_type')
        title = request.GET.get('title') 

        # properties = Property.objects.all()
        properties = Property.objects.filter(status=True)  # Only include available properties


        if location:
            properties = properties.filter(location__name__icontains=location)

        if property_type:
            properties = properties.filter(property_type__iexact=property_type)

        if price_type:
            properties = properties.filter(price_type__iexact=price_type)

        if title:
            properties = properties.filter(title__icontains=title)

        boolean_fields = [
            'balcony_terrace',
            'parking_space',
            'co_living',
            'swimming_pool',
            'lift_elevator',
            'pet_friendly',
            # 'gym',
            ]

        for field in boolean_fields:
            val = request.GET.get(field)
            # Only filter for True fields, don't filter if user left it unchecked
            if val and val.lower() == 'true':
                properties = properties.filter(**{field: True})

        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# views.py
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class SearchPropertyView(generics.ListAPIView): 
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = [
        'location__name', 'property_type', 'price_type',
        'balcony_terrace', 'parking_space', 'co_living', 'swimming_pool',
        'lift_elevator', 'pet_friendly', 'gym',
    ]
    search_fields = ['title']

#displaying details of the clicked property
from rest_framework.generics import RetrieveAPIView


from rest_framework import generics
from .models import User, Tenant, Owner, Admin
from .serializers import UserSerializer, TenantSerializer, OwnerSerializer, AdminSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegisterTenantView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')  # Extract the password from the request data
        tenant_data = {
            'name': data.get('name'),
            'phone_number': data.get('phone_number'),
            'criminal_history': data.get('criminal_history', 'false').lower() == 'true',  # Convert to boolean
            'employment_status': data.get('employment_status', 'false').lower() == 'true',  # Convert to boolean
            'user_image': data.get('user_image'),
        }

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create the user with inactive status
            user = User.objects.create_user(
                email=email,
                password=password,
                role='tenant',
                is_active=False,  # Inactive until email is verified
                is_verified=False
            )

            # Create the tenant profile linked to the user
            Tenant.objects.create(
                user=user,
                name=tenant_data.get('name'),
                phone_number=tenant_data.get('phone_number'),
                criminal_history=tenant_data.get('criminal_history', False),
                employment_status=tenant_data.get('employment_status', False),
                user_image=tenant_data.get('user_image')
            )

            # Send OTP for email verification
            user.send_verification_email()

            return Response({'message': 'Tenant registered successfully. Please verify your email.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class RegisterOwnerView(generics.CreateAPIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')  # Extract the password from the request data
        owner_data = {
            'name': data.get('name'),
            'phone_number': data.get('phone_number'),
            'criminal_history': data.get('criminal_history', 'false').lower() == 'true',  # Convert to boolean
            'employment_status': data.get('employment_status', 'false').lower() == 'true',  # Convert to boolean
            'user_image': data.get('user_image'),
        }

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create the user with inactive status
            user = User.objects.create_user(
                email=email,
                password=password,
                role='owner',
                is_active=False,  # Inactive until email is verified
                is_verified=False
            )

            # Create the tenant profile linked to the user
            Owner.objects.create(
                user=user,
                name=owner_data.get('name'),
                phone_number=owner_data.get('phone_number'),
                criminal_history=owner_data.get('criminal_history', False),
                employment_status=owner_data.get('employment_status', False),
                user_image=owner_data.get('user_image')
            )

            # Send OTP for email verification
            user.send_verification_email()

            return Response({'message': 'Owner registered successfully. Please verify your email.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterAdminView(generics.CreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response({'error': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.send_verification_email()
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            # Fetch the user by email
            user = User.objects.get(email=email)

            # Check if OTP is valid
            if user.otp != otp:
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if OTP is expired (5 minutes validity)
            if user.otp_created_at < timezone.now() - timedelta(minutes=5):
                return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

            # Mark email as verified and activate the account
            user.is_verified = True
            user.is_active = True  # Activate the user
            user.otp = None  # Clear OTP
            user.save()

            return Response({'message': 'Email verified successfully!'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class LocationCreateView(generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    parser_classes = [MultiPartParser, FormParser]

#getting lcoation name from location id
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location

# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import LoginSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Check if the user is verified
        if not user.is_verified:
            # Generate and send OTP
            user.send_verification_email()
            return Response(
                {
                    'message': 'Your email is not verified. An OTP has been sent to your email.',
                    'email': user.email,
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # If verified, proceed with login
        tokens = serializer.create(serializer.validated_data)
        return Response(tokens, status=status.HTTP_200_OK)

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCSerializer
    permission_classes = [IsAuthenticated]

#displaying bookgings and changing property status when accepted
class BookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            owner = Owner.objects.get(user=request.user)
        except Owner.DoesNotExist:
            return Response({"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)

        bookings = Booking.objects.filter(property__owner=owner).select_related('tenant__user', 'property')
        serializer = BookingSerializer(bookings, many=True, context={'request': request})
        return Response(serializer.data)


    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status not in ["accepted", "rejected", "pending"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        property = booking.property

        if new_status == "accepted":
            Occupancy.objects.create(
                property=property,
                tenant=booking.tenant,
                booking=booking,
            )

            if not property.co_living:
                property.status = False
                property.save()
            else:
                current_occupants = Occupancy.objects.filter(
                    property=property,
                ).count()

                if current_occupants >= property.max_occupants:
                    property.status = False
                    property.save()

            # Send email to the tenant
            tenant_email = booking.tenant.user.email
            subject = "Booking Accepted"
            message = f"Dear {booking.tenant.name},\n\nYour booking request for the property '{property.title}' has been accepted.\n\nThank you for choosing our service!"
            send_mail(
                subject,
                message,
                'noreply@yourdomain.com',  # Replace with your sender email
                [tenant_email],
                fail_silently=False,
            )
        
        elif new_status == "rejected":
            # Send email for rejected booking
            tenant_email = booking.tenant.user.email
            subject = "Booking Rejected"
            message = f"Dear {booking.tenant.name},\n\nWe regret to inform you that your booking request for the property '{property.title}' has been rejected.\n\nThank you for understanding."
            send_mail(
                subject,
                message,
                'noreply@yourdomain.com',  # Replace with your sender email
                [tenant_email],
                fail_silently=False,
            )


        booking.status = new_status
        booking.save()

        return Response({"message": f"Booking status updated to {new_status}"}, status=status.HTTP_200_OK)

#tenant side
class BookingUpdateDeleteView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    lookup_field = 'id'

    def check_ownership(self, request):
        """Helper method to verify the requesting user owns the booking"""
        booking = self.get_object()
        if not hasattr(booking.tenant, 'user'):
            return False
        return request.user.id == booking.tenant.user.id

    def patch(self, request, *args, **kwargs):
        if not self.check_ownership(request):
            return Response(
                {"error": "You can only update your own bookings"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        valid_statuses = ['pending', 'accepted', 'rejected']
        
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking = self.get_object()
        booking.status = new_status
        booking.save()
        return Response(self.get_serializer(booking).data)

    def delete(self, request, *args, **kwargs):
        if not self.check_ownership(request):
            return Response(
                {"error": "You can only delete your own bookings"},
                status=status.HTTP_403_FORBIDDEN
            )

        return self.destroy(request, *args, **kwargs)


class TenantBookingList(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        return Booking.objects.filter(tenant=self.request.user.tenant).select_related('property__owner', 'tenant')

    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status not in ["accepted", "rejected", "pending"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        booking.save()

        # If the booking is accepted, set the property's status to False (Unavailable)
        if new_status == "accepted":
            property = booking.property
            property.status = False
            property.save()

        return Response({"message": f"Booking status updated to {new_status}"}, status=status.HTTP_200_OK)

class TourRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            owner = Owner.objects.get(user=request.user)
        except Owner.DoesNotExist:
            return Response({"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only fetch tour requests for properties owned by the logged-in owner
        tour_requests = TourRequest.objects.filter(property__owner=owner).select_related('tenant__user', 'property')
        serializer = TourRequestSerializer(tour_requests, many=True, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request, tourrequest_id):
        try:
            tour = TourRequest.objects.get(id=tourrequest_id)
        except TourRequest.DoesNotExist:
            return Response({"error": "Tour not found"}, status=404)

        new_status = request.data.get("status")
        if new_status not in ["accepted", "declined", "pending"]:
            return Response({"error": "Invalid status"}, status=400)

        tour.status = new_status
        tour.save()
        return Response({"message": f"Tour status updated to {new_status}"}, status=200)


class TourRequestCreateView(generics.CreateAPIView):
    queryset = TourRequest.objects.all()
    serializer_class = TourRequestCSerializer
    permission_classes = [IsAuthenticated]

#for displaying owner image in the property details page
class PropertyDetailView(APIView):
    def get(self, request, pk):
        try:
            prop = get_object_or_404(Property.objects.select_related('location'), pk=pk)            
            serializer = PropertyDetailSerializer(prop)
            return Response(serializer.data)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_owner(request, id):
    try:
        owner = Owner.objects.get(id=id)
        serializer = OwnerSerializer(owner)
        return Response(serializer.data)
    except Owner.DoesNotExist:
        return Response({"error": "Owner not found"}, status=404)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking, TourRequest, Property

class CheckBookingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, property_id):
        try:
            tenant = request.user.tenant  # Get the tenant object for the logged-in user
            booking = Booking.objects.filter(property_id=property_id, tenant=tenant).first()

            if not booking:
                return Response({"status": "not_booked", "message": "You haven't booked this property yet."})
            if booking.status == "pending":
                return Response({"status": "pending", "message": "Your booking is pending."})
            elif booking.status == "accepted":
                return Response({"status": "approved", "message": "You have already booked this property."})
            elif booking.status == "rejected":
                return Response({"status": "rejected", "message": "Your previous booking was rejected. You can try again."})
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)


class CheckTourRequestStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, property_id):
        try:
            tenant = request.user.tenant  # Get the tenant object for the logged-in user
            tour = TourRequest.objects.filter(property_id=property_id, tenant=tenant).first()

            if not tour:
                return Response({"status": "not_requested", "message": "You haven't requested a tour yet."})
            if tour.status == "pending":
                return Response({"status": "pending", "message": "Your tour request is pending."})
            elif tour.status == "confirmed":
                return Response({"status": "confirmed", "message": "Your tour request was confirmed."})
            elif tour.status == "declined":
                return Response({"status": "declined", "message": "Your previous tour request was declined. You can try again."})
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)


class TourRequestViewSet(viewsets.ModelViewSet):
    serializer_class = TourRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TourRequest.objects.filter(tenant__user=self.request.user)
        
        # Filter by status if provided
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param.lower())
            
        return queryset.select_related(
            'property', 
            'property__owner',
            'tenant',
            'tenant__user'
        )

    def perform_create(self, serializer):
        # Automatically assign the tenant based on the requesting user
        tenant = self.request.user.tenant_profile
        serializer.save(tenant=tenant)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.tenant.user != request.user:
            return Response(
                {"error": "You can only delete your own tour requests"},
                status=status.HTTP_403_FORBIDDEN
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

#fisplaying and canceling tour rests in tenants

class TenantTourRequestList(generics.ListAPIView):
    serializer_class = TourRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        return TourRequest.objects.filter(tenant=self.request.user.tenant).select_related('property', 'tenant')

class TourRequestUpdateDeleteView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = TourRequest.objects.all()
    serializer_class = TourRequestSerializer
    lookup_field = 'id'

    def check_ownership(self, request):
        """Helper method to verify the requesting user owns the tour request"""
        tour_request = self.get_object()
        if not hasattr(tour_request.tenant, 'user'):
            return False
        return request.user.id == tour_request.tenant.user.id

    def patch(self, request, *args, **kwargs):
        if not self.check_ownership(request):
            return Response(
                {"error": "You can only update your own tour requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        valid_statuses = ['pending', 'accepted', 'declined']
        
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        tour_request = self.get_object()
        tour_request.status = new_status
        tour_request.save()
        return Response(self.get_serializer(tour_request).data)

    def delete(self, request, *args, **kwargs):
        if not self.check_ownership(request):
            return Response(
                {"error": "You can only delete your own tour requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        return self.destroy(request, *args, **kwargs)

class PropertyTenantsAPIView(APIView):
    """
    Get all tenants for a specific property
    Example: /api/property-tenants/<property_id>/
    """
    def get(self, request, property_id):
        try:
            # Get all occupancy records for this property
            occupancies = Occupancy.objects.filter(
                property_id=property_id
            ).select_related('tenant')
            
            # Extract tenant details
            tenants_data = []
            for occ in occupancies:
                tenant = occ.tenant
                tenants_data.append({
                    'id': tenant.id,
                    'name': tenant.name,
                    'phone_number': tenant.phone_number,
                    'employment_status': tenant.employment_status,
                    'criminal_history': tenant.criminal_history,
                    'user_image': tenant.user_image.url if tenant.user_image else None,
                    'check_in': occ.check_in
                })
            
            return Response(tenants_data)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TenantListAPIView(APIView):
    """
    Get multiple tenants by IDs
    Example: /api/tenants/?ids=1,2,3
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ids_param = request.query_params.get('ids', '')
        if not ids_param:
            return Response(
                {"error": "Tenant IDs are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            tenant_ids = [int(id) for id in ids_param.split(',')]
        except ValueError:
            return Response(
                {"error": "Invalid tenant IDs format"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tenants = Tenant.objects.filter(id__in=tenant_ids)
        
        data = [{
            'id': tenant.id,
            'name': tenant.name,
            'phone_number': tenant.phone_number,
            'employment_status': tenant.employment_status,
            'criminal_history': tenant.criminal_history,
            'user_image': tenant.user_image.url if tenant.user_image else None
        } for tenant in tenants]
        
        return Response(data)


# Returns properties that have at least one occupancy record

from django.db.models import Count  # Add this import
from django.shortcuts import get_object_or_404

class OwnerRentedPropertiesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner = request.user.owner
        properties = Property.objects.filter(
            owner=owner,
            occupancy__isnull=False
        ).distinct().annotate(
            current_occupants=Count('occupancy')
        )
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class PropertyOccupantsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, property_id):
        occupancies = Occupancy.objects.filter(
            property_id=property_id
        ).select_related('tenant')
        data = [{
            'id': occ.id,
            'tenant': {
                'id': occ.tenant.id,
                'name': occ.tenant.name,
                'phone_number': occ.tenant.phone_number,
                'user_image': occ.tenant.user_image.url if occ.tenant.user_image else None
            },
            'check_in': occ.check_in
        } for occ in occupancies]
        return Response(data)

class OccupancyDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, occupancy_id):
        occupancy = get_object_or_404(Occupancy, id=occupancy_id)
        if occupancy.property.owner.user != request.user:
            return Response(
                {"error": "You don't have permission to remove this tenant"},
                status=status.HTTP_403_FORBIDDEN
            )
        occupancy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class PropertySafetyView(APIView):
#     def get(self, request, pk):
#         # Fetch property with location in a single query
#         property = get_object_or_404(
#             Property.objects.select_related('location'),
#             pk=pk
#         )
#         serializer = PropertySafetySerializer(property, context={'request': request})
#         return Response(serializer.data)

class LocationDetailView(RetrieveAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

# For individual location operations (GET, PUT, PATCH, DELETE)
class LocationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    parser_classes = [MultiPartParser, FormParser]

# For listing and creating locations (GET list, POST)
class LocationListView(ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    parser_classes = [MultiPartParser, FormParser]

class AllTenantsView(generics.ListAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantASerializer

class TenantAdminView(generics.DestroyAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantASerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        self.perform_destroy(instance)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AllOwnersView(generics.ListAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerASerializer

class OwnerAdminView(generics.DestroyAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerASerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        self.perform_destroy(instance)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PropertyAdminView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyASerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can delete

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({"message": "Property deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Property.DoesNotExist:
            return Response({"error": "No Property matches the given query."}, status=status.HTTP_404_NOT_FOUND)


from django.db.models import Count
from django.db.models.functions import TruncMonth  # Add this import
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Location, Owner, Tenant, Property
from datetime import datetime  # Needed for date formatting

class DashboardView(APIView):
    def get(self, request, format=None):
        # Get counts for each category
        counts = {
            'owners': Owner.objects.count(),
            'tenants': Tenant.objects.count(),
            'properties': Property.objects.count(),
            'locations': Location.objects.count()
        }


        user_type_data = list(
            User.objects.values('role')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        
        # Property location distribution
        property_location_data = list(
            Property.objects.values('location__name')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        
        # Utility cost data
        utility_cost_data = list(
            Location.objects.all().values(
                'name',
                'transportcost',
                'utilitycost',
                'foodcost',
                'entertainmentcost',
                'healthcarecost',
                'clothingcost',
                'pethealthcost'
            )
        )
        
        # Monthly registrations with proper TruncMonth usage
        # Get filter parameters
        selected_month = request.query_params.get('month', None)
        selected_year = request.query_params.get('year', None)
        
        # Base querysets
        owner_qs = Owner.objects.all()
        tenant_qs = Tenant.objects.all()
        
        # Apply filters if provided
        if selected_year:
            owner_qs = owner_qs.filter(owner_created__year=selected_year)
            tenant_qs = tenant_qs.filter(tenant_created__year=selected_year)
        
        if selected_month:
            owner_qs = owner_qs.filter(owner_created__month=selected_month)
            tenant_qs = tenant_qs.filter(tenant_created__month=selected_month)
        
        # Get monthly registrations
        owner_registrations = list(
            owner_qs.annotate(month=TruncMonth('owner_created'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        
        tenant_registrations = list(
            tenant_qs.annotate(month=TruncMonth('tenant_created'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        
        # Prepare the response data
        data = {
            'counts': counts,  # Add this line
            'user_type_data': {
                'labels': [item['role'].capitalize() for item in user_type_data],
                'data': [item['count'] for item in user_type_data]
            },
            'user_type_data': {
                'labels': [item['role'].capitalize() for item in user_type_data],
                'data': [item['count'] for item in user_type_data]
            },
            'property_location_data': {
                'labels': [item['location__name'] for item in property_location_data],
                'data': [item['count'] for item in property_location_data]
            },
            'utility_cost_data': {
                'labels': [item['name'] for item in utility_cost_data],
                'transport': [item['transportcost'] for item in utility_cost_data],
                'utility': [item['utilitycost'] for item in utility_cost_data],
                'food': [item['foodcost'] for item in utility_cost_data],
                'entertainment': [item['entertainmentcost'] for item in utility_cost_data],
                'healthcare': [item['healthcarecost'] for item in utility_cost_data],
                'clothing': [item['clothingcost'] for item in utility_cost_data],
                'pethealth': [item['pethealthcost'] for item in utility_cost_data]
            },
            'monthly_registrations': {
                'labels': [item['month'].strftime('%b %Y') for item in owner_registrations],
                'owners': [item['count'] for item in owner_registrations],
                'tenants': [item['count'] for item in tenant_registrations]
            }
        }
        
        return Response(data)