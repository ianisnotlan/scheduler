from django.contrib.auth import authenticate, get_user_model, login, logout
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import UserProfile

from .serializers import UserSerializer, UserProfileSerializer

User = get_user_model()

class UserViewSet(ViewSet):
    def list(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=False, methods=['GET'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=False, methods=['POST'])
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.get(username=request.data.get('username'))
        user.set_password(request.data.get('password'))
        user.save()
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)

    @action(detail=False, methods=['POST'])
    def logout(self, request):
        logout(request)

        return Response({'msg': 'success'})

    @action(detail=False, methods=['POST'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        
        if not user:
            return Response({'msg': 'failed'})

        login(request, user)

        return Response({'msg': 'success'})

class UserProfileViewSet(ViewSet):
    def list(self, request):
        user_profile, _ = UserProfile.objects.get_or_create(owner=request.user)
        user_serializer = UserSerializer(request.user)
        profile_serializer = UserProfileSerializer(user_profile)
        data = {**user_serializer.data, **profile_serializer.data}
        return Response(status=status.HTTP_200_OK, data=data)

    def partial_update(self, request, *args, **kwargs):
        user_serializer = UserSerializer(instance=request.user, data=request.data, partial=True)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()
        instance = UserProfile.objects.get(pk=kwargs.get('pk'))
        profile_serializer = UserProfileSerializer(instance=instance, data=request.data, partial=True)
        profile_serializer.is_valid(raise_exception=True)
        profile_serializer.save()
        data = {**user_serializer.data, **profile_serializer.data}
        return Response(status=status.HTTP_200_OK, data=data)


