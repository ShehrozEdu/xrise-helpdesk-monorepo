import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { analyticsApi } from '../services/analytics.api';
import { Clock, Ticket, BarChart3, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Analytics: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsApi.getStats(),
  });

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;
  if (isError || !data) return <Layout><ErrorState message="Failed to load analytics" onRetry={() => refetch()} /></Layout>;

  const pieData = {
    labels: data.byStatus.map((s) => s.label),
    datasets: [
      {
        data: data.byStatus.map((s) => s.value),
        backgroundColor: ['#ffab0033', '#5c6cfa33', '#00d4aa33'],
        borderColor: ['#ffab00', '#5c6cfa', '#00d4aa'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: data.byPriority.map((p) => p.label),
    datasets: [
      {
        label: 'Tickets',
        data: data.byPriority.map((p) => p.value),
        backgroundColor: '#5c6cfa33',
        borderColor: '#5c6cfa',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: data.trend.map((t) => t.date),
    datasets: [
      {
        label: 'Tickets Created',
        data: data.trend.map((t) => t.count),
        fill: true,
        backgroundColor: 'rgba(92, 108, 250, 0.1)',
        borderColor: '#5c6cfa',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          color: '#b0b0c0', 
          font: { family: 'Inter', size: 11 },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 25, 0.95)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: { 
        grid: { color: 'rgba(255,255,255,0.05)' }, 
        ticks: { color: '#808090', font: { size: 11 } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#808090', font: { size: 11 } } 
      },
    },
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #b0b0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'var(--font-size-3xl)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ color: 'var(--accent-primary)', display: 'flex' }}><BarChart3 size={32} /></div>
              Analytics Dashboard
            </h1>
            <p style={{ maxWidth: '600px' }}>Comprehensive insights into ticket lifecycle, response times, and team performance metrics.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(92, 108, 250, 0.1)', borderRadius: '12px', color: '#5c6cfa', display: 'flex' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Average Response Time</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{data.avgResponseTimeHours.toFixed(1)} hrs</div>
            </div>
          </div>
          <div className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(0, 212, 170, 0.1)', borderRadius: '12px', color: '#00d4aa', display: 'flex' }}>
              <Ticket size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Total Tickets</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                {data.byStatus.reduce((acc, curr) => acc + curr.value, 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="charts-main-grid">
          <div className="glass-card">
            <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} /> Ticket Trends (Last 7 Days)
            </h3>
            <div className="chart-container">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
          
          <div className="charts-sub-grid">
            <div className="glass-card">
              <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>By Status</h3>
              <div className="chart-container">
                <Pie data={pieData} options={{ ...chartOptions, scales: undefined }} />
              </div>
            </div>
            <div className="glass-card">
              <h3 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '16px' }}>By Priority</h3>
              <div className="chart-container">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
