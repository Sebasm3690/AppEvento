# Generated by Django 4.2.7 on 2024-01-08 03:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0002_evento_eliminado'),
    ]

    operations = [
        migrations.AddField(
            model_name='boleto',
            name='id_evento',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='party_management.evento'),
            preserve_default=False,
        ),
    ]
