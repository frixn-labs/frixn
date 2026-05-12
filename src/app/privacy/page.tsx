"use client";

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const privacySections = [
  { id: "s1", title: "1. Introduction" },
  { id: "s2", title: "2. Who We Are" },
  { id: "s3", title: "3. Information We Collect" },
  { id: "s4", title: "4. How We Use Data" },
  { id: "s5", title: "5. Legal Basis for Processing" },
  { id: "s6", title: "6. Data Sharing" },
  { id: "s7", title: "7. Data Retention" },
  { id: "s8", title: "8. Rights Under DPDP Act" },
  { id: "s9", title: "9. Data Security" },
  { id: "s10", title: "10. International Data Transfers" },
  { id: "s11", title: "11. Cookies and Tracking" },
  { id: "s12", title: "12. Children's Privacy" },
  { id: "s13", title: "13. Changes to This Policy" },
  { id: "s14", title: "14. Contact" }
];

export default function PrivacyPage() {
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

    privacySections.forEach(section => {
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
             Privacy Policy
           </h1>
           <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6">
             How we collect, use, and protect your personal data in compliance with India's Digital Personal Data Protection Act, 2023. Please read carefully.
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
                  {privacySections.map(s => (
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
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">1. Introduction</h2>
                <p className="mb-4">Frixn ("Frixn", "we", "us") respects your privacy and is committed to protecting personal data in compliance with India's Digital Personal Data Protection Act, 2023 ("DPDP Act") and the Information Technology Act, 2000.</p>
                <p>This Privacy Policy explains what data we collect, how we use it, and your rights. It applies to both subscribers (users of our dashboard) and prospects (people whose contact information is captured through Frixn NFC cards or links).</p>
              </div>

              <div id="s2" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">2. Who We Are</h2>
                <p className="mb-4">Data Fiduciary (under DPDP Act): Frixn.</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60">
                  <li className="pl-2"><strong>For subscriber data:</strong> Frixn acts as the Data Fiduciary.</li>
                  <li className="pl-2"><strong>For lead/prospect data captured by subscribers:</strong> The subscriber (e.g., a real estate brokerage or individual agent) is the Data Fiduciary. Frixn acts as a Data Processor on their behalf.</li>
                </ul>
              </div>

              <div id="s3" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">3. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-4">3.1 From Subscribers (users paying for Frixn):</h3>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-8">
                  <li className="pl-2"><strong>Account data:</strong> Name, email, phone number, company name, role, profile photo</li>
                  <li className="pl-2"><strong>Authentication data:</strong> Password (hashed), login timestamps, IP address</li>
                  <li className="pl-2"><strong>Payment data:</strong> Handled entirely by Razorpay. We store only the subscription ID and transaction reference, never card numbers or bank details.</li>
                  <li className="pl-2"><strong>Usage data:</strong> Pages visited in the dashboard, features used, device type, browser type</li>
                  <li className="pl-2"><strong>Communication data:</strong> Emails exchanged with our support team</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-4">3.2 From Prospects (people whose cards are tapped):</h3>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-8">
                  <li className="pl-2"><strong>Contact data:</strong> Phone number, name (if shared via Google/LinkedIn OAuth), email (if shared), company (if shared), job title (if shared)</li>
                  <li className="pl-2"><strong>Meeting context:</strong> Event name or location (as configured by the subscriber), timestamp of capture, agent who captured the lead</li>
                  <li className="pl-2"><strong>Technical data:</strong> IP address at time of tap, device type, browser — used for analytics and security</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-4">3.3 Data We Do NOT Collect:</h3>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60">
                  <li className="pl-2">Aadhaar numbers</li>
                  <li className="pl-2">Bank account details</li>
                  <li className="pl-2">Biometric data</li>
                  <li className="pl-2">Location data (we would capture the city of the lead captured but we dont collect the absolute location)</li>
                  <li className="pl-2">Data from minors (under 18) — we do not knowingly process this</li>
                </ul>
              </div>

              <div id="s4" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">4. How We Use Data</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-4">4.1 For Subscribers:</h3>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-8">
                  <li className="pl-2">Provide and maintain the Service</li>
                  <li className="pl-2">Process payments and manage subscriptions</li>
                  <li className="pl-2">Send transactional emails (receipts, account alerts, security notifications)</li>
                  <li className="pl-2">Improve the platform based on usage analytics</li>
                  <li className="pl-2">Respond to support requests</li>
                  <li className="pl-2">Comply with legal obligations (GST filings, tax reporting)</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-4">4.2 For Prospects:</h3>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-6">
                  <li className="pl-2">Enable the subscriber (agent/company) to contact you about their products or services</li>
                  <li className="pl-2">Facilitate the opening of a WhatsApp conversation between you and the agent</li>
                  <li className="pl-2">Provide data to the subscriber's connected CRM (if configured)</li>
                </ul>
                <div className="bg-muted/50 px-6 py-4 rounded-xl border border-border/50 text-sm">
                  We do <strong className="text-foreground">NOT</strong> use prospect data to send marketing communications from Frixn directly. We do <strong className="text-foreground">NOT</strong> sell prospect data to third parties. We do <strong className="text-foreground">NOT</strong> use prospect data for advertising.
                </div>
              </div>

              <div id="s5" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">5. Legal Basis for Processing</h2>
                <p className="mb-4">Under the DPDP Act 2023, we process personal data based on:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60">
                  <li className="pl-2"><strong>Consent:</strong> for prospects who voluntarily share their data by tapping a card and submitting the form</li>
                  <li className="pl-2"><strong>Contract performance:</strong> for subscribers who have signed up for paid services</li>
                  <li className="pl-2"><strong>Legitimate interest:</strong> for analytics, security, and fraud prevention</li>
                  <li className="pl-2"><strong>Legal obligation:</strong> for compliance with Indian law</li>
                </ul>
              </div>

              <div id="s6" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">6. Data Sharing</h2>
                <p className="mb-4">We share data with:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-6">
                  <li className="pl-2"><strong>Payment processors</strong> (Razorpay or other Authorised Payment Service Providers) — for subscription billing</li>
                  <li className="pl-2"><strong>Communication providers</strong> (Meta/WhatsApp Business API) — for message delivery</li>
                  <li className="pl-2"><strong>Cloud infrastructure</strong> (Railway, Vercel, Cloudflare, or equivalent) — for hosting</li>
                  <li className="pl-2"><strong>CRM platforms</strong> (Zoho, HubSpot, Salesforce, LeadSquared or other enablers) — only when configured by the subscriber</li>
                  <li className="pl-2"><strong>Analytics providers</strong> — anonymized usage data only</li>
                  <li className="pl-2"><strong>Law enforcement</strong> — only when legally required under Indian law</li>
                </ul>
                <p className="font-semibold text-foreground">We do NOT sell personal data to third parties under any circumstances.</p>
              </div>

              <div id="s7" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">7. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-6">
                  <li className="pl-2"><strong>Subscriber account data:</strong> Retained while subscription is active + 90 days after cancellation for recovery</li>
                  <li className="pl-2"><strong>Lead/prospect data:</strong> Retained as long as the subscriber's account is active. Subscribers can delete specific leads at any time.</li>
                  <li className="pl-2"><strong>Payment records:</strong> Retained for 8 years as required by Indian tax law</li>
                  <li className="pl-2"><strong>Logs and analytics:</strong> Retained for 12 months then anonymized</li>
                </ul>
                <div className="bg-muted/50 px-6 py-4 rounded-xl border border-border/50 text-sm">
                  <strong className="text-foreground">Upon account termination:</strong> All data is deleted within 30 days unless legally required to retain.
                </div>
              </div>

              <div id="s8" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">8. Your Rights Under DPDP Act 2023</h2>
                <p className="mb-4">For all individuals whose data we process:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-8">
                  <li className="pl-2"><strong>Right to access:</strong> Request a copy of your personal data we hold</li>
                  <li className="pl-2"><strong>Right to correction:</strong> Request correction of inaccurate data</li>
                  <li className="pl-2"><strong>Right to erasure:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                  <li className="pl-2"><strong>Right to grievance redressal:</strong> Raise concerns about how your data is handled</li>
                  <li className="pl-2"><strong>Right to nominate:</strong> Nominate another person to exercise your rights in case of death or incapacity</li>
                  <li className="pl-2"><strong>Right to withdraw consent:</strong> Withdraw consent for processing at any time</li>
                </ul>
                <div className="space-y-4">
                  <p><strong>How to exercise your rights:</strong> Email <a href="mailto:contactus@frixn.in" className="text-[#FF3D00] hover:underline">contactus@frixn.in</a> with your request. We will respond within 30 days.</p>
                  <p className="bg-[#FF3D00]/5 text-[#FF3D00] px-6 py-4 rounded-xl border border-[#FF3D00]/20 text-sm">
                    <strong>Special note for prospects:</strong> If you were captured as a lead through a Frixn NFC card tap and want your data removed, email <a href="mailto:privacy@frixn.in" className="hover:underline">privacy@frixn.in</a>. We will delete your data from our systems and notify the subscriber (agent/company) of your request.
                  </p>
                </div>
              </div>

              <div id="s9" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">9. Data Security</h2>
                <p className="mb-4">We implement reasonable security measures:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-6">
                  <li className="pl-2">All data transmitted over HTTPS with TLS 1.3</li>
                  <li className="pl-2">Passwords hashed using bcrypt</li>
                  <li className="pl-2">Database encryption at rest</li>
                  <li className="pl-2">Role-based access control for internal staff</li>
                  <li className="pl-2">Multi-tenant isolation ensuring company data cannot be accessed across accounts</li>
                  <li className="pl-2">Regular security audits and penetration testing</li>
                </ul>
                <p>No system is 100% secure. In the event of a breach affecting your data, we will notify the Data Protection Board of India and affected users within 72 hours as required by DPDP Act.</p>
              </div>

              <div id="s10" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">10. International Data Transfers</h2>
                <p>Data is primarily processed within India. Some third-party services (e.g., Meta, Google, cloud providers) may process data outside India under standard data protection safeguards. By using Frixn, you consent to these transfers.</p>
              </div>

              <div id="s11" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">11. Cookies and Tracking</h2>
                <p className="mb-4">Our website uses:</p>
                <ul className="list-disc pl-6 space-y-3 marker:text-muted-foreground/60 mb-4">
                  <li className="pl-2"><strong>Essential cookies</strong> — for authentication and session management (cannot be disabled)</li>
                  <li className="pl-2"><strong>Analytics cookies</strong> — for usage statistics (can be disabled in settings)</li>
                </ul>
                <p>We do not use advertising cookies or tracking pixels from third-party ad networks.</p>
              </div>

              <div id="s12" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">12. Children's Privacy</h2>
                <p>Frixn is intended for users 18 years and older. We do not knowingly collect data from minors. If we discover that a minor's data has been collected, we will delete it immediately.</p>
              </div>

              <div id="s13" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">13. Changes to This Policy</h2>
                <p>We may update this Privacy Policy. Material changes will be notified via email to subscribers and via a banner on frixn.in at least 30 days before taking effect.</p>
              </div>

              <div id="s14" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-6">14. Contact</h2>
                <p className="mb-2">For questions about this Privacy Policy:</p>
                <div className="flex gap-4 p-6 bg-card border border-border/50 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#FF3D00]/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#FF3D00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Privacy Inquiries</h4>
                    <a href="mailto:contactus@frixn.in" className="text-[#007AFF] hover:underline font-medium text-sm">contactus@frixn.in</a>
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
