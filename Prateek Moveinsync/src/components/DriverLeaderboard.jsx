import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { useSorting, useFiltering, usePagination } from '../hooks/index';
import { useAppStore } from '../store/appStore';

/**
 * Driver Leaderboard Component
 * Sortable table of drivers with color-coded rows
 * Click to expand row showing recent 5 feedback entries
 * Filter by score range and search
 */

const DriverLeaderboard = ({ drivers = [], onDriverSelect }) => {
  const [expandedDriverId, setExpandedDriverId] = useState(null);
  const setSelectedDriver = useAppStore((state) => state.setSelectedDriver);
  const ratingFilter = useAppStore((state) => state.ratingFilter);
  const searchQuery = useAppStore((state) => state.searchQuery);

  // Filtering
  const { filtered: filteredDrivers } = useFiltering(
    drivers,
    (driver, filters) => {
      // Rating filter
      if (
        driver.averageScore < filters.minRating ||
        driver.averageScore > filters.maxRating
      ) {
        return false;
      }
      // Search filter
      if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        return (
          driver.name.toLowerCase().includes(lowerSearch) ||
          driver.email.toLowerCase().includes(lowerSearch)
        );
      }
      return true;
    }
  );

  // Sorting
  const { sortedItems, sort, handleSort } = useSorting(
    filteredDrivers,
    {
      key: 'averageScore',
      order: 'desc',
    }
  );

  // Pagination
  const { currentItems, currentPage, totalPages, goToPage, pageSize } =
    usePagination(sortedItems, 10);

  // Get row color based on score
  const getRowColor = (score) => {
    if (score >= 4.0) return 'bg-success/5 border-l-4 border-success';
    if (score >= 2.5) return 'bg-warning/5 border-l-4 border-warning';
    return 'bg-danger/5 border-l-4 border-danger';
  };

  // Get status badge
  const getStatusBadge = (driver) => {
    if (driver.isBelowThreshold) {
      return (
        <span className="inline-block px-2 py-1 bg-danger text-white text-xs font-semibold rounded">
          ⚠️ Alert
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 bg-success/20 text-success text-xs font-semibold rounded">
        Active
      </span>
    );
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    if (trend.direction === 'up') {
      return (
        <div className="flex items-center gap-1 text-success">
          <TrendingUp size={16} />
          <span className="font-semibold">{trend.value}</span>
        </div>
      );
    } else if (trend.direction === 'down') {
      return (
        <div className="flex items-center gap-1 text-danger">
          <TrendingDown size={16} />
          <span className="font-semibold">{trend.value}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-slate-500">
        <span>-</span>
      </div>
    );
  };

  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No drivers found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Table Header with Sort Controls */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 hover:text-slate-900 transition-colors"
                >
                  Driver Name
                  {sort.key === 'name' && (
                    sort.order === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('totalTrips')}
                  className="flex items-center gap-2 hover:text-slate-900 transition-colors"
                >
                  Trips
                  {sort.key === 'totalTrips' && (
                    sort.order === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('averageScore')}
                  className="flex items-center gap-2 hover:text-slate-900 transition-colors"
                >
                  Score
                  {sort.key === 'averageScore' && (
                    sort.order === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Trend (vs week)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((driver) => (
              <React.Fragment key={driver.id}>
                <tr
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${getRowColor(
                    driver.averageScore
                  )}`}
                  onClick={() => setExpandedDriverId(
                    expandedDriverId === driver.id ? null : driver.id
                  )}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {driver.name}
                      </p>
                      <p className="text-xs text-slate-500">{driver.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {driver.totalTrips.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-slate-900">
                      {driver.averageScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/5</span>
                  </td>
                  <td className="px-6 py-4">
                    {getTrendIcon(driver.trend)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(driver)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDriver(driver);
                        onDriverSelect?.(driver);
                      }}
                      className="text-primary hover:text-blue-700 font-semibold text-sm transition-colors"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>

                {/* Expandable Recent Feedback Row */}
                {expandedDriverId === driver.id && (
                  <tr className="bg-slate-50 border-b-2 border-primary/30">
                    <td colSpan="6" className="px-6 py-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">
                          Recent Feedback (Last 5)
                        </h4>
                        {driver.recentFeedback.length === 0 ? (
                          <p className="text-slate-500 text-sm">
                            No recent feedback
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {driver.recentFeedback.map((feedback) => (
                              <div
                                key={feedback.id}
                                className="bg-white p-3 rounded border border-slate-200"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                          feedback.sentiment === 'positive'
                                            ? 'bg-success/20 text-success'
                                            : feedback.sentiment ===
                                              'negative'
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
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                      {feedback.text}
                                    </p>
                                    {feedback.tags.length > 0 && (
                                      <div className="flex gap-1 mt-2 flex-wrap">
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
                                  <span className="text-xs text-slate-500 shrink-0">
                                    {new Date(
                                      feedback.date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages} ({filteredDrivers.length} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-500">
            No drivers match your current filters
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverLeaderboard;
