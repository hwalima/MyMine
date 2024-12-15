from django.db import migrations
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal
import random

def fix_energy_usage_data(apps, schema_editor):
    EnergyUsage = apps.get_model('mining_operations', 'EnergyUsage')
    
    # Clear existing data to avoid duplicates
    EnergyUsage.objects.all().delete()
    
    # Start from January 1, 2023
    start_date = date(2023, 1, 1)
    end_date = date(2024, 12, 15)  # Current date
    
    current_date = start_date
    while current_date <= end_date:
        # Base values that increase slightly over time to show growth
        days_since_start = (current_date - start_date).days
        growth_factor = Decimal('1') + (Decimal(str(days_since_start)) * Decimal('0.0001'))
        
        # Base values
        base_electricity = Decimal('50000') * growth_factor  # Base electricity in kWh
        base_diesel = Decimal('1000') * growth_factor      # Base diesel in liters
        
        # Add some random daily variation (±10%)
        variation = Decimal(str(random.uniform(0.9, 1.1)))
        electricity_kwh = base_electricity * variation
        diesel_liters = base_diesel * variation
        
        # Calculate costs (electricity at $0.15 per kWh, diesel at $2.00 per liter)
        electricity_cost = electricity_kwh * Decimal('0.15')
        diesel_cost = diesel_liters * Decimal('2.00')
        
        # Create the energy usage record
        EnergyUsage.objects.create(
            date=current_date,
            electricity_kwh=float(electricity_kwh),  # Convert to float as per model
            electricity_cost=electricity_cost,
            diesel_liters=float(diesel_liters),      # Convert to float as per model
            diesel_cost=diesel_cost,
            total_cost=electricity_cost + diesel_cost
        )
        
        current_date += timedelta(days=1)

def reverse_energy_usage_data(apps, schema_editor):
    EnergyUsage = apps.get_model('mining_operations', 'EnergyUsage')
    EnergyUsage.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('mining_operations', '0034_update_production_data'),
    ]

    operations = [
        migrations.RunPython(fix_energy_usage_data, reverse_energy_usage_data),
    ]
