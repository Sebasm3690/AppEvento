# Generated by Django 5.0 on 2023-12-30 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0006_alter_boleto_stock'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boleto',
            name='tipo',
            field=models.CharField(max_length=15),
        ),
    ]
