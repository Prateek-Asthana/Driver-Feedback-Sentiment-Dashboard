import React from 'react';
import { TrendingUp, Loader } from 'lucide-react';

export default function MetricsCard({ title, value, change, color, icon, isLoading = false }) {
  const isPositive = !change.startsWith('-');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-slate-100 p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl sm:text-4xl font-bold text-darker mt-3">{value}</h3>
        </div>
        <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <TrendingUp
          size={16}
          className={isPositive ? 'text-success' : 'text-danger'}
          strokeWidth={2.5}
        />
        <span className={`text-sm font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
          {change}
        </span>
        <span className="text-slate-500 text-xs">vs last period</span>
      </div>
    </div>
  );
}
