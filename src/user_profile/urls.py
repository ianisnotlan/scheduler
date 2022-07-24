from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register('user', views.UserViewSet, 'user')
router.register('user-profile', views.UserProfileViewSet, 'user-profile')

urlpatterns = router.urls