from django.db import models
from datetime import datetime


class teamTable(models.Model):
    team_name = models.CharField(max_length=200, primary_key=True)
    player1_name = models.CharField(max_length=100)
    player2_name = models.CharField(max_length=100)
    points = models.IntegerField(default=0)
    date = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.team_name


class matchTable(models.Model):
    team1 = models.CharField(max_length=200)
    team2 = models.CharField(max_length=200)
    status = models.CharField(max_length=20)
    date = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.status
