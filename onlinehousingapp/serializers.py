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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class OwnerSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='owner'), source='user'
    )

    class Meta:
        model = Owner
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='tenant'), source='user'
    )

    class Meta:
        model = Tenant
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='admin'), source='user'
    )

    class Meta:
        model = Admin
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['owner']

    # def create(self, validated_data):
    #     # Extract user-related data
    #     user_data = validated_data.pop('user')
    #     user_data['role'] = 'tenant'  # Ensure the role is set to 'tenant'

    #     # Create the User first
    #     user = User.objects.create(**user_data)

    #     # Create the Tenant instance with the user as a foreign key
    #     return Tenant.objects.create(user=user, **validated_data)
