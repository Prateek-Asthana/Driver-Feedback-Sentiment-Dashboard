import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useDriver, useDriverTrend, useFeedback } from '../services/api';
import { usePagination } from '../hooks/index';
import { useAppStore } from '../store/appStore';

/**
 * Driver Detail Page Component
 * Shows comprehensive analytics for individual driver
 * - Sentiment trend chart (30 days)
 * - Tag breakdown bar chart
 * - Full feedback history with pagination
 * - Alert badge if driver flagged
 */

const DriverDetailPage = ({ driverId, onClose }) => {
  const { data: driver, isLoading: driverLoading } = useDriver(driverId);
  const { data: trendData, isLoading: trendLoading } = useDriverTrend(driverId);
  const { data: feedbacks, isLoading: feedbackLoading } = useFeedback({
    driverId,
  });
  const setSelectedDriver = useAppStore((state) => state.setSelectedDriver);

  // Pagination for feedback
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(
    feedbacks || [],
    10
  );

  // Calculate tag statistics
  const tagStats = React.useMemo(() => {
    const stats = {};
    (feedbacks || []).forEach((feedback) => {
      feedback.tags.forEach((tag) => {
        stats[tag] = (stats[tag] || 0) + 1;
      });
    });
    return Object.entries(stats)
      .map(([tag, count]) => ({ name: tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags
  }, [feedbacks]);

  // Sentiment trend data
  const sentimentTrendData = React.useMemo(() => {
    return (trendData || []).map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: item.score,
      positive: item.positive,
      neutral: item.neutral,
      negative: item.negative,
    }));
  }, [trendData]);

  if (driverLoading || trendLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <AlertCircle className="mx-auto mb-2 text-danger" size={32} />
        <p className="text-slate-500">Driver not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                onClose?.();
                setSelectedDriver(null);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-slate-900">
              {driver.name}
            </h1>
          </div>
          <p className="text-slate-600">{driver.email}</p>
        </div>

        {/* Alert Badge */}
        {driver.isBelowThreshold && (
          <div className="bg-danger/10 border border-danger rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="text-danger" size={20} />
              <p className="font-semibold text-danger">Below Alert Threshold</p>
            </div>
            <p className="text-sm text-danger/80">
              Current score: {driver.averageScore}/5 (Threshold: {driver.alertThreshold}/5)
            </p>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 font-medium">Overall Score</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {driver.averageScore.toFixed(1)}
            <span className="text-lg">/5</span>
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 font-medium">Total Trips</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {driver.totalTrips.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 font-medium">Weekly Trend</p>
          <div className="mt-1 flex items-center gap-1">
            {driver.trend.direction === 'up' ? (
              <TrendingUp className="text-success" size={24} />
            ) : driver.trend.direction === 'down' ? (
              <TrendingDown className="text-danger" size={24} />
            ) : (
              <span className="text-slate-400">-</span>
            )}
            <p
              className={`text-2xl font-bold ${
                driver.trend.direction === 'up'
                  ? 'text-success'
                  : driver.trend.direction === 'down'
                  ? 'text-danger'
                  : 'text-slate-400'
              }`}
            >
              {driver.trend.value}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600 font-medium">Status</p>
          <p
            className={`text-lg font-bold mt-1 ${
              driver.isBelowThreshold
                ? 'text-danger'
                : 'text-success'
            }`}
          >
            {driver.isBelowThreshold ? '⚠️ Flagged' : '✓ Active'}
          </p>
        </div>
      </div>

      {/* Sentiment Trend Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Sentiment Trend (30 Days)
        </h2>
        {sentimentTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[2, 5]} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#0066CC"
                dot={{ fill: '#0066CC' }}
                activeDot={{ r: 6 }}
                strokeWidth={2}
                name="Avg Score"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-slate-500 py-8">No trend data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Common Feedback Tags
          </h2>
          {tagStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tagStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0066CC" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-8">No tag data available</p>
          )}
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Sentiment Distribution
          </h2>
          {feedbacks && feedbacks.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(
                feedbacks.reduce((acc, f) => {
                  acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
                  return acc;
                }, {})
              ).map(([sentiment, count]) => {
                const percentage = (
                  (count / feedbacks.length) *
                  100
                ).toFixed(1);
                const bgColor =
                  sentiment === 'positive'
                    ? 'bg-success'
                    : sentiment === 'negative'
                    ? 'bg-danger'
                    : 'bg-warning';
                return (
                  <div key={sentiment}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-slate-700 capitalize">
                        {sentiment}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {count} ({percentage}%)
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${bgColor} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No feedback data</p>
          )}
        </div>
      </div>

      {/* Full Feedback History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Full Feedback History
        </h2>

        {feedbackLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        ) : (feedbacks || []).length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No feedback available for this driver
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {currentItems.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gaps mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          feedback.sentiment === 'positive'
                            ? 'bg-success/20 text-success'
                            : feedback.sentiment === 'negative'
                            ? 'bg-danger/20 text-danger'
                            : 'bg-warning/20 text-warning'
                        }`}
                      >
                        {feedback.sentiment.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        ⭐ {feedback.score}/5
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {feedback.text}
                  </p>
                  {feedback.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {feedback.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-sm"
                >
                  Previous
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDetailPage;
