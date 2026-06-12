import React from 'react';

interface TableWidgetProps {
  title: string;
}

const users = [
  { id: 1, name: 'Alice Freeman', role: 'Designer', status: 'Active' },
  { id: 2, name: 'Bob Smith', role: 'Developer', status: 'Offline' },
  { id: 3, name: 'Charlie Brown', role: 'Manager', status: 'Active' },
  { id: 4, name: 'Diana Prince', role: 'Analyst', status: 'Busy' },
  { id: 5, name: 'Evan Wright', role: 'Marketing', status: 'Active' },
];

export const TableWidget: React.FC<TableWidgetProps> = ({ title }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: 'var(--bg-widget)', borderRadius: 'var(--radius-lg)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h3>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 12px 12px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)' }}>User</th>
              <th style={{ padding: '0 12px 12px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)' }}>Role</th>
              <th style={{ padding: '0 12px 12px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td style={{ padding: '16px 12px', fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem', borderBottom: idx !== users.length - 1 ? '1px solid var(--border-light)' : 'none' }}>{user.name}</td>
                <td style={{ padding: '16px 12px', color: 'var(--text-secondary)', fontSize: '0.875rem', borderBottom: idx !== users.length - 1 ? '1px solid var(--border-light)' : 'none' }}>{user.role}</td>
                <td style={{ padding: '16px 12px', borderBottom: idx !== users.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: user.status === 'Active' ? '#ECFDF5' : 
                                    user.status === 'Busy' ? '#FFFBEB' : '#F3F4F6',
                    color: user.status === 'Active' ? '#059669' : 
                           user.status === 'Busy' ? '#D97706' : '#6B7280',
                    border: `1px solid ${user.status === 'Active' ? '#A7F3D0' : user.status === 'Busy' ? '#FDE68A' : '#E5E7EB'}`
                  }}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
