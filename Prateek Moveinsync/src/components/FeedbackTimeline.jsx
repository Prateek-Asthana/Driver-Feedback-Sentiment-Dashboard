import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Loader } from 'lucide-react';
import { usePagination } from '../hooks/index';

/**
 * Feedback Timeline Component
 * Chronological feed of feedback submissions (most recent first)
 * Infinite scroll or paginated view
 * Filterable by entity type, sentiment, date range, driver
 */

const FeedbackTimeline = ({
  feedbacks = [],
  loading = false,
  error = null,
  onFeedbackClick,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    entity: null, // 'driver', 'trip', 'app', 'marshal'
    sentiment: null, // 'positive', 'neutral', 'negative'
  });

  // Apply filters
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filters.entity && feedback.entity !== filters.entity) return false;
    if (filters.sentiment && feedback.sentiment !== filters.sentiment)
      return false;
    return true;
  });

  // Pagination
  const { currentItems, currentPage, totalPages, goToPage, pageSize } =
    usePagination(filteredFeedbacks, 8);

  // Entity types in feedback
  const entityTypes = [...new Set(feedbacks.map((f) => f.entity))];
  const sentiments = ['positive', 'neutral', 'negative'];

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-success/10 border-success/20 text-success',
      neutral: 'bg-warning/10 border-warning/20 text-warning',
      negative: 'bg-danger/10 border-danger/20 text-danger',
    };
    return colors[sentiment] || colors.neutral;
  };

  // Get entity badge
  const getEntityBadge = (entity) => {
    const badges = {
      driver: 'Driver',
      trip: 'Trip',
      app: 'App',
      marshal: 'Marshal',
    };
    return badges[entity] || entity;
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <AlertCircle className="mx-auto mb-2 text-danger" size={32} />
        <h3 className="font-semibold text-slate-700 mb-1">Error Loading Feedback</h3>
        <p className="text-slate-600 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Feedback
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-primary hover:text-blue-700 font-medium transition-colors"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Entity Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Entity Type
            </label>
            <select
              value={filters.entity || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  entity: e.target.value || null,
                }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">All Types</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {getEntityBadge(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sentiment
            </label>
            <select
              value={filters.sentiment || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sentiment: e.target.value || null,
                }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">All Sentiments</option>
              {sentiments.map((sentiment) => (
                <option key={sentiment} value={sentiment}>
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({ entity: null, sentiment: null })
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Empty State */}
      {!loading && currentItems.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500">
            {feedbacks.length === 0
              ? 'No feedback available yet'
              : 'No feedback matches your filters'}
          </p>
        </div>
      )}

      {/* Feedback Items */}
      {!loading && currentItems.length > 0 && (
        <div className="space-y-3">
          {currentItems.map((feedback) => (
            <div
              key={feedback.id}
              onClick={() => onFeedbackClick?.(feedback)}
              className={`
                bg-white border border-slate-200 rounded-lg p-4 transition-all
                hover:shadow-md hover:border-primary/50 cursor-pointer
                ${getSentimentColor(feedback.sentiment)}
              `}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {getEntityBadge(feedback.entity)}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full border ${getSentimentColor(
                        feedback.sentiment
                      )}`}
                    >
                      {feedback.sentiment.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold bg-accent/20 text-accent px-2 py-1 rounded-full">
                      ⭐ {feedback.score}/5
                    </span>
                  </div>

                  {/* Driver Info */}
                  <p className="font-semibold text-slate-900 mb-1">
                    {feedback.driverName}
                  </p>

                  {/* Feedback Text */}
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {feedback.text}
                  </p>

                  {/* Tags */}
                  {feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {feedback.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {feedback.tags.length > 3 && (
                        <span className="text-xs text-slate-500 px-2 py-1">
                          +{feedback.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(feedback.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages} (
            {filteredFeedbacks.length} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
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
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTimeline;
