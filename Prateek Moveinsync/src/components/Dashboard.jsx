import React, { useState } from 'react';
import { Calendar, Filter, Download, TrendingUp, Users, MessageSquare, Award, Bell } from 'lucide-react';
import MetricsCard from './MetricsCard';
import SentimentChart from './SentimentChart';
import FeedbackTimeline from './FeedbackTimeline';
import DriverLeaderboard from './DriverLeaderboard';
import Insights from './Insights';
import {
  useDrivers,
  useSentimentSummary,
  useWeeklySentimentTrend,
  useFeedback,
  useAlerts,
} from '../services/api';
import { useAppStore } from '../store/appStore';

/**
 * Enhanced Dashboard Component
 * Integrates all analytics views with React Query for caching and real-time updates
 */

export default function Dashboard({ onNavigate }) {
  const [dateRange, setDateRange] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAlerts, setShowAlerts] = useState(false);

  // Store setters
  const setSelectedDriver = useAppStore((state) => state.setSelectedDriver);

  // Data queries
  const { data: drivers = [], isLoading: driversLoading } = useDrivers();
  const { data: sentimentSummary, isLoading: sentimentLoading } =
    useSentimentSummary(dateRange);
  const { data: trendData, isLoading: trendLoading } = useWeeklySentimentTrend();
  const { data: feedbacks = [], isLoading: feedbacksLoading } = useFeedback();
  const { data: alerts = [] } = useAlerts();

  const categories = [
    { id: 'all', name: 'All', count: feedbacks.length },
    { id: 'driver', name: 'Driver', count: feedbacks.filter(f => f.entity === 'driver').length },
    { id: 'trip', name: 'Trip', count: feedbacks.filter(f => f.entity === 'trip').length },
    { id: 'app', name: 'App', count: feedbacks.filter(f => f.entity === 'app').length },
    { id: 'marshal', name: 'Marshal', count: feedbacks.filter(f => f.entity === 'marshal').length },
  ];

  // Calculate sentiment stats
  const sentimentStats = sentimentSummary || {
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0,
  };

  const positivePercentage =
    sentimentStats.total > 0
      ? ((sentimentStats.positive / sentimentStats.total) * 100).toFixed(1)
      : 0;
  const neutralPercentage =
    sentimentStats.total > 0
      ? ((sentimentStats.neutral / sentimentStats.total) * 100).toFixed(1)
      : 0;
  const negativePercentage =
    sentimentStats.total > 0
      ? ((sentimentStats.negative / sentimentStats.total) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-darker">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Driver Feedback & Sentiment Analytics
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-lighter transition border border-slate-200 font-medium text-sm shadow-sm relative"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 bg-danger text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
            <span>Alerts</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-lighter transition border border-slate-200 font-medium text-sm shadow-sm">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 flex-wrap">
        {['today', 'week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg transition duration-200 font-medium text-sm ${
              dateRange === range
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-lighter'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts Section */}
      {showAlerts && alerts.length > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
          <h3 className="font-semibold text-danger mb-3">
            Active Alerts ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3 rounded border border-danger/20 cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  const driver = drivers.find(d => d.id === alert.driverId);
                  if (driver) {
                    setSelectedDriver(driver);
                    onNavigate?.('driver-details');
                  }
                }}
              >
                <p className="font-semibold text-slate-900">{alert.title}</p>
                <p className="text-sm text-slate-600">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Feedbacks"
          value={sentimentStats.total.toLocaleString()}
          change="+12.5%"
          color="bg-blue-500"
          icon="📊"
          isLoading={sentimentLoading}
        />
        <MetricsCard
          title="Positive Sentiment"
          value={`${positivePercentage}%`}
          change="+8.2%"
          color="bg-success"
          icon="😊"
          isLoading={sentimentLoading}
        />
        <MetricsCard
          title="Active Drivers"
          value={drivers.length.toString()}
          change="+2.1%"
          color="bg-primary"
          icon="👥"
          isLoading={driversLoading}
        />
        <MetricsCard
          title="Avg Rating"
          value={
            drivers.length > 0
              ? (
                  drivers.reduce((sum, d) => sum + d.averageScore, 0) /
                  drivers.length
                ).toFixed(1)
              : '0'
          }
          change="+0.3"
          color="bg-accent"
          icon="⭐"
          isLoading={driversLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Trend Chart */}
        <div className="lg:col-span-2">
          <SentimentChart data={trendData} isLoading={trendLoading} />
        </div>

        {/* Sentiment Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-darker mb-6">Sentiment Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-slate-700 font-medium">Positive</span>
              </div>
              <span className="font-bold text-darker text-lg">
                {sentimentStats.positive}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-slate-700 font-medium">Neutral</span>
              </div>
              <span className="font-bold text-darker text-lg">
                {sentimentStats.neutral}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-danger rounded-full"></div>
                <span className="text-slate-700 font-medium">Negative</span>
              </div>
              <span className="font-bold text-darker text-lg">
                {sentimentStats.negative}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Insights */}
      <Insights />

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-darker mb-4">Feedback by Entity</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition duration-200 font-medium text-sm ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-lighter text-slate-700 border border-slate-200 hover:bg-white'
              }`}
            >
              {cat.name} <span className="ml-1 font-semibold">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Driver Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-darker">Driver Leaderboard</h2>
          <p className="text-slate-600 text-sm mt-1">
            Top performers based on feedback sentiment
          </p>
        </div>
        <DriverLeaderboard
          drivers={drivers}
          onDriverSelect={(driver) => {
            setSelectedDriver(driver);
            onNavigate?.('driver-details');
          }}
        />
      </div>

      {/* Feedback Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <FeedbackTimeline
          feedbacks={feedbacks}
          loading={feedbacksLoading}
        />
      </div>
    </div>
  );
}
