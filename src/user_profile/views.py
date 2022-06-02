from django.contrib.auth import authenticate, get_user_model, login, logout
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .serializers import UserSerializer

User = get_user_model()

class UserViewSet(ViewSet):
    @action(detail=False, methods=["GET"])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(detail=False, methods=["POST"])
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = User.objects.get(username=request.data.get("username"))
        user.set_password(request.data.get("password"))
        user.save()
        return Response(status=status.HTTP_201_CREATED, data=serializer.data)

    @action(detail=False, methods=["POST"])
    def logout(self, request):
        logout(request)

        return Response({"msg": "success"})

    @action(detail=False, methods=["POST"])
    def login(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = authenticate(request, username=username, password=password)
        except Exception as err:
            return Response({"msg": str(err)})

        login(request, user)

        return Response({"msg": "success"})
