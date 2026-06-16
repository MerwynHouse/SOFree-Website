import { useState } from 'react';
import { sb } from '../lib/supabase.js';
import { B } from '../brand/index.js';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError('Enter your email and password.');
    setLoading(true); setError('');
    try {
      const data = await sb.signIn(email, password);
      if (data.error || !data.access_token) {
        return setError('Invalid credentials. Try again.');
      }
      // Check is_admin on the profile
      const profile = await sb.getProfile(data.user.id, data.access_token);
      if (!profile?.is_admin) {
        await sb.signOut(data.access_token);
        return setError('You do not have admin access.');
      }
      onLogin({ token: data.access_token, userId: data.user.id, email: data.user.email });
    } catch {
      setError('Something went wrong. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: B.deepOlive, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: B.baseSand, borderRadius: 20, padding: '40px 36px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>

        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: B.deepOlive, marginBottom: 4 }}>SOFree</div>
        <div style={{ fontSize: 13, color: B.textLight, fontFamily: 'Inter, sans-serif', marginBottom: 36 }}>Admin Panel</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: B.textLight, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${B.borderLight}`, fontSize: 14, fontFamily: 'Inter, sans-serif', background: B.white, color: B.textDark, boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: B.textLight, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10, border: `1px solid ${B.borderLight}`, fontSize: 14, fontFamily: 'Inter, sans-serif', background: B.white, color: B.textDark, boxSizing: 'border-box' }} />
              <button onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: B.textLight, fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 13, color: B.redHigh, fontFamily: 'Inter, sans-serif', background: B.redHighBg, padding: '10px 14px', borderRadius: 8 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 11, background: loading ? B.textLight : B.deepOlive, color: B.white, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', marginTop: 8, transition: 'background 0.2s' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
