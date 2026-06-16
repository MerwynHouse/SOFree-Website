import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { sb } from './lib/supabase.js';
import { GLOBAL_CSS } from './brand/index.js';

import HomePage     from './pages/HomePage.jsx';
import BlogPage     from './pages/BlogPage.jsx';
import PostPage     from './pages/PostPage.jsx';
import ThankYouPage from './pages/ThankYouPage.jsx';

import AdminLogin   from './admin/AdminLogin.jsx';
import AdminShell   from './admin/AdminShell.jsx';

export default function App() {
  const [adminSession, setAdminSession] = useState(null);
  const [checking, setChecking]         = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sofree_admin_session");
    if (stored) {
      try { setAdminSession(JSON.parse(stored)); }
      catch { localStorage.removeItem("sofree_admin_session"); }
    }
    setChecking(false);
  }, []);

  const handleAdminLogin = (session) => {
    localStorage.setItem("sofree_admin_session", JSON.stringify(session));
    setAdminSession(session);
  };

  const handleAdminLogout = async () => {
    if (adminSession?.token) await sb.signOut(adminSession.token);
    localStorage.removeItem("sofree_admin_session");
    setAdminSession(null);
  };

  if (checking) return null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Routes>
        {/* ── Public site ── */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/blog"        element={<BlogPage />} />
        <Route path="/blog/:slug"  element={<PostPage />} />
        <Route path="/thank-you"   element={<ThankYouPage />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={
          adminSession
            ? <AdminShell session={adminSession} onLogout={handleAdminLogout} />
            : <AdminLogin onLogin={handleAdminLogin} />
        } />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}
