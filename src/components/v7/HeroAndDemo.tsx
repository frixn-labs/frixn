'use client';

import React, { useEffect, useRef } from 'react';

export function HeroAndDemo() {
  const demoRunningRef = useRef(false);
  const demoPlayedRef = useRef(false);
  const timersRef = useRef<any[]>([]);

  useEffect(() => {
    // Spawns 14 glowing pulses in the background dots wrapper
    const wrap = document.getElementById('v7dots');
    if (wrap && wrap.childElementCount === 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 14; i++) {
        const d = document.createElement('div');
        const s = (2 + Math.random() * 2).toFixed(1);
        const warm = Math.random() < 0.62;
        d.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;` +
          `width:${s}px;height:${s}px;` +
          `left:${(4 + Math.random() * 92).toFixed(1)}%;` +
          `top:${(4 + Math.random() * 92).toFixed(1)}%;` +
          `background:${warm ? 'rgba(255,77,0,.35)' : 'rgba(232,192,125,.25)'};` +
          `animation:v7pulse ${(2 + Math.random() * 5).toFixed(2)}s ease-in-out infinite;` +
          `animation-delay:-${(Math.random() * 5).toFixed(2)}s;`;
        fragment.appendChild(d);
      }
      wrap.appendChild(fragment);
    }

    // Pointer mouse tilt for Hero card
    const card = document.getElementById('v5card');
    if (card) {
      const wrap = card.parentElement;
      if (wrap) {
        const mm = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
        };
        const ml = () => { card.style.transform = 'rotateX(0deg) rotateY(0deg)'; };
        wrap.addEventListener('mousemove', mm);
        wrap.addEventListener('mouseleave', ml);
        return () => {
          wrap.removeEventListener('mousemove', mm);
          wrap.removeEventListener('mouseleave', ml);
        };
      }
    }
  }, []);

  // Demo autoplay when the section enters the screen
  useEffect(() => {
    const sec = document.getElementById('moment');
    if (!sec) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && !demoPlayedRef.current) {
          io.disconnect();
          const t = setTimeout(() => {
            if (!demoPlayedRef.current) {
              runDemo();
            }
          }, 700);
          timersRef.current.push(t);
        }
      });
    }, { threshold: 0.45 });
    io.observe(sec);
    return () => {
      io.disconnect();
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const runDemo = () => {
    if (demoRunningRef.current) return;
    demoRunningRef.current = true;
    demoPlayedRef.current = true;

    const $ = (id: string) => document.getElementById(id);
    const at = (ms: number, fn: () => void) => {
      const t = setTimeout(fn, ms);
      timersRef.current.push(t);
    };

    const rail = $('v5rail'), form = $('v5form'), wa = $('v5wa'),
      send = $('v5send'), auto = $('v5auto'), row = $('v5row'),
      msg = $('v5msg'), del = $('v5del'), count = $('v5count'),
      playLabel = $('v5playLabel'), demoCard = $('v5demoCard');

    const fields = [1, 2, 3].map(i => [$('v5f' + i), $('v5a' + i)]);
    const dots = [1, 2, 3].map(i => $('v5s' + i + 'dot'));
    const stations = [1, 2, 3].map(i => $('v5s' + i));
    const tags = [0, 1, 2, 3].map(i => $('v5t' + i));

    if (!rail) { demoRunningRef.current = false; return; }

    // reset elements
    rail.style.transform = 'scaleX(0)';
    if (form) { form.style.opacity = '1'; form.style.filter = 'blur(0)'; }
    if (wa) { wa.style.opacity = '0'; wa.style.filter = 'blur(4px)'; }
    fields.forEach(([f, a]) => { if (f) f.textContent = ''; if (a) a.style.opacity = '0'; });
    if (auto) { auto.textContent = '3 FIELDS'; auto.style.color = '#B4AA9C'; }
    if (send) { send.style.background = '#DAD3C8'; send.style.transform = 'none'; }
    if (row) { row.style.opacity = '0'; row.style.transform = 'translateY(8px)'; row.style.filter = 'blur(4px)'; }
    if (msg) msg.textContent = '';
    if (del) del.style.opacity = '0';
    dots.forEach(d => { if (d) d.style.background = '#33302c'; });
    stations.forEach(s => { if (s) { s.style.borderColor = 'rgba(255,255,255,.08)'; s.style.boxShadow = 'none'; } });
    tags.forEach(t => { if (t) t.style.color = '#6E6862'; });
    if (playLabel) playLabel.textContent = 'Playing…';

    const lite = (i: number) => {
      const s = stations[i], d = dots[i];
      if (s) { s.style.borderColor = 'rgba(255,77,0,.45)'; s.style.boxShadow = '0 0 0 1px rgba(255,77,0,.15), 0 24px 60px -30px rgba(255,77,0,.3)'; }
      if (d) d.style.background = '#FF4D00';
    };
    const dim = (i: number) => {
      const s = stations[i];
      if (s) { s.style.borderColor = 'rgba(255,255,255,.08)'; s.style.boxShadow = 'none'; }
      if (dots[i]) dots[i].style.background = '#2EBD85';
    };
    const tag = (i: number) => { if (tags[i]) tags[i].style.color = i === 3 ? '#2EBD85' : '#FF8952'; };
    const railTo = (p: number) => { rail.style.transform = `scaleX(${p})`; };

    // 1 · TAP
    lite(0); tag(0); railTo(0.12);
    if (demoCard && demoCard.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      demoCard.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }],
        { duration: 450, easing: 'cubic-bezier(.21,.9,.27,1)' });
    }

    // 2 · AUTO-FILL
    const vals = ['Ananya Rao', '+91 98••• •4521', 'Nexlify Tech'];
    at(800, () => { dim(0); lite(1); tag(1); railTo(0.4); if (auto) auto.textContent = 'AUTO-FILLING…'; });
    const fill = (i: number) => {
      const [f, a] = fields[i];
      if (f) f.textContent = vals[i];
      if (a) a.style.opacity = '1';
    };
    at(1050, () => fill(0));
    at(1300, () => fill(1));
    at(1550, () => { fill(2); if (auto) { auto.textContent = '90% AUTO-FILLED'; auto.style.color = '#1E9E6A'; } });

    // 3 · SEND
    at(2200, () => { tag(2); railTo(0.66); if (send) send.style.background = '#FF4D00'; });
    at(2650, () => { if (send) send.style.transform = 'scale(.95)'; });
    at(2800, () => { if (send) send.style.transform = 'scale(1)'; });
    at(2950, () => {
      if (form) { form.style.opacity = '0'; form.style.filter = 'blur(4px)'; }
      if (wa) { wa.style.opacity = '1'; wa.style.filter = 'blur(0)'; }
    });
    const text = 'Hi Rahul, great meeting you at the expo — send me the details';
    at(3300, () => {
      let i = 0;
      const type = () => {
        if (!msg) return;
        msg.textContent = text.slice(0, i);
        i += 2;
        if (i <= text.length + 1) {
          const t = setTimeout(type, 22);
          timersRef.current.push(t);
        } else if (del) {
          del.style.opacity = '1';
        }
      };
      type();
    });

    // 4 · CAPTURED
    at(4500, () => { dim(1); lite(2); tag(3); railTo(1); });
    at(4800, () => {
      if (row) { row.style.opacity = '1'; row.style.transform = 'translateY(0)'; row.style.filter = 'blur(0)'; }
      if (count) count.textContent = '290';
    });
    at(5600, () => {
      dim(2);
      if (playLabel) playLabel.textContent = 'Replay';
      demoRunningRef.current = false;
    });
  };

  return (
    <>
      {/* ============ 01 HERO ============ */}
      <section
        id="top"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 60px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,77,0,.11), transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 30% at 50% 65%, rgba(255,77,0,.07), transparent 60%)', pointerEvents: 'none' }} />
        <div id="v7dots" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1000px' }}>
          <div data-v5r="" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '7px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,.1)', background: 'rgba(244,240,234,.03)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10.5px', fontWeight: 500, letterSpacing: '.22em', color: '#97908A' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#FF4D00' }} />OFFLINE → ONLINE REVENUE OS
          </div>

          <h1 style={{ margin: '34px 0 0', textAlign: 'center', fontSize: 'clamp(38px,5.6vw,84px)', fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1.1, color: '#F4F0EA' }}>
            <span data-v5r="" data-d="80" style={{ display: 'block' }}>Meetings end.</span>
            <span data-v5r="" data-d="220" style={{ display: 'block', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#FF8952', letterSpacing: '-.02em', lineHeight: 1.18 }}>The follow-up begins itself.</span>
          </h1>

          <p data-v5r="" data-d="360" style={{ margin: '28px 0 0', maxWidth: '380px', textAlign: 'center', fontSize: '19px', fontWeight: 500, lineHeight: 1.65, color: '#F4F0EA' }}>
            Your reps tap.<br />Your pipeline fills.<br />You see everything.
          </p>

          <div data-v5r="" data-d="460" style={{ display: 'flex', gap: '14px', marginTop: '38px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#moment" className="v5-btn-getstarted-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '52px', padding: '0 30px', borderRadius: '10px', background: '#FF4D00', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 0 1px rgba(255,77,0,.4), 0 16px 44px -16px rgba(255,77,0,.6)', transition: 'transform .18s cubic-bezier(.21,.9,.27,1), box-shadow .3s' }}>
              Watch the tap <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', opacity: 0.75 }}>6s</span>
            </a>
            <a href="#console" className="v5-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 30px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.14)', color: '#F4F0EA', fontSize: '15px', fontWeight: 500, textDecoration: 'none', boxSizing: 'border-box', transition: 'border-color .18s, transform .18s cubic-bezier(.21,.9,.27,1)' }}>
              See the command view
            </a>
          </div>

          {/* the card, 3D */}
          <div data-v5r="" data-d="560" style={{ marginTop: '70px', perspective: '1200px' }}>
            <div
              id="v5card"
              style={{
                width: 'min(420px, 84vw)',
                height: '258px',
                borderRadius: '18px',
                position: 'relative',
                background: 'linear-gradient(155deg,#1B1815,#0E0C0A 55%,#171310)',
                border: '1px solid rgba(255,255,255,.1)',
                boxShadow: '0 0 0 1px rgba(0,0,0,.4),0 1px 2px -1px rgba(0,0,0,.5),0 60px 120px -40px rgba(0,0,0,.9),0 30px 80px -30px rgba(255,77,0,.22),inset 0 1px 0 rgba(255,255,255,.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform .35s cubic-bezier(.21,.9,.27,1)',
                willChange: 'transform',
              }}
            >
              <div style={{ position: 'absolute', top: '26px', left: '30px', width: '44px', height: '34px', borderRadius: '7px', background: 'linear-gradient(135deg,#2b2620,#1a1611)', border: '1px solid rgba(255,255,255,.1)' }} />
              <div style={{ position: 'absolute', top: '30px', right: '30px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.24em', color: '#4d463f' }}>NFC · N°0001</div>
              <div style={{ fontWeight: 700, fontSize: '42px', letterSpacing: '-.03em', color: '#F4F0EA' }}>frixn<span style={{ color: '#FF4D00' }}>.</span></div>
              <div style={{ position: 'absolute', bottom: '26px', left: '30px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.24em', color: '#4d463f' }}>TAP TO CONNECT</div>
              <div style={{ position: 'absolute', bottom: '26px', right: '30px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #4d463f' }} />
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #FF4D00', marginLeft: '-8px' }} />
              </div>
            </div>
          </div>
          <div data-v5r="" data-d="680" style={{ marginTop: '22px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', letterSpacing: '.26em', color: '#6E6862' }}>THE ENTIRE PRODUCT FITS IN A WALLET</div>
        </div>
      </section>

      {/* ============ 02 THE MOMENT — CINEMATIC DEMO ============ */}
      <section
        id="moment"
        style={{
          position: 'relative',
          padding: '110px 24px',
          borderTop: '1px solid rgba(255,255,255,.06)',
          backgroundImage: 'linear-gradient(to bottom, rgba(244,240,234,.018) 0px, transparent 180px)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div data-v5r="" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.26em', color: '#FF8952' }}>01 — THE MOMENT</div>
              <h2 data-v5r="" data-d="100" style={{ margin: '18px 0 0', fontSize: 'clamp(32px,4vw,54px)', fontWeight: 600, letterSpacing: '-.035em', lineHeight: 1.05 }}>
                Six seconds,<br /><span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#97908A' }}>start to captured.</span>
              </h2>
            </div>
            <button id="v5play" onClick={runDemo} className="v5-btn-demo">
              <span id="v5playIcon" style={{ display: 'inline-block', width: 0, height: 0, borderLeft: '9px solid currentColor', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: '2px' }} />
              <span id="v5playLabel">Play the tap</span>
            </button>
          </div>

          {/* stage */}
          <div data-v5r="" data-d="200" style={{ marginTop: '54px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>

            {/* STATION 1 · CARD */}
            <div id="v5s1" style={{ position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,.08)', background: '#100E0C', padding: '26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'border-color .4s, box-shadow .4s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.22em', color: '#6E6862' }}>STATION 01</span>
                <span id="v5s1dot" style={{ width: '7px', height: '7px', borderRadius: '1px', background: '#33302c', transition: 'background .3s' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '26px 0' }}>
                <div id="v5demoCard" onClick={runDemo} style={{ cursor: 'pointer', width: '200px', height: '124px', borderRadius: '12px', position: 'relative', background: 'linear-gradient(155deg,#1B1815,#0E0C0A)', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 24px 50px -22px rgba(0,0,0,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .25s cubic-bezier(.21,.9,.27,1), box-shadow .35s' }}>
                  <div style={{ fontWeight: 700, fontSize: '22px', color: '#F4F0EA' }}>frixn<span style={{ color: '#FF4D00' }}>.</span></div>
                  <div style={{ position: 'absolute', bottom: '11px', left: '14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '7px', letterSpacing: '.2em', color: '#4d463f' }}>TAP TO CONNECT</div>
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>The rep's card meets the phone</div>
              <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.6, color: '#6E6862' }}>NFC. No app on either side. The rep's job is over here.</div>
            </div>

            {/* STATION 2 · PHONE */}
            <div id="v5s2" style={{ position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,.08)', background: '#100E0C', padding: '26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'border-color .4s, box-shadow .4s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.22em', color: '#6E6862' }}>STATION 02</span>
                <span id="v5s2dot" style={{ width: '7px', height: '7px', borderRadius: '1px', background: '#33302c', transition: 'background .3s' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 0' }}>
                <div style={{ width: '196px', borderRadius: '22px', background: '#F6F3EE', boxShadow: '0 30px 60px -24px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.08)', padding: '8px', boxSizing: 'border-box' }}>
                  <div style={{ width: '52px', height: '5px', borderRadius: '3px', background: '#D9D2C8', margin: '4px auto 8px' }} />
                  <div style={{ position: 'relative', height: '212px', borderRadius: '15px', overflow: 'hidden', background: '#FBF9F6' }}>
                    {/* form screen */}
                    <div id="v5form" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '12px 12px 10px', boxSizing: 'border-box', transition: 'opacity .35s, filter .35s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#191612' }}>Rahul · frixn<span style={{ color: '#FF4D00' }}>.</span></span>
                        <span id="v5auto" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '6.5px', letterSpacing: '.12em', color: '#B4AA9C', transition: 'color .3s' }}>3 FIELDS</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '6px', letterSpacing: '.16em', color: '#B4AA9C' }}>NAME</span><span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 9px', borderRadius: '7px', background: '#fff', boxShadow: '0 0 0 1px rgba(25,22,18,.09)', minHeight: '13px' }}><span id="v5f1" style={{ fontSize: '9.5px', fontWeight: 600, color: '#191612' }} /><span id="v5a1" style={{ opacity: 0, transition: 'opacity .3s', fontFamily: "'IBM Plex Mono', monospace", fontSize: '5.5px', fontWeight: 600, color: '#1E9E6A' }}>AUTO</span></span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '6px', letterSpacing: '.16em', color: '#B4AA9C' }}>PHONE</span><span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 9px', borderRadius: '7px', background: '#fff', boxShadow: '0 0 0 1px rgba(25,22,18,.09)', minHeight: '13px' }}><span id="v5f2" style={{ fontSize: '9.5px', fontWeight: 600, color: '#191612' }} /><span id="v5a2" style={{ opacity: 0, transition: 'opacity .3s', fontFamily: "'IBM Plex Mono', monospace", fontSize: '5.5px', fontWeight: 600, color: '#1E9E6A' }}>AUTO</span></span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '6px', letterSpacing: '.16em', color: '#B4AA9C' }}>COMPANY</span><span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 9px', borderRadius: '7px', background: '#fff', boxShadow: '0 0 0 1px rgba(25,22,18,.09)', minHeight: '13px' }}><span id="v5f3" style={{ fontSize: '9.5px', fontWeight: 600, color: '#191612' }} /><span id="v5a3" style={{ opacity: 0, transition: 'opacity .3s', fontFamily: "'IBM Plex Mono', monospace", fontSize: '5.5px', fontWeight: 600, color: '#1E9E6A' }}>AUTO</span></span></div>
                        <div style={{ flex: 1 }} />
                        <div id="v5send" style={{ height: '27px', borderRadius: '8px', background: '#DAD3C8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9.5px', fontWeight: 700, transition: 'background .3s, transform .15s cubic-bezier(.21,.9,.27,1)' }}>Send on WhatsApp</div>
                      </div>
                    </div>
                    {/* whatsapp screen */}
                    <div id="v5wa" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#E7F2EA', opacity: 0, filter: 'blur(4px)', transition: 'opacity .35s, filter .35s' }}>
                      <div style={{ background: '#0E856B', padding: '8px 11px', display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FF4D00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: '#fff' }}>R</span><span style={{ fontSize: '9.5px', color: '#fff', fontWeight: 600 }}>Rahul · Frixn</span></div>
                      <div style={{ margin: '12px 10px 0', padding: '8px 9px', borderRadius: '9px', background: '#fff', boxShadow: '0 2px 6px rgba(25,22,18,.09)', color: '#191612', fontSize: '9px', lineHeight: 1.55, minHeight: '30px' }}><span id="v5msg" /><div id="v5del" style={{ marginTop: '3px', fontSize: '7px', color: '#8ba396', textAlign: 'right', opacity: 0, transition: 'opacity .3s' }}>Delivered ✓✓</div></div>
                      <div style={{ flex: 1 }} />
                      <div style={{ padding: '8px 10px 12px', display: 'flex', gap: '6px' }}><span style={{ flex: 1, height: '22px', borderRadius: '11px', background: '#fff' }} /><span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0E856B' }} /></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Three fields. Filled by the tap.</div>
              <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.6, color: '#6E6862' }}>90% auto-filled. One press fires WhatsApp from the prospect's side.</div>
            </div>

            {/* STATION 3 · LEDGER */}
            <div id="v5s3" style={{ position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,.08)', background: '#100E0C', padding: '26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'border-color .4s, box-shadow .4s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.22em', color: '#6E6862' }}>STATION 03</span>
                <span id="v5s3dot" style={{ width: '7px', height: '7px', borderRadius: '1px', background: '#33302c', transition: 'background .3s' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', padding: '22px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 2px 8px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.2em', color: '#6E6862' }}>LEAD LEDGER</span>
                  <span id="v5count" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', fontWeight: 600, color: '#F4F0EA' }}>289</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderRadius: '10px', background: 'rgba(244,240,234,.03)', border: '1px solid rgba(255,255,255,.06)', fontSize: '11.5px', color: '#97908A' }}><span>Priya S. — Expo North</span><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', color: '#6E6862' }}>10:42</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderRadius: '10px', background: 'rgba(244,240,234,.03)', border: '1px solid rgba(255,255,255,.06)', fontSize: '11.5px', color: '#97908A' }}><span>Dev M. — Site visit</span><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', color: '#6E6862' }}>11:15</span></div>
                <div id="v5row" style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderRadius: '10px', background: 'rgba(30,158,106,.08)', border: '1px solid rgba(30,158,106,.35)', fontSize: '11.5px', color: '#F4F0EA', opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)', transition: 'opacity .45s cubic-bezier(.21,.9,.27,1), transform .45s cubic-bezier(.21,.9,.27,1), filter .45s' }}><span style={{ fontWeight: 600 }}>Ananya R. — Nexlify Tech</span><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', color: '#2EBD85', fontWeight: 600 }}>NOW</span></div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Logged before the handshake ends</div>
              <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.6, color: '#6E6862' }}>Name, number, company, event, rep — on the manager's ledger. Zero typing.</div>
            </div>
          </div>

          {/* progress rail */}
          <div data-v5r="" data-d="300" style={{ marginTop: '34px' }}>
            <div style={{ position: 'relative', height: '2px', background: 'rgba(255,255,255,.08)', borderRadius: '1px', overflow: 'hidden' }}>
              <div id="v5rail" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#FF4D00,#FF8952)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .5s cubic-bezier(.21,.9,.27,1)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.2em' }}>
              <span id="v5t0" style={{ color: '#6E6862', transition: 'color .3s' }}>TAP</span>
              <span id="v5t1" style={{ color: '#6E6862', transition: 'color .3s' }}>AUTO-FILL</span>
              <span id="v5t2" style={{ color: '#6E6862', transition: 'color .3s' }}>SEND</span>
              <span id="v5t3" style={{ color: '#6E6862', transition: 'color .3s' }}>CAPTURED</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
