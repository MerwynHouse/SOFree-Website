import { useState, useEffect, useRef } from 'react';
import { B } from '../brand/index.js';

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled ? 'rgba(45,80,22,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: B.warmSand, letterSpacing: -0.3 }}>
        SOFree
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <a href="/blog" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(232,213,176,0.7)', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = B.warmSand}
          onMouseLeave={e => e.target.style.color = 'rgba(232,213,176,0.7)'}>
          Blog
        </a>
        <a href="#waitlist" style={{
          fontSize: 13, fontWeight: 700, color: B.white, fontFamily: 'Inter, sans-serif',
          background: B.heroGreen, borderRadius: 8, padding: '8px 18px',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.target.style.background = B.brightAccent}
          onMouseLeave={e => e.target.style.background = B.heroGreen}>
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function WaitlistForm({ light = false }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!email.includes('@')) return setError('Please enter a valid email.');
    setLoading(true); setError('');
    try {
      // MailerLite API call — replace GROUP_ID with your actual MailerLite group ID
      const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_MAILERLITE_API_KEY',
        },
        body: JSON.stringify({ email, groups: ['YOUR_GROUP_ID'], fields: { country: 'NZ' } }),
      });
      if (r.ok) {
        setDone(true);
        window.location.href = '/thank-you';
      } else {
        setError('Something went wrong. Try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBg    = light ? B.white : 'rgba(255,255,255,0.1)';
  const inputColor = light ? B.textDark : B.white;
  const inputBorder= light ? `1px solid ${B.borderLight}` : '1px solid rgba(255,255,255,0.15)';

  if (done) return (
    <div style={{ textAlign: 'center', padding: '12px 0' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: light ? B.heroGreen : B.warmSand, fontFamily: 'Inter, sans-serif' }}>
        ✓ You're on the list. We'll be in touch.
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your email address"
          style={{
            flex: 1, minWidth: 200, padding: '14px 16px', borderRadius: 10,
            border: inputBorder, background: inputBg, color: inputColor,
            fontSize: 15, fontFamily: 'Inter, sans-serif',
          }}
        />
        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '14px 22px', borderRadius: 10, background: B.heroGreen,
          color: B.white, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap', transition: 'background 0.2s',
          opacity: loading ? 0.7 : 1,
        }}
          onMouseEnter={e => { if (!loading) e.target.style.background = B.brightAccent; }}
          onMouseLeave={e => { if (!loading) e.target.style.background = B.heroGreen; }}>
          {loading ? 'Joining…' : 'JOIN THE WAITLIST — GET EARLY ACCESS'}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: B.redHigh, marginTop: 8, fontFamily: 'Inter, sans-serif' }}>{error}</p>}
      <p style={{ fontSize: 12, color: light ? B.textLight : 'rgba(232,213,176,0.5)', marginTop: 10, fontFamily: 'Inter, sans-serif' }}>
        Free to join. Be first when we launch.
      </p>
    </div>
  );
}

// ─── Block 1: Hero ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      background: B.deepOlive, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,163,42,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="fade-up" style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
        color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 24,
      }}>
        — The seed oil identification app —
      </div>

      <h1 className="fade-up-1" style={{
        fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 7vw, 72px)',
        fontWeight: 900, color: B.warmSand, lineHeight: 1.1,
        letterSpacing: -1.5, maxWidth: 760, marginBottom: 24,
      }}>
        Finally know what's actually in your food.
      </h1>

      <p className="fade-up-2" style={{
        fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'rgba(232,213,176,0.7)',
        fontFamily: 'Inter, sans-serif', lineHeight: 1.7,
        maxWidth: 560, marginBottom: 44,
      }}>
        SOFree scans any product and tells you straight: seed oils or not.
        No label decoding. No guesswork. Just a clear answer.
      </p>

      <div className="fade-up-3" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} id="waitlist">
        <WaitlistForm />
      </div>
    </section>
  );
}

