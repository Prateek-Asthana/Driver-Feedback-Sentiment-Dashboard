import { useState } from 'react';
import { Star, TrendingUp, MessageSquare, Calendar, Mail, Phone, Award, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DriverPortalLeaderboard from './DriverPortalLeaderboard';

export default function DriverPortalDashboard({ driver }) {
  // Mock feedback data for this specific driver
  const driverRecentFeedback = [
    { id: 1, date: '2024-02-20', rating: 5, category: 'Service Quality', sentiment: 'positive', comment: 'Excellent service, very professional driver!' },
    { id: 2, date: '2024-02-18', rating: 5, category: 'Punctuality', sentiment: 'positive', comment: 'On time, safe driving' },
    { id: 3, date: '2024-02-15', rating: 4, category: 'Behavior', sentiment: 'positive', comment: 'Great behavior, courteous' },
    { id: 4, date: '2024-02-12', rating: 5, category: 'Safety', sentiment: 'positive', comment: 'Very safe driver' },
    { id: 5, date: '2024-02-10', rating: 4, category: 'Service Quality', sentiment: 'positive', comment: 'Good service overall' },
  ];

  // Sentiment breakdown
  const sentimentData = [
    { name: 'Positive', value: 138, color: '#10b981' },
    { name: 'Neutral', value: 5, color: '#f59e0b' },
    { name: 'Negative', value: 2, color: '#ef4444' },
  ];

  // Category-wise ratings
  const categoryData = [
    { category: 'Service Quality', rating: 4.8, feedbacks: 145 },
    { category: 'Punctuality', rating: 4.7, feedbacks: 132 },
    { category: 'Safety', rating: 4.9, feedbacks: 128 },
    { category: 'Behavior', rating: 4.6, feedbacks: 119 },
  ];

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Jan', rating: 4.5, feedbacks: 28 },
    { month: 'Feb', rating: 4.6, feedbacks: 32 },
    { month: 'Mar', rating: 4.7, feedbacks: 35 },
    { month: 'Apr', rating: 4.65, feedbacks: 30 },
    { month: 'May', rating: 4.8, feedbacks: 42 },
    { month: 'Jun', rating: 4.75, feedbacks: 38 },
  ];

  const getPositiveFeedback = (sentiment) => {
    const total = driver?.totalFeedbacks || 145;
    return Math.round((sentiment.value / total) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Driver Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-darker mb-6">My Profile Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Full Name</p>
              <p className="text-lg font-bold text-darker">{driver?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Driver ID</p>
              <p className="text-lg font-bold text-primary font-mono">{driver?.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Email</p>
              <p className="text-base text-darker flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                {driver?.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Phone</p>
              <p className="text-base text-darker flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                {driver?.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Joined</p>
              <p className="text-base text-darker flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {new Date(driver?.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Your Overall Rating</p>
          <div className="flex items-baseline gap-2 my-4">
            <span className="text-5xl font-bold">{driver?.rating}</span>
            <span className="text-2xl">/5.0</span>
          </div>
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={i < Math.floor(driver?.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-blue-200'}
              />
            ))}
          </div>
          <p className="text-blue-100 text-sm">Based on {driver?.totalFeedbacks} feedback(s)</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Feedbacks</p>
            <MessageSquare size={24} className="text-primary opacity-30" />
          </div>
          <h4 className="text-3xl font-bold text-darker">{driver?.totalFeedbacks}</h4>
          <p className="text-xs text-slate-500 mt-2">Responses collected</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-semibold uppercase">Positive Rate</p>
            <Award size={24} className="text-success opacity-30" />
          </div>
          <h4 className="text-3xl font-bold text-darker">{getPositiveFeedback(sentimentData[0])}%</h4>
          <p className="text-xs text-slate-500 mt-2">Positive feedbacks</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-semibold uppercase">Neutral Rate</p>
            <Target size={24} className="text-warning opacity-30" />
          </div>
          <h4 className="text-3xl font-bold text-darker">{getPositiveFeedback(sentimentData[1])}%</h4>
          <p className="text-xs text-slate-500 mt-2">Neutral feedbacks</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-semibold uppercase">Improvement</p>
            <TrendingUp size={24} className="text-primary opacity-30" />
          </div>
          <h4 className="text-3xl font-bold text-darker">+12%</h4>
          <p className="text-xs text-slate-500 mt-2">vs last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-darker mb-6">Rating Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis domain={[4, 5]} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#0066cc"
                strokeWidth={3}
                dot={{ fill: '#0066cc', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-darker mb-6">Feedback Sentiment Distribution</h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width="40%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <p className="text-sm font-semibold text-darker">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.value} feedbacks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category-wise Performance */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-darker mb-6">Performance by Category</h3>
        <div className="space-y-4">
          {categoryData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32">
                <p className="text-sm font-semibold text-darker">{item.category}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 bg-lighter rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(item.rating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-darker w-12 text-right">{item.rating}/5</span>
                </div>
              </div>
              <div className="text-right w-20">
                <p className="text-xs text-slate-500">{item.feedbacks} feedback(s)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-darker mb-6">Recent Feedback</h3>
        <div className="space-y-4">
          {driverRecentFeedback.map((feedback) => (
            <div key={feedback.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-darker">{feedback.category}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-primary rounded text-xs font-semibold">
                      {feedback.rating}
                      <Star size={12} className="fill-current" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(feedback.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  feedback.sentiment === 'positive' ? 'bg-green-50 text-success' :
                  feedback.sentiment === 'neutral' ? 'bg-yellow-50 text-warning' :
                  'bg-red-50 text-danger'
                }`}>
                  {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                </span>
              </div>
              <p className="text-sm text-slate-700">"{feedback.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard (for context) */}
      <div>
        <DriverPortalLeaderboard currentDriver={driver} />
      </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-darker mb-4">Recent Trips</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-600 text-left border-b border-slate-100">
                    <th className="py-2">Trip ID</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Route</th>
                    <th className="py-2">Punctuality</th>
                    <th className="py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'T-1001', date: '2024-02-20', route: 'Office A → Office B', punctuality: 'On time', rating: 5 },
                    { id: 'T-1002', date: '2024-02-18', route: 'Office C → Office A', punctuality: 'Late', rating: 4 },
                    { id: 'T-1003', date: '2024-02-15', route: 'Office B → Office D', punctuality: 'On time', rating: 4 },
                    { id: 'T-1004', date: '2024-02-12', route: 'Office A → Office C', punctuality: 'On time', rating: 5 },
                  ].map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-lighter">
                      <td className="py-3 font-medium">{t.id}</td>
                      <td className="py-3">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td className="py-3">{t.route}</td>
                      <td className="py-3">{t.punctuality}</td>
                      <td className="py-3 font-semibold">{t.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      {/* Tips for Better Rating */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-darker mb-4">💡 Tips to Improve Your Rating</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <p className="font-semibold text-darker text-sm">Maintain Punctuality</p>
              <p className="text-xs text-slate-600 mt-1">Always arrive on time for pickups</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <p className="font-semibold text-darker text-sm">Focus on Safety</p>
              <p className="text-xs text-slate-600 mt-1">Follow traffic rules and drive safely</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <p className="font-semibold text-darker text-sm">Professional Behavior</p>
              <p className="text-xs text-slate-600 mt-1">Be courteous and helpful to customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
