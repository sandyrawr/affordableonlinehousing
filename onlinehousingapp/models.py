# models.py
from django.db import models

class Property(models.Model):
    title = models.CharField(max_length=255, )
    description = models.TextField()
    rent = models.PositiveIntegerField()
    bedroom = models.PositiveIntegerField()
    livingroom = models.PositiveIntegerField()
    washroom = models.PositiveIntegerField()
    kitchen = models.PositiveIntegerField()
    status = models.BooleanField(default=True)
    coliving = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    balcony = models.BooleanField(default=False)
    petfriendly = models.BooleanField(default=False)
    owner = models.ForeignKey('Owner', on_delete=models.CASCADE)  
    location = models.ForeignKey('Location', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
class Location(models.Model):
    name = models.CharField(max_length=255, )
    transportcost = models.PositiveIntegerField()
    utilitycost = models.PositiveIntegerField()
    foodcost = models.PositiveIntegerField()
    safetyrating = models.PositiveIntegerField()
    # limage = models.ImageField()

class Tenant(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=128)
    criminal_history = models.BooleanField(default=False)
    employment_status = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
class Owner(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()  
    phonenumber = models.CharField(max_length=20)  
    password = models.CharField(max_length=255) 
    criminalhistory = models.BooleanField(default=False)  
    address = models.TextField()  

    def __str__(self):
        return self.name
    
class Booking(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()  
    phonenumber = models.CharField(max_length=20)  
    password = models.CharField(max_length=255) 
    criminalhistory = models.BooleanField(default=False)  
    address = models.TextField()  

    def __str__(self):
        return self.name


    
# class Teacher (models .Model):
#     full_name= models.CharField(max_length=100)
#     email=models.CharField (max_length=100)
#     password=models.CharField(max_length=100,blank=True, null=True)
#     qualification=models.CharField (max_length= 200)
#     mobile_no=models.CharField (max_length=20)
#     profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True)
#     skills=models.TextField()
#     verify_status=models.BooleanField (default=False)
#     otp_digit=models.CharField (max_length=100 ,null=True)

#     class Meta:
#         verbose_name_plural="1. Teachers"
    
#     def skill_list(self):
#         skill_list=self.skills.split(',')
#         return skill_list
    
#     # Total Teacher Courses
#     def total_teacher_courses (self):
#         total_courses=Course.objects.filter (teacher=self).count () 
#         return total_courses

#     # Total Teacher Chapters
#     def total_teacher_chapters (self):
#         total_chapters=Chapter.objects.filter (course_teacher=self).count ()
#         return total_chapters
    
#     # Total Teacher Students
#     def total_teacher_students (self):
#         total_students=StudentCourseEnrollment.objects.filter(course_teacher=self).count()
