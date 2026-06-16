import { useState, useEffect, useRef } from 'react';
import { sb } from '../lib/supabase.js';
import { B } from '../brand/index.js';

// ─── Slug generator ───────────────────────────────────────────────────────────
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Simple rich text toolbar ─────────────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  };

  const tools = [
    { label: 'B',  cmd: 'bold',          style: { fontWeight: 700 } },
    { label: 'I',  cmd: 'italic',        style: { fontStyle: 'italic' } },
    { label: 'H2', cmd: 'formatBlock',   val: 'H2', style: {} },
    { label: 'H3', cmd: 'formatBlock',   val: 'H3', style: {} },
    { label: '¶',  cmd: 'formatBlock',   val: 'P',  style: {} },
    { label: 'UL', cmd: 'insertUnorderedList', style: {} },
    { label: 'OL', cmd: 'insertOrderedList',   style: {} },
    { label: '"',  cmd: 'formatBlock',   val: 'BLOCKQUOTE', style: {} },
    { label: '—',  cmd: 'insertHorizontalRule', style: {} },
  ];

  return (
    <div style={{ border: `1px solid ${B.borderLight}`, borderRadius: 11, overflow: 'hidden', background: B.white }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 10px', borderBottom: `1px solid ${B.borderLight}`, background: B.baseSand }}>
        {tools.map(t => (
          <button key={t.label} onMouseDown={e => { e.preventDefault(); exec(t.cmd, t.val || null); }}
            style={{ padding: '5px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', background: B.white, color: B.textDark, border: `1px solid ${B.borderLight}`, ...t.style }}>
            {t.label}
          </button>
        ))}
        <button onMouseDown={e => { e.preventDefault(); const url = prompt('Link URL:'); if (url) exec('createLink', url); }}
          style={{ padding: '5px 10px', borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', background: B.white, color: B.textDark, border: `1px solid ${B.borderLight}` }}>
          Link
        </button>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{
          minHeight: 400, padding: '20px 24px', fontSize: 16,
          fontFamily: 'Inter, sans-serif', color: B.textDark, lineHeight: 1.8,
          outline: 'none',
        }}
      />
    </div>
  );
}

// ─── Post Editor ──────────────────────────────────────────────────────────────
function PostEditor({ post, session, onSave, onCancel }) {
  const isNew = !post?.id;
  const [title, setTitle]       = useState(post?.title || '');
  const [slug, setSlug]         = useState(post?.slug || '');
  const [excerpt, setExcerpt]   = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || '');
  const [body, setBody]         = useState(post?.body_html || '');
  const [status, setStatus]     = useState(post?.status || 'draft');
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const fileRef = useRef();

  const handleTitleChange = (val) => {
    setTitle(val);
    if (isNew) setSlug(toSlug(val));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const url = await sb.uploadPostImage(session.token, session.userId, file);
    if (url) setCoverUrl(url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) return setError('Title is required.');
    if (!slug.trim())  return setError('Slug is required.');
    setSaving(true); setError('');
    const payload = {
      title: title.trim(),
      slug:  slug.trim(),
      excerpt: excerpt.trim() || null,
      category: category.trim() || null,
      body_html: body,
      status,
      cover_image_url: coverUrl || null,
      published_at: status === 'published' ? (post?.published_at || new Date().toISOString()) : null,
    };
    try {
      if (isNew) {
        await sb.createPost(session.token, payload);
      } else {
        await sb.updatePost(session.token, post.id, payload);
      }
      onSave();
    } catch {
      setError('Save failed. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const inp = { width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${B.borderLight}`, fontSize: 14, fontFamily: 'Inter, sans-serif', background: B.white, color: B.textDark, boxSizing: 'border-box' };
  const lbl = { fontSize: 11, fontWeight: 700, color: B.textLight, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 6 };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button onClick={onCancel} style={{ color: B.textLight, fontSize: 22, lineHeight: 1 }}>←</button>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: B.deepOlive, flex: 1 }}>
          {isNew ? 'New Post' : 'Edit Post'}
        </h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ ...inp, width: 'auto', padding: '10px 14px' }}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '10px 24px', borderRadius: 10, background: saving ? B.textLight : B.deepOlive, color: B.white, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
            {saving ? 'Saving…' : status === 'published' ? 'Publish' : 'Save Draft'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: B.redHighBg, color: B.redHigh, padding: '12px 16px', borderRadius: 10, fontSize: 13, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Title */}
        <div>
          <label style={lbl}>Title *</label>
          <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title…" style={{ ...inp, fontSize: 18, fontWeight: 600 }} />
        </div>

        {/* Slug */}
        <div>
          <label style={lbl}>Slug (URL)</label>
          <input value={slug} onChange={e => setSlug(toSlug(e.target.value))} placeholder="post-url-slug" style={inp} />
          <div style={{ fontSize: 11, color: B.textLight, marginTop: 4, fontFamily: 'Inter, sans-serif' }}>sofree.app/blog/{slug || 'your-slug'}</div>
        </div>

        {/* Excerpt */}
        <div>
          <label style={lbl}>Excerpt (shown on blog listing)</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} placeholder="A short summary of this post…"
            style={{ ...inp, resize: 'vertical' }} />
        </div>

        {/* Category */}
        <div>
          <label style={lbl}>Category</label>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Nutrition, Tutorial, News" style={inp} />
        </div>

        {/* Cover image */}
        <div>
          <label style={lbl}>Cover Image</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files[0])} />
          {coverUrl ? (
            <div style={{ position: 'relative' }}>
              <img src={coverUrl} alt="Cover" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 11, border: `1px solid ${B.borderLight}` }} />
              <button onClick={() => setCoverUrl('')}
                style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: B.white, borderRadius: 20, width: 28, height: 28, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ width: '100%', padding: '32px', borderRadius: 11, border: `2px dashed ${B.borderLight}`, background: B.white, color: B.textLight, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
              {uploading ? 'Uploading…' : '📷  Upload cover image'}
            </button>
          )}
        </div>

        {/* Body */}
        <div>
          <label style={lbl}>Body *</label>
          <RichEditor value={body} onChange={setBody} />
        </div>
      </div>
    </div>
  );
}

