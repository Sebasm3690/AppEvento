# Generated by Django 5.0 on 2024-01-09 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='vende',
            name='precio_actual',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
