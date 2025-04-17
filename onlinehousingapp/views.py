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
from .models import User, Admin, Owner, Property, Booking, TourRequest
from .serializers import OwnerSerializer, TenantSerializer, UserSerializer, AdminSerializer, PropertySerializer, BookingSerializer, TourRequestSerializer, PropertyDetailSerializer
from .serializers import OwnerCSerializer, TenantCSerializer, UserSerializer, AdminSerializer, BookingCSerializer, TourRequestCSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.db import connection


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

# class UserRegistrationView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({'user_id': user.id}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class OwnerRegistrationView(APIView):
#     def post(self, request):
#         serializer = OwnerSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'Owner registered successfully'}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status
# from .serializers import TenantSerializer

# class TenantRegistrationView(APIView):
#     def post(self, request):
#         serializer = TenantSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'Tenant registered successfully'}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AdminRegistrationView(APIView):
#     def post(self, request):
#         serializer = AdminSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'Admin registered successfully'}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     def post(self, request):
#         # permission_classes = [AllowAny]
#         permission_classes = [IsAuthenticated]
#         email = request.data.get('email')
#         password = request.data.get('password')

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#         if not check_password(password, user.password):
#             return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

#         refresh = RefreshToken.for_user(user)
#         response_data = {
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user_id': user.id,
#             'role': user.role,
#             'email': user.email
#         }

#         if user.role == 'owner':
#             try:
#                 owner = Owner.objects.get(user=user)
#                 response_data['owner_id'] = owner.id
#             except Owner.DoesNotExist:
#                 response_data['owner_id'] = None

#         elif user.role == 'tenant':
#             try:
#                 tenant = Tenant.objects.get(user=user)
#                 response_data['tenant_id'] = tenant.id
#             except Tenant.DoesNotExist:
#                 response_data['tenant_id'] = None

#         elif user.role == 'admin':
#             try:
#                 admin = Admin.objects.get(user=user)
#                 response_data['admin_id'] = admin.id
#             except Admin.DoesNotExist:
#                 response_data['admin_id'] = None

#         return Response(response_data, status=status.HTTP_200_OK)

# class PropertyCreateView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request):
#         # print("Authenticated User:", request.user)  # This should print a user object
#         # print("User ID:", request.user.id)  # This should print the user ID
#         # try:
#         #     owner = Owner.objects.get(user=request.user)  # assuming Owner has FK to User
#         # except Owner.DoesNotExist:
#         #     return Response({"error": "You are not registered as an owner."}, status=403)
        
#         # # data = request.data.copy()
#         # data['owner'] = owner.id  # Inject the owner ID

#         # owner = Owner.objects.get(user=request.user)

#         data = request.data.copy()

        
#         serializer = PropertySerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)
        
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

# class OwnerDetailView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, user_id):
#         try:
#             owner = Owner.objects.get(user_id=user_id)
#             return Response({
#                 'id': owner.id,
#                 'user_id': owner.user_id,
#                 'additional_owner_details': owner.additional_field
#             })
#         except Owner.DoesNotExist:
#             return Response({'error': 'Owner not found'}, status=404)

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


class PropertyListView(APIView):
    def get(self, request):
        location_id = request.GET.get('location')
        print(f"Filtering properties with location_id: {location_id}")  # Check location_id value
        
        if location_id:
            properties = Property.objects.filter(location_id=location_id)
        else:
            properties = Property.objects.all()

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

from rest_framework import viewsets


#search filter and feature fitler
class FilteredPropertiesView(APIView):
    def get(self, request):
        location = request.GET.get('location')
        property_type = request.GET.get('property_type')
        price_type = request.GET.get('price_type')
        title = request.GET.get('title') 

        properties = Property.objects.all()

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
            'garden_yard',
            'swimming_pool',
            'lift_elevator',
            'pet_friendly',
            'gym',
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
        'balcony_terrace', 'parking_space', 'garden_yard', 'swimming_pool',
        'lift_elevator', 'pet_friendly', 'gym',
    ]
    search_fields = ['title']

#displaying details of the clicked property
from rest_framework.generics import RetrieveAPIView