// ─── Post List ────────────────────────────────────────────────────────────────
function PostList({ session, onEdit, onNew }) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    sb.getPosts('all').then(data => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeleting(post.id);
    await sb.deletePost(session.token, post.id);
    setPosts(prev => prev.filter(p => p.id !== post.id));
    setDeleting(null);
  };

  const statusColor = { published: B.heroGreen, draft: B.amber };
  const statusBg    = { published: '#e8f5e0', draft: B.amberBg };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: B.deepOlive }}>Blog Posts</h2>
        <button onClick={onNew}
          style={{ padding: '10px 20px', borderRadius: 10, background: B.deepOlive, color: B.white, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          + New Post
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${B.borderLight}`, borderTopColor: B.heroGreen, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: B.textLight, fontFamily: 'Inter, sans-serif' }}>
          No posts yet. Create your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: B.white, borderRadius: 13, padding: '16px 20px', border: `1px solid ${B.borderLight}`, display: 'flex', alignItems: 'center', gap: 16 }}>
              {post.cover_image_url && (
                <img src={post.cover_image_url} alt="" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: B.textDark, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 12, color: B.textLight, fontFamily: 'Inter, sans-serif', marginTop: 3 }}>
                  /blog/{post.slug} · {post.category || 'Uncategorised'} · {post.published_at ? new Date(post.published_at).toLocaleDateString('en-NZ') : 'Not published'}
                </div>
              </div>
              <span style={{ background: statusBg[post.status] || B.baseSand, color: statusColor[post.status] || B.textLight, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                {post.status}
              </span>
              <button onClick={() => onEdit(post)}
                style={{ background: B.baseSand, borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, color: B.textMid, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(post)} disabled={deleting === post.id}
                style={{ color: deleting === post.id ? B.textLight : B.redHigh, fontSize: 18, padding: '0 4px', flexShrink: 0 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Shell ──────────────────────────────────────────────────────────────
export default function AdminShell({ session, onLogout }) {
  const [view, setView]         = useState('posts');   // 'posts' | 'editor'
  const [editingPost, setEditingPost] = useState(null); // null = new post

  const handleNew  = () => { setEditingPost(null); setView('editor'); };
  const handleEdit = (post) => { setEditingPost(post); setView('editor'); };
  const handleSave = () => setView('posts');
  const handleCancel = () => setView('posts');

  return (
    <div style={{ minHeight: '100vh', background: B.baseSand }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Admin top bar */}
      <div style={{ background: B.deepOlive, padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: B.warmSand }}>SOFree Admin</span>
          <span style={{ fontSize: 11, color: 'rgba(232,213,176,0.4)', fontFamily: 'Inter, sans-serif' }}>|</span>
          <button onClick={() => setView('posts')}
            style={{ fontSize: 13, fontWeight: 600, color: view === 'posts' ? B.warmSand : 'rgba(232,213,176,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Blog Posts
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: 'rgba(232,213,176,0.5)', fontFamily: 'Inter, sans-serif' }}>{session.email}</span>
          <button onClick={onLogout}
            style={{ fontSize: 13, color: 'rgba(232,213,176,0.6)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'posts'
        ? <PostList session={session} onEdit={handleEdit} onNew={handleNew} />
        : <PostEditor post={editingPost} session={session} onSave={handleSave} onCancel={handleCancel} />
      }
    </div>
  );
}
