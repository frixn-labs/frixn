'use client';

import React, { useEffect } from 'react';
import { NavBar, CTA, Footer } from '@/components/v7/NavBarAndFooter';
import { HeroAndDemo } from '@/components/v7/HeroAndDemo';
import { Leak, Field } from '@/components/v7/LeakAndField';
import { System, Category, Roadmap } from '@/components/v7/Details';
import { Console, Pricing } from '@/components/v7/ConsoleAndPricing';

export default function Page() {
  const seatPrice = 499;

  // Initialize Scroll Reveals
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll('[data-v5r]')) as HTMLElement[];

    els.forEach(t => {
      const r = t.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9) {
        t.style.opacity = '0';
        t.style.transform = 'translateY(14px)';
        t.style.filter = 'blur(6px)';
        t.style.transition = 'opacity .55s cubic-bezier(.21,.9,.27,1), transform .55s cubic-bezier(.21,.9,.27,1), filter .55s cubic-bezier(.21,.9,.27,1)';
      }
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const t = en.target as HTMLElement;
        io.unobserve(t);
        setTimeout(() => {
          t.style.opacity = '1';
          t.style.transform = 'translateY(0)';
          t.style.filter = 'none';
        }, Number(t.dataset.d || 0));
      });
    }, { threshold: 0.15 });

    els.forEach(t => {
      const r = t.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9) {
        io.observe(t);
      }
    });

    return () => io.disconnect();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes grainShift {
            0%, 100% { transform:translate(0, 0); }
            10% { transform:translate(-1%, -1%); }
            20% { transform:translate(-2%, 1%); }
            30% { transform:translate(1%, -2%); }
            40% { transform:translate(-1%, 3%); }
            50% { transform:translate(-1%, 1%); }
            60% { transform:translate(3%, -1%); }
            70% { transform:translate(-2%, 1%); }
            85% { transform:translate(1%, 3%); }
            90% { transform:translate(-1%, 1%); }
          }
          @keyframes v7pulse {
            0%, 100% { opacity: .12; }
            50% { opacity: .75; }
          }

          /* Custom global styles to blend the new cinematic experience */
          .v7-main-wrapper * {
            box-sizing: border-box;
          }
          
          .v5-btn-getstarted {
            display: inline-flex;
            align-items: center;
            height: 38px;
            padding: 0 20px;
            border-radius: 8px;
            background: #F4F0EA;
            color: #0B0A09 !important;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            transition: transform .18s cubic-bezier(.21,.9,.27,1), background .18s;
          }
          .v5-btn-getstarted:hover {
            background: #ffffff;
            color: #0B0A09 !important;
          }
          .v5-btn-getstarted:active {
            transform: scale(0.97);
          }
          
          .v5-btn-getstarted-orange {
            transition: transform .18s cubic-bezier(.21,.9,.27,1), box-shadow .3s, background .18s;
          }
          .v5-btn-getstarted-orange:hover {
            background: #ff5e1a !important;
            color: #fff !important;
            transform: translateY(-1px);
          }
          .v5-btn-getstarted-orange:active {
            transform: scale(0.97);
          }

          .v5-btn-demo {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            height: 46px;
            padding: 0 24px;
            border-radius: 10px;
            border: 1px solid rgba(255,77,0,.5);
            background: rgba(255,77,0,.08);
            color: #FF8952 !important;
            font-size: 14px;
            font-weight: 600;
            transition: background .2s, transform .18s cubic-bezier(.21,.9,.27,1);
          }
          .v5-btn-demo:hover {
            background: rgba(255,77,0,.16);
          }
          .v5-btn-demo:active {
            transform: scale(0.97);
          }

          .v5-nav-link {
            color: #97908A !important;
            text-decoration: none;
            font-size: 13.5px;
            font-weight: 500;
            transition: color 0.18s;
          }
          .v5-nav-link:hover {
            color: #F4F0EA !important;
          }

          .v5-btn-watch {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            height: 52px;
            padding: 0 30px;
            border-radius: 10px;
            background: #FF4D00;
            color: #fff !important;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 0 0 1px rgba(255,77,0,.4), 0 16px 44px -16px rgba(255,77,0,.6);
            transition: transform .18s cubic-bezier(.21,.9,.27,1), box-shadow .3s;
          }
          .v5-btn-watch:hover {
            box-shadow: 0 0 0 1px rgba(255,77,0,.6), 0 20px 54px -14px rgba(255,77,0,.75);
            color: #fff !important;
          }
          .v5-btn-watch:active {
            transform: scale(0.97);
          }

          .v5-btn-secondary {
            display: inline-flex;
            align-items: center;
            height: 52px;
            padding: 0 30px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,.14);
            color: #F4F0EA !important;
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            box-sizing: border-box;
            transition: border-color .18s, transform .18s cubic-bezier(.21,.9,.27,1);
          }
          .v5-btn-secondary:hover {
            border-color: rgba(255,255,255,.34);
            color: #F4F0EA !important;
          }
          .v5-btn-secondary:active {
            transform: scale(0.97);
          }

          .v5-category-card {
            background: #0E0D0B;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 16px;
            padding: 30px;
            box-sizing: border-box;
            transition: transform .2s cubic-bezier(.21,.9,.27,1), border-color .2s;
          }
          .v5-category-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255,77,0,.2);
          }

          .v5-btn-cta-watch {
            display: inline-flex;
            align-items: center;
            height: 52px;
            padding: 0 32px;
            border-radius: 10px;
            border: 1px solid rgba(255,77,0,.4);
            color: #FF8952 !important;
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            box-sizing: border-box;
            transition: border-color .18s;
          }
          .v5-btn-cta-watch:hover {
            border-color: rgba(255,77,0,.7);
            color: #FF8952 !important;
          }

          .v5-how-row {
            display: flex;
            flex-wrap: wrap;
            gap: 16px 28px;
            align-items: baseline;
            padding: 34px 8px;
            border-top: 1px solid rgba(255,255,255,.08);
            transition: background .25s;
          }
          .v5-how-row:hover {
            background: rgba(244,240,234,.02);
          }
        `,
        }}
      />

      <main
        className="v7-main-wrapper"
        style={{
          backgroundColor: '#0B0A09',
          color: '#F4F0EA',
          minHeight: '100vh',
          fontFamily: "'Space Grotesk', sans-serif",
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {/* grain overlay */}
        <div
          id="grain"
          style={{
            position: 'fixed',
            inset: '-50%',
            zIndex: 99,
            pointerEvents: 'none',
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.045\'/%3E%3C/svg%3E")',
            animation: 'grainShift 8s steps(10) infinite',
          }}
        />

        <NavBar />

        <HeroAndDemo />

        <Leak />

        <Field />

        <System />

        <Category />

        <Console />

        <Roadmap />

        <Pricing seatPrice={seatPrice} />

        <CTA seatPrice={seatPrice} />

        <Footer />
      </main>
    </>
  );
}
