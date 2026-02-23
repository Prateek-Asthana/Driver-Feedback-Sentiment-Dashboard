import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader } from 'lucide-react';

const defaultData = [
  { day: 'Mon', positive: 78, neutral: 15, negative: 7 },
  { day: 'Tue', positive: 82, neutral: 12, negative: 6 },
  { day: 'Wed', positive: 75, neutral: 18, negative: 7 },
  { day: 'Thu', positive: 80, neutral: 14, negative: 6 },
  { day: 'Fri', positive: 85, neutral: 10, negative: 5 },
  { day: 'Sat', positive: 79, neutral: 16, negative: 5 },
  { day: 'Sun', positive: 77, neutral: 17, negative: 6 },
];

export default function SentimentChart({ data = defaultData, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-darker mb-6">Sentiment Trend Analysis</h3>
        <div className="flex items-center justify-center h-80">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-darker mb-6">Sentiment Trend Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || defaultData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="day" stroke="#64748B" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar dataKey="positive" stackId="a" fill="#10B981" name="Positive" radius={[8, 8, 0, 0]} />
          <Bar dataKey="neutral" stackId="a" fill="#F59E0B" name="Neutral" radius={[8, 8, 0, 0]} />
          <Bar dataKey="negative" stackId="a" fill="#EF4444" name="Negative" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
