# Generated by Django 5.1.4 on 2024-12-13 19:23

from django.db import migrations
from django.utils import timezone

def convert_shift_choices_to_model(apps, schema_editor):
    LaborMetric = apps.get_model('mining_operations', 'LaborMetric')
    Shift = apps.get_model('mining_operations', 'Shift')
    MiningDepartment = apps.get_model('mining_operations', 'MiningDepartment')

    # First, temporarily set all shift references to NULL
    db_alias = schema_editor.connection.alias
    LaborMetric.objects.using(db_alias).all().update(shift=None)

    # Create default shifts for each department
    shift_mapping = {}
    departments = MiningDepartment.objects.all()

    for department in departments:
        morning_shift = Shift.objects.create(
            name='Morning Shift',
            start_time='06:00',
            end_time='14:00',
            department=department,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        afternoon_shift = Shift.objects.create(
            name='Afternoon Shift',
            start_time='14:00',
            end_time='22:00',
            department=department,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        night_shift = Shift.objects.create(
            name='Night Shift',
            start_time='22:00',
            end_time='06:00',
            department=department,
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        shift_mapping[department.id] = {
            'MORNING': morning_shift,
            'AFTERNOON': afternoon_shift,
            'NIGHT': night_shift
        }

    # Update labor metrics with new shift references
    for labor_metric in LaborMetric.objects.all():
        if labor_metric.department_id in shift_mapping and labor_metric.shift in shift_mapping[labor_metric.department_id]:
            labor_metric.shift = shift_mapping[labor_metric.department_id][labor_metric.shift]
            labor_metric.save()

def reverse_convert_shift_choices_to_model(apps, schema_editor):
    LaborMetric = apps.get_model('mining_operations', 'LaborMetric')
    Shift = apps.get_model('mining_operations', 'Shift')

    # Convert back to choices
    for labor_metric in LaborMetric.objects.all():
        if labor_metric.shift:
            if 'Morning' in labor_metric.shift.name:
                labor_metric.shift = 'MORNING'
            elif 'Afternoon' in labor_metric.shift.name:
                labor_metric.shift = 'AFTERNOON'
            elif 'Night' in labor_metric.shift.name:
                labor_metric.shift = 'NIGHT'
            labor_metric.save()

    # Delete all shifts
    Shift.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('mining_operations', '0012_certification_employee_historicalcertification_and_more'),
    ]

    operations = [
        migrations.RunPython(convert_shift_choices_to_model, reverse_convert_shift_choices_to_model),
    ]