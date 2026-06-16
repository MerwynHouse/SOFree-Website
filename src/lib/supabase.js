const SUPABASE_URL = "https://fatkmaxbsmnxaurtkneo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdGttYXhic21ueGF1cnRrbmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM5MTksImV4cCI6MjA5NTY0OTkxOX0.tMcOs5WpCBuVyplSojNYrR9c_XSJCue86CRojqr_mfo";

export const sb = {
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  },
  authHeaders: (t) => ({
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${t}`,
  }),

  // ── Auth ──────────────────────────────────────────────────────────────────
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: sb.headers,
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST", headers: sb.authHeaders(token),
    });
  },
  async getProfile(userId, token) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, {
      headers: sb.authHeaders(token),
    });
    const d = await r.json();
    return d[0] || null;
  },

  // ── Blog Posts ────────────────────────────────────────────────────────────
  async getPosts(status = "published") {
    const filter = status === "all" ? "" : `&status=eq.${status}`;
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?order=published_at.desc${filter}&select=*`,
      { headers: sb.headers }
    );
    return r.json();
  },
  async getPost(slug) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${slug}&select=*`,
      { headers: sb.headers }
    );
    const d = await r.json();
    return d[0] || null;
  },
  async createPost(token, post) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: "POST",
      headers: { ...sb.authHeaders(token), "Prefer": "return=representation" },
      body: JSON.stringify(post),
    });
    const d = await r.json();
    return d[0];
  },
  async updatePost(token, id, updates) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...sb.authHeaders(token), "Prefer": "return=representation" },
      body: JSON.stringify(updates),
    });
    const d = await r.json();
    return d[0];
  },
  async deletePost(token, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`, {
      method: "DELETE", headers: sb.authHeaders(token),
    });
  },
  async uploadPostImage(token, userId, file) {
    const ext  = file.name.split(".").pop();
    const path = `blog/${userId}/${Date.now()}.${ext}`;
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/website/${path}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!r.ok) return null;
    return `${SUPABASE_URL}/storage/v1/object/public/website/${path}`;
  },
};
