'use client';

import React from 'react';

export function System() {
  return (
    <section
      id="how"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255, 255, 255, .06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 77, 0, .025) 0px, transparent 140px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          data-v5r=""
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            letterSpacing: '.26em',
            color: '#FF8952',
          }}
        >
          04 — THE SYSTEM
        </div>
        <h2
          data-v5r=""
          data-d="100"
          style={{
            margin: '18px 0 0',
            fontSize: 'clamp(32px, 4vw, 54px)',
            fontWeight: 600,
            letterSpacing: '-.035em',
            lineHeight: 1.05,
          }}
        >
          The whole product,<br />
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#97908A',
            }}
          >
            honestly.
          </span>
        </h2>

        <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column' }}>
          <div data-v5r="" className="v5-how-row">
            <div style={{ flex: '0 0 52px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#FF4D00' }}>
              01
            </div>
            <div style={{ flex: '1 1 200px', fontSize: '22px', fontWeight: 600, letterSpacing: '-.02em', color: '#F4F0EA' }}>
              The tap
            </div>
            <div style={{ flex: '1.4 1 280px', fontSize: '16px', lineHeight: 1.75, color: '#97908A' }}>
              Card meets phone. A 3-field form opens, auto-filled by the tap 90% of the time. One press fires WhatsApp — from the prospect's side, so the thread lives in their chat list too.
            </div>
          </div>

          <div data-v5r="" data-d="80" className="v5-how-row">
            <div style={{ flex: '0 0 52px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#FF4D00' }}>
              02
            </div>
            <div style={{ flex: '1 1 200px', fontSize: '22px', fontWeight: 600, letterSpacing: '-.02em', color: '#F4F0EA' }}>
              The first move
            </div>
            <div style={{ flex: '1.4 1 280px', fontSize: '16px', lineHeight: 1.75, color: '#97908A' }}>
              Two things fire instantly: a warm WhatsApp thread from the rep's own number, and a proposal email that lands before the prospect's next meeting. Configured once. Runs on every tap.
            </div>
          </div>

          <div
            data-v5r=""
            data-d="160"
            className="v5-how-row"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, .08)' }}
          >
            <div style={{ flex: '0 0 52px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', color: '#FF4D00' }}>
              03
            </div>
            <div style={{ flex: '1 1 200px', fontSize: '22px', fontWeight: 600, letterSpacing: '-.02em', color: '#F4F0EA' }}>
              The command view
            </div>
            <div style={{ flex: '1.4 1 280px', fontSize: '16px', lineHeight: 1.75, color: '#97908A' }}>
              Every tap, lead, rep and event on one live ledger. Response rates and event ROI instead of Monday reports. You manage 20 reps; Frixn sits in all their meetings.
            </div>
          </div>
        </div>

        <div data-v5r="" data-d="220" style={{ display: 'flex', gap: '34px', marginTop: '44px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '26px', fontWeight: 600, color: '#F4F0EA' }}>
              &lt;6s
            </span>
            <span style={{ fontSize: '14px', color: '#6E6862' }}>tap → captured</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '26px', fontWeight: 600, color: '#F4F0EA' }}>
              0
            </span>
            <span style={{ fontSize: '14px', color: '#6E6862' }}>apps to install, either side</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '26px', fontWeight: 600, color: '#F4F0EA' }}>
              10min
            </span>
            <span style={{ fontSize: '14px', color: '#6E6862' }}>org setup, once</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Category() {
  return (
    <section
      id="category"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255, 255, 255, .06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(244, 240, 234, .018) 0px, transparent 180px), radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 77, 0, .04), transparent 70%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(244, 240, 234, .06) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div
          data-v5r=""
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            letterSpacing: '.2em',
            color: '#FF4D00',
          }}
        >
          <span style={{ width: '6px', height: '6px', background: '#FF4D00', display: 'inline-block' }} />
          05 — THE CATEGORY
        </div>
        <h2
          data-v5r=""
          data-d="100"
          style={{
            margin: '28px 0 0',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 600,
            letterSpacing: '-.035em',
            lineHeight: 1.12,
            color: '#F4F0EA',
          }}
        >
          A new category.
          <br />
          Built for the meeting
          <br />
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#97908A',
            }}
          >
            that starts everything.
          </span>
        </h2>
        <div
          data-v5r=""
          data-d="200"
          style={{
            marginTop: '24px',
            maxWidth: '560px',
            fontSize: '16px',
            color: '#97908A',
            lineHeight: 1.75,
          }}
        >
          Every CRM starts the moment a contact is added. Frixn starts the moment a contact is met.
          <br />
          <br />
          That gap — between met and added — is where most revenue disappears.
          <br />
          <br />
          <span style={{ color: '#F4F0EA', fontWeight: 600 }}>We built the operating system for that gap.</span>
        </div>

        <div style={{ marginTop: '54px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%', textAlign: 'left' }}>
          <div data-v5r="" className="v5-category-card">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.12em', color: '#FF4D00' }}>
              CAPTURE
            </div>
            <div style={{ marginTop: '14px', fontSize: '16px', fontWeight: 700, color: '#F4F0EA' }}>
              Offline → Online
            </div>
            <div style={{ marginTop: '8px', fontSize: '14.5px', color: '#97908A', lineHeight: 1.7 }}>
              Every physical meeting becomes a digital lead. Automatically.
            </div>
          </div>
          <div data-v5r="" data-d="150" className="v5-category-card">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.12em', color: '#FF4D00' }}>
              INTELLIGENCE
            </div>
            <div style={{ marginTop: '14px', fontSize: '16px', fontWeight: 700, color: '#F4F0EA' }}>
              Context → Action
            </div>
            <div style={{ marginTop: '8px', fontSize: '14.5px', color: '#97908A', lineHeight: 1.7 }}>
              Every lead becomes a smart follow-up. On the cadence you set.
            </div>
          </div>
          <div data-v5r="" data-d="300" className="v5-category-card">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.12em', color: '#FF4D00' }}>
              REVENUE
            </div>
            <div style={{ marginTop: '14px', fontSize: '16px', fontWeight: 700, color: '#F4F0EA' }}>
              Pipeline → Closed
            </div>
            <div style={{ marginTop: '8px', fontSize: '14.5px', color: '#97908A', lineHeight: 1.7 }}>
              Every rep's activity becomes manager-visible pipeline. In real time.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Roadmap() {
  return (
    <section
      id="roadmap"
      style={{
        position: 'relative',
        padding: '110px 24px',
        borderTop: '1px solid rgba(255, 255, 255, .06)',
        backgroundImage: 'linear-gradient(to bottom, rgba(244, 240, 234, .018) 0px, transparent 180px)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          data-v5r=""
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            letterSpacing: '.26em',
            color: '#FF8952',
          }}
        >
          07 — ROADMAP
        </div>
        <h2
          data-v5r=""
          data-d="100"
          style={{
            margin: '18px 0 0',
            fontSize: 'clamp(32px, 4vw, 54px)',
            fontWeight: 600,
            letterSpacing: '-.035em',
            lineHeight: 1.05,
            color: '#F4F0EA',
          }}
        >
          Today, Frixn captures.
          <br />
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#97908A',
            }}
          >
            Tomorrow, it closes.
          </span>
        </h2>

        <div style={{ marginTop: '54px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          <div
            data-v5r=""
            style={{
              borderRadius: '16px',
              border: '1px solid rgba(46, 189, 133, .3)',
              background: '#0E0D0B',
              padding: '30px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#2EBD85' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.2em', color: '#2EBD85' }}>
                FRIXN TODAY
              </span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, .07)', margin: '20px 0' }} />
            <div style={{ fontSize: '15px', color: '#97908A', lineHeight: 2.1 }}>
              NFC tap-to-lead capture
              <br />
              3-field auto-filled form
              <br />
              WhatsApp thread + proposal email, instant
              <br />
              QR capture — no NFC needed
              <br />
              Manager command console, live
              <br />
              Per-rep dashboard — leads &amp; pipeline
            </div>
          </div>

          <div
            data-v5r=""
            data-d="120"
            style={{
              borderRadius: '16px',
              border: '1px dashed rgba(255, 77, 0, .4)',
              background: '#0E0D0B',
              padding: '30px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#FF4D00' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.2em', color: '#FF8952' }}>
                V2 — NEXT
              </span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, .07)', margin: '20px 0' }} />
            <div style={{ fontSize: '15px', color: '#97908A', lineHeight: 2.1 }}>
              AI-drafted first reply, one-tap approve
              <br />
              AI-powered follow-up intelligence
              <br />
              CRM sync — Zoho, HubSpot, Salesforce
              <br />
              Automated follow-up sequences
              <br />
              Dormant lead alerts
              <br />
              Deal pipeline tracking
            </div>
          </div>

          <div
            data-v5r=""
            data-d="240"
            style={{
              borderRadius: '16px',
              border: '1px solid rgba(255, 137, 82, .25)',
              background: 'linear-gradient(165deg, #161210, #0E0C0A)',
              padding: '30px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: '#E8C07D' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.2em', color: '#E8C07D' }}>
                THE VISION
              </span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, .07)', margin: '20px 0' }} />
            <div style={{ fontSize: '16px', color: '#97908A', lineHeight: 1.85 }}>
              Agentic AI that runs the entire post-meeting workflow while your reps are in the field.
              <br />
              <br />
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '19px', color: '#F4F0EA' }}>
                Revenue on autopilot. Offline to online, fully automated.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
