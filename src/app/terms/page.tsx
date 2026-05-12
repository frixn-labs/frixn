"use client";

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const termsSections = [
  { id: "s1", title: "1. Acceptance of Terms" },
  { id: "s2", title: "2. Description of Service" },
  { id: "s3", title: "3. Eligibility" },
  { id: "s4", title: "4. Account Registration" },
  { id: "s5", title: "5. Subscription and Payment" },
  { id: "s6", title: "6. Acceptable Use" },
  { id: "s7", title: "7. NFC Cards and Physical Goods" },
  { id: "s8", title: "8. User-Generated Content" },
  { id: "s9", title: "9. Third-Party Integrations" },
  { id: "s10", title: "10. Intellectual Property" },
  { id: "s11", title: "11. Data Ownership" },
  { id: "s12", title: "12. Service Availability" },
  { id: "s13", title: "13. Limitation of Liability" },
  { id: "s14", title: "14. Indemnification" },
  { id: "s15", title: "15. Termination" },
  { id: "s16", title: "16. Governing Law and Jurisdiction" },
  { id: "s17", title: "17. Changes to Terms" },
  { id: "s18", title: "18. Contact" }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("s1")

  // Auto-scroll the sidebar when active section changes
  useEffect(() => {
    const activeEl = document.getElementById(`nav-${activeSection}`);
    const sidebarEl = document.getElementById('sidebar-nav');
    if (activeEl && sidebarEl) {
      const sidebarRect = sidebarEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      
      // If it's too high or too low out of the sidebar viewport
      if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: "-120px 0px -60% 0px" });

    termsSections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100, // Offset for the fixed header
        behavior: "smooth"
      });
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative font-sans">
      <Header hideNavLinks />
      
      {/* Futuristic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none bg-[radial-gradient(ellipse_at_top_center,rgba(255,61,0,0.06),transparent_60%)] z-0" />

      {/* Top Hero Section */}
      <div className="pt-32 pb-16 md:pt-48 md:pb-24 border-b border-border/50 relative z-10">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
           <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-foreground mb-6">
             Terms & Conditions
           </h1>
           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6">
             Everything you need to know about your rights and responsibilities when using the frixn platform. Please read carefully.
           </p>
           <p className="text-[14px] text-muted-foreground/60">
             Last Updated: April 2026
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 w-full">
          
          {/* Vercel-style Sticky Sidebar Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div 
              id="sidebar-nav"
              className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pl-1 pr-6 pb-10 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">On this page</h3>
              <div className="relative">
                {/* Subtle vertical spine */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
                
                <ul className="space-y-4">
                  {termsSections.map(s => (
                    <li key={s.id} id={`nav-${s.id}`} className="relative">
                      {/* Active Track Highlight */}
                      {activeSection === s.id && (
                        <div className="absolute -left-[0.5px] top-0 bottom-0 w-[2px] bg-[#FF3D00] rounded-full shadow-[0_0_8px_rgba(255,61,0,0.4)]" />
                      )}
                      <button 
                        onClick={() => scrollToSection(s.id)}
                        className={`text-[14px] block transition-all duration-200 w-full text-left truncate pl-5 ${
                          activeSection === s.id 
                            ? 'text-[#FF3D00] font-semibold' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-3xl w-full">
            <div className="space-y-16 text-[15.5px] leading-8 text-muted-foreground/90">
              
              <div id="s1" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">1. Acceptance of Terms</h2>
                <p>By accessing or using Frixn (the "Service"), operated by Frixn Solutions Private Limited ("Frixn", "we", "us", or "our"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, do not use the Service.</p>
              </div>
              
              <div id="s2" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">2. Description of Service</h2>
                <p>Frixn provides a software-as-a-service platform that enables sales professionals and organizations to capture leads through NFC-enabled physical cards, QR codes, and digital links. The Service includes a web dashboard, automated WhatsApp communication workflows, lead management tools, and optional CRM integrations.</p>
              </div>

              <div id="s3" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">3. Eligibility</h2>
                <p>You must be at least 18 years old and capable of forming a legally binding contract in India to use Frixn. By using the Service, you represent that you meet these requirements.</p>
              </div>

              <div id="s4" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">4. Account Registration</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify Frixn immediately of any unauthorized access. Frixn is not liable for any loss arising from your failure to secure your account.</p>
              </div>

              <div id="s5" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">5. Subscription and Payment</h2>
                <ul className="list-decimal pl-6 space-y-4 marker:text-muted-foreground/60 marker:font-mono marker:text-sm">
                  <li className="pl-2"><strong className="text-foreground font-medium">5.1</strong> Frixn operates on a subscription basis. Pricing is displayed on frixn.in and is subject to change with 30 days' notice to existing subscribers.</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">5.2</strong> Subscription fees are billed monthly or annually in advance via Razorpay or other authorized payment processors. All fees are exclusive of applicable taxes (GST).</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">5.3</strong> Subscriptions auto-renew unless cancelled at least 24 hours before the next billing cycle. You may cancel at any time via the dashboard.</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">5.4</strong> Refunds are provided only within 7 days of initial subscription if the Service has not been substantially used. NFC cards already shipped are non-refundable.</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">5.5</strong> Failure to pay results in suspension of access until payment is resolved.</li>
                </ul>
              </div>

              <div id="s6" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">6. Acceptable Use</h2>
                <p className="mb-4">You agree NOT to use Frixn for:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-6">
                  <li className="pl-2">Capturing leads without the prospect's awareness or lawful basis</li>
                  <li className="pl-2">Sending unsolicited spam, phishing, or fraudulent communications via WhatsApp or any other channel</li>
                  <li className="pl-2">Violating WhatsApp's Business Policies or any applicable telecommunication laws</li>
                  <li className="pl-2">Capturing data of minors (under 18) or vulnerable individuals</li>
                  <li className="pl-2">Competing intelligence, scraping, or reverse-engineering the platform</li>
                  <li className="pl-2">Reselling or sublicensing Frixn services without written permission</li>
                  <li className="pl-2">Any activity that violates Indian laws including the Information Technology Act 2000, DPDP Act 2023, or Consumer Protection Act 2019</li>
                </ul>
                <div className="bg-muted px-6 py-4 rounded-xl border border-border/50 text-sm">
                  <span className="font-semibold text-foreground">Important:</span> Violation results in immediate account termination without refund.
                </div>
              </div>

              <div id="s7" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">7. NFC Cards and Physical Goods</h2>
                <ul className="list-decimal pl-6 space-y-4 marker:text-muted-foreground/60 marker:font-mono marker:text-sm">
                  <li className="pl-2"><strong className="text-foreground font-medium">7.1</strong> Physical NFC cards included in your subscription are issued on a lease basis, they remain property of Frixn and must be deactivated if the subscription ends.</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">7.2</strong> Lost, stolen, or damaged cards can be replaced.</li>
                  <li className="pl-2"><strong className="text-foreground font-medium">7.3</strong> Frixn does not warrant that NFC cards will function on 100% of smartphones. QR code fallback is provided for non-NFC devices.</li>
                </ul>
              </div>

              <div id="s8" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">8. User-Generated Content</h2>
                <p>You grant Frixn a non-exclusive, royalty-free license to store, process, and display content you submit (profile photos, company details, contact information) solely for the purpose of delivering the Service. You retain ownership of your data.</p>
              </div>

              <div id="s9" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">9. Third-Party Integrations</h2>
                <p>Frixn integrates with WhatsApp Business Platform, Google OAuth, LinkedIn OAuth, and CRM platforms (Zoho, HubSpot, Salesforce, LeadSquared). Use of these integrations is subject to their respective terms. Frixn is not responsible for third-party service outages or policy changes.</p>
              </div>

              <div id="s10" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">10. Intellectual Property</h2>
                <p className="mb-4">All Frixn software, trademarks, logos, content, and designs are the property of Frixn Solutions Private Limited. You are granted a limited, non-exclusive, non-transferable license to use the Service during your active subscription.</p>
                <p>The mark "Frixn" is a trademark of Frixn Solutions Private Limited (Trademark Application No: [TM number once filed], Class 42 and Class 35).</p>
              </div>

              <div id="s11" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">11. Data Ownership</h2>
                <p>You own the lead data captured through your Frixn account. Frixn acts as a data processor on your behalf. You are responsible for ensuring you have lawful basis to capture, store, and process the personal data of your prospects under the DPDP Act 2023.</p>
              </div>

              <div id="s12" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">12. Service Availability</h2>
                <p>Frixn targets 99.5% monthly uptime. We do not guarantee uninterrupted service and are not liable for scheduled maintenance, third-party outages (WhatsApp, CRM APIs), or force majeure events.</p>
              </div>

              <div id="s13" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">13. Limitation of Liability</h2>
                <p className="mb-6">To the maximum extent permitted by law, Frixn's total liability to you for any claim shall not exceed the amount you paid to Frixn in the 3 months preceding the event giving rise to the claim.</p>
                <p className="font-semibold text-foreground mb-4">Frixn is not liable for:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 bg-muted/30 p-6 rounded-2xl border border-border/50">
                  <li className="pl-2">Lost leads, lost deals, or lost revenue resulting from Service outages</li>
                  <li className="pl-2">WhatsApp API changes, restrictions, or policy enforcement by Meta</li>
                  <li className="pl-2">Third-party CRM failures</li>
                  <li className="pl-2">User error, incorrect configuration, or misuse of the platform</li>
                  <li className="pl-2">Any indirect, consequential, or punitive damages</li>
                </ul>
              </div>

              <div id="s14" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">14. Indemnification</h2>
                <p>You agree to indemnify and hold Frixn harmless from any claims, damages, or expenses arising from your misuse of the Service, violation of these Terms, or breach of applicable law — including unauthorized data collection from prospects.</p>
              </div>

              <div id="s15" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">15. Termination</h2>
                <p>Frixn may terminate or suspend your account at any time for violation of these Terms. You may terminate your account at any time via the dashboard. Upon termination, your data will be retained for 30 days for recovery purposes, after which it will be permanently deleted.</p>
              </div>

              <div id="s16" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">16. Governing Law and Jurisdiction</h2>
                <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.</p>
              </div>

              <div id="s17" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">17. Changes to Terms</h2>
                <p>Frixn may update these Terms. Material changes will be communicated via email 30 days in advance. Continued use after changes constitutes acceptance.</p>
              </div>

              <div id="s18" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">18. Contact</h2>
                <p className="mb-2">For questions about these Terms:</p>
                <div className="flex gap-4 p-6 bg-card border border-border/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#FF3D00]/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#FF3D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Legal Inquiries</h4>
                    <a href="mailto:contactus@frixn.in" className="text-[#FF3D00] hover:underline font-medium text-sm">contactus@frixn.in</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
