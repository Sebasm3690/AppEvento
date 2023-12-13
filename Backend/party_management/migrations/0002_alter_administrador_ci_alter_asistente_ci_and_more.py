# Generated by Django 4.2.7 on 2023-12-13 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='administrador',
            name='ci',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='asistente',
            name='ci',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='asistente',
            name='correo',
            field=models.CharField(max_length=25, unique=True),
        ),
        migrations.AlterField(
            model_name='boleto',
            name='stock',
            field=models.BooleanField(unique=True),
        ),
        migrations.AlterField(
            model_name='boleto',
            name='tipo',
            field=models.CharField(max_length=15, unique=True),
        ),
        migrations.AlterField(
            model_name='evento',
            name='nombre_evento',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='organizador',
            name='ci',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='organizador',
            name='correo',
            field=models.CharField(max_length=25, unique=True),
        ),
    ]
