# Generated by Django 5.1.4 on 2025-04-08 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onlinehousingapp', '0006_alter_tenant_employment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='location_images/'),
        ),
    ]
