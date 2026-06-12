import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export const SavedLayoutsPanel: React.FC = () => {
  const { savedLayouts, saveCurrentLayout, loadSavedLayout, deleteSavedLayout, widgets } = useDashboardStore();
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!newName.trim()) return;
    saveCurrentLayout(newName.trim());
    setNewName('');
    setSaving(false);
  };

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', backgroundColor: '#F5F7FB' }}>
      <div style={{ maxWidth: '720px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Saved Layouts</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 32px' }}>Save up to 5 layouts and restore them anytime.</p>

        {/* Save Current */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Save Current Layout</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {saving ? (
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaving(false); }}
                  placeholder="e.g. Q2 Sales Dashboard"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '2px solid #2563EB', outline: 'none',
                    fontSize: '0.875rem', color: '#111827', fontFamily: 'inherit', boxSizing: 'border-box',
                    boxShadow: '0 0 0 3px rgba(37,99,235,0.1)',
                  }}
                />
              ) : (
                <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                  {widgets.length} widget{widgets.length !== 1 ? 's' : ''} in current layout · {savedLayouts.length}/5 slots used
                </div>
              )}
            </div>
            {saving ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSaving(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#374151', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button onClick={handleSave} disabled={!newName.trim()} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: !newName.trim() ? 0.5 : 1 }}>Save</button>
              </div>
            ) : (
              <button onClick={() => setSaving(true)} disabled={savedLayouts.length >= 5} style={{
                padding: '10px 20px', borderRadius: '8px', border: 'none',
                background: savedLayouts.length >= 5 ? '#F3F4F6' : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: savedLayouts.length >= 5 ? '#9CA3AF' : 'white',
                fontSize: '0.875rem', fontWeight: 600, cursor: savedLayouts.length >= 5 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>
                {savedLayouts.length >= 5 ? 'Limit Reached' : '+ Save Layout'}
              </button>
            )}
          </div>
        </div>

        {/* Saved List */}
        {savedLayouts.length === 0 ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '48px', border: '1px dashed #E5E7EB', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗂️</div>
            <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>No saved layouts yet</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', margin: 0 }}>Save your current layout to access it later.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savedLayouts.map((sl, idx) => (
              <div key={sl.id} style={{
                backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '20px 24px',
                border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: '20px',
                transition: 'box-shadow 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {['🎯','📊','📋','⚡','🚀'][idx % 5]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827', marginBottom: '2px' }}>{sl.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{sl.widgets.length} widgets · Saved {fmt(sl.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => loadSavedLayout(sl.id)} style={{
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF', color: '#374151', fontSize: '0.8125rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >Restore</button>
                  <button onClick={() => deleteSavedLayout(sl.id)} style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid #FCA5A5',
                    backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.8125rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
