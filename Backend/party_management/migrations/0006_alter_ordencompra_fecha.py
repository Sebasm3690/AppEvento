# Generated by Django 4.2.7 on 2024-01-26 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0005_alter_ordencompra_fecha'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ordencompra',
            name='fecha',
            field=models.DateField(auto_now_add=True),
        ),
    ]
