# Generated by Django 5.0 on 2024-01-01 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('party_management', '0013_contiene_boleto_cdg'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contiene',
            name='boleto_cdg',
            field=models.CharField(default='', max_length=50),
        ),
    ]
