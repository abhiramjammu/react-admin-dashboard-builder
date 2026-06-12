import React, { useState } from 'react';
import { useDashboardStore } from './store/dashboardStore';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { DashboardBuilder } from './components/DashboardBuilder';
import { SavedLayoutsPanel } from './components/SavedLayoutsPanel';
import './index.css';

// Analytics placeholder
const AnalyticsView: React.FC = () => (
  <div style={{ flex: 1, padding: '40px', backgroundColor: '#F5F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📈</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Analytics</h2>
      <p style={{ color: '#6B7280', margin: 0 }}>Full analytics coming soon — add Chart widgets to your dashboard for now.</p>
    </div>
  </div>
);

const UsersView: React.FC = () => (
  <div style={{ flex: 1, padding: '40px', backgroundColor: '#F5F7FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👥</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Users</h2>
      <p style={{ color: '#6B7280', margin: 0 }}>User management coming soon — add a Table widget for user data.</p>
    </div>
  </div>
);

const SettingsView: React.FC<{ onLogout: () => void; userName: string }> = ({ onLogout, userName }) => (
  <div style={{ flex: 1, padding: '40px', backgroundColor: '#F5F7FB', overflowY: 'auto' }}>
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Settings</h1>
      <p style={{ color: '#6B7280', margin: '0 0 32px' }}>Manage your account and workspace preferences.</p>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>Account</h3>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.875rem' }}>Signed in as <strong style={{ color: '#111827' }}>{userName}</strong></p>
        </div>
        <div style={{ padding: '24px' }}>
          <button onClick={onLogout} style={{
            padding: '10px 20px', borderRadius: '8px', border: '1px solid #FCA5A5',
            backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.875rem',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const { userId, userName, setUserId } = useDashboardStore();
  const [activeView, setActiveView] = useState('dashboard');

  if (!userId) {
    return <Login onLogin={(id, name) => setUserId(id, name)} />;
  }

  const topbarTitle: Record<string, string> = {
    dashboard: 'Dashboard',
    layouts: 'Saved Layouts',
    analytics: 'Analytics',
    users: 'Users',
    settings: 'Settings',
  };

  const handleLogout = () => {
    setUserId(null, '');
    setActiveView('dashboard');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          height: '60px', minHeight: '60px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9CA3AF' }}>
            <span style={{ color: '#9CA3AF' }}>Mokhu</span>
            <span>/</span>
            <span style={{ color: '#111827', fontWeight: 600 }}>{topbarTitle[activeView] || 'Dashboard'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '14px' }}>🔍</span>
              <input type="text" placeholder="Search…" style={{
                padding: '7px 12px 7px 32px', borderRadius: '8px',
                border: '1px solid #E5E7EB', outline: 'none',
                fontSize: '0.8125rem', color: '#374151', width: '200px',
                fontFamily: 'inherit', backgroundColor: '#F9FAFB',
              }} />
            </div>
            {/* Bell */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6B7280', padding: '4px' }}>🔔</button>
            {/* Avatar */}
            <div onClick={() => setActiveView('settings')} style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
            }}>
              {(userName || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Sub-header only on dashboard */}
        {activeView === 'dashboard' && (
          <div style={{
            backgroundColor: '#FFFFFF', borderBottom: '1px solid #F1F5F9',
            padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
                {userName ? `${userName}'s Dashboard` : 'Dashboard'}
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#9CA3AF' }}>Drag widgets to arrange · Hover to remove · Right-resize corners</p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {activeView === 'dashboard' && <DashboardBuilder userName={userName} />}
          {activeView === 'layouts' && <SavedLayoutsPanel />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView onLogout={handleLogout} userName={userName || ''} />}
        </div>
      </div>
    </div>
  );
}

export default App;
