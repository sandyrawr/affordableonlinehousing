from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from onlinehousingapp.serializers import PropertySerializer
from onlinehousingapp.models import Property

@csrf_exempt
def propertyApi(request, id=0):
    if request.method == 'GET':
        properties = Property.objects.all()
        property_serializer = PropertySerializer(properties, many=True)
        return JsonResponse(property_serializer.data, safe=False)
    elif request.method == 'POST':
        property_data = JSONParser().parse(request)
        property_serializer = PropertySerializer(data=property_data)
        if property_serializer.is_valid():
            property_serializer.save()
            return JsonResponse("Added Successfully", safe=False)
        return JsonResponse("Failed to Add", safe=False)
    elif request.method == 'PUT':
        property_data = JSONParser().parse(request)
        property = Property.objects.get(id=id)
        property_serializer = PropertySerializer(property, data=property_data)
        if property_serializer.is_valid():
            property_serializer.save()
            return JsonResponse("Updated Successfully", safe=False)
        return JsonResponse("Failed to Update", safe=False)
    elif request.method == 'DELETE':
        property = Property.objects.get(id=id)
        property.delete()
        return JsonResponse("Deleted Successfully", safe=False)