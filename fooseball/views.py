from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import teamTable
from django.views.decorators.csrf import csrf_exempt
import json


def index(request):
    try:
        return render(request, 'fooseball/index.html')
    except Exception as ex:
        return HttpResponse(ex)


@csrf_exempt
def CreateTeam(request):
    outResponse = ''
    try:
        if request.method == 'POST':
            try:
                p = teamTable(
                    team_name=request.POST['team_name'],
                    player1_name=request.POST['player1_name'],
                    player2_name=request.POST['player2_name'],
                )
                p.save()                
           
            except teamTable.DoesNotExist:
                outResponse = 'Team already created'

        else:
            return HttpResponse("Invalid Request")

        recent_teams = teamTable.objects.all().order_by('-id')[:5]
        team_details = json.dumps({'outResponse': outResponse, 'recent_teams' : recent_teams })
        return HttpResponse(team_details, content_type='application/json')

    except Exception as ex:
        return HttpResponse(ex)
