# Generated by Django 5.1.4 on 2024-12-15 21:40

import django.core.validators
import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mining_operations', '0031_auto_20241215_0453'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalEnvironmentalMetric',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('date', models.DateField()),
                ('dust_level_pm10', models.FloatField(help_text='PM10 particulate matter (μg/m³)')),
                ('noise_level_db', models.FloatField(help_text='Average noise level in decibels')),
                ('water_usage_m3', models.FloatField(help_text='Water consumption in cubic meters')),
                ('rehabilitation_area_m2', models.FloatField(help_text='Area under rehabilitation in square meters')),
                ('waste_water_ph', models.FloatField(help_text='pH level of waste water')),
                ('carbon_emissions', models.DecimalField(decimal_places=2, help_text='Carbon emissions in metric tons', max_digits=10)),
                ('waste_generated', models.DecimalField(decimal_places=2, help_text='Waste generated in metric tons', max_digits=10)),
                ('additional_notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('updated_at', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Environmental Metric',
                'verbose_name_plural': 'historical Environmental Metrics',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalExplosivesInventory',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('date', models.DateField()),
                ('anfo_kg', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('emulsion_kg', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('detonators_count', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('boosters_count', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('total_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('updated_at', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Explosives Inventory',
                'verbose_name_plural': 'historical Explosives Inventories',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='HistoricalStockpileVolume',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('date', models.DateField()),
                ('ore_tons', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('waste_tons', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('grade_gpt', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('location', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(blank=True, editable=False)),
                ('updated_at', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField(db_index=True)),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical Stockpile Volume',
                'verbose_name_plural': 'historical Stockpile Volumes',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': ('history_date', 'history_id'),
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.DeleteModel(
            name='DailyExpense',
        ),
        migrations.RemoveField(
            model_name='historicaldailystockpile',
            name='history_user',
        ),
        migrations.RemoveField(
            model_name='historicaldailystockpile',
            name='site',
        ),
        migrations.RemoveField(
            model_name='historicalenvironmentalimpactlog',
            name='history_user',
        ),
        migrations.RemoveField(
            model_name='historicalenvironmentalimpactlog',
            name='site',
        ),
        migrations.AlterModelOptions(
            name='dailyproductionlog',
            options={'ordering': ['-date'], 'verbose_name': 'Daily Production Log', 'verbose_name_plural': 'Daily Production Logs'},
        ),
        migrations.AlterModelOptions(
            name='environmentalmetric',
            options={'ordering': ['-date'], 'verbose_name': 'Environmental Metric', 'verbose_name_plural': 'Environmental Metrics'},
        ),
        migrations.AlterModelOptions(
            name='explosivesinventory',
            options={'ordering': ['-date'], 'verbose_name': 'Explosives Inventory', 'verbose_name_plural': 'Explosives Inventories'},
        ),
        migrations.AlterModelOptions(
            name='historicaldailyproductionlog',
            options={'get_latest_by': ('history_date', 'history_id'), 'ordering': ('-history_date', '-history_id'), 'verbose_name': 'historical Daily Production Log', 'verbose_name_plural': 'historical Daily Production Logs'},
        ),
        migrations.AlterModelOptions(
            name='stockpilevolume',
            options={'ordering': ['-date'], 'verbose_name': 'Stockpile Volume', 'verbose_name_plural': 'Stockpile Volumes'},
        ),
        migrations.RemoveField(
            model_name='dailyproductionlog',
            name='id',
        ),
        migrations.RemoveField(
            model_name='historicaldailyproductionlog',
            name='id',
        ),
        migrations.RemoveField(
            model_name='historicaldailyproductionlog',
            name='site',
        ),
        migrations.AddField(
            model_name='dailyproductionlog',
            name='total_tonnage_milled',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Total tonnage of ore milled', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AddField(
            model_name='historicaldailyproductionlog',
            name='created_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='historicaldailyproductionlog',
            name='modified_at',
            field=models.DateTimeField(blank=True, editable=False, null=True),
        ),
        migrations.AddField(
            model_name='historicaldailyproductionlog',
            name='total_tonnage_milled',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Total tonnage of ore milled', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='certification',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='certification',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='created_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='date',
            field=models.DateField(help_text='Date of production log', primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='gold_price',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Daily gold price in USD per gram', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='gold_recovery_rate',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Percentage of gold recovered', max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='gross_profit',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Gross profit in USD (smelted_gold * gold_price)', max_digits=15, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='modified_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='operational_efficiency',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Percentage of operational efficiency', max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='smelted_gold',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Gold smelted in grams', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='dailyproductionlog',
            name='total_tonnage_crushed',
            field=models.DecimalField(decimal_places=2, help_text='Total tonnage of ore crushed', max_digits=10),
        ),
        migrations.AlterField(
            model_name='employee',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='employee',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='historicalcertification',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalcertification',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='date',
            field=models.DateField(db_index=True, help_text='Date of production log'),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='gold_price',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Daily gold price in USD per gram', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='gold_recovery_rate',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Percentage of gold recovered', max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='gross_profit',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Gross profit in USD (smelted_gold * gold_price)', max_digits=15, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='history_change_reason',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='operational_efficiency',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Percentage of operational efficiency', max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='smelted_gold',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Gold smelted in grams', max_digits=10, validators=[django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='historicaldailyproductionlog',
            name='total_tonnage_crushed',
            field=models.DecimalField(decimal_places=2, help_text='Total tonnage of ore crushed', max_digits=10),
        ),
        migrations.AlterField(
            model_name='historicalemployee',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalemployee',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicallabormetric',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicallabormetric',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalsafetyincident',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalsafetyincident',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalshift',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalshift',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalskill',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalskill',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalzone',
            name='created_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='historicalzone',
            name='updated_at',
            field=models.DateTimeField(blank=True, editable=False),
        ),
        migrations.AlterField(
            model_name='labormetric',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='labormetric',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='safetyincident',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='safetyincident',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='shift',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='shift',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='skill',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='skill',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.DeleteModel(
            name='HistoricalDailyExplosivesUsed',
        ),
        migrations.DeleteModel(
            name='HistoricalDailyStockpile',
        ),
        migrations.DeleteModel(
            name='HistoricalEnvironmentalImpactLog',
        ),
    ]