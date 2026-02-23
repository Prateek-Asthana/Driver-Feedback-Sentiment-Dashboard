import React, { useState } from 'react';

export default function DriverPortalLeaderboard({ currentDriver }) {
  // Mock leaderboard data
  const [drivers] = useState([
    { id: 'DRV001', name: 'Rajesh Kumar', avg: 4.8, trips: 420, trend: '+0.2' },
    { id: 'DRV002', name: 'Priya Singh', avg: 4.7, trips: 398, trend: '+0.1' },
    { id: 'DRV003', name: 'Amit Patel', avg: 4.6, trips: 372, trend: '-0.1' },
    { id: 'DRV004', name: 'Neha Sharma', avg: 4.5, trips: 350, trend: '+0.0' },
    { id: 'DRV005', name: 'Vikram Singh', avg: 4.4, trips: 320, trend: '-0.2' },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-darker mb-4">Driver Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-600 text-left border-b border-slate-100">
              <th className="py-2">Rank</th>
              <th className="py-2">Driver</th>
              <th className="py-2">Avg Score</th>
              <th className="py-2">Trips</th>
              <th className="py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, idx) => (
              <tr key={d.id} className={`border-b border-slate-100 ${d.id === currentDriver?.id ? 'bg-blue-50' : ''}`}>
                <td className="py-3 font-medium">#{idx + 1}</td>
                <td className="py-3">{d.name} <div className="text-xs text-slate-500">{d.id}</div></td>
                <td className="py-3 font-bold">{d.avg}</td>
                <td className="py-3">{d.trips}</td>
                <td className="py-3 text-sm text-slate-600">{d.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
