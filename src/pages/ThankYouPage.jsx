import { B } from '../brand/index.js';

export default function ThankYouPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.deepOlive, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(107,163,42,0.2)', border: `2px solid ${B.brightAccent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={B.brightAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, color: B.warmSand, marginBottom: 16, lineHeight: 1.1 }}>
        You're on the list.
      </h1>
      <p style={{ fontSize: 18, color: 'rgba(232,213,176,0.7)', fontFamily: 'Inter, sans-serif', lineHeight: 1.7, maxWidth: 400, marginBottom: 48 }}>
        We'll be in touch the moment SOFree launches in New Zealand.
      </p>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px 32px', maxWidth: 400, width: '100%', marginBottom: 40 }}>
        <p style={{ fontSize: 15, color: B.warmSand, fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: 8 }}>
          Know someone who reads labels?
        </p>
        <p style={{ fontSize: 14, color: 'rgba(232,213,176,0.6)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
          Share SOFree with someone who'd actually use it.
        </p>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'SOFree', text: 'Check out SOFree — it scans food products for seed oils instantly.', url: 'https://sofree.app' });
            } else {
              navigator.clipboard.writeText('https://sofree.app');
              alert('Link copied!');
            }
          }}
          style={{ marginTop: 16, padding: '11px 24px', borderRadius: 10, background: B.heroGreen, color: B.white, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          Share SOFree →
        </button>
      </div>
      <a href="/" style={{ fontSize: 14, color: 'rgba(232,213,176,0.45)', fontFamily: 'Inter, sans-serif' }}>← Back to SOFree</a>
    </div>
  );
}
