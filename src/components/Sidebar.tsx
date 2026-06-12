import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import type { WidgetType } from '../store/types';
import { CustomWidgetBuilder } from './CustomWidgetBuilder';

const NavIcon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

interface SidebarProps {
  activeView: string;
  onViewChange: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { addWidget, setDraggingType, draggingType } = useDashboardStore();
  const [showBuilder, setShowBuilder] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'layouts', label: 'Saved Layouts', icon: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M3 9h18' },
    { id: 'analytics', label: 'Analytics', icon: 'M18 20V10 M12 20V4 M6 20v-6' },
    { id: 'users', label: 'Users', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'settings', label: 'Settings', icon: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  ];

  const widgetTemplates: { type: WidgetType; label: string; desc: string; icon: string }[] = [
    { type: 'stats', label: 'Stats Card', desc: 'KPI metric', icon: '📊' },
    { type: 'chart', label: 'Area Chart', desc: 'Time series', icon: '📈' },
    { type: 'table', label: 'Data Table', desc: 'Records list', icon: '📋' },
  ];

  return (
    <>
      {showBuilder && <CustomWidgetBuilder onClose={() => setShowBuilder(false)} />}

      <nav style={{
        width: '260px', minWidth: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #F1F5F9',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflowY: 'auto',
        boxShadow: '1px 0 0 #F1F5F9',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.3)', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#111827', letterSpacing: '-0.02em' }}>Mokhu</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '16px 12px', flex: '0 0 auto' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 8px' }}>Navigation</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => onViewChange(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: activeView === item.id ? '#EFF6FF' : 'transparent',
              color: activeView === item.id ? '#2563EB' : '#6B7280',
              fontWeight: activeView === item.id ? 600 : 500,
              fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.15s',
              fontFamily: 'inherit', position: 'relative',
            }}
            onMouseOver={e => { if (activeView !== item.id) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
            onMouseOut={e => { if (activeView !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {activeView === item.id && <div style={{ position: 'absolute', left: 0, top: '6px', bottom: '6px', width: '3px', background: '#2563EB', borderRadius: '0 3px 3px 0' }} />}
              <NavIcon d={item.icon} />
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 12px 8px' }} />

        {/* Widget Library */}
        <div style={{ padding: '0 12px', flex: 1 }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 8px' }}>Widget Library</p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 12px 8px' }}>Drag onto dashboard or click to add</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {widgetTemplates.map(t => (
              <div key={t.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', t.type);
                  setDraggingType(t.type);
                }}
                onDragEnd={() => setDraggingType(null)}
                onClick={() => addWidget(t.type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 12px', borderRadius: '10px',
                  border: `1px solid ${draggingType === t.type ? '#2563EB' : '#E5E7EB'}`,
                  backgroundColor: draggingType === t.type ? '#EFF6FF' : '#FAFAFA',
                  cursor: 'grab', transition: 'all 0.15s', userSelect: 'none',
                }}
                onMouseOver={e => { if (draggingType !== t.type) { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.06)'; } }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#FAFAFA'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '20px', lineHeight: 1 }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{t.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{t.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '18px', color: '#CBD5E1' }}>⠿</div>
              </div>
            ))}
          </div>

          {/* Custom Widget Builder CTA */}
          <div style={{ marginTop: '16px' }}>
            <button onClick={() => setShowBuilder(true)} style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              border: '2px dashed #CBD5E1',
              backgroundColor: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              color: '#6B7280', fontSize: '0.8125rem', fontWeight: 600,
              transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.backgroundColor = '#EFF6FF'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span style={{ fontSize: '16px' }}>✦</span>
              Build Custom Widget
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ padding: '16px 12px 20px', marginTop: 'auto' }}>
          <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>💾</div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5 }}>Layouts auto-save<br />per user session</div>
          </div>
        </div>
      </nav>
    </>
  );
};
