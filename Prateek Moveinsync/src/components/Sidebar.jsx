import React from 'react';
import { BarChart3, MessageSquare, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback Form', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'driver-portal', label: 'Driver Portal', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen, onNavigate, currentPage = 'dashboard' }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative w-64 h-screen bg-secondary text-white transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-xl lg:translate-x-0 lg:shadow-none`}
      >
        <div className="p-6 border-b border-tertiary bg-gradient-to-r from-secondary to-tertiary">
          <h2 className="text-base font-bold uppercase tracking-wide text-blue-100">Navigation</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-md font-semibold'
                    : 'text-blue-100 hover:bg-tertiary hover:text-white'
                }`}
              >
                <Icon size={19} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tertiary bg-gradient-to-b from-transparent to-secondary to-40%">
          <button
            onClick={() => {
              // clear frontend auth and navigate home
              useAuthStore.getState().logout();
              onNavigate?.('dashboard');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-blue-100 hover:bg-tertiary hover:text-white rounded-md transition duration-200"
          >
            <LogOut size={19} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