// ─── Block 2: Stats Bar ───────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { number: '~80%',  label: 'of packaged foods contain seed oils' },
    { number: '3B+',   label: 'social impressions around seed oils in 2024' },
    { number: '62%',   label: 'of consumers now actively read ingredient labels' },
  ];
  return (
    <section style={{ background: B.heroGreen, padding: '48px 24px' }}>
      <div style={{
        maxWidth: 960, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32, textAlign: 'center',
      }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, color: B.brightAccent, lineHeight: 1 }}>
              {s.number}
            </div>
            <div style={{ fontSize: 14, color: B.warmSand, fontFamily: 'Inter, sans-serif', marginTop: 10, lineHeight: 1.5, opacity: 0.85 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Block 3: The Problem ─────────────────────────────────────────────────────
function Problem() {
  return (
    <section style={{ background: B.baseSand, padding: '96px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          The problem
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.15, marginBottom: 32 }}>
          Seed oils are hiding in plain sight.
        </h2>
        <p style={{ fontSize: 18, color: B.textMid, lineHeight: 1.8, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
          Canola. Soybean. Sunflower. Corn. Cottonseed. Grapeseed. Safflower. They're in approximately <strong style={{ color: B.deepOlive }}>80% of packaged and processed foods</strong> — and the food industry has no incentive to make that obvious.
        </p>
        <p style={{ fontSize: 18, color: B.textMid, lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
          Millions of people are trying to cut seed oils from their diet. But decoding an ingredient list at the supermarket? That takes a degree in food chemistry — or an app that does it for you.
        </p>
      </div>
    </section>
  );
}

// ─── Block 4: How It Works ────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Scan', body: 'Point your phone at any barcode or photograph an ingredient label. SOFree reads it instantly.' },
    { num: '02', title: 'Identify', body: 'Our seed oil index cross-references every ingredient against the most comprehensive database available. Instantly.' },
    { num: '03', title: 'Decide', body: 'Seed oil free ✓ — or not. A clear, binary verdict every time. No percentages. No guessing. Just the answer.' },
  ];
  return (
    <section style={{ background: B.deepOlive, padding: '96px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          How it works
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: B.warmSand, lineHeight: 1.15, marginBottom: 64 }}>
          Three steps. One answer.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 32,
              padding: '32px 0',
              borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 900, color: B.brightAccent, lineHeight: 1, flexShrink: 0, minWidth: 64 }}>
                {s.num}
              </div>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: B.warmSand, marginBottom: 10 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 16, color: 'rgba(232,213,176,0.7)', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Block 5: What We Check ───────────────────────────────────────────────────
function WhatWeCheck() {
  const flagged = ['Canola oil','Soybean oil','Sunflower oil','Corn oil','Cottonseed oil','Grapeseed oil','Safflower oil','Rice bran oil','Peanut oil','Palm olein','Vegetable oil (generic)','Partially hydrogenated oils'];
  const safe    = ['Extra virgin olive oil','Virgin coconut oil','Avocado oil','Grass-fed tallow','Lard','Butter / ghee','Duck fat','Macadamia oil'];

  return (
    <section style={{ background: B.white, padding: '96px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          The seed oils we catch
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.15, marginBottom: 16 }}>
          Every oil. Every alias. Every hiding spot.
        </h2>
        <p style={{ fontSize: 16, color: B.textMid, lineHeight: 1.7, maxWidth: 640, marginBottom: 52, fontFamily: 'Inter, sans-serif' }}>
          The food industry loves creative labelling. 'Liquid vegetable oil.' 'Blend of oils.' 'Refined vegetable fat.' SOFree knows every alias and calls them all out.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Flagged */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.redHigh, fontFamily: 'Inter, sans-serif', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
              ✗ Flagged — avoid these
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {flagged.map(oil => (
                <span key={oil} style={{
                  background: B.redHighBg, color: B.redHigh, borderRadius: 20,
                  padding: '6px 14px', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  border: `1px solid rgba(196,98,45,0.2)`,
                }}>
                  {oil}
                </span>
              ))}
            </div>
          </div>

          {/* Safe */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.heroGreen, fontFamily: 'Inter, sans-serif', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
              ✓ Better alternatives
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {safe.map(oil => (
                <span key={oil} style={{
                  background: '#e8f5e0', color: B.heroGreen, borderRadius: 20,
                  padding: '6px 14px', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  border: `1px solid rgba(74,124,47,0.2)`,
                }}>
                  {oil}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Block 6: Features ────────────────────────────────────────────────────────
function Features() {
  const features = [
    { title: 'Real barcode scanning', body: 'Point at any product. No manual searching or typing required. Works on anything with a barcode.' },
    { title: 'Instant results', body: 'The verdict comes back in under a second. Scan it on the shelf before you put it in your trolley.' },
    { title: 'Binary verdict — no grey areas', body: 'Seed oil free, or not. We don\'t give you a wellness score or a percentage. Just the answer you need.' },
    { title: 'Build your safe lists', body: 'Save your approved products and build a personal seed-oil-free shopping list over time.' },
    { title: 'Search by name', body: 'Don\'t have the product in front of you? Search by name and check before you shop.' },
    { title: 'Track your streak', body: 'XP, levels, badges, and a weekly streak calendar. Cutting seed oils should feel like winning.' },
  ];

  return (
    <section style={{ background: B.baseSand, padding: '96px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          Why SOFree
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.15, marginBottom: 64 }}>
          Built for one thing.<br />Better at it than anyone.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: B.white, padding: '32px 28px',
              borderRadius: 0,
              border: `1px solid ${B.borderLight}`,
              marginRight: -1, marginBottom: -1,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: B.heroGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: B.white }} />
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: B.deepOlive, marginBottom: 10 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: B.textMid, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
                {f.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Block 7: What We Are Not ─────────────────────────────────────────────────
function WhatWeAreNot() {
  const notList = ['diet app','calorie counter','keto tracker','wellness platform','allergen checker','meal planner','nutrition coach','sugar tracker','food logger','supplement recommender'];
  return (
    <section style={{ background: B.heroGreen, padding: '96px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: B.warmSand, marginBottom: 16 }}>
          We are one thing only.
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: 'rgba(232,213,176,0.8)', marginBottom: 40, fontStyle: 'italic' }}>
          The world's most focused seed oil identification tool.
        </div>
        <div style={{ fontSize: 14, color: 'rgba(232,213,176,0.5)', fontFamily: 'Inter, sans-serif', lineHeight: 2.2 }}>
          {notList.join(' · ')}
        </div>
      </div>
    </section>
  );
}

// ─── Block 8: Main Waitlist CTA ───────────────────────────────────────────────
function WaitlistCTA() {
  return (
    <section style={{ background: B.deepOlive, padding: '96px 24px', textAlign: 'center' }} id="waitlist-main">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 900, color: B.brightAccent, lineHeight: 1, marginBottom: 24 }}>
          Be first.
        </h2>
        <p style={{ fontSize: 18, color: B.warmSand, fontFamily: 'Inter, sans-serif', lineHeight: 1.7, marginBottom: 44, opacity: 0.85 }}>
          SOFree is launching soon in New Zealand. Join the waitlist and be among the first to know what's actually in your food.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

// ─── Block 9: FAQ ────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: 'What are seed oils and why should I avoid them?',
      a: 'Seed oils — canola, soybean, sunflower, corn, cottonseed, grapeseed, and safflower — are industrially processed oils extracted using heat, chemicals, and high pressure. They\'re high in omega-6 fatty acids and present in roughly 80% of packaged foods. Many people choose to avoid them for reasons related to inflammation and metabolic health.',
    },
    {
      q: 'How does SOFree identify seed oils in food?',
      a: 'SOFree uses barcode scanning and a comprehensive seed oil ingredient index to check every ingredient in a product against a database of seed oils and their aliases. You get a clear, instant verdict: seed oil free, or not. No guesswork required.',
    },
    {
      q: 'Which seed oils does SOFree check for?',
      a: 'SOFree checks for all major seed oils including canola oil, soybean oil, sunflower oil, corn oil, cottonseed oil, grapeseed oil, safflower oil, and rice bran oil — as well as generic labels like \'vegetable oil\', \'refined vegetable fat\', and \'liquid vegetable oil blend\'.',
    },
    {
      q: 'Is SOFree available on iPhone and Android?',
      a: 'SOFree is currently available as a web app, with native iOS and Android apps launching soon. Join the waitlist to be notified the moment we launch — and to get early access before the public release.',
    },
    {
      q: 'Is SOFree free to use?',
      a: 'SOFree offers a free tier with core scanning features. A premium subscription at $3.99/month unlocks unlimited scans, custom lists, full scan history, and the full gamification suite. Join the waitlist for early access and founding-member pricing.',
    },
    {
      q: 'What oils are seed oil free?',
      a: 'Oils that are not seed oils include extra virgin olive oil, virgin coconut oil, avocado oil, grass-fed tallow, lard, butter, ghee, duck fat, and macadamia oil. SOFree gives these products the green light — and flags any product that contains seed oils instead.',
    },
  ];

  return (
    <section style={{ background: B.white, padding: '96px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: B.brightAccent, fontFamily: 'Inter, sans-serif', marginBottom: 20 }}>
          Frequently asked questions
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: B.deepOlive, lineHeight: 1.15, marginBottom: 52 }}>
          Everything you want to know about seed oils — and SOFree.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '24px 0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 700, color: B.deepOlive, lineHeight: 1.4, borderLeft: `3px solid ${B.brightAccent}`, paddingLeft: 16 }}>
                  {faq.q}
                </span>
                <span style={{ color: B.textLight, fontSize: 20, flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {open === i && (
                <div style={{ paddingLeft: 19, paddingBottom: 24, fontSize: 15, color: B.textMid, lineHeight: 1.8, fontFamily: 'Inter, sans-serif', animation: 'slideDown 0.2s ease' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Block 10: Footer ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: B.deepOlive, padding: '56px 24px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 900, color: B.warmSand, marginBottom: 8 }}>
        SOFree
      </div>
      <div style={{ fontSize: 13, color: 'rgba(232,213,176,0.6)', fontFamily: 'Inter, sans-serif', fontStyle: 'italic', marginBottom: 32 }}>
        Know what's in it. Cut the seed oils. Live freer.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Blog', href: '/blog' },
          { label: 'contact@sofree.app', href: 'mailto:contact@sofree.app' },
        ].map(l => (
          <a key={l.label} href={l.href} style={{ fontSize: 13, color: 'rgba(232,213,176,0.6)', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = B.warmSand}
            onMouseLeave={e => e.target.style.color = 'rgba(232,213,176,0.6)'}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(232,213,176,0.35)', fontFamily: 'Inter, sans-serif' }}>
        © 2026 SOFree. All rights reserved. · Privacy Policy · Terms of Use
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <Problem />
      <HowItWorks />
      <WhatWeCheck />
      <Features />
      <WhatWeAreNot />
      <WaitlistCTA />
      <FAQ />
      <Footer />
    </>
  );
}
