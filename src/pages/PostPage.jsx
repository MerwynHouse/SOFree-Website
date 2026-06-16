import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { B } from '../brand/index.js';
import { sb } from '../lib/supabase.js';

export default function PostPage() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.getPost(slug).then(data => {
      setPost(data);
      setLoading(false);
      if (data) {
        document.title = `${data.title} — SOFree`;
      }
    });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: B.baseSand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${B.borderLight}`, borderTopColor: B.heroGreen, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!post) return (
    <div style={{ minHeight: '100vh', background: B.baseSand, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: B.deepOlive }}>Post not found</div>
      <button onClick={() => navigate('/blog')} style={{ color: B.heroGreen, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600 }}>← Back to Blog</button>
    </div>
  );

  return (
    <>
      <style>{`
        .post-body h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: #2D5016; margin: 40px 0 16px; font-weight: 700; }
        .post-body h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: #2D5016; margin: 32px 0 12px; font-weight: 700; }
        .post-body p  { font-size: 17px; color: #444; line-height: 1.85; margin-bottom: 20px; font-family: Inter, sans-serif; }
        .post-body ul, .post-body ol { padding-left: 24px; margin-bottom: 20px; }
        .post-body li { font-size: 17px; color: #444; line-height: 1.8; margin-bottom: 6px; font-family: Inter, sans-serif; }
        .post-body strong { color: #2D5016; font-weight: 700; }
        .post-body a  { color: #4A7C2F; text-decoration: underline; }
        .post-body blockquote { border-left: 4px solid #6BA32A; padding: 12px 20px; margin: 24px 0; background: #F5EDD8; border-radius: 0 8px 8px 0; }
        .post-body blockquote p { color: #2D5016; font-style: italic; margin: 0; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: B.deepOlive, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: B.warmSand }}>SOFree</a>
        <button onClick={() => navigate('/blog')} style={{ fontSize: 13, color: 'rgba(232,213,176,0.7)', fontFamily: 'Inter, sans-serif' }}>← Blog</button>
      </nav>

      {/* Hero */}
      <div style={{ background: B.deepOlive, padding: '56px 24px 64px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {post.category && (
            <span style={{ fontSize: 11, fontWeight: 700, color: B.brightAccent, fontFamily: 'Inter, sans-serif', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
              {post.category}
            </span>
          )}
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: B.warmSand, lineHeight: 1.15, marginBottom: 20 }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontSize: 18, color: 'rgba(232,213,176,0.7)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ fontSize: 13, color: 'rgba(232,213,176,0.45)', fontFamily: 'Inter, sans-serif', marginTop: 20 }}>
            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: '0 0 16px 16px' }} />
        </div>
      )}

      {/* Body */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 96px' }}>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.body_html || '' }} />
      </article>

      {/* Footer */}
      <footer style={{ background: B.deepOlive, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, color: B.warmSand, marginBottom: 8 }}>SOFree</div>
        <div style={{ fontSize: 12, color: 'rgba(232,213,176,0.4)', fontFamily: 'Inter, sans-serif' }}>© 2026 SOFree. All rights reserved.</div>
      </footer>
    </>
  );
}
