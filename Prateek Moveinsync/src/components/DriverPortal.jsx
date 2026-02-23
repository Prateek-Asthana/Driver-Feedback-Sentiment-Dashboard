import { useState } from 'react';
import { LogOut, TrendingUp, AlertCircle } from 'lucide-react';
import DriverPortalDashboard from './DriverPortalDashboard';
import Dashboard from './Dashboard';
import DriverDetailPage from './DriverDetailPage';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';

export default function DriverPortal({ onLogout }) {
  const [driverUID, setDriverUID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver'); // 'driver' or 'admin'
  const [isSignup, setIsSignup] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Global auth store (frontend demo only)
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const logoutAuth = useAuthStore((s) => s.logout);

  // App store (must be called at top level for all renders)
  const selectedDriver = useAppStore((s) => s.selectedDriver);
  const setSelectedDriver = useAppStore((s) => s.setSelectedDriver);

  // Mock users (drivers + admins) with demo passwords
  const driverDatabase = {
    DRV001: {
      id: 'DRV001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 98765 43210',
      rating: 4.8,
      totalFeedbacks: 145,
      joinDate: '2021-03-15',
      password: 'driver123',
      role: 'driver',
    },
    DRV002: {
      id: 'DRV002',
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 98765 43211',
      rating: 4.7,
      totalFeedbacks: 132,
      joinDate: '2021-05-20',
      password: 'driver123',
      role: 'driver',
    },
    DRV003: {
      id: 'DRV003',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 98765 43212',
      rating: 4.6,
      totalFeedbacks: 128,
      joinDate: '2021-07-10',
      password: 'driver123',
      role: 'driver',
    },
    DRV004: {
      id: 'DRV004',
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      phone: '+91 98765 43213',
      rating: 4.5,
      totalFeedbacks: 119,
      joinDate: '2021-09-05',
      password: 'driver123',
      role: 'driver',
    },
    DRV005: {
      id: 'DRV005',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 98765 43214',
      rating: 4.4,
      totalFeedbacks: 98,
      joinDate: '2022-01-12',
      password: 'driver123',
      role: 'driver',
    },
    ADMIN01: {
      id: 'ADMIN01',
      name: 'MoveInSync Admin',
      email: 'admin@example.com',
      phone: '+91 90000 00001',
      password: 'adminpass',
      role: 'admin',
    },
  };

  // Local DB (allows signups during demo)
  const [localDB, setLocalDB] = useState(driverDatabase);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!driverUID.trim()) {
      setLoginError('Please enter UID');
      return;
    }
    const uid = driverUID.toUpperCase();
    const user = localDB[uid];
    if (!user) {
      setLoginError('Invalid UID. Use demo credentials or sign up.');
      return;
    }
    if (user.role !== role) {
      setLoginError(`Please choose correct role for ${uid}`);
      return;
    }
    if (!password) {
      setLoginError('Please enter password');
      return;
    }
    if (user.password !== password) {
      setLoginError('Incorrect password');
      return;
    }
    setAuthUser(user);
    setDriverUID('');
    setPassword('');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoginError('');

    const uid = driverUID.trim().toUpperCase();
    if (!uid) {
      setLoginError('Please enter a valid UID to signup');
      return;
    }
    if (localDB[uid]) {
      setLoginError('UID already exists. Try logging in.');
      return;
    }
    if (!password) {
      setLoginError('Please enter a password to create account');
      return;
    }
    const newUser = {
      id: uid,
      name: role === 'admin' ? `Admin ${uid.slice(-3)}` : `New Driver ${uid.slice(-3)}`,
      email: `${uid.toLowerCase()}@example.com`,
      phone: '+91 90000 00000',
      rating: role === 'driver' ? 4.2 : undefined,
      totalFeedbacks: role === 'driver' ? 0 : undefined,
      joinDate: new Date().toISOString().slice(0, 10),
      password,
      role,
    };
    setLocalDB((d) => ({ ...d, [uid]: newUser }));
    setAuthUser(newUser);
    setIsSignup(false);
    setDriverUID('');
    setPassword('');
  };

  const handleLogout = () => {
    logoutAuth();
    setDriverUID('');
    setPassword('');
    onLogout?.();
  };

  // If not authenticated, show login/signup
  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-primary text-white p-3 rounded-full mb-4">
              <TrendingUp size={32} />
            </div>
            <h1 className="text-3xl font-bold text-darker">Driver Portal</h1>
            <p className="text-slate-600 mt-2">MoveInSync Feedback System</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-darker mb-2">UID</label>
                <input
                  type="text"
                  placeholder="Enter UID (e.g., DRV001 or ADMIN01)"
                  value={driverUID}
                  onChange={(e) => {
                    setDriverUID(e.target.value.toUpperCase());
                    setLoginError('');
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 font-medium tracking-widest"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-darker mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">I am a</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="ml-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start">
                  <AlertCircle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-danger text-sm font-medium">Login Failed</p>
                    <p className="text-danger text-xs mt-1">{loginError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold text-base shadow-md hover:shadow-lg active:scale-95"
              >
                {isSignup ? 'Create Account & Enter Portal' : 'Login to Your Portal'}
              </button>

              <div className="flex items-center justify-between mt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup((s) => !s);
                    setLoginError('');
                  }}
                  className="text-primary hover:underline"
                >
                  {isSignup ? 'Have an account? Login' : "Don't have UID? Sign up"}
                </button>
                {isSignup && <div className="text-slate-500">Tip: choose UID like DRV123</div>}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-600 font-semibold mb-2">Demo Credentials</p>
              <div className="text-xs text-slate-700 mb-2">
                <div className="mb-1">Driver demo: UID <span className="font-mono">DRV001</span> / Password <span className="font-mono">driver123</span></div>
                <div className="mb-1">Driver demo: UID <span className="font-mono">DRV002</span> / Password <span className="font-mono">driver123</span></div>
                <div className="mb-1">Admin demo: UID <span className="font-mono">ADMIN01</span> / Password <span className="font-mono">adminpass</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(localDB).map((uid) => (
                  <button
                    key={uid}
                    onClick={() => {
                      setDriverUID(uid);
                      setLoginError('');
                    }}
                    className="text-xs px-2 py-1.5 bg-blue-50 text-primary rounded border border-blue-200 hover:bg-blue-100 transition font-mono font-semibold"
                  >
                    {uid}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-600">
            <p>This is a secure driver portal. Only drivers and admins can access their data (demo).</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin view
  if (authUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-lighter">
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-darker">Admin Portal</h1>
              <p className="text-xs text-slate-500 mt-0.5">UID: {authUser?.id}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg transition font-semibold text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <h2 className="text-3xl font-bold mb-2">Welcome, {authUser?.name}! 👋</h2>
            <p className="text-blue-100">Admin analytics and sentiment dashboard</p>
          </div>
        </div>

        <div className="bg-lighter min-h-[calc(100vh-300px)]">
          {!selectedDriver ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
              <Dashboard onNavigate={() => {}} />
            </div>
          ) : (
            <DriverDetailPage
              driverId={selectedDriver?.id}
              onClose={() => setSelectedDriver(null)}
            />
          )}
        </div>
      </div>
    );
  }

  // Driver view
  return (
    <div className="min-h-screen bg-lighter">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-darker">My Driver Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">UID: {authUser?.id}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-danger hover:bg-red-600 text-white rounded-lg transition font-semibold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {authUser?.name}! 👋</h2>
          <p className="text-blue-100">Here's your performance dashboard and feedback summary</p>
        </div>
      </div>

      <DriverPortalDashboard driver={authUser} />
    </div>
  );
}
