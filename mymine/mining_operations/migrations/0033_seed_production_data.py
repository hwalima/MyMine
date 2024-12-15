from django.db import migrations
from django.utils import timezone
from datetime import date, timedelta
from decimal import Decimal
import random

def create_production_data(apps, schema_editor):
    DailyProductionLog = apps.get_model('mining_operations', 'DailyProductionLog')
    
    # Start from 30 days ago
    start_date = date(2024, 11, 15)
    
    # Create 30 days of production data
    for i in range(30):
        current_date = start_date + timedelta(days=i)
        
        # Create production log with realistic values
        DailyProductionLog.objects.create(
            date=current_date,
            total_tonnage_crushed=Decimal(str(random.uniform(800, 1200))),
            total_tonnage_hoisted=Decimal(str(random.uniform(750, 1150))),
            total_tonnage_milled=Decimal(str(random.uniform(780, 1180))),
            gold_recovery_rate=Decimal(str(random.uniform(85, 95))),
            operational_efficiency=Decimal(str(random.uniform(80, 98))),
            smelted_gold=Decimal(str(random.uniform(2000, 3000))),
            gold_price=Decimal('60.00'),
            gross_profit=Decimal(str(random.uniform(100000, 150000))),
            notes=f"Production data for {current_date}"
        )

def remove_production_data(apps, schema_editor):
    DailyProductionLog = apps.get_model('mining_operations', 'DailyProductionLog')
    DailyProductionLog.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('mining_operations', '0032_historicalenvironmentalmetric_and_more'),
    ]

    operations = [
        migrations.RunPython(create_production_data, remove_production_data),
    ]
