import { useState, useEffect, useRef } from 'react';
import { B } from '../brand/index.js';

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }

  .sf-reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .sf-reveal.visible { opacity: 1; transform: none; }
  .sf-d1 { transition-delay: 0.1s; }
  .sf-d2 { transition-delay: 0.2s; }
  .sf-d3 { transition-delay: 0.3s; }

  .sf-pill-bad  { background: rgba(196,98,45,0.15); color: #F4A07A; border: 1px solid rgba(196,98,45,0.25); border-radius: 24px; padding: 7px 16px; font-size: 13px; font-weight: 600; display: inline-block; transition: transform 0.15s; }
  .sf-pill-bad:hover { transform: translateY(-2px); }
  .sf-pill-good { background: rgba(107,163,42,0.15); color: #A8C87A; border: 1px solid rgba(107,163,42,0.25); border-radius: 24px; padding: 7px 16px; font-size: 13px; font-weight: 600; display: inline-block; transition: transform 0.15s; }
  .sf-pill-good:hover { transform: translateY(-2px); }

  .sf-feature-card { background: #fff; padding: 36px 32px; transition: background 0.2s; }
  .sf-feature-card:hover { background: #FAFAF8; }

  .sf-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding-bottom 0.3s ease; }
  .sf-faq-open .sf-faq-a { max-height: 300px; padding-bottom: 24px; }
  .sf-faq-toggle { transition: transform 0.3s; }
  .sf-faq-open .sf-faq-toggle { transform: rotate(45deg); }

  .sf-nav-link { font-size: 14px; font-weight: 500; color: rgba(232,213,176,0.65); transition: color 0.2s; }
  .sf-nav-link:hover { color: #E8D5B0; }
  .sf-nav-cta { font-size: 14px; font-weight: 700; color: #fff; background: #4A7C2F; border-radius: 9px; padding: 10px 22px; transition: background 0.2s, transform 0.15s; display: inline-block; }
  .sf-nav-cta:hover { background: #6BA32A; transform: translateY(-1px); }

  .sf-footer-link { display: block; font-size: 14px; color: rgba(232,213,176,0.6); margin-bottom: 10px; transition: color 0.2s; }
  .sf-footer-link:hover { color: #E8D5B0; }

  @media (max-width: 768px) {
    .sf-split { grid-template-columns: 1fr !important; gap: 40px !important; }
    .sf-stats { grid-template-columns: 1fr !important; }
    .sf-stat + .sf-stat { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.15) !important; padding-top: 32px !important; }
    .sf-oils-grid { grid-template-columns: 1fr !important; }
    .sf-features-grid { grid-template-columns: 1fr !important; }
    .sf-footer-top { flex-direction: column !important; }
    .sf-footer-links { flex-direction: column !important; gap: 32px !important; }
    .sf-footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
    .sf-hide-mobile { display: none !important; }
    .sf-hero-h1 { font-size: clamp(40px, 11vw, 84px) !important; }
  }
`;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    ref.current.querySelectorAll('.sf-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function WaitlistForm({ dark = true }) {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async () => {
    if (!email.includes('@')) return setError('Please enter a valid email.');
    setLoading(true); setError('');
    try {
      const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_MAILERLITE_API_KEY' },
        body: JSON.stringify({ email, groups: ['YOUR_GROUP_ID'], fields: { country: 'NZ' } }),
      });
      if (r.ok) { setDone(true); window.location.href = '/thank-you'; }
      else setError('Something went wrong. Try again.');
    } catch { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    flex: 1, minWidth: 200, padding: '15px 18px', borderRadius: 11,
    border: `1.5px solid ${dark ? 'rgba(255,255,255,0.12)' : B.borderLight}`,
    background: dark ? 'rgba(255,255,255,0.08)' : B.white,
    color: dark ? B.warmSand : B.textDark,
    fontSize: 15, fontFamily: 'Inter, sans-serif',
  };

  if (done) return <div style={{ fontSize: 15, fontWeight: 700, color: dark ? B.warmSand : B.heroGreen, fontFamily: 'Inter, sans-serif' }}>✓ You're on the list. We'll be in touch.</div>;

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your email address" style={inputStyle} />
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '15px 22px', borderRadius: 11, background: B.heroGreen, color: B.white,
          fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
          opacity: loading ? 0.7 : 1, transition: 'background 0.2s',
        }}
          onMouseEnter={e => { if (!loading) e.target.style.background = B.brightAccent; }}
          onMouseLeave={e => { if (!loading) e.target.style.background = B.heroGreen; }}>
          {loading ? 'Joining…' : 'JOIN THE WAITLIST'}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: '#F4A07A', marginTop: 8, fontFamily: 'Inter, sans-serif' }}>{error}</p>}
      <p style={{ fontSize: 12, color: dark ? 'rgba(232,213,176,0.35)' : B.textLight, marginTop: 12, fontFamily: 'Inter, sans-serif' }}>
        Free to join. Be first when we launch in New Zealand.
      </p>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 68, padding: '0 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(45,80,22,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <a href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 900, color: B.warmSand, letterSpacing: -0.5 }}>SOFree</a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#how" className="sf-nav-link sf-hide-mobile">How it works</a>
        <a href="#faq" className="sf-nav-link sf-hide-mobile">FAQ</a>
        <a href="#cta-main" className="sf-nav-cta">Join Waitlist</a>
      </div>
    </nav>
  );
}

function Hero() {
  const ref = useReveal();
  useEffect(() => {
    document.querySelectorAll('#sf-hero .sf-reveal').forEach(el => el.classList.add('visible'));
  }, []);
  return (
    <section id="sf-hero" ref={ref} style={{
      minHeight: '100vh', background: B.deepOlive,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '140px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,163,42,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div className="sf-reveal" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 28, position: 'relative' }}>
        — The seed oil identification app —
      </div>
      <h1 className="sf-reveal sf-d1 sf-hero-h1" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(44px, 7.5vw, 84px)', fontWeight: 900, color: B.warmSand, lineHeight: 1.05, letterSpacing: -2, maxWidth: 820, marginBottom: 28, position: 'relative' }}>
        Finally know what's <em style={{ fontStyle: 'italic', color: B.softHighlight }}>actually</em> in your food.
      </h1>
      <p className="sf-reveal sf-d2" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(232,213,176,0.65)', lineHeight: 1.75, maxWidth: 520, marginBottom: 52, position: 'relative', fontFamily: 'Inter, sans-serif' }}>
        SOFree scans any product and tells you straight: seed oils or not. No label decoding. No guesswork. Just a clear answer.
      </p>
      <div className="sf-reveal sf-d3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
        <WaitlistForm dark={true} />
      </div>
    </section>
  );
}

function Stats() {
  const ref = useReveal();
  const stats = [
    { num: '~80%', label: 'of packaged foods contain seed oils' },
    { num: '3B+',  label: 'social impressions around seed oils in 2024' },
    { num: '62%',  label: 'of consumers now actively read ingredient labels' },
  ];
  return (
    <section ref={ref} style={{ background: B.heroGreen, padding: '56px 48px' }}>
      <div className="sf-stats" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
        {stats.map((s, i) => (
          <div key={i} className={`sf-stat sf-reveal sf-d${i}`} style={{ padding: '0 32px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px,5vw,60px)', fontWeight: 900, color: B.warmSand, lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontSize: 14, color: 'rgba(232,213,176,0.6)', marginTop: 10, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const ref = useReveal();
  const ingredients = [
    { name: 'Wheat flour', bad: false },
    { name: 'Sugar', bad: false },
    { name: 'Canola oil ⚠', bad: true },
    { name: 'Salt', bad: false },
    { name: 'Soybean oil ⚠', bad: true },
    { name: 'Natural flavours', bad: false },
  ];
  return (
    <section ref={ref} style={{ background: B.white, padding: '112px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="sf-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="sf-reveal">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>The problem</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.1, letterSpacing: -1, marginBottom: 24 }}>Seed oils are hiding in plain sight.</h2>
            <p style={{ fontSize: 17, color: B.textMid, lineHeight: 1.8, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Canola. Soybean. Sunflower. Corn. Cottonseed. Grapeseed. Safflower. They're in approximately <strong style={{ color: B.deepOlive }}>80% of packaged foods</strong> — and the food industry has no incentive to make that obvious.</p>
            <p style={{ fontSize: 17, color: B.textMid, lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>Millions of people are trying to cut seed oils from their diet. But decoding an ingredient list at the supermarket? That takes a degree in food chemistry — or an app that does it for you.</p>
          </div>
          <div className="sf-reveal sf-d1" style={{ background: B.baseSand, borderRadius: 20, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: B.white, borderRadius: 14, padding: '20px 24px', width: 280, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, right: -12, background: B.redHigh, color: B.white, borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(196,98,45,0.4)' }}>✗</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: B.deepOlive, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Inter, sans-serif' }}>Ingredients</div>
              {ingredients.map((ing, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < ingredients.length - 1 ? `1px solid ${B.borderLight}` : 'none', fontSize: 13, fontFamily: 'Inter, sans-serif', color: ing.bad ? B.redHigh : B.textMid, fontWeight: ing.bad ? 700 : 400 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: ing.bad ? B.redHigh : B.heroGreen }} />
                  {ing.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const ref = useReveal();
  const steps = [
    { num: '01', title: 'Scan', body: 'Point your phone at any barcode or photograph an ingredient label. SOFree reads it instantly — no typing, no searching, no waiting.' },
    { num: '02', title: 'Identify', body: 'Our seed oil index cross-references every ingredient against the most comprehensive database available. Every alias. Every hiding spot. Instantly.' },
    { num: '03', title: 'Decide', body: 'Seed oil free ✓ — or not. A clear, binary verdict every time. No percentages. No wellness scores. No guessing. Just the answer you need.' },
  ];
  return (
    <section id="how" ref={ref} style={{ background: B.baseSand, padding: '112px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="sf-reveal">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>How it works</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.1, letterSpacing: -1 }}>Three steps. One answer.</h2>
        </div>
        <div style={{ marginTop: 64 }}>
          {steps.map((s, i) => (
            <div key={i} className="sf-reveal" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, alignItems: 'start', padding: '40px 0', borderBottom: i < steps.length - 1 ? `1px solid ${B.borderLight}` : 'none' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 56, fontWeight: 900, color: B.softHighlight, lineHeight: 1 }}>{s.num}</div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: B.deepOlive, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 16, color: B.textMid, lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Oils() {
  const ref = useReveal();
  const flagged = ['Canola oil','Soybean oil','Sunflower oil','Corn oil','Cottonseed oil','Grapeseed oil','Safflower oil','Rice bran oil','Peanut oil','Palm olein','Vegetable oil (generic)','Partially hydrogenated oils'];
  const safe    = ['Extra virgin olive oil','Virgin coconut oil','Avocado oil','Grass-fed tallow','Lard','Butter / ghee','Duck fat','Macadamia oil'];
  return (
    <section id="oils" ref={ref} style={{ background: B.deepOlive, padding: '112px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="sf-reveal">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.softHighlight, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>The seed oils we catch</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, color: B.warmSand, lineHeight: 1.1, letterSpacing: -1, marginBottom: 16 }}>Every oil. Every alias. Every hiding spot.</h2>
          <p style={{ fontSize: 17, color: 'rgba(232,213,176,0.65)', lineHeight: 1.8, maxWidth: 600, marginBottom: 52, fontFamily: 'Inter, sans-serif' }}>The food industry loves creative labelling. 'Liquid vegetable oil.' 'Blend of oils.' 'Refined vegetable fat.' SOFree knows every alias and calls them all out.</p>
        </div>
        <div className="sf-oils-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div className="sf-reveal sf-d1">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#F4A07A', fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>✗ Flagged — avoid these</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{flagged.map(o => <span key={o} className="sf-pill-bad">{o}</span>)}</div>
          </div>
          <div className="sf-reveal sf-d2">
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: B.softHighlight, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>✓ Better alternatives</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{safe.map(o => <span key={o} className="sf-pill-good">{o}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const ref = useReveal();
  const features = [
    { title: 'Real barcode scanning', body: 'Point at any product. No manual searching or typing required. Works on anything with a barcode.', icon: <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/> },
    { title: 'Instant results', body: 'The verdict comes back in under a second. Scan it on the shelf before you put it in your trolley.', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
    { title: 'Binary verdict — no grey areas', body: "Seed oil free, or not. We don't give you a wellness score or a percentage. Just the answer you need.", icon: <polyline points="20 6 9 17 4 12"/> },
    { title: 'Build your safe lists', body: 'Save your approved products and build a personal seed-oil-free shopping list over time.', icon: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></> },
    { title: 'Search by name', body: "Don't have the product in front of you? Search by name and check before you shop.", icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></> },
    { title: 'Track your streak', body: 'XP, levels, badges, and a weekly streak calendar. Cutting seed oils should feel like winning.', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
  ];
  return (
    <section id="features" ref={ref} style={{ background: B.white, padding: '112px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="sf-reveal">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>Why SOFree</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.1, letterSpacing: -1, marginBottom: 4 }}>Built for one thing.</h2>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, color: B.brightAccent, lineHeight: 1.1, letterSpacing: -1 }}>Better at it than anyone.</h2>
        </div>
        <div className="sf-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: B.borderLight, border: `1px solid ${B.borderLight}`, borderRadius: 16, overflow: 'hidden', marginTop: 56 }}>
          {features.map((f, i) => (
            <div key={i} className={`sf-feature-card sf-reveal sf-d${i % 3}`}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: B.deepOlive, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 700, color: B.deepOlive, marginBottom: 10, lineHeight: 1.3 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: B.textMid, lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Positioning() {
  const ref = useReveal();
  const notList = ['diet app','calorie counter','keto tracker','wellness platform','allergen checker','meal planner','nutrition coach','sugar tracker','food logger','supplement recommender'];
  return (
    <section ref={ref} style={{ background: B.heroGreen, padding: '96px 48px', textAlign: 'center' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="sf-reveal" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, color: B.warmSand, marginBottom: 14 }}>We are one thing only.</div>
        <div className="sf-reveal sf-d1" style={{ fontSize: 18, color: 'rgba(232,213,176,0.65)', fontStyle: 'italic', fontFamily: 'Inter, sans-serif', marginBottom: 48 }}>The world's most focused seed oil identification tool.</div>
        <div className="sf-reveal sf-d2" style={{ fontSize: 14, color: 'rgba(232,213,176,0.4)', lineHeight: 2.4, fontFamily: 'Inter, sans-serif' }}>{notList.join(' · ')}</div>
      </div>
    </section>
  );
}

function MainCTA() {
  const ref = useReveal();
  return (
    <section id="cta-main" ref={ref} style={{ background: B.deepOlive, padding: '112px 48px', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="sf-reveal" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(64px,10vw,120px)', fontWeight: 900, color: B.brightAccent, lineHeight: 0.95, letterSpacing: -3, marginBottom: 28 }}>Be first.</div>
        <p className="sf-reveal sf-d1" style={{ fontSize: 18, color: 'rgba(232,213,176,0.7)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.75, fontFamily: 'Inter, sans-serif' }}>SOFree is launching soon in New Zealand. Join the waitlist and be among the first to know what's actually in your food.</p>
        <div className="sf-reveal sf-d2" style={{ display: 'flex', justifyContent: 'center' }}>
          <WaitlistForm dark={true} />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const ref = useReveal();
  const faqs = [
    { q: 'What are seed oils and why should I avoid them?', a: "Seed oils — canola, soybean, sunflower, corn, cottonseed, grapeseed, and safflower — are industrially processed oils extracted using heat, chemicals, and high pressure. They're high in omega-6 fatty acids and present in roughly 80% of packaged foods. Many people choose to avoid them for reasons related to inflammation and metabolic health." },
    { q: 'How does SOFree identify seed oils in food?', a: 'SOFree uses barcode scanning and a comprehensive seed oil ingredient index to check every ingredient in a product against a database of seed oils and their aliases. You get a clear, instant verdict: seed oil free, or not. No guesswork required.' },
    { q: 'Which seed oils does SOFree check for?', a: "SOFree checks for all major seed oils including canola oil, soybean oil, sunflower oil, corn oil, cottonseed oil, grapeseed oil, safflower oil, and rice bran oil — as well as generic labels like 'vegetable oil', 'refined vegetable fat', and 'liquid vegetable oil blend'." },
    { q: 'Is SOFree available on iPhone and Android?', a: 'SOFree is currently available as a web app, with native iOS and Android apps launching soon. Join the waitlist to be notified the moment we launch — and to get early access before the public release.' },
    { q: 'Is SOFree free to use?', a: "SOFree offers a free tier with core scanning features. A premium subscription at $3.99/month unlocks unlimited scans, custom lists, full scan history, and the full gamification suite. Join the waitlist for early access and founding-member pricing." },
    { q: 'What oils are seed oil free?', a: 'Oils that are not seed oils include extra virgin olive oil, virgin coconut oil, avocado oil, grass-fed tallow, lard, butter, ghee, duck fat, and macadamia oil. SOFree gives these products the green light — and flags any product that contains seed oils instead.' },
  ];
  return (
    <section id="faq" ref={ref} style={{ background: B.baseSand, padding: '112px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="sf-reveal">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>Frequently asked questions</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.15, marginBottom: 52 }}>Everything you want to know about seed oils — and SOFree.</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className={`sf-reveal ${open === i ? 'sf-faq-open' : ''}`} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: B.deepOlive, paddingLeft: 18, borderLeft: `3px solid ${B.brightAccent}`, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>{faq.q}</span>
              <span className="sf-faq-toggle" style={{ width: 28, height: 28, borderRadius: '50%', background: open === i ? B.deepOlive : B.baseSand, border: `1px solid ${B.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: open === i ? B.white : B.textLight, flexShrink: 0 }}>+</span>
            </button>
            <div className="sf-faq-a">
              <p style={{ fontSize: 15, color: B.textMid, lineHeight: 1.85, paddingLeft: 21, fontFamily: 'Inter, sans-serif' }}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: B.deepOlive, padding: '64px 48px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="sf-footer-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: B.warmSand, marginBottom: 8 }}>SOFree</div>
            <div style={{ fontSize: 13, color: 'rgba(232,213,176,0.45)', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 260, fontFamily: 'Inter, sans-serif' }}>Know what's in it. Cut the seed oils. Live freer.</div>
          </div>
          <div className="sf-footer-links" style={{ display: 'flex', gap: 48 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(232,213,176,0.4)', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Product</div>
              <a href="#how"  className="sf-footer-link">How it works</a>
              <a href="#oils" className="sf-footer-link">Seed oil index</a>
              <a href="#faq"  className="sf-footer-link">FAQ</a>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(232,213,176,0.4)', marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Company</div>
              <a href="/blog" className="sf-footer-link">Blog</a>
              <a href="mailto:contact@sofree.app" className="sf-footer-link">Contact</a>
            </div>
          </div>
        </div>
        <div className="sf-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(232,213,176,0.25)', fontFamily: 'Inter, sans-serif' }}>© 2026 SOFree. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms of Use'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(232,213,176,0.25)', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}>{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <style>{CSS}</style>
      <Nav />
      <Hero />
      <Stats />
      <Problem />
      <HowItWorks />
      <Oils />
      <Features />
      <Positioning />
      <MainCTA />
      <FAQ />
      <Footer />
    </>
  );
}