# models.py
from django.db import models
# from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

    
class Location(models.Model):
    name = models.CharField(max_length=255)
    transportcost = models.PositiveIntegerField()
    utilitycost = models.PositiveIntegerField()
    foodcost = models.PositiveIntegerField()
    safetyrating = models.PositiveIntegerField()
    image = models.ImageField(upload_to='location_images/', blank=True, null=True)

    def __str__(self):
        return self.name


# class User(models.Model):
#     ROLE_CHOICES = (
#         ('tenant', 'Tenant'),
#         ('owner', 'Owner'),
#         ('admin', 'Admin'),
#     )

#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=128)
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES)

#     def __str__(self):
#         return f"{self.role.capitalize()} - {self.email}"


# class Owner(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     phone_number = models.CharField(max_length=20)
#     criminal_history = models.BooleanField(default=False)
#     employment_status = models.BooleanField(default=False)
#     user_image = models.ImageField(upload_to='owner_images/', null=True, blank=True)

#     def __str__(self):
#         return self.name


# class Tenant(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     phone_number = models.CharField(max_length=20)
#     criminal_history = models.BooleanField(default=False)
#     employment_status = models.BooleanField(default=False)
#     user_image = models.ImageField(upload_to='tenant_images/', null=True, blank=True)

#     def __str__(self):
#         return self.name


# class Admin(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"Admin - {self.user.email}"

# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('tenant', 'Tenant'),
        ('owner', 'Owner'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['role']

    def __str__(self):
        return f"{self.role.capitalize()} - {self.email}"

class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    criminal_history = models.BooleanField(default=False)
    employment_status = models.BooleanField(default=False)
    user_image = models.ImageField(upload_to='owner_images/', null=True, blank=True)

    def __str__(self):
        return self.name


class Tenant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    criminal_history = models.BooleanField(default=False)
    employment_status = models.BooleanField(default=False)
    user_image = models.ImageField(upload_to='tenant_images/', null=True, blank=True)

    def __str__(self):
        return self.name


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin - {self.user.email}"


# models.py
# class Property(models.Model):
#     PROPERTY_TYPE_CHOICES = [
#         ('Apartment', 'Apartment'),
#         ('House', 'House'),
#         ('Studio', 'Studio'),
#         ('Villa', 'Villa'),
#         ('Commercial', 'Commercial'),
#         ('Flat', 'Flat'),
#     ]
#     PRICE_TYPE_CHOICES = [
#         ('Fixed', 'Fixed'),
#         ('Negotiable', 'Negotiable'),
#     ]

#     title = models.CharField(max_length=255)
#     property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE_CHOICES)
#     description = models.TextField()
#     location = models.ForeignKey(Location, on_delete=models.CASCADE)
#     bedrooms = models.IntegerField()
#     bathrooms = models.IntegerField()
#     total_rooms = models.IntegerField()
#     floor_level = models.CharField(max_length=50)
#     total_floors = models.IntegerField()
#     owner = models.ForeignKey(Owner, on_delete=models.CASCADE, null=True)
#     property_size = models.CharField(max_length=50)
#     rent = models.DecimalField(max_digits=10, decimal_places=2)
#     price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES)
#     balcony_terrace = models.BooleanField()
#     parking_space = models.BooleanField()
#     garden_yard = models.BooleanField()
#     swimming_pool = models.BooleanField()
#     lift_elevator = models.BooleanField()
#     pet_friendly = models.BooleanField()
#     gym = models.BooleanField()
#     property_image = models.ImageField(upload_to='property_images/')

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('Apartment', 'Apartment'),
        ('House', 'House'),
        ('Studio', 'Studio'),
        ('Villa', 'Villa'),
        ('Commercial', 'Commercial'),
        ('Flat', 'Flat'),
    ]
    PRICE_TYPE_CHOICES = [
        ('Fixed', 'Fixed'),
        ('Negotiable', 'Negotiable'),
    ]

    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPE_CHOICES)
    description = models.TextField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='properties')  # Mandatory location
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    total_rooms = models.IntegerField()
    floor_level = models.CharField(max_length=50)
    total_floors = models.IntegerField()
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='properties')  # Mandatory owner
    property_size = models.DecimalField(max_digits=6, decimal_places=2)  # Changed to DecimalField for area size
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES)
    balcony_terrace = models.BooleanField()
    parking_space = models.BooleanField()
    garden_yard = models.BooleanField()
    swimming_pool = models.BooleanField()
    lift_elevator = models.BooleanField()
    pet_friendly = models.BooleanField()
    gym = models.BooleanField()
    property_image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return self.title





# class Tenant(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     phone_number = models.CharField(max_length=15)
#     password = models.CharField(max_length=128)
#     criminal_history = models.BooleanField(default=False)
#     employment_status = models.BooleanField(default=True)

#     def __str__(self):
#         return self.name
    
# class Owner(models.Model):
#     name = models.CharField(max_length=255)
#     email = models.EmailField()  
#     phonenumber = models.CharField(max_length=20)  
#     password = models.CharField(max_length=255) 
#     criminalhistory = models.BooleanField(default=False)  
#     address = models.TextField()  

#     def __str__(self):
#         return self.name
    
# class Booking(models.Model):
#     name = models.CharField(max_length=255)
#     email = models.EmailField()  
#     phonenumber = models.CharField(max_length=20)  
#     password = models.CharField(max_length=255) 
#     criminalhistory = models.BooleanField(default=False)  
#     address = models.TextField()  

#     def __str__(self):
#         return self.name
