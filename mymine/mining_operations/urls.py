from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    DailyProductionLogViewSet,
    SmeltedGoldViewSet,
)

router = DefaultRouter()
router.register(r'production-logs', DailyProductionLogViewSet)
router.register(r'smelted-gold', SmeltedGoldViewSet)

urlpatterns = [
    # Add mining operations related URLs here
    path('dashboard-data/', views.dashboard_data_dev, name='dashboard_data'),
    path('energy-usage/', views.energy_usage, name='energy_usage'),
    path('chemicals-usage/', views.chemicals_usage, name='chemicals_usage'),
    path('gold-production/', views.gold_production, name='gold_production'),
    path('equipment-maintenance/', views.equipment_maintenance, name='equipment_maintenance'),
] + router.urls
