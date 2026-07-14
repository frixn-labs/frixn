'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function Console() {
  const [taps, setTaps] = useState(347);
  const [leads, setLeads] = useState(289);

  const palette = ['#FF8952', '#E8C07D', '#2EBD85', '#8FA8C8', '#C89BB4'];
  const baseFeedInit = [
    { name: 'Arjun T.', city: 'Bengaluru' },
    { name: 'Sana K.', city: 'Mumbai' },
    { name: 'Vikram P.', city: 'Pune' },
    { name: 'Nia D.', city: 'Hyderabad' }
  ];
  const [feed, setFeed] = useState<ReadonlyArray<{ readonly name: string; readonly city: string }>>(baseFeedInit);

  useEffect(() => {
    const sec = document.getElementById('console');
    if (!sec) return;
    const reps = [
      ['Arjun T.', 'Bengaluru'], ['Sana K.', 'Mumbai'], ['Vikram P.', 'Pune'],
      ['Nia D.', 'Hyderabad'], ['Rohan B.', 'Bengaluru'], ['Kabir S.', 'Delhi']
    ];
    let timer: any = null;

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && !timer) {
          timer = setInterval(() => {
            const [name, city] = reps[Math.floor(Math.random() * reps.length)];
            setTaps(s => s + 1);
            setLeads(s => s + (Math.random() < 0.62 ? 1 : 0));
            setFeed(s => [{ name, city }, ...s].slice(0, 4));
          }, 3400 + Math.random() * 2000);
        } else if (!en.isIntersecting && timer) {
          clearInterval(timer);
          timer = null;
        }
      });
    }, { threshold: 0.2 });

    io.observe(sec);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  const perf = [
    { name: 'Arjun T.', taps: 61 },
    { name: 'Sana K.', taps: 54 },
    { name: 'Kabir S.', taps: 47 },
    { name: 'Nia D.', taps: 39 },
    { name: 'Rohan B.', taps: 31 }
  ].map((p, i) => ({ ...p, color: palette[i], w: `${Math.round(p.taps / 61 * 100)}%` }));

  const ago = ['now', '2m', '5m', '9m'];
  const feedWithColor = feed.map((f, i) => ({
    name: f.name,
    city: f.city,
    initial: f.name.charAt(0),
    color: palette[(f.name.charCodeAt(0) + f.name.length) % palette.length],
    time: ago[i] || '12m'
  }));

  return (
    <section
      id="console"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,77,0,.025) 0px, transparent 140px), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,77,0,.06), transparent 70%)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div data-v5r="" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.26em', color: '#FF8952' }}>06 — COMMAND</div>
            <h2 data-v5r="" data-d="100" style={{ margin: '18px 0 0', fontSize: 'clamp(32px,4vw,54px)', fontWeight: 600, letterSpacing: '-.035em', lineHeight: 1.05, color: '#F4F0EA' }}>
              Your reps tap.<br />
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#97908A' }}>
                You watch revenue happen.
              </span>
            </h2>
          </div>
          <p data-v5r="" data-d="180" style={{ margin: 0, maxWidth: '320px', fontSize: '14px', color: '#6E6862', lineHeight: 1.7 }}>
            Every tap on every card lands here in real time. <span style={{ color: '#F4F0EA' }}>This console is simulating live field taps now.</span>
          </p>
        </div>

        <div data-v5r="" data-d="240" style={{ marginTop: '50px', borderRadius: '16px', border: '1px solid rgba(255,255,255,.09)', background: '#0E0D0B', boxShadow: '0 0 0 1px rgba(0,0,0,.4), 0 60px 140px -50px rgba(0,0,0,.95)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#F4F0EA' }}>
                frixn<span style={{ color: '#FF4D00' }}>.</span>
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6E6862' }}>
                admin / command
              </span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(46,189,133,.35)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.16em', color: '#2EBD85' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#2EBD85' }} />
              LIVE
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ padding: '22px 20px', borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.18em', color: '#6E6862' }}>
                TAPS THIS MONTH
              </div>
              <div style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '34px', fontWeight: 600, color: '#FF8952', letterSpacing: '-1px' }}>
                {taps}
              </div>
            </div>
            <div style={{ padding: '22px 20px', borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.18em', color: '#6E6862' }}>
                LEADS CAPTURED
              </div>
              <div style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '34px', fontWeight: 600, color: '#2EBD85', letterSpacing: '-1px' }}>
                {leads}
              </div>
            </div>
            <div style={{ padding: '22px 20px', borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.18em', color: '#6E6862' }}>
                ACTIVE CARDS
              </div>
              <div style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '34px', fontWeight: 600, color: '#F4F0EA', letterSpacing: '-1px' }}>
                12
              </div>
            </div>
            <div style={{ padding: '22px 20px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.18em', color: '#6E6862' }}>
                RESPONSE RATE
              </div>
              <div style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '34px', fontWeight: 600, color: '#F4F0EA', letterSpacing: '-1px' }}>
                71%
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
            {/* performance */}
            <div style={{ padding: '24px 20px', borderRight: '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#F4F0EA' }}>Rep performance</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', letterSpacing: '.16em', color: '#6E6862' }}>
                  TAPS · THIS MONTH
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {perf.map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 34px', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#F4F0EA', whiteSpace: 'nowrap' }}>{p.name}</span>
                    <span style={{ height: '4px', borderRadius: '2px', background: 'rgba(244,240,234,.07)', overflow: 'hidden', display: 'block' }}>
                      <span style={{ display: 'block', height: '100%', borderRadius: '2px', background: p.color, width: p.w }}></span>
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11.5px', color: '#97908A', textAlign: 'right' }}>{p.taps}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* live feed */}
            <div style={{ padding: '24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#F4F0EA' }}>Live tap feed</span>
                <span style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#FF4D00' }}></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {feedWithColor.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 13px', borderRadius: '9px', background: 'rgba(244,240,234,.03)', border: '1px solid rgba(255,255,255,.05)' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#0B0A09', flexShrink: 0 }}>{f.initial}</span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: '13px', fontWeight: 600, color: '#F4F0EA' }}>
                      {f.name}
                      <span style={{ fontWeight: 400, color: '#6E6862' }}> · {f.city}</span>
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#6E6862', flexShrink: 0 }}>
                      {f.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.16em', color: '#6E6862' }}>
          <span>SIMULATION · NAMES ANONYMIZED · REAL PRODUCT</span>
          <span>EVERY TAP → A ROW. NO REP FILES A REPORT.</span>
        </div>

        {/* rep's own dashboard */}
        <div style={{ marginTop: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap', padding: '28px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,.08)', background: 'rgba(244,240,234,.02)' }}>
          <div style={{ maxWidth: '440px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.2em', color: '#FF8952' }}>
              AND FOR EVERY REP
            </div>
            <div style={{ marginTop: '10px', fontSize: '19px', fontWeight: 600, letterSpacing: '-.02em', color: '#F4F0EA' }}>
              Their own dashboard, on their phone.
            </div>
            <div style={{ marginTop: '8px', fontSize: '15px', lineHeight: 1.7, color: '#97908A' }}>
              Every user tracks their own leads and pipeline — who they met, who replied, who's due a follow-up. The manager sees the org; the rep owns their book.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', background: '#0E0D0B', minWidth: '110px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', letterSpacing: '.16em', color: '#6E6862' }}>
                MY LEADS
              </div>
              <div style={{ marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '28px', fontWeight: 600, color: '#F4F0EA' }}>
                23
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', background: '#0E0D0B', minWidth: '110px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', letterSpacing: '.16em', color: '#6E6862' }}>
                IN PIPELINE
              </div>
              <div style={{ marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '28px', fontWeight: 600, color: '#FF8952' }}>
                9
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,.07)', background: '#0E0D0B', minWidth: '110px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', letterSpacing: '.16em', color: '#6E6862' }}>
                FOLLOW-UPS DUE
              </div>
              <div style={{ marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '28px', fontWeight: 600, color: '#2EBD85' }}>
                4
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing({ seatPrice }: { seatPrice: number }) {
  const price10 = (seatPrice * 10).toLocaleString('en-IN');
  const price25 = (seatPrice * 25).toLocaleString('en-IN');

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,77,0,.025) 0px, transparent 140px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '60px', alignItems: 'center' }}>
        <div>
          <div data-v5r="" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.26em', color: '#FF8952' }}>08 — PRICING</div>
          <h2 data-v5r="" data-d="100" style={{ margin: '18px 0 0', fontSize: 'clamp(32px,4vw,54px)', fontWeight: 600, letterSpacing: '-.035em', lineHeight: 1.05, color: '#F4F0EA' }}>
            One price.<br />
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#97908A' }}>
              The math isn't subtle.
            </span>
          </h2>
          <p data-v5r="" data-d="180" style={{ margin: '24px 0 0', maxWidth: '400px', fontSize: '16px', color: '#97908A', lineHeight: 1.75 }}>
            One closed deal typically covers six months of Frixn for a ten-rep team. You'll know within thirty days.
          </p>
          <div data-v5r="" data-d="260" style={{ marginTop: '34px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', color: '#6E6862' }}>
            <div>
              At 10 reps — <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#F4F0EA' }}>₹{price10}/mo</span>
            </div>
            <div>
              At 25 reps — <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#F4F0EA' }}>₹{price25}/mo</span>
            </div>
            <div style={{ fontSize: '12px' }}>
              No lock-in. Cancel anytime. Your data is always yours.
            </div>
          </div>
        </div>

        <div data-v5r="" data-d="200" style={{ borderRadius: '18px', border: '1px solid rgba(255,77,0,.35)', background: 'linear-gradient(165deg,#161210,#0E0C0A)', boxShadow: '0 0 0 1px rgba(0,0,0,.4), 0 50px 120px -50px rgba(255,77,0,.35)', padding: '44px', boxSizing: 'border-box' }}>
          <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(255,77,0,.4)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.2em', color: '#FF8952' }}>
            LAUNCHING PRICE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '22px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '60px', fontWeight: 600, letterSpacing: '-3px', color: '#F4F0EA' }}>
              ₹{seatPrice}
            </span>
            <span style={{ fontSize: '15px', color: '#6E6862' }}>/seat/month</span>
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '28px 0' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '15px', color: '#97908A' }}>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>NFC cards for every rep, shipped same-day</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>3-field auto-filled capture on every tap</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>WhatsApp thread + proposal email, instant</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>Live command console, all reps, all events</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>Event ROI and response-rate analytics</div>
            <div style={{ display: 'flex', gap: '12px' }}><span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>Unlimited taps. Zero manual entry.</div>
          </div>
          <Link href="/contact" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '52px', borderRadius: '10px', background: '#FF4D00', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 16px 44px -16px rgba(255,77,0,.6)' }} className="v5-btn-getstarted-orange">
            Start converting meetings
          </Link>
        </div>
      </div>
    </section>
  );
}
