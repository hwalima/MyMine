# Generated by Django 5.1.4 on 2024-12-12 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0011_machinery_operating_hours_alter_machinery_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='machinery',
            name='_next_maintenance_due',
            field=models.DateField(blank=True, null=True),
        ),
    ]
