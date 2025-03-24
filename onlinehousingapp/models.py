from django.db import models

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length=255)
    fee = models.IntegerField()
    
class Teacher (models .Model):
    full_name= models.CharField(max_length=100)
    email=models.CharField (max_length=100)
    password=models.CharField(max_length=100,blank=True, null=True)
    qualification=models.CharField (max_length= 200)
    mobile_no=models.CharField (max_length=20)
    profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True)
    skills=models.TextField()
    verify_status=models.BooleanField (default=False)
    otp_digit=models.CharField (max_length=100 ,null=True)

    class Meta:
        verbose_name_plural="1. Teachers"
    
    def skill_list(self):
        skill_list=self.skills.split(',')
        return skill_list
    
    # Total Teacher Courses
    def total_teacher_courses (self):
        total_courses=Course.objects.filter (teacher=self).count () 
        return total_courses

    # Total Teacher Chapters
    def total_teacher_chapters (self):
        total_chapters=Chapter.objects.filter (course_teacher=self).count ()
        return total_chapters
    
    # Total Teacher Students
    def total_teacher_students (self):
        total_students=StudentCourseEnrollment.objects.filter(course_teacher=self).count()
