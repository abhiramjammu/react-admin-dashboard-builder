import React from 'react';
import type { WidgetData } from '../../store/types';

interface CustomWidgetProps {
  widget: WidgetData;
}

export const CustomWidget: React.FC<CustomWidgetProps> = ({ widget }) => {
  const accentColor = widget.customBg || '#2563EB';
  const icon = widget.customIcon || '📊';
  const value = widget.customText || '—';
  const note = widget.customNote || '';

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>{widget.title}</p>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
          {note && (
            <div style={{ marginTop: '10px', fontSize: '0.8125rem', color: accentColor, fontWeight: 600 }}>
              {note}
            </div>
          )}
        </div>
        <div style={{
          width: '48px', height: '48px', flexShrink: 0,
          borderRadius: '12px',
          backgroundColor: accentColor + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
        }}>
          {icon}
        </div>
      </div>
      <div style={{ marginTop: '16px', height: '3px', borderRadius: '3px', backgroundColor: '#F1F5F9' }}>
        <div style={{ width: '65%', height: '100%', borderRadius: '3px', backgroundColor: accentColor, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
};
