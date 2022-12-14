import datetime
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from .serializers import EventSerializer
from .models import Event

User = get_user_model()

class EventViewSet(GenericViewSet, CreateModelMixin, UpdateModelMixin, DestroyModelMixin):
    serializer_class = EventSerializer

    def get_queryset(self):
        events = Event.objects.filter(Q(creator=self.request.user) | Q(shared_users=self.request.user))
        events = events.distinct()
        return events

    def list(self, request):
        queryset = self.get_queryset()

        year = request.GET.get('year', None)
        month = request.GET.get('month', None)
        day = request.GET.get('day', None)

        if all(item is not None for item in [year, month, day]):
            next_day = datetime.date(int(year), int(month), int(day)) + datetime.timedelta(days=1)
            queryset = queryset.filter(Q(start_datetime__lt=next_day) & Q(end_datetime__gt=f'{year}-{month}-{day}'))
        elif year is not None and month is not None:
            first_day_of_next_month = datetime.date(int(year) if int(month) != 12 else int(year) + 1,(int(month) + 1) if int(month) != 12 else 1,1)
            queryset = queryset.filter(Q(start_datetime__lt=first_day_of_next_month) & Q(end_datetime__gt=f'{year}-{month}-1'))
        elif year is not None:
            queryset = queryset.filter(Q(start_datetime__lt=f'{int(year)+1}-1-1') & Q(end_datetime__gt=f'{year}-1-1'))
            
        queryset = queryset.order_by('start_datetime', '-end_datetime')
        serializer = self.get_serializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
