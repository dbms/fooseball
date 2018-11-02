from django.urls import path, re_path
from fooseball import views

urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    re_path(r'^CreateTeam$', views.CreateTeam, name='CreateTeam'),
]
