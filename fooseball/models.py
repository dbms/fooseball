from django.db import models
from datetime import datetime

class teamTable(models.Model):
    team_name = models.CharField(max_length=50, unique=True)
    player1_name = models.CharField(max_length=120)
    player2_name = models.CharField(max_length=15)
    date = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.team_name