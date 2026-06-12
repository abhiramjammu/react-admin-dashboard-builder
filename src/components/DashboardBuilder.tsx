import React, { useEffect, useRef, useState } from 'react';
import RGL_PACKAGE from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '../store/dashboardStore';
import type { WidgetData } from '../store/types';
import { StatsWidget } from './widgets/StatsWidget';
import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { CustomWidget } from './widgets/CustomWidget';

interface DashboardBuilderProps {
  userName: string | null;
}

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({ userName: _userName }) => {
  const RGL: any = (RGL_PACKAGE as any).Responsive || (RGL_PACKAGE as any).default?.Responsive || RGL_PACKAGE;
  const { layouts, widgets, updateLayouts, removeWidget, loadUserData } = useDashboardStore();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [isDragOver, setIsDragOver] = useState(false);
  const addWidget = useDashboardStore((s: any) => s.addWidget);

  useEffect(() => {
    loadUserData();
    setMounted(true);
  }, [loadUserData]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setWidth(entries[0].contentRect.width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const renderWidget = (w: WidgetData) => {
    switch (w.type) {
      case 'stats': return <StatsWidget title={w.title} />;
      case 'chart': return <ChartWidget title={w.title} />;
      case 'table': return <TableWidget title={w.title} />;
      case 'custom': return <CustomWidget widget={w} />;
      default: return <div style={{ padding: 16, color: '#6B7280' }}>Unknown widget</div>;
    }
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', backgroundColor: '#F5F7FB' }}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={e => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setIsDragOver(false);
      }}
      onDrop={e => {
        e.preventDefault();
        setIsDragOver(false);
        const type = e.dataTransfer.getData('text/plain') as any;
        if (type) addWidget(type);
      }}
    >
      {widgets.length === 0 ? (
        <div style={{
          height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px dashed ${isDragOver ? '#2563EB' : '#CBD5E1'}`,
          borderRadius: '16px', transition: 'all 0.2s',
          backgroundColor: isDragOver ? '#EFF6FF' : '#FAFBFC',
          flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <p style={{ fontWeight: 600, color: '#374151', margin: 0, fontSize: '1rem' }}>
            {isDragOver ? 'Drop widget here' : 'Your dashboard is empty'}
          </p>
          <p style={{ color: '#9CA3AF', margin: 0, fontSize: '0.875rem' }}>Drag widgets from the sidebar or click to add them</p>
        </div>
      ) : (
        <div style={{
          border: isDragOver ? '2px dashed #2563EB' : '2px solid transparent',
          borderRadius: '16px', transition: 'border-color 0.2s',
          backgroundColor: isDragOver ? 'rgba(37,99,235,0.02)' : 'transparent',
        }}>
          <RGL
            width={width}
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 960, sm: 720, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={44}
            onLayoutChange={(_curr: any, all: any) => updateLayouts(all as any)}
            isDraggable
            isResizable
            isDroppable
            droppingItem={{ i: '__dropping__', w: 4, h: 4 } as any}
            onDrop={(_layout: any, _item: any, e: any) => {
              const type = (e as any).dataTransfer.getData('text/plain') as any;
              if (type) addWidget(type);
              setIsDragOver(false);
            }}
            margin={[20, 20]}
            useCSSTransforms
          >
            {widgets.map((w) => (
              <div
                key={w.i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeWidget(w.i)}
                  style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                    width: '26px', height: '26px', borderRadius: '6px',
                    border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
                    color: '#9CA3AF', cursor: 'pointer', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.15s, background 0.15s',
                    fontFamily: 'inherit',
                  }}
                  className="widget-remove-btn"
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.borderColor = '#FCA5A5'; e.currentTarget.style.color = '#DC2626'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#9CA3AF'; }}
                >
                  ✕
                </button>
                <div style={{ flex: 1, height: '100%' }}>{renderWidget(w)}</div>
              </div>
            ))}
          </RGL>
        </div>
      )}

      <style>{`
        .react-grid-item:hover .widget-remove-btn { opacity: 1 !important; }
        .react-grid-item.react-draggable-dragging { box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important; opacity: 0.95; }
        .react-grid-item.react-grid-placeholder { background: #2563EB !important; opacity: 0.08 !important; border-radius: 14px !important; }
        .react-resizable-handle { opacity: 0; transition: opacity 0.2s; }
        .react-grid-item:hover .react-resizable-handle { opacity: 1; }
        .react-resizable-handle::after { border-color: #9CA3AF !important; }
      `}</style>
    </div>
  );
};
