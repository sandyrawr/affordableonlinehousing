from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from onlinehousingapp.serializers import StudentSerializer
from onlinehousingapp.models import Student
from onlinehousingapp.models import Teacher


@csrf_exempt
def studentApi(request,id=0):
    if request.method=='GET':
        student = Student.objects.all()
        student_serializer=StudentSerializer(student,many=True)
        return JsonResponse(student_serializer.data,safe=False)
    elif request.method=='POST':
        student_data=JSONParser().parse(request)
        student_serializer=StudentSerializer(data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        student_data=JSONParser().parse(request)
        student=Student.objects.get(id=id)
        student_serializer=StudentSerializer(student,data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        student=Student.objects.get(id=id)
        student.delete()
        return JsonResponse("Deleted Successfully",safe=False)
    
@csrf_exempt
def teacher_login (request):
    email=request.POST ['email']
    password=request.POST['password']
    try:
        teacherData=models.Teacher.objects.get(email=email,password=password, verify_status=True)
    except models.Teacher.DoesNotExist:
        teacherData=None
    if teacherData:
        if not teacherData.verify_status:
            return JsonResponse({'bool' :False, 'msg': 'Account is not verified!!'})
        else:
            return JsonResponse({'bool' :True, 'teacher_id': teacherData.id})
        
    else:
        return JsonResponse ( {'bool': False, 'msg': 'Invalid username or password!!'})
