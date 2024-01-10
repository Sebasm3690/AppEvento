# Generated by Django 4.2.7 on 2024-01-09 03:25

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asistente',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id_asistente', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('apellido', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=25, unique=True)),
                ('password', models.CharField(max_length=50)),
                ('ci', models.CharField(max_length=10, unique=True)),
                ('confirmed', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Administrador',
            fields=[
                ('id_admin', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('apellido', models.CharField(max_length=50)),
                ('ci', models.CharField(max_length=10, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Organizador',
            fields=[
                ('id_organizador', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('apellido', models.CharField(max_length=50)),
                ('ci', models.CharField(max_length=10, unique=True)),
                ('correo', models.CharField(max_length=25, unique=True)),
                ('contrasenia', models.CharField(max_length=15)),
                ('eliminado', models.BooleanField(default=False)),
                ('id_admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='party_management.administrador')),
            ],
        ),
        migrations.CreateModel(
            name='OrdenCompra',
            fields=[
                ('num_orden', models.AutoField(primary_key=True, serialize=False)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('valor_total', models.FloatField()),
                ('id_asistente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id_evento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre_evento', models.CharField(max_length=50)),
                ('fecha', models.DateField()),
                ('hora', models.TimeField()),
                ('ubicacion', models.CharField(max_length=50)),
                ('descripcion', models.CharField(max_length=100)),
                ('tipo', models.CharField(max_length=10)),
                ('limite', models.IntegerField()),
                ('eliminado', models.BooleanField(default=False)),
                ('id_organizador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='party_management.organizador')),
            ],
        ),
        migrations.CreateModel(
            name='Boleto',
            fields=[
                ('id_boleto', models.AutoField(primary_key=True, serialize=False)),
                ('stock', models.IntegerField()),
                ('tipoBoleto', models.CharField(max_length=15)),
                ('precio', models.FloatField()),
                ('id_evento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='party_management.evento')),
            ],
        ),
        migrations.CreateModel(
            name='Vende',
            fields=[
                ('id_vende', models.AutoField(primary_key=True, serialize=False)),
                ('iva', models.FloatField()),
                ('descuento', models.FloatField()),
                ('ice', models.FloatField()),
                ('stock_actual', models.IntegerField(default=0)),
                ('id_boleto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vende_boleto', to='party_management.boleto')),
                ('id_organizador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vende_organizador', to='party_management.organizador')),
            ],
            options={
                'unique_together': {('id_boleto', 'id_organizador')},
            },
        ),
        migrations.CreateModel(
            name='Contiene',
            fields=[
                ('id_contiene', models.AutoField(primary_key=True, serialize=False)),
                ('boleto_cdg', models.CharField(default='', max_length=50, unique=True)),
                ('cantidad_total', models.IntegerField()),
                ('id_boleto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='party_management.boleto')),
                ('num_orden', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='party_management.ordencompra')),
            ],
            options={
                'unique_together': {('id_boleto', 'num_orden')},
            },
        ),
    ]
