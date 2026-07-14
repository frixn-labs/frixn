'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export function NavBar() {
  useEffect(() => {
    const prog = document.getElementById('v5prog');
    const nav = document.getElementById('v5nav');
    let ticking = false;

    const apply = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (prog && max > 0) {
        prog.style.transform = `scaleX(${(window.scrollY / max).toFixed(4)})`;
      }
      if (nav) {
        const on = window.scrollY > 40;
        nav.style.background = on ? 'rgba(11,10,9,.78)' : 'rgba(11,10,9,0)';
        nav.style.borderColor = on ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,0)';
        nav.style.backdropFilter = on ? 'blur(16px)' : 'none';
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    apply();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* hairline scroll progress */}
      <div
        id="v5prog"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: '100%',
          zIndex: 70,
          background: 'linear-gradient(90deg, #FF4D00, #FF8952)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
        }}
      />

      {/* ============ NAV ============ */}
      <div
        id="v5nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 40px',
          boxSizing: 'border-box',
          background: 'rgba(11,10,9,0)',
          borderBottom: '1px solid rgba(255,255,255,0)',
          transition: 'background .4s cubic-bezier(.21,.9,.27,1), border-color .4s, backdrop-filter .4s',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/brandlogo.png" alt="frixn logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '19px', letterSpacing: '-.02em', color: '#F4F0EA' }}>frixn.</span>
        </Link>

        {/* Centered nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          <a href="#moment" className="v5-nav-link">The moment</a>
          <a href="#leak" className="v5-nav-link">The leak</a>
          <a href="#console" className="v5-nav-link">Command</a>
          <a href="#pricing" className="v5-nav-link">Pricing</a>
        </div>

        {/* Actions bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ThemeToggle />
          <Link href="/login" style={{ textDecoration: 'none' }} className="v5-nav-link">
            Login
          </Link>
          <Link href="/contact" className="v5-btn-getstarted">
            Get started
          </Link>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        maxWidth: '1100px',
        margin: '110px auto 0',
        borderTop: '1px solid rgba(255,255,255,.08)',
        paddingTop: '30px',
        paddingBottom: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/brandlogo.png" alt="frixn logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#F4F0EA' }}>
          frixn<span style={{ color: '#FF4D00' }}>.</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: '24px', fontSize: '12.5px' }}>
        <a href="#how" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Product
        </a>
        <a href="#console" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Command
        </a>
        <a href="#pricing" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Pricing
        </a>
        <Link href="/login" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Login
        </Link>
        <Link href="/privacy" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Privacy
        </Link>
        <Link href="/terms" style={{ color: '#6E6862', textDecoration: 'none' }} className="hover:text-[#F4F0EA]">
          Terms
        </Link>
      </div>
      <span style={{ fontSize: '11px', color: '#4d463f' }}>build in India</span>
    </footer>
  );
}

export function CTA({ seatPrice }: { seatPrice: number }) {
  useEffect(() => {
    const card = document.getElementById('v6ctaCard');
    if (!card) return;
    const wrap = card.parentElement;
    if (!wrap) return;

    const mm = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
    };
    const ml = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    wrap.addEventListener('mousemove', mm);
    wrap.addEventListener('mouseleave', ml);
    return () => {
      wrap.removeEventListener('mousemove', mm);
      wrap.removeEventListener('mouseleave', ml);
    };
  }, []);

  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        padding: '130px 24px 60px',
        borderTop: '1px solid rgba(255,255,255,.06)',
        background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,77,0,.12), transparent 70%)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* the returning card */}
        <div data-v5r="" style={{ marginBottom: '54px', perspective: '1200px' }}>
          <div
            id="v6ctaCard"
            style={{
              width: 'min(378px, 80vw)',
              height: '232px',
              borderRadius: '18px',
              position: 'relative',
              background: 'linear-gradient(155deg,#1B1815,#0E0C0A 55%,#171310)',
              border: '1px solid rgba(255,255,255,.1)',
              boxShadow: '0 0 0 1px rgba(0,0,0,.4),0 1px 2px -1px rgba(0,0,0,.5),0 60px 120px -40px rgba(0,0,0,.9),0 30px 80px -24px rgba(255,77,0,.25),0 0 60px 12px rgba(255,77,0,.08),inset 0 1px 0 rgba(255,255,255,.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform .35s cubic-bezier(.21,.9,.27,1)',
              willChange: 'transform',
            }}
          >
            <div style={{ position: 'absolute', top: '24px', left: '27px', width: '40px', height: '31px', borderRadius: '7px', background: 'linear-gradient(135deg,#2b2620,#1a1611)', border: '1px solid rgba(255,255,255,.1)' }} />
            <div style={{ position: 'absolute', top: '27px', right: '27px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.24em', color: '#4d463f' }}>NFC · N°0001</div>
            <div style={{ fontWeight: 700, fontSize: '38px', letterSpacing: '-.03em', color: '#F4F0EA' }}>frixn<span style={{ color: '#FF4D00' }}>.</span></div>
            <div style={{ position: 'absolute', bottom: '23px', left: '27px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9.5px', letterSpacing: '.24em', color: '#4d463f' }}>TAP TO CONNECT</div>
            <div style={{ position: 'absolute', bottom: '23px', right: '27px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1.5px solid #4d463f' }} />
              <span style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1.5px solid #FF4D00', marginLeft: '-7px' }} />
            </div>
          </div>
        </div>

        <h2 style={{ margin: 0, maxWidth: '860px', fontSize: 'clamp(34px,4.6vw,64px)', fontWeight: 600, letterSpacing: '-.04em', lineHeight: 1.14 }}>
          <span data-v5r="" style={{ display: 'block', color: '#F4F0EA' }}>Every meeting you have tomorrow</span>
          <span data-v5r="" data-d="120" style={{ display: 'block', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#FF8952' }}>is revenue you can capture.</span>
          <span data-v5r="" data-d="620" style={{ display: 'block', color: '#97908A' }}>Or revenue you'll lose.</span>
        </h2>

        <div data-v5r="" data-d="720" style={{ marginTop: '20px', fontSize: '22px', fontWeight: 900, color: '#F4F0EA' }}>Start converting meetings.</div>

        <div data-v5r="" data-d="800" style={{ display: 'flex', gap: '14px', marginTop: '38px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', height: '52px', padding: '0 32px', borderRadius: '10px', background: '#FF4D00', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 16px 44px -16px rgba(255,77,0,.6)', transition: 'transform .18s cubic-bezier(.21,.9,.27,1)' }} className="v5-btn-getstarted-orange">
            Get started — ₹{seatPrice}/seat
          </a>
          <Link href="/contact" className="v5-btn-cta-watch">
            Book a 15-minute demo
          </Link>
        </div>
      </div>
    </section>
  );
}
