import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { LayoutDashboard, Users, Clock, BookOpen, AlertCircle } from 'lucide-react';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
);

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000');

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/analytics`);
        if (!res.ok) throw new Error('Failed to fetch analytics data');
        const result = await res.json();
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="analytics-loading"><div className="spinner" />Loading Analytics...</div>;
  if (error) return <div className="analytics-error"><AlertCircle /> Error: {error}</div>;
  if (!data || data.total_queries === 0) return <div className="analytics-empty">No analytics data available yet. Start asking questions!</div>;

  const subjectData = {
    labels: data.subject_distribution.map(d => d.subject),
    datasets: [{
      label: 'Queries per Subject',
      data: data.subject_distribution.map(d => d.count),
      backgroundColor: [
        '#DE7356', '#8B3A1A', '#A09A90', '#C5B4A2', '#EADBC8', '#B2C2D1'
      ],
      borderWidth: 1,
    }]
  };

  const userData = {
    labels: data.user_stats.map(u => u.name),
    datasets: [{
      label: 'Queries per User',
      data: data.user_stats.map(u => u.count),
      backgroundColor: 'rgba(222, 115, 86, 0.6)',
      borderColor: '#DE7356',
      borderWidth: 1,
    }]
  };

  return (
    <div className="analytics-container fade-in">
      <div className="analytics-header">
        <h1><LayoutDashboard /> Learning Analytics</h1>
        <p>Insights into your VTU preparation progress</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><BookOpen /></div>
          <div className="stat-info">
            <span className="stat-label">Total Queries</span>
            <span className="stat-value">{data.total_queries}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Clock /></div>
          <div className="stat-info">
            <span className="stat-label">Avg Response Time</span>
            <span className="stat-value">{data.average_time}s</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div className="stat-info">
            <span className="stat-label">Active Learners</span>
            <span className="stat-value">{data.user_stats.length}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Subject Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={subjectData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>User Activity</h3>
          <div className="chart-wrapper">
            <Bar data={userData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
