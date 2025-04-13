# serializers.py
from rest_framework import serializers
# from .models import Property
from .models import Location
from .models import User, Owner, Tenant, Admin, Property
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

class TenantSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Tenant
        fields = ['user', 'name', 'phone_number', 'criminal_history', 'employment_status', 'user_image']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        tenant = Tenant.objects.create(user=user, **validated_data)
        return tenant

class OwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Owner
        fields = ['user', 'name', 'phone_number', 'criminal_history', 'employment_status', 'user_image']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        owner = Owner.objects.create(user=user, **validated_data)
        return owner

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
    class Meta:
        model = Property
        fields = '__all__'
        # read_only_fields = ['owner']
        extra_kwargs = {
            'owner': {'required': True},
        }
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
