# Generated by Django 5.2 on 2025-04-10 00:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('transportcost', models.PositiveIntegerField()),
                ('utilitycost', models.PositiveIntegerField()),
                ('foodcost', models.PositiveIntegerField()),
                ('safetyrating', models.PositiveIntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='location_images/')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('role', models.CharField(choices=[('tenant', 'Tenant'), ('owner', 'Owner'), ('admin', 'Admin')], max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=20)),
                ('criminal_history', models.TextField()),
                ('employment_status', models.CharField(max_length=100)),
                ('user_image', models.ImageField(blank=True, null=True, upload_to='tenant_images/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onlinehousingapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('phone_number', models.CharField(max_length=20)),
                ('criminal_history', models.TextField()),
                ('employment_status', models.CharField(max_length=100)),
                ('user_image', models.ImageField(blank=True, null=True, upload_to='owner_images/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onlinehousingapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='onlinehousingapp.user')),
            ],
        ),
    ]
