import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import type { WidgetType } from '../store/types';

const COLORS = ['#2563EB','#059669','#D97706','#DC2626','#7C3AED','#0891B2','#BE185D','#374151'];
const ICONS = ['📊','📈','📉','💰','👥','⚡','🎯','📋','🔔','💡','🚀','✅'];

interface CustomWidgetBuilderProps {
  onClose: () => void;
}

export const CustomWidgetBuilder: React.FC<CustomWidgetBuilderProps> = ({ onClose }) => {
  const addWidget = useDashboardStore((s: any) => s.addWidget);
  const [title, setTitle] = useState('My Widget');
  const [note, setNote] = useState('');
  const [value, setValue] = useState('₹0');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [widgetType, setWidgetType] = useState<WidgetType>('custom');

  const previewTypes: { type: WidgetType; label: string }[] = [
    { type: 'custom', label: 'KPI Card' },
    { type: 'stats', label: 'Stats Card' },
    { type: 'chart', label: 'Chart' },
    { type: 'table', label: 'Table' },
  ];

  const handleAdd = () => {
    addWidget(widgetType, {
      title,
      customBg: selectedColor,
      customText: value,
      customNote: note,
      customIcon: selectedIcon,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        width: '520px', maxHeight: '90vh', overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        padding: '32px',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Widget Builder</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>Create your custom dashboard widget</p>
          </div>
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>✕</button>
        </div>

        {/* Widget Type Selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>Widget Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {previewTypes.map(pt => (
              <button key={pt.type} onClick={() => setWidgetType(pt.type)} style={{
                padding: '10px 8px', borderRadius: '10px', border: '2px solid',
                borderColor: widgetType === pt.type ? '#2563EB' : '#E5E7EB',
                backgroundColor: widgetType === pt.type ? '#EFF6FF' : '#FAFAFA',
                color: widgetType === pt.type ? '#2563EB' : '#6B7280',
                fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}>{pt.label}</button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Widget Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB',
            fontSize: '0.875rem', outline: 'none', color: '#111827', fontFamily: 'inherit', boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          placeholder="e.g. Monthly Revenue" />
        </div>

        {widgetType === 'custom' && <>
          {/* Value */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Display Value</label>
            <input value={value} onChange={e => setValue(e.target.value)} style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB',
              fontSize: '0.875rem', outline: 'none', color: '#111827', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            placeholder="e.g. ₹1,23,456 or 98.5%" />
          </div>

          {/* Note */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Subtitle / Note</label>
            <input value={note} onChange={e => setNote(e.target.value)} style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E5E7EB',
              fontSize: '0.875rem', outline: 'none', color: '#111827', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            placeholder="e.g. +12.5% vs last month" />
          </div>

          {/* Icon */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>Icon</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setSelectedIcon(icon)} style={{
                  width: '40px', height: '40px', borderRadius: '10px', border: '2px solid',
                  borderColor: selectedIcon === icon ? '#2563EB' : '#E5E7EB',
                  backgroundColor: selectedIcon === icon ? '#EFF6FF' : '#FAFAFA',
                  fontSize: '18px', cursor: 'pointer', transition: 'all 0.15s',
                }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>Accent Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)} style={{
                  width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c,
                  border: selectedColor === c ? '3px solid #111827' : '3px solid transparent',
                  cursor: 'pointer', outline: '2px solid white', outlineOffset: '-1px',
                  transition: 'border 0.15s',
                }} />
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '10px' }}>Preview</label>
            <div style={{
              border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px',
              backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: selectedColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {selectedIcon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '2px', fontWeight: 500 }}>{title || 'Widget Title'}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>{value || '₹0'}</div>
                {note && <div style={{ fontSize: '0.75rem', color: selectedColor, fontWeight: 500, marginTop: '2px' }}>{note}</div>}
              </div>
            </div>
          </div>
        </>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF', color: '#374151', fontSize: '0.9375rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >Cancel</button>
          <button onClick={handleAdd} style={{
            flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            color: 'white', fontSize: '0.9375rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          }}>
            + Add to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
