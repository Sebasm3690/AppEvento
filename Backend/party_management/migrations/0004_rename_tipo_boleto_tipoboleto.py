# Generated by Django 4.2.7 on 2024-01-08 03:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0003_boleto_id_evento'),
    ]

    operations = [
        migrations.RenameField(
            model_name='boleto',
            old_name='tipo',
            new_name='tipoBoleto',
        ),
    ]
