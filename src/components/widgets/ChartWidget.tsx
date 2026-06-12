import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

interface ChartWidgetProps {
  title: string;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ title }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px', backgroundColor: 'var(--bg-widget)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.6} />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px', 
                color: '#111827',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
              }}
              itemStyle={{ color: '#2563EB', fontWeight: 500 }}
            />
            <Area type="monotone" dataKey="uv" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" activeDot={{ r: 4, strokeWidth: 0, fill: '#2563EB' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
