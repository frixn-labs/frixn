'use client';

import React, { useState, useEffect, useRef } from 'react';

export function Leak() {
  useEffect(() => {
    const sec = document.getElementById('leak');
    const num = document.getElementById('v5num');
    const cap = document.getElementById('v5cap');
    const foot = document.getElementById('v5leakFoot');
    const money = document.getElementById('v5money');
    const moneyWrap = document.getElementById('v5moneyWrap');
    if (!sec) return;

    const ticks = Array.from(document.querySelectorAll('[data-v5tick]')) as HTMLElement[];
    const stages: [number, string, string, number, string][] = [
      [0, '31', 'conversations your rep had at the expo.', 31, '#F4F0EA'],
      [0.28, '9', 'she remembers by Friday.', 9, '#F4F0EA'],
      [0.48, '4', 'she actually followed up with.', 4, '#F4F0EA'],
      [0.68, '1', 'deal closed.', 1, '#F4F0EA'],
      [0.85, '27', 'walked away — and bought elsewhere.', 1, '#FF4D00']
    ];

    let last = -1;
    let raf: number;

    const loop = () => {
      const r = sec.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const p = denom > 0 ? Math.max(0, Math.min(1, -r.top / denom)) : 0;
      let stage = 0;
      stages.forEach(([atP], i) => { if (p >= atP) stage = i; });

      if (money && moneyWrap) {
        moneyWrap.style.opacity = p > 0.3 ? '1' : '0';
        const pct = Math.round(Math.max(0, Math.min(1, (p - 0.28) / 0.62)) * 87);
        money.textContent = `≈${pct}%`;
      }

      if (stage !== last) {
        last = stage;
        const [, n, c, keep, color] = stages[stage];
        if (num) {
          num.style.opacity = '0';
          num.style.filter = 'blur(8px)';
          setTimeout(() => {
            num.textContent = n;
            num.style.color = color;
            num.style.opacity = '1';
            num.style.filter = 'blur(0)';
          }, 180);
        }
        if (cap) {
          cap.style.opacity = '0';
          setTimeout(() => {
            cap.textContent = c;
            cap.style.opacity = '1';
          }, 180);
        }
        ticks.forEach((t, i) => {
          const alive = i < keep;
          t.style.opacity = alive ? '.9' : '.12';
          t.style.background = alive && stage < 4 ? '#F4F0EA' : (alive ? '#FF4D00' : '#F4F0EA');
        });
        if (foot) {
          foot.style.opacity = stage >= 4 ? '1' : '0';
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="leak"
      style={{
        position: 'relative',
        height: '280vh',
        borderTop: '1px solid rgba(255,255,255,.06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,77,0,.025) 0px, transparent 140px)',
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 24px', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.26em', color: '#FF8952' }}>02 — THE LEAK</div>
        <div style={{ position: 'relative', marginTop: '28px', height: 'clamp(120px,18vw,220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div id="v5num" style={{ fontSize: 'clamp(110px,17vw,210px)', fontWeight: 600, letterSpacing: '-.06em', lineHeight: 1, color: '#F4F0EA', transition: 'opacity .35s, filter .35s' }}>31</div>
        </div>
        <div id="v5cap" style={{ marginTop: '6px', fontSize: 'clamp(18px,2.2vw,26px)', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#97908A', transition: 'opacity .35s' }}>conversations your rep had at the expo.</div>

        <div style={{ display: 'flex', gap: '5px', marginTop: '44px' }}>
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              data-v5tick=""
              style={{
                width: 'clamp(8px,1.6vw,16px)',
                height: '38px',
                borderRadius: '2px',
                background: '#F4F0EA',
                opacity: 0.9,
                transition: 'opacity .5s, background .5s',
              }}
            />
          ))}
        </div>

        <div id="v5moneyWrap" style={{ marginTop: '44px', display: 'flex', alignItems: 'baseline', gap: '14px', opacity: 0, transition: 'opacity .5s' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.22em', color: '#6E6862' }}>PIPELINE WALKING AWAY</span>
          <span id="v5money" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 'clamp(26px,3.4vw,40px)', fontWeight: 600, color: '#FF4D00', letterSpacing: '-1px' }}>≈0%</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.16em', color: '#4d463f' }}>APPROX.</span>
        </div>
        <div id="v5leakFoot" style={{ marginTop: '20px', maxWidth: '480px', textAlign: 'center', fontSize: '15px', color: '#6E6862', lineHeight: 1.7, opacity: 0, transition: 'opacity .4s' }}>The other 27 bought from whoever followed up.<br /><span style={{ color: '#F4F0EA', fontWeight: 600 }}>Frixn makes that person your rep. Every time.</span></div>
      </div>
    </section>
  );
}

export function Field() {
  const [uc, setUcState] = useState(0);
  const timersRef = useRef<any[]>([]);

  const ucs = [
    {
      label: 'Founders & BD',
      line: 'You meet 40 people at every conference.\nYou follow up with 6.',
      body: 'The other 34 were customers, partners, or your next hire — and they met someone else who followed up first. Every tap captures who you met and gets your deck in their inbox before you’ve moved to the next conversation.',
      tap: 'CARD → PIPELINE',
      stats: ['Every contact captured at the tap', 'WhatsApp thread + deck in parallel', 'Your network compounds — nothing falls through'],
      who: 'Ananya R. — Nexlify Tech',
      where: 'SaaSBoomi Annual · Chennai · Day 1',
      fired: 'WhatsApp intro + pitch deck',
      seen: 'You, and your BD pipeline'
    },
    {
      label: 'VC & Investors',
      line: 'You meet every founder who matters.\nYou remember half by Monday.',
      body: 'Demo days blur into one evening. Frixn captures everyone the moment you meet them — name, company, what they’re building, where. Your deal flow is only as good as your follow-up.',
      tap: 'CAPTURED IN-ROOM',
      stats: ['Every founder captured instantly', 'Context preserved from first tap', 'Follow-up ready before you leave'],
      who: 'Karan V. — building in fintech infra',
      where: 'Demo Day · Bengaluru · 7:40 PM',
      fired: 'Calendly + fund one-pager',
      seen: 'You + investment team'
    },
    {
      label: 'SaaS Sales Teams',
      line: 'Your AEs are at 12 events a quarter.\nMost notes never get sent.',
      body: 'Each rep meets 30 potential customers per event, and most conversations end with “I’ll send you a note.” Frixn captures the lead as the conversation happens, fires the proposal in parallel, and logs it for the manager instantly.',
      tap: 'SOLD, NOT REMEMBERED',
      stats: ['Every event conversation captured', 'Proposal email fired immediately', 'Manager sees pipeline per event'],
      who: 'Meera J. — Head of Ops, retail chain',
      where: 'Industry Expo · Hall 4 · Booth 212',
      fired: 'Proposal email + WhatsApp thread',
      seen: 'Rep + sales manager, live'
    },
    {
      label: 'Real Estate',
      line: 'They toured the flat, loved the view —\nand forgot by dinner.',
      body: 'A tap at the site gate sends the brochure, price sheet and agent’s line to the visitor’s phone before they reach the next project. Every walk-in is tagged to the property and the agent who showed it.',
      tap: 'FASTER THAN RIVAL SITE',
      stats: ['Every walk-in becomes a tracked lead', 'Brochures + pricing fired at the gate', 'Tagged to property and agent'],
      who: 'Rajiv & Shruti M. — 3BHK enquiry',
      where: 'Site visit · Tower B · 11:20 AM',
      fired: 'Brochure + price sheet + agent line',
      seen: 'Agent + project sales head'
    },
    {
      label: 'Insurance & BFSI',
      line: 'Advisors meet dozens a week.\nThe leads live in notebooks.',
      body: 'Branch walk-ins, community events, referrals at a wedding. Every conversation becomes a lead with a name, number and instant WhatsApp intro — logged and visible to the branch manager the moment it happens.',
      tap: 'NOTEBOOK RETIRED',
      stats: ['Every conversation becomes a lead', 'Instant, compliant WhatsApp intro', 'Branch manager sees it live'],
      who: 'Suresh P. — term plan referral',
      where: 'Community event · Jayanagar · Sunday',
      fired: 'Advisor intro + plan brochure',
      seen: 'Advisor + branch manager'
    },
    {
      label: 'Events & Community',
      line: 'Exhibitors ask the same question\nevery year: was it worth it?',
      body: 'Hand frixn to exhibitors and their teams. Every booth conversation is captured and counted, so you hand each exhibitor a lead ledger — proof of ROI per booth, per day, per event. They rebook because the numbers say so.',
      tap: 'FOOTFALL → PIPELINE',
      stats: ['Every booth conversation counted', 'Lead ledger per exhibitor', 'ROI proof that rebooks them'],
      who: '212 leads — Exhibitor: CloudServe',
      where: 'Expo floor · Day 2 · all booths',
      fired: 'Lead ledger + ROI report',
      seen: 'Organiser + every exhibitor'
    }
  ];

  const setUc = (i: number) => {
    if (i === uc) return;
    const panel = document.getElementById('v5ucPanel');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (panel && !reduced) {
      panel.style.opacity = '0';
      panel.style.filter = 'blur(5px)';
      const t = setTimeout(() => {
        setUcState(i);
        requestAnimationFrame(() => {
          panel.style.opacity = '1';
          panel.style.filter = 'blur(0)';
        });
      }, 220);
      timersRef.current.push(t);
    } else {
      setUcState(i);
    }
  };

  useEffect(() => {
    return () => timersRef.current.forEach(t => clearTimeout(t));
  }, []);

  const activeUc = ucs[uc];

  return (
    <section
      id="field"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(244,240,234,.018) 0px, transparent 180px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div data-v5r="" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.26em', color: '#FF8952' }}>03 — THE FIELD</div>
        <h2 data-v5r="" data-d="100" style={{ margin: '18px 0 0', fontSize: 'clamp(32px,4vw,54px)', fontWeight: 600, letterSpacing: '-.035em', lineHeight: 1.05 }}>
          Same tap.<br /><span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#97908A' }}>Wherever revenue shakes hands.</span>
        </h2>

        {/* tab bar */}
        <div data-v5r="" data-d="160" style={{ marginTop: '44px', display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,.08)', flexWrap: 'wrap' }}>
          {ucs.map((u, i) => (
            <div
              key={i}
              onClick={() => setUc(i)}
              style={{
                cursor: 'pointer',
                padding: '14px 18px',
                marginBottom: '-1px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: i === uc ? '#F4F0EA' : '#6E6862',
                borderBottom: i === uc ? '2px solid #FF4D00' : '2px solid rgba(0,0,0,0)',
                transition: 'color .3s, border-color .3s',
              }}
              className="hover:text-[#F4F0EA]"
            >
              {u.label}
            </div>
          ))}
        </div>

        {/* panel: story left · capture receipt right */}
        <div id="v5ucPanel" data-v5r="" data-d="220" style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '44px', alignItems: 'stretch', transition: 'opacity .3s cubic-bezier(.21,.9,.27,1), filter .3s cubic-bezier(.21,.9,.27,1)' }}>
          {/* story 55% */}
          <div style={{ flex: '55 1 320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(26px,2.8vw,36px)', lineHeight: 1.35, color: '#F4F0EA', whiteSpace: 'pre-line' }}>{activeUc.line}</div>
            <div style={{ marginTop: '20px', fontSize: '16px', lineHeight: 1.8, color: '#97908A', maxWidth: '480px' }}>{activeUc.body}</div>
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeUc.stats.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                  <span style={{ color: '#FF4D00', flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: '15px', lineHeight: 1.6, color: '#97908A' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          {/* capture receipt 45% */}
          <div style={{ flex: '45 1 300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '380px', borderRadius: '14px', border: '1px dashed rgba(255,137,82,.4)', background: 'linear-gradient(170deg,#14110F,#0E0C0A)', padding: '26px 28px', boxSizing: 'border-box', boxShadow: '0 40px 90px -40px rgba(0,0,0,.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.24em', color: '#FF8952' }}>CAPTURE RECEIPT</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', color: '#4d463f' }}>frixn.</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '18px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '.2em', color: '#6E6862' }}>CONTACT</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#F4F0EA' }}>{activeUc.who}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '.2em', color: '#6E6862' }}>CONTEXT · AUTO-TAGGED</span>
                  <span style={{ fontSize: '14px', color: '#97908A' }}>{activeUc.where}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '.2em', color: '#6E6862' }}>FIRED · INSTANT</span>
                  <span style={{ fontSize: '14px', color: '#97908A' }}>{activeUc.fired}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', letterSpacing: '.2em', color: '#6E6862' }}>VISIBLE TO</span>
                  <span style={{ fontSize: '14px', color: '#97908A' }}>{activeUc.seen}</span>
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,.08)', margin: '18px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.18em', color: '#2EBD85' }}><span style={{ width: '5px', height: '5px', background: '#2EBD85', display: 'inline-block' }} />LOGGED · 00:06</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.14em', color: '#FF8952' }}>{activeUc.tap}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
