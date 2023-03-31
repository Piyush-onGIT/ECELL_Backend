from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import AuthSerializer, PostsSerializer
from .models import Auth, Posts
import json
from django.views.generic.edit import CreateView
import rest_framework

class Ecell:
    @api_view(["GET"])
    def getUsers(request: rest_framework.request.Request) -> rest_framework.response.Response:
        data = Auth.objects.all()
        serial = AuthSerializer(data, many=True)
        return Response(serial.data)


    @api_view(["GET"])
    def getPosts(request: rest_framework.request.Request) -> rest_framework.response.Response:
        data = Posts.objects.all()
        serial = PostsSerializer(data, many=True)
        return Response(serial.data)
    
    @api_view(["POST"])
    def filter(request: rest_framework.request.Request) -> rest_framework.response.Response:
        data = json.loads(request.body.decode("utf-8"))
        d = Posts.objects.all().filter(user = data['id'])
        serial = PostsSerializer(d, many=True)
        return Response(serial.data)


    @api_view(["GET", "POST"])
    def register(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        send = AuthSerializer(data=data)

        serial = AuthSerializer(Auth.objects.all(), many=True)
        
        for i in serial.data:
            if (i['username'] == data['username'] or i['email'] == data['email']):
                return HttpResponse("-1")

        if send.is_valid():
            send.save()
            return HttpResponse("0")
        

    @api_view(["GET", "POST"])
    def login(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        serial = AuthSerializer(Auth.objects.all(), many=True)

        for i in serial.data:
            if (i['username'] == data['username']):
                if (i['password'] == data['password']):
                    d = {'res': '0', 'id': i['id'], 'username': i['username']}
                    return HttpResponse(json.dumps(d))
                else:
                    d = {'res': '1'}
                    return HttpResponse(json.dumps(d))

        d = {'res': '-1'}
        return HttpResponse(json.dumps(d))


    @api_view(["POST"])
    def create(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))

        user = Auth.objects.get(id=data['user'])

        user.posts_set.create(title=data['title'], content=data['content'])
        return HttpResponse("0")
        
        return HttpResponse("-1")

    @api_view(["POST"])
    def editPost(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        id = data['id']
        post = Posts.objects.get(id=id)
        post.title = data['title']
        post.content = data['content']
        
        try:
            post.save()
            return HttpResponse(0)
        except:
            return HttpResponse(-1)


    @api_view(["DELETE"])
    def delPost(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        id = data['id']
        post = Posts.objects.get(id=id)
        try:
            post.delete()
            return HttpResponse(0)
        except:
            return HttpResponse(-1)