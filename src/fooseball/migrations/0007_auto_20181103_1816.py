# Generated by Django 2.1.3 on 2018-11-03 12:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fooseball', '0006_auto_20181103_1235'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchtable',
            name='team1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team1', to='fooseball.teamTable'),
        ),
        migrations.AlterField(
            model_name='matchtable',
            name='team2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team2', to='fooseball.teamTable'),
        ),
    ]