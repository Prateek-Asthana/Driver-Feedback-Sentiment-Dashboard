import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-gradient-to-r from-secondary via-tertiary to-primary text-white shadow-md border-b border-primary border-opacity-20">
      <div className="flex items-center justify-between px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200"
            title="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <img
            src="https://moveinsync.com/wp-content/uploads/2020/03/Header-Logo-White.svg"
            alt="MoveInSync Logo"
            className="h-7 sm:h-9"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold leading-tight">
              Driver Feedback
            </h1>
            <p className="text-xs text-blue-100">Sentiment Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200" 
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </button>
          <button 
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200" 
            title="User profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
