import React, { useState, useEffect } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import DriverDetailPage from './components/DriverDetailPage';
import DriverPortal from './components/DriverPortal';
import { useAppStore } from './store/appStore';
import { useFeatureFlags } from './services/api';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const selectedDriver = useAppStore((state) => state.selectedDriver);
  const { data: featureFlags } = useFeatureFlags();

  // Navigate to driver details when driver is selected
  useEffect(() => {
    if (selectedDriver) {
      setCurrentPage('driver-details');
    }
  }, [selectedDriver]);

  const renderContent = () => {
    switch (currentPage) {
      case 'feedback':
        return <FeedbackForm onSuccess={() => setCurrentPage('dashboard')} />;
      case 'driver-portal':
        return <DriverPortal onLogout={() => setCurrentPage('dashboard')} />;
      case 'driver-details':
        return (
          <DriverDetailPage
            driverId={selectedDriver?.id}
            onClose={() => setCurrentPage('dashboard')}
          />
        );
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-light">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light">
          <div className="p-4 sm:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
