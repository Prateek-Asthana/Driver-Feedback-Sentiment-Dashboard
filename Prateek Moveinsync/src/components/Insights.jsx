import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, TrendingDown } from 'lucide-react';

const insights = [
  {
    id: 1,
    type: 'alert',
    title: 'Low Rating Alert',
    message: 'Driver "Vikram Singh" has received 3 negative feedbacks in the last 24 hours',
    time: '2 hours ago',
    icon: AlertCircle,
  },
  {
    id: 2,
    type: 'success',
    title: 'Excellent Performance',
    message: 'Driver "Rajesh Kumar" achieved 5 consecutive positive ratings',
    time: '5 hours ago',
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'info',
    title: 'Feedback Surge',
    message: '156 new feedback entries recorded today (higher than usual)',
    time: '8 hours ago',
    icon: Info,
  },
  {
    id: 4,
    type: 'warning',
    title: 'Declining Trend',
    message: 'Positive sentiment decreased by 5% compared to last week',
    time: '1 day ago',
    icon: TrendingDown,
  },
];

const getAlertColor = (type) => {
  switch (type) {
    case 'alert':
      return 'border-l-danger bg-red-50';
    case 'success':
      return 'border-l-success bg-green-50';
    case 'warning':
      return 'border-l-warning bg-yellow-50';
    case 'info':
      return 'border-l-primary bg-blue-50';
    default:
      return 'border-l-slate-300 bg-slate-50';
  }
};

const getIconColor = (type) => {
  switch (type) {
    case 'alert':
      return 'text-danger';
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-primary';
    default:
      return 'text-slate-500';
  }
};

export default function Insights() {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const handleDismiss = (id) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const visibleInsights = insights.filter((i) => !dismissedAlerts.includes(i.id));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-darker mb-6">Real-time Insights & Alerts</h3>
      <div className="space-y-3">
        {visibleInsights.length > 0 ? (
          visibleInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className={`border-l-4 rounded-lg p-4 flex items-start justify-between ${getAlertColor(
                  insight.type
                )}`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon size={20} className={`flex-shrink-0 mt-0.5 ${getIconColor(insight.type)}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-darker text-sm">{insight.title}</h4>
                    <p className="text-slate-600 text-xs mt-1">{insight.message}</p>
                    <p className="text-slate-500 text-xs mt-2">{insight.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(insight.id)}
                  className="text-slate-400 hover:text-slate-600 transition ml-2 flex-shrink-0"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 text-sm">No new alerts. All systems operating normally! ✓</p>
          </div>
        )}
      </div>
    </div>
  );
}
