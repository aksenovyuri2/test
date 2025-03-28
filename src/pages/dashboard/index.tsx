import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import MetricCard from '@/components/metrics/MetricCard';
import FilterPanel from '@/components/dashboard/FilterPanel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Пример данных для графика
  const chartData = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [
      {
        label: 'DAU',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика метрик'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Дашборд метрик</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Line options={chartOptions} data={chartData} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="DAU"
                value="3,000"
                description="Daily Active Users"
                trend={15}
                period="месяц"
              />
              <MetricCard
                title="LTV"
                value="$45"
                description="Life Time Value"
                trend={8}
                period="месяц"
              />
              <MetricCard
                title="CAC"
                value="$32"
                description="Customer Acquisition Cost"
                trend={-5}
                period="месяц"
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <FilterPanel
              selectedMetrics={selectedMetrics}
              setSelectedMetrics={setSelectedMetrics}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 