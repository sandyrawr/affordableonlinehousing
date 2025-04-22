# serializers.py
from rest_framework import serializers
# from .models import Property
from .models import Location
from .models import User, Owner, Tenant, Admin, Property, Booking, TourRequest
from django.contrib.auth.hashers import make_password

# class PropertySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Property
#         fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location  
        fields = '__all__'


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['email', 'password', 'role']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def create(self, validated_data):
#         validated_data['password'] = make_password(validated_data['password'])
#         return super().create(validated_data)


# class OwnerSerializer(serializers.ModelSerializer):
#     user_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.filter(role='owner'), source='user'
#     )

#     class Meta:
#         model = Owner
#         fields = '__all__'

# class TenantSerializer(serializers.ModelSerializer):
#     user_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.filter(role='tenant'), source='user'
#     )

#     class Meta:
#         model = Tenant
#         fields = '__all__'

# class AdminSerializer(serializers.ModelSerializer):
#     user_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.filter(role='admin'), source='user'
#     )

#     class Meta:
#         model = Admin
#         fields = '__all__'

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Tenant, Owner, Admin

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

# class TenantSerializer(serializers.ModelSerializer):
#     user = UserSerializer()

#     class Meta:
#         model = Tenant
#         fields = ['user', 'name', 'phone_number', 'criminal_history', 'employment_status', 'user_image']

#     def create(self, validated_data):
#         user_data = validated_data.pop('user')
#         user = User.objects.create_user(**user_data)
#         tenant = Tenant.objects.create(user=user, **validated_data)
#         return tenant

#     def update(self, instance, validated_data):
#         user_data = validated_data.pop('user', {})
#         password = validated_data.pop('password', None)
#         new_password = validated_data.pop('new_password', None)

#         user = instance.user

#         if 'email' in user_data:
#             user.email = user_data['email']

#         # Verify current password before setting new one
#         if new_password:
#             if not password:
#                 raise serializers.ValidationError({"password": "Current password is required to change password."})
#             if not user.check_password(password):
#                 raise serializers.ValidationError({"password": "Current password is incorrect."})
#             user.set_password(new_password)

#         user.save()

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         return instance

class TenantSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    email = serializers.EmailField(source='user.email', write_only=True)
    password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Tenant
        fields = [
            'user',
            'email',
            'name',
            'phone_number',
            'criminal_history',
            'employment_status',
            'user_image',
            'password',
            'new_password',
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        tenant = Tenant.objects.create(user=user, **validated_data)
        return tenant

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        email = user_data.get('email', None)
        password = validated_data.pop('password', None)
        new_password = validated_data.pop('new_password', None)

        user = instance.user

        # Email update (optional)
        if 'email' in user_data:
            user.email = user_data['email']

        # Password update with validation
        if new_password:
            if not password:
                raise serializers.ValidationError({
                    "password": "Current password is required to change password."
                })
            if not user.check_password(password):
                raise serializers.ValidationError({
                    "password": "Current password is incorrect."
                })
            user.set_password(new_password)

        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class OwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    email = serializers.EmailField(source='user.email', write_only=True)
    password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Owner
        fields = [
            'user',
            'email',
            'name',
            'phone_number',
            'criminal_history',
            'employment_status',
            'user_image',
            'password',
            'new_password',
        ]
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        owner = Owner.objects.create(user=user, **validated_data)
        return owner

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        email = user_data.get('email', None)
        password = validated_data.pop('password', None)
        new_password = validated_data.pop('new_password', None)

        user = instance.user

        # Email update (optional)
        if 'email' in user_data:
            user.email = user_data['email']

        # Password update with validation
        if new_password:
            if not password:
                raise serializers.ValidationError({
                    "password": "Current password is required to change password."
                })
            if not user.check_password(password):
                raise serializers.ValidationError({
                    "password": "Current password is incorrect."
                })
            user.set_password(new_password)

        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_superuser(**user_data)
        admin = Admin.objects.create(user=user)
        return admin


class PropertySerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source="owner.id", read_only=True)
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    owner_image = serializers.ImageField(source="owner.user_image", read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_id = serializers.IntegerField(source='location.id', read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
        # read_only_fields = ['owner']
        extra_kwargs = {
            'owner': {'required': True},
            'property_image': {'required': False}  # Make image optional for updates
        }

#for returning  owner image for property details page

# class PropertySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Property
#         fields = '__all__'
#             # 'id', 'title', 'description', 'property_type', 'location', 'rent', 'total_room'
#             # 'bedrooms', 'bathrooms', 'property_size', 'property_image', 'owner', 'price_type',, 
        

#for returning owner details for displaying in property details page
# class PropertyOSerializer(serializers.ModelSerializer):
#     owner_id = serializers.IntegerField(source="owner.id", read_only=True)
#     owner_name = serializers.CharField(source="owner.name", read_only=True)
#     owner_image = serializers.ImageField(source="owner.user_image", read_only=True)

#     class Meta:
#         model = Property
#         fields = [
#             'id', 'title', 'description', 'property_type', 'location', 'rent',
#             'bedrooms', 'bathrooms', 'property_size', 'property_image',
#             'owner_id', 'owner_name', 'owner_image'
        # ]
#for extracting owner image for property details page
class PropertyDetailSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    owner_image = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'  # or list the fields manually
        extra_fields = ['owner_image']

    def get_owner_image(self, obj):
        return obj.owner.user_image.url if obj.owner.user_image else None


    # def create(self, validated_data):
    #     # Extract user-related data
    #     user_data = validated_data.pop('user')
    #     user_data['role'] = 'tenant'  # Ensure the role is set to 'tenant'

    #     # Create the User first
    #     user = User.objects.create(**user_data)

    #     # Create the Tenant instance with the user as a foreign key
    #     return Tenant.objects.create(user=user, **validated_data)

# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")
        
        return {
            'user': user
        }

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
            'role': user.role
        }


class TenantCSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Tenant
        fields = ['user', 'name', 'phone_number', 'criminal_history', 'employment_status', 'user_image']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        tenant = Tenant.objects.create(user=user, **validated_data)
        return tenant

class OwnerCSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Owner
        fields = ['user', 'name', 'phone_number', 'criminal_history', 'employment_status', 'user_image']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        owner = Owner.objects.create(user=user, **validated_data)
        return owner

class BookingCSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['property', 'message', 'status', 'date_applied']  # exclude tenant
        read_only_fields = ['status', 'date_applied']

    def create(self, validated_data):
        user = self.context['request'].user
        tenant = Tenant.objects.get(user=user)
        return Booking.objects.create(tenant=tenant, **validated_data)

class TourRequestCSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourRequest
        fields = ['property', 'requested_date', 'status', 'time_submitted']  # exclude tenant
        read_only_fields = ['status', 'time_submitted']

    def create(self, validated_data):
        user = self.context['request'].user
        tenant = Tenant.objects.get(user=user)
        return TourRequest.objects.create(tenant=tenant, **validated_data)

class BookingSerializer(serializers.ModelSerializer):
    tenant_name = serializers.SerializerMethodField()
    tenant_image = serializers.SerializerMethodField()
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_image = serializers.ImageField(source='property.property_image', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_rooms = serializers.IntegerField(source='property.total_rooms', read_only=True)
    owner_name = serializers.CharField(source='property.owner.name', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'tenant', 'tenant_name', 'tenant_image', 'property', 'property_title', 'property_image', 'message', 'status', 'date_applied', 'property_rooms', 'owner_name']

    def get_tenant_name(self, obj):
        return obj.tenant.name  # Assumes user model has full_name field

    def get_tenant_image(self, obj):
        return obj.tenant.user_image.url if obj.tenant.user_image else None

class TourRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.SerializerMethodField()
    tenant_image = serializers.SerializerMethodField()
    owner_name = serializers.CharField(source='property.owner.name', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_type = serializers.CharField(source='property.property_type', read_only=True)
    property_image = serializers.ImageField(source='property.property_image', read_only=True)

    class Meta:
        model = TourRequest
        fields = ['id', 'tenant', 'tenant_name', 'tenant_image', 'property', 'property_title',
                  'property_type', 'property_image', 'requested_date', 'status', 'time_submitted', 'owner_name']

    def get_tenant_name(self, obj):
        return obj.tenant.name

    def get_tenant_image(self, obj):
        return obj.tenant.user_image.url if obj.tenant.user_image else None    