class PropertyDetailView(RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

# class MyPropertiesView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         try:
#             owner = Owner.objects.get(user=request.user)
#         except Owner.DoesNotExist:
#             return Response({'error': 'Owner not found'}, status=status.HTTP_404_NOT_FOUND)

#         properties = Property.objects.filter(owner=owner)
#         serializer = PropertySerializer(properties, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework import generics
from .models import User, Tenant, Owner, Admin
from .serializers import UserSerializer, TenantSerializer, OwnerSerializer, AdminSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegisterTenantView(generics.CreateAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantCSerializer


class RegisterOwnerView(generics.CreateAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerCSerializer


class RegisterAdminView(generics.CreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

# class MyPropertiesListView(generics.ListAPIView):
#     serializer_class = PropertySerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Property.objects.filter(owner=self.request.user.owner)

# class PropertyUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = Property.objects.all()
#     serializer_class = PropertySerializer
#     permission_classes = [permissions.IsAuthenticated]


# @csrf_exempt
# def propertyApi(request, id=0):
#     if request.method == 'GET':
#         properties = Property.objects.all()
#         property_serializer = PropertySerializer(properties, many=True)
#         return JsonResponse(property_serializer.data, safe=False)
#     elif request.method == 'POST':
#         property_data = JSONParser().parse(request)
#         property_serializer = PropertySerializer(data=property_data)
#         if property_serializer.is_valid():
#             property_serializer.save()
#             return JsonResponse("Added Successfully", safe=False)
#         return JsonResponse("Failed to Add", safe=False)
#     elif request.method == 'PUT':
#         property_data = JSONParser().parse(request)
#         property = Property.objects.get(id=id)
#         property_serializer = PropertySerializer(property, data=property_data)
#         if property_serializer.is_valid():
#             property_serializer.save()
#             return JsonResponse("Updated Successfully", safe=False)
#         return JsonResponse("Failed to Update", safe=False)
#     elif request.method == 'DELETE':
#         property = Property.objects.get(id=id)
#         property.delete()
#         return JsonResponse("Deleted Successfully", safe=False)

# @api_view(['POST'])
# def register_tenant(request):
#     serializer = TenantSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# def tenant_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             email = data.get('email')
#             password = data.get('password')
            
#             try:
#                 tenant = Tenant.objects.get(email=email)
#                 # Just check if password matches (insecure - for demo only)
#                 if tenant.password == password:
#                     return JsonResponse({
#                         'success': True,
#                         'tenant': {
#                             'id': tenant.id,
#                             'name': tenant.name,
#                             'email': tenant.email
#                         }
#                     })
#                 return JsonResponse({'success': False, 'error': 'Invalid password'}, status=401)
#             except Tenant.DoesNotExist:
#                 return JsonResponse({'success': False, 'error': 'Tenant not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'success': False, 'error': str(e)}, status=400)
#     return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

class LocationCreateView(generics.CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    parser_classes = [MultiPartParser, FormParser]

#getting lcoation name from location id
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location

@api_view(['GET'])
def location_detail(request, pk):
    try:
        location = Location.objects.get(pk=pk)
        return Response({
            "id": location.id,
            "name": location.name
        })
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=404)



# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Property, Location
# from .serializers import PropertySerializer, LocationSerializer
# from django.db.models import Q

# @api_view(['GET'])
# def property_list(request):
#     # Get query parameters
#     location_name = request.GET.get('location', '')
#     bedroom = request.GET.get('bedroom', '')
#     livingroom = request.GET.get('livingroom', '')
#     washroom = request.GET.get('washroom', '')
#     kitchen = request.GET.get('kitchen', '')
#     min_rent = request.GET.get('minRent', '')
#     max_rent = request.GET.get('maxRent', '')
#     coliving = request.GET.get('coliving', 'false') == 'true'
#     parking = request.GET.get('parking', 'false') == 'true'
#     balcony = request.GET.get('balcony', 'false') == 'true'
#     petfriendly = request.GET.get('petfriendly', 'false') == 'true'
#     status = request.GET.get('status', 'true') == 'true'

#     # Start with all active properties
#     queryset = Property.objects.filter(status=status)

#     # Apply filters
#     if location_name:
#         queryset = queryset.filter(location__name__icontains=location_name)
#     if bedroom:
#         queryset = queryset.filter(bedroom__gte=bedroom)
#     if livingroom:
#         queryset = queryset.filter(livingroom__gte=livingroom)
#     if washroom:
#         queryset = queryset.filter(washroom__gte=washroom)
#     if kitchen:
#         queryset = queryset.filter(kitchen__gte=kitchen)
#     if min_rent:
#         queryset = queryset.filter(rent__gte=min_rent)
#     if max_rent:
#         queryset = queryset.filter(rent__lte=max_rent)
#     if coliving:
#         queryset = queryset.filter(coliving=True)
#     if parking:
#         queryset = queryset.filter(parking=True)
#     if balcony:
#         queryset = queryset.filter(balcony=True)
#     if petfriendly:
#         queryset = queryset.filter(petfriendly=True)

#     # Serialize and return the data
#     serializer = PropertySerializer(queryset, many=True)
#     return Response(serializer.data)

# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import LoginSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.create(serializer.validated_data), status=status.HTTP_200_OK)

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCSerializer
    permission_classes = [IsAuthenticated]

#displaying bookgings
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
        if new_status not in ["Accepted", "Rejected", "Pending"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        booking.save()
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
        if new_status not in ["confirmed", "declined", "pending"]:
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
            prop = Property.objects.get(pk=pk)
            serializer = PropertyDetailSerializer(prop)
            return Response(serializer.data)
        except Property.DoesNotExist:
            return Response({"error": "Property not found"}, status=status.HTTP_404_NOT_FOUND)
