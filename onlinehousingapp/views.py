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
from .models import User, Admin, Owner, Property
from .serializers import OwnerSerializer, TenantSerializer, UserSerializer, AdminSerializer, PropertySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

def locationApi(request, id=0):
    locations = Location.objects.all()
    location_serializer = LocationSerializer(locations, many=True)
    return JsonResponse(location_serializer.data, safe=False)

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'user_id': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnerRegistrationView(APIView):
    def post(self, request):
        serializer = OwnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Owner registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import TenantSerializer

class TenantRegistrationView(APIView):
    def post(self, request):
        serializer = TenantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Tenant registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminRegistrationView(APIView):
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Admin registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        # permission_classes = [AllowAny]
        permission_classes = [IsAuthenticated]
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'role': user.role,
            'email': user.email
        }

        if user.role == 'owner':
            try:
                owner = Owner.objects.get(user=user)
                response_data['owner_id'] = owner.id
            except Owner.DoesNotExist:
                response_data['owner_id'] = None

        elif user.role == 'tenant':
            try:
                tenant = Tenant.objects.get(user=user)
                response_data['tenant_id'] = tenant.id
            except Tenant.DoesNotExist:
                response_data['tenant_id'] = None

        elif user.role == 'admin':
            try:
                admin = Admin.objects.get(user=user)
                response_data['admin_id'] = admin.id
            except Admin.DoesNotExist:
                response_data['admin_id'] = None

        return Response(response_data, status=status.HTTP_200_OK)

class PropertyCreateView(APIView):
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # print("Authenticated User:", request.user)  # This should print a user object
        # print("User ID:", request.user.id)  # This should print the user ID
        # try:
        #     owner = Owner.objects.get(user=request.user)  # assuming Owner has FK to User
        # except Owner.DoesNotExist:
        #     return Response({"error": "You are not registered as an owner."}, status=403)
        
        # # data = request.data.copy()
        # data['owner'] = owner.id  # Inject the owner ID

        # owner = Owner.objects.get(user=request.user)

        data = request.data.copy()

        
        serializer = PropertySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
        

class OwnerDetailView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            owner = Owner.objects.get(user_id=user_id)
            return Response({
                'id': owner.id,
                'user_id': owner.user_id,
                'additional_owner_details': owner.additional_field
            })
        except Owner.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)

class PropertyListView(APIView):
    def get(self, request):
        location_name = request.GET.get('location')  # Get the location parameter from the URL
        if location_name:
            properties = Property.objects.filter(location__name=location_name)  # Filter properties by location
        else:
            properties = Property.objects.all()  # If no location is provided, return all properties

        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class MyPropertiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(owner__user=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

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

