import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useEnergyData } from '../../hooks/useEnergyData';
import { formatNumber } from '../../utils/formatters';
import { useDateFilterContext } from '../../contexts/DateFilterContext';

const CHART_COLORS = {
  electricity: '#8884d8',  // Lilac color
  diesel: '#82ca9d',      // Green color
  gradient1: '#8884d8',
  gradient2: '#82ca9d',
};

export const EnergyWidget: React.FC = () => {
  const theme = useTheme();
  const { data, isLoading, error } = useEnergyData();
  const { dateRange } = useDateFilterContext();

  const glassEffect = {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(40,40,40,0.9) 0%, rgba(20,20,20,0.8) 100%)'
      : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.1)' 
      : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,0.2)'
      : '0 8px 32px rgba(31,38,135,0.15)',
  };

  const metricCardStyle = {
    ...glassEffect,
    p: 2.5,
    height: '100%',
    display: 'relative',
    flexDirection: 'column',
    gap: 1,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: (props: { color?: string }) =>
        `linear-gradient(90deg, ${props.color || CHART_COLORS.electricity}, ${alpha(props.color || CHART_COLORS.electricity, 0.3)})`,
    }
  };

  const formatChartData = (data: any[]) => {
    const daysDifference = differenceInDays(dateRange.endDate, dateRange.startDate);
    
    if (daysDifference <= 31) {
      // For 31 days or less, show daily data
      return data.map(item => ({
        ...item,
        date: format(new Date(item.date), 'yyyy-MM-dd'),
        total_cost: Number(item.electricity_cost) + Number(item.diesel_cost),  // Ensure proper addition
      }));
    } else {
      // For longer periods, group by weeks
      const weeklyData = data.reduce((acc: any[], item) => {
        const itemDate = new Date(item.date);
        const weekStart = startOfWeek(itemDate);
        const weekEnd = endOfWeek(itemDate);
        
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        const existingWeek = acc.find(w => w.date === weekKey);

        if (existingWeek) {
          existingWeek.electricity_kwh += item.electricity_kwh;
          existingWeek.diesel_liters += item.diesel_liters;
          existingWeek.electricity_cost += Number(item.electricity_cost);
          existingWeek.diesel_cost += Number(item.diesel_cost);
          existingWeek.total_cost = existingWeek.electricity_cost + existingWeek.diesel_cost;  // Recalculate total
          existingWeek.count += 1;
        } else {
          acc.push({
            date: weekKey,
            dateRange: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
            electricity_kwh: item.electricity_kwh,
            diesel_liters: item.diesel_liters,
            electricity_cost: Number(item.electricity_cost),
            diesel_cost: Number(item.diesel_cost),
            total_cost: Number(item.electricity_cost) + Number(item.diesel_cost),
            count: 1
          });
        }
        return acc;
      }, []);

      // Calculate averages for each week
      return weeklyData.map(week => ({
        ...week,
        electricity_kwh: week.electricity_kwh / week.count,
        diesel_liters: week.diesel_liters / week.count,
        electricity_cost: week.electricity_cost / week.count,
        diesel_cost: week.diesel_cost / week.count,
        total_cost: week.total_cost / week.count
      }));
    }
  };

  const chartData = React.useMemo(() => {
    if (!data?.data) return [];
    
    // Filter data based on date range
    const filteredData = data.data.filter(item => {
      const itemDate = new Date(item.date);
      return isWithinInterval(itemDate, {
        start: dateRange.startDate,
        end: dateRange.endDate
      });
    });

    return formatChartData(filteredData);
  }, [data, dateRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const electricityData = payload.find((p: any) => p.dataKey === 'electricity_kwh');
    const dieselData = payload.find((p: any) => p.dataKey === 'diesel_liters');

    return (
      <Box
        sx={{
          ...glassEffect,
          p: 2,
          minWidth: 200,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
          {label}
        </Typography>
        
        {/* Electricity Data */}
        {electricityData && (
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Typography variant="body2" sx={{ color: CHART_COLORS.electricity, fontWeight: 500 }}>
              Electricity: {formatNumber(electricityData.value)} kWh
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cost: ${formatNumber(electricityData.payload.electricity_cost)}
            </Typography>
          </Stack>
        )}
        
        {/* Diesel Data */}
        {dieselData && (
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Typography variant="body2" sx={{ color: CHART_COLORS.diesel, fontWeight: 500 }}>
              Diesel: {formatNumber(dieselData.value)} L
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cost: ${formatNumber(dieselData.payload.diesel_cost)}
            </Typography>
          </Stack>
        )}

        {/* Total Cost */}
        <Box sx={{ pt: 1, mt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Total Cost: ${formatNumber(payload[0].payload.total_cost)}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ ...glassEffect, p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ ...glassEffect, p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: 'transparent',
            color: theme.palette.error.main,
            border: `1px solid ${theme.palette.error.main}`,
            '& .MuiAlert-icon': {
              color: theme.palette.error.main,
            }
          }}
        >
          Error loading energy data
        </Alert>
      </Paper>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Paper elevation={0} sx={{ ...glassEffect, p: 3 }}>
        <Alert 
          severity="info"
          sx={{ 
            backgroundColor: 'transparent',
            color: theme.palette.info.main,
            border: `1px solid ${theme.palette.info.main}`,
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
            }
          }}
        >
          No energy data available
        </Alert>
      </Paper>
    );
  }

  const { summary } = data;

  // Calculate daily averages for comparison using the formatted data
  const previousDay = chartData[chartData.length - 2] || chartData[chartData.length - 1];
  const currentDay = chartData[chartData.length - 1];

  // Calculate averages for the current date range
  const averages = chartData.reduce((acc, day) => {
    acc.electricity_kwh += day.electricity_kwh;
    acc.electricity_cost += day.electricity_cost;
    acc.diesel_liters += day.diesel_liters;
    acc.diesel_cost += day.diesel_cost;
    acc.total_cost += day.total_cost;
    return acc;
  }, {
    electricity_kwh: 0,
    electricity_cost: 0,
    diesel_liters: 0,
    diesel_cost: 0,
    total_cost: 0
  });

  const dataLength = chartData.length;
  const avgElectricityKwh = averages.electricity_kwh / dataLength;
  const avgElectricityCost = averages.electricity_cost / dataLength;
  const avgDieselLiters = averages.diesel_liters / dataLength;
  const avgDieselCost = averages.diesel_cost / dataLength;
  const avgTotalCost = averages.total_cost / dataLength;

  // Calculate percentage changes
  const electricityChange = previousDay && currentDay
    ? ((currentDay.electricity_kwh - previousDay.electricity_kwh) / previousDay.electricity_kwh) * 100
    : 0;
  const dieselChange = previousDay && currentDay
    ? ((currentDay.diesel_liters - previousDay.diesel_liters) / previousDay.diesel_liters) * 100
    : 0;

  return (
    <Paper elevation={0} sx={{ 
      ...glassEffect, 
      p: 3, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <BoltIcon sx={{ color: CHART_COLORS.electricity }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Energy Consumption
            </Typography>
          </Stack>
          <Tooltip title="Daily energy consumption metrics including electricity and diesel usage">
            <IconButton size="small">
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ ...metricCardStyle, color: CHART_COLORS.electricity }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltIcon sx={{ color: CHART_COLORS.electricity }} />
                <Typography variant="body2" color="text.secondary">
                  Electricity Usage
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, color: CHART_COLORS.electricity, fontWeight: 600 }}>
                {formatNumber(avgElectricityKwh)} kWh
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                {electricityChange >= 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="caption"
                  color={electricityChange >= 0 ? 'success.main' : 'error.main'}
                  fontWeight={500}
                >
                  {Math.abs(electricityChange).toFixed(1)}% vs yesterday
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Avg. Cost: ${formatNumber(avgElectricityCost)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ ...metricCardStyle, color: CHART_COLORS.diesel }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalGasStationIcon sx={{ color: CHART_COLORS.diesel }} />
                <Typography variant="body2" color="text.secondary">
                  Diesel Consumption
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, color: CHART_COLORS.diesel, fontWeight: 600 }}>
                {formatNumber(avgDieselLiters)} L
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                {dieselChange >= 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="caption"
                  color={dieselChange >= 0 ? 'success.main' : 'error.main'}
                  fontWeight={500}
                >
                  {Math.abs(dieselChange).toFixed(1)}% vs yesterday
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Avg. Cost: ${formatNumber(avgDieselCost)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ ...metricCardStyle, color: theme.palette.primary.main }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" color="text.secondary">
                  Total Energy Cost
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, color: theme.palette.primary.main, fontWeight: 600 }}>
                ${formatNumber(avgTotalCost)}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  Average for selected period
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Electricity: ${formatNumber(avgElectricityCost)} | Diesel: ${formatNumber(avgDieselCost)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          flex: 1,
          minHeight: 0,
          position: 'relative',
          width: '100%',
          overflow: 'hidden'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="electricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.electricity} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={CHART_COLORS.electricity} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="diesel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.diesel} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={CHART_COLORS.diesel} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey={differenceInDays(dateRange.endDate, dateRange.startDate) <= 31 ? 'date' : 'dateRange'}
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="electricity_kwh"
                name="Electricity"
                stroke={CHART_COLORS.electricity}
                fillOpacity={1}
                fill="url(#electricity)"
              />
              <Area
                type="monotone"
                dataKey="diesel_liters"
                name="Diesel"
                stroke={CHART_COLORS.diesel}
                fillOpacity={1}
                fill="url(#diesel)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};
