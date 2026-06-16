import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { B } from '../brand/index.js';
import { sb } from '../lib/supabase.js';

function Nav() {
  return (
    <nav style={{ background: B.deepOlive, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <a href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: B.warmSand }}>SOFree</a>
      <a href="/#waitlist" style={{ fontSize: 13, fontWeight: 700, color: B.white, fontFamily: 'Inter, sans-serif', background: B.heroGreen, borderRadius: 8, padding: '8px 18px' }}>
        Join Waitlist
      </a>
    </nav>
  );
}

export default function BlogPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    sb.getPosts('published').then(data => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Nav />
      <div style={{ background: B.baseSand, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ background: B.deepOlive, padding: '64px 24px 56px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>
            The SOFree Blog
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: B.warmSand, lineHeight: 1.15 }}>
            Know more. Eat better.
          </h1>
        </div>

        {/* Posts grid */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${B.borderLight}`, borderTopColor: B.heroGreen, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: B.deepOlive, marginBottom: 12 }}>Coming soon</div>
              <p style={{ color: B.textLight, fontFamily: 'Inter, sans-serif' }}>The first articles are on their way.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {posts.map(post => (
                <article key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  style={{ background: B.white, borderRadius: 16, overflow: 'hidden', border: `1px solid ${B.borderLight}`, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(45,80,22,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '20px 22px 24px' }}>
                    {post.category && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: B.brightAccent, fontFamily: 'Inter, sans-serif', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        {post.category}
                      </span>
                    )}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: B.deepOlive, lineHeight: 1.3, margin: '10px 0 10px' }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ fontSize: 14, color: B.textMid, fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div style={{ fontSize: 12, color: B.textLight, fontFamily: 'Inter, sans-serif', marginTop: 16 }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: B.deepOlive, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, color: B.warmSand, marginBottom: 8 }}>SOFree</div>
        <div style={{ fontSize: 12, color: 'rgba(232,213,176,0.4)', fontFamily: 'Inter, sans-serif' }}>© 2026 SOFree. All rights reserved.</div>
      </footer>
    </>
  );
}
