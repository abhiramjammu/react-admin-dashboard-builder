import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userId: string, userName: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const usersDb: Record<string, { password: string; name: string }> =
      JSON.parse(localStorage.getItem('users_db') || '{}');

    if (isLogin) {
      if (usersDb[userId] && usersDb[userId].password === password) {
        onLogin(userId, usersDb[userId].name);
      } else {
        setError('Invalid User ID or Password.');
      }
    } else {
      if (!userId.trim() || !password.trim() || !name.trim()) {
        setError('All fields are required.');
        return;
      }
      if (usersDb[userId]) {
        setError('User ID already exists. Please log in.');
        return;
      }
      usersDb[userId] = { password, name: name.trim() };
      localStorage.setItem('users_db', JSON.stringify(usersDb));
      onLogin(userId, name.trim());
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#2563EB';
    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0F4FF 0%, #FAF9FF 50%, #F0FDF4 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '440px', backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        padding: '48px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 16px rgba(37,99,235,0.3)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
            {isLogin ? 'Sign in to your Mokhu workspace' : 'Start building your dashboard today'}
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Full Name</label>
              <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} placeholder="Jane Doe" required />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>User ID</label>
            <input style={inputStyle} type="text" value={userId} onChange={(e) => setUserId(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} placeholder="jane_doe" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Password</label>
            <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} placeholder="••••••••" required />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '11px', marginTop: '8px',
            background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.45)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)'; }}
          >
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '24px', marginBottom: 0 }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
};
