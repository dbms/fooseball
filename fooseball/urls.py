from django.urls import path, re_path
from fooseball import views

urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    re_path(r'^CreateTeam$', views.CreateTeam, name='CreateTeam'),
    re_path(r'^CreateMatch$', views.CreateMatch, name='CreateMatch'),
    re_path(r'^GetTeamDetails$', views.getTeamDetails, name='getTeamDetails'),
    re_path(r'^GetMatchDetails$', views.getMatchDetails, name='getMatchDetails'),
    re_path(r'^GetLeaderBoard$', views.getLeaderBoard, name='getLeaderBoard'),
    re_path(r'^SaveScore$', views.SaveScore, name='SaveScore'),
]
