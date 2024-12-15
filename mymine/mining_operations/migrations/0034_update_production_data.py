from django.db import migrations
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal
import random

def update_production_data(apps, schema_editor):
    DailyProductionLog = apps.get_model('mining_operations', 'DailyProductionLog')
    
    # Clear existing data to avoid any conflicts
    DailyProductionLog.objects.all().delete()
    
    # Start from January 1, 2023
    start_date = date(2023, 1, 1)
    end_date = date(2024, 12, 15)  # Current date
    
    current_date = start_date
    while current_date <= end_date:
        # Create production log with realistic values
        # Base values that increase slightly over time to show growth
        days_since_start = (current_date - start_date).days
        growth_factor = 1 + (days_since_start * 0.0001)  # Small daily increase
        
        base_tonnage = 1000 * growth_factor
        base_gold = 2500 * growth_factor
        
        # Add some random variation around the base values
        DailyProductionLog.objects.create(
            date=current_date,
            total_tonnage_crushed=Decimal(str(random.uniform(base_tonnage * 0.95, base_tonnage * 1.05))),
            total_tonnage_hoisted=Decimal(str(random.uniform(base_tonnage * 0.90, base_tonnage * 1.00))),
            total_tonnage_milled=Decimal(str(random.uniform(base_tonnage * 0.92, base_tonnage * 1.02))),
            gold_recovery_rate=Decimal(str(random.uniform(85, 95))),
            operational_efficiency=Decimal(str(random.uniform(80, 98))),
            smelted_gold=Decimal(str(random.uniform(base_gold * 0.95, base_gold * 1.05))),
            gold_price=Decimal(str(random.uniform(55.00, 65.00))),  # Varying gold price
            gross_profit=Decimal(str(random.uniform(120000 * growth_factor, 150000 * growth_factor))),
            notes=f"Production data for {current_date}"
        )
        current_date += timedelta(days=1)

def remove_production_data(apps, schema_editor):
    DailyProductionLog = apps.get_model('mining_operations', 'DailyProductionLog')
    DailyProductionLog.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('mining_operations', '0033_seed_production_data'),
    ]

    operations = [
        migrations.RunPython(update_production_data, remove_production_data),
    ]
