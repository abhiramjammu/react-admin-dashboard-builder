import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity } from 'lucide-react';

import type { WidgetData } from '../../store/types';

interface StatsWidgetProps {
  widget: WidgetData;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ widget }) => {
  const { title, customText, customNote } = widget;
  const stats = [
    { label: 'Total Revenue', value: '₹45,231', icon: DollarSign, change: '+20.1%', isPositive: true },
    { label: 'Active Users', value: '2,314', icon: Users, change: '+15.2%', isPositive: true },
    { label: 'Activity Rate', value: '78.5%', icon: Activity, change: '-4.1%', isPositive: false },
  ];

  // Randomly select one for variety based on title length
  const defaultStat = stats[title.length % stats.length];
  
  const value = customText || defaultStat.value;
  const change = customNote || defaultStat.change;
  const isPositive = change.startsWith('+') || change.startsWith('up') || defaultStat.isPositive;
  const Icon = defaultStat.icon;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: 'var(--bg-widget)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, margin: 0, letterSpacing: '0.01em' }}>
            {title}
          </h3>
          <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px', letterSpacing: '-0.02em' }}>
            {value}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          <Icon size={20} color="var(--text-secondary)" />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', marginTop: '16px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '2px', 
          color: isPositive ? '#059669' : '#DC2626', 
          fontWeight: 500,
          backgroundColor: isPositive ? '#ECFDF5' : '#FEF2F2',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    </div>
  );
};
