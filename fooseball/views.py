from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import teamTable, matchTable
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers


def index(request):
    try:
        return render(request, 'fooseball/index.html')
    except Exception as ex:
        return HttpResponse(ex)


def getTeamDetails(request):
    try:
        recent_teams = teamTable.objects.all().order_by("-date")
        return HttpResponse(serializers.serialize('json', recent_teams), content_type='application/json')
    except Exception as ex:
        print(ex)
        return HttpResponse(ex)


def getMatchDetails(request):
    try:
        matches = matchTable.objects.all().order_by("-date")
        return HttpResponse(serializers.serialize('json', matches), content_type='application/json')
    except Exception as ex:
        return HttpResponse(ex)


@csrf_exempt
def CreateTeam(request):
    outputResponse = ''
    try:
        if request.method == 'POST':
            if teamTable.objects.filter(team_name=request.POST['team_name']).exists():
                outResponse = 'Team already created'
            else:
                p = teamTable(
                    team_name=request.POST['team_name'],
                    player1_name=request.POST['player1_name'],
                    player2_name=request.POST['player2_name'],
                )
                p.save()
                outResponse = 'Successfully Saved'
        else:
            return HttpResponse("Invalid Request")

        return HttpResponse(json.dumps({'outResponse': outResponse}), content_type='application/json')

    except Exception as ex:
        return HttpResponse(ex)


@csrf_exempt
def CreateMatch(request):
    outputResponse = ''
    try:
        if request.method == 'POST':
            team1name = request.POST['team1']
            team2name = request.POST['team2']
            if matchTable.objects.filter(team1=team1name, team2=team2name).exists() or matchTable.objects.filter(team1=team2name, team2=team1name).exists():
                outResponse = 'Match already in progress'
            else:
                p = matchTable(
                    team1=team1name,
                    team2=team2name,
                    status='ongoing',
                )
                p.save()
                outResponse = 'Successfully Saved'
        else:
            return HttpResponse("Invalid Request")

        return HttpResponse(json.dumps({'outResponse': outResponse}), content_type='application/json')

    except Exception as ex:
        print(ex)
        return HttpResponse(ex)
