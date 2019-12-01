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
        return HttpResponse(ex)

def getLeaderBoard(request):
    try:
        recent_teams = teamTable.objects.all().order_by("-points")
        return HttpResponse(serializers.serialize('json', recent_teams), content_type='application/json')
    except Exception as ex:
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
            if matchTable.objects.filter(team1=team1name, team2=team2name, status="ongoing").exists()  or matchTable.objects.filter(team1=team2name, team2=team1name,status="ongoing").exists():
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


@csrf_exempt
def SaveScore(request):
    outputResponse = ''
    try:
        if request.method == 'POST':     
            if matchTable.objects.filter(pk = request.POST['MatchID']).exists():  
                matchTable.objects.filter(pk = request.POST['MatchID']).update(team1score=request.POST['scoreA'], team2score=request.POST['scoreB'], status = request.POST['status'])
                outResponse = 'Successfully Updated'

                winner_team_name = ''
                looser_team_name = ''
                draw_team_name1 =''
                draw_team_name1 =''

                macthDetails = matchTable.objects.get(pk = request.POST['MatchID'])
                if request.POST['status'] == 'Team 1 Won':                    
                    win_team = teamTable.objects.get(team_name = macthDetails.team1) # +3 for winning team , -2 for loosing
                    win_team.points += 3
                    win_team.matches_won += 1
                    win_team.save()

                    loose_team = teamTable.objects.get(team_name = macthDetails.team2)
                    loose_team.points -= 2
                    loose_team.matches_lost += 1
                    loose_team.save()

                elif request.POST['status'] == 'Team 2 Won':
                    win_team = teamTable.objects.get(team_name = macthDetails.team2)
                    win_team.points += 3
                    win_team.matches_won += 1
                    win_team.save()
                    
                    loose_team = teamTable.objects.get(team_name = macthDetails.team1)
                    loose_team.points -= 2
                    loose_team.matches_lost += 1
                    loose_team.save()

                else: # incase of match draw +1 to both
                    win_team = teamTable.objects.get(team_name = macthDetails.team1)
                    win_team.points += 1
                    win_team.matches_draw += 1
                    win_team.save()

                    loose_team = teamTable.objects.get(team_name = macthDetails.team2)
                    loose_team.points += 1
                    loose_team.matches_draw += 1
                    loose_team.save()
            else:
                outResponse = 'This match doesnot exists'
        else:
            return HttpResponse("Invalid Request")

        return HttpResponse(json.dumps({'outResponse': outResponse}), content_type='application/json')

    except Exception as ex:
        print(ex)
        return HttpResponse(ex)

