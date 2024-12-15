from rest_framework import serializers
from .models import (
    ExplosivesInventory, StockpileVolume,
    LaborMetric, EnvironmentalMetric, DailyProductionLog,
    SmeltedGold, MiningSite
)

class ExplosivesInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExplosivesInventory
        fields = '__all__'

class StockpileVolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockpileVolume
        fields = '__all__'

class LaborMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaborMetric
        fields = ['date', 'shift', 'workers_present', 'hours_worked', 
                 'overtime_hours', 'productivity_index', 'safety_incidents']

class EnvironmentalMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalMetric
        fields = '__all__'

class DailyProductionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyProductionLog
        fields = '__all__'
        read_only_fields = ('created_at', 'modified_at', 'gross_profit')

    def validate(self, data):
        """
        Custom validation for DailyProductionLog
        """
        if 'total_tonnage_milled' in data and 'total_tonnage_crushed' in data:
            if data['total_tonnage_milled'] > data['total_tonnage_crushed']:
                raise serializers.ValidationError({
                    'total_tonnage_milled': 'Milled tonnage cannot exceed crushed tonnage.'
                })

        if 'gold_recovery_rate' in data:
            if data['gold_recovery_rate'] > 100 or data['gold_recovery_rate'] < 0:
                raise serializers.ValidationError({
                    'gold_recovery_rate': 'Gold recovery rate must be between 0 and 100.'
                })

        if 'operational_efficiency' in data:
            if data['operational_efficiency'] > 100 or data['operational_efficiency'] < 0:
                raise serializers.ValidationError({
                    'operational_efficiency': 'Operational efficiency must be between 0 and 100.'
                })

        return data

class SmeltedGoldSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)

    class Meta:
        model = SmeltedGold
        fields = '__all__'

    def validate(self, data):
        """
        Custom validation for SmeltedGold
        """
        if 'purity_percentage' in data:
            if data['purity_percentage'] > 100 or data['purity_percentage'] < 0:
                raise serializers.ValidationError({
                    'purity_percentage': 'Purity percentage must be between 0 and 100.'
                })

        if 'total_weight' in data and data['total_weight'] < 0:
            raise serializers.ValidationError({
                'total_weight': 'Total weight cannot be negative.'
            })

        return data
