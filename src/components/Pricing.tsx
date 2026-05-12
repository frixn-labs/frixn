"use client"
import { motion } from 'framer-motion'
import { Check, ShieldCheck, ArrowRight, Zap } from 'lucide-react'

const features = [
  "1 premium matte NFC card per seat",
  "Unlimited lead capture, forever",
  "Full admin dashboard & team management",
  "Location and time intelligence",
  "Push notifications to every rep",
  "Follow-up reminders & dormant alerts",
  "WhatsApp thread integration",
  "Event ROI analytics",
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 relative z-10 bg-background overflow-hidden border-t border-border/50">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#FF3D00]/[0.06] blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* Section label + heading — left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
            Simple Pricing
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05] mb-3">
            One price. <span className="text-[#FF3D00]">No games.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            ₹499. That's it.&ensp;·&ensp;No tiers.&ensp;·&ensp;No "contact sales."
          </p>
        </motion.div>

        {/* Single unified mega card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] overflow-hidden border border-border bg-card shadow-2xl flex flex-col lg:flex-row"
        >

          {/* ── Left panel: Price ── */}
          <div className="relative lg:w-[340px] shrink-0 bg-[#0A0A0B] dark:bg-[#0A0A0B] p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
            {/* Corner glow */}
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#FF3D00]/25 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Rupee + price */}
              <div className="flex items-start gap-0.5 leading-none mb-2">
                <span className="text-[#FF3D00] text-3xl font-black mt-3 mr-0.5 leading-none">₹</span>
                <span className="text-[96px] lg:text-[108px] font-black tracking-[-0.04em] text-white leading-none">499</span>
              </div>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-8">per seat / per month</p>

              {/* Divider */}
              <div className="h-px w-12 bg-white/10 mb-8" />

              <p className="text-white/60 text-sm font-medium leading-relaxed">
                The same price for a solo founder and a 50-agent brokerage.
                <br /><br />
                No negotiation. No enterprise upsell. Just one honest number.
              </p>
            </div>

            {/* CTA — pinned to bottom of panel */}
            <div className="relative z-10 mt-10 flex flex-col gap-3">
              <a
                href="/contact"
                className="w-full bg-[#FF3D00] hover:bg-[#FF6D3A] text-white font-bold text-[15px] rounded-xl py-4 flex items-center justify-center gap-2 transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center justify-center gap-2 text-[12px] text-white/40 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                No setup fee. No annual contract.
              </div>
            </div>
          </div>

          {/* ── Vertical divider (desktop) ── */}
          <div className="hidden lg:block w-px bg-border/50 self-stretch" />

          {/* ── Right panel: Features ── */}
          <div className="flex-1 p-10 lg:p-12 flex flex-col gap-8">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              Everything included — no add-ons, no hidden extras
            </p>

            <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-10 flex-1">
              {features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FF3D00]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF3D00]/20 transition-colors">
                    <Check className="w-2.5 h-2.5 text-[#FF3D00]" strokeWidth={3.5} />
                  </div>
                  <span className="text-foreground text-[14px] font-medium leading-snug">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Bottom strip: scale note */}
            <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-foreground font-bold text-sm mb-0.5">Scaling your team?</p>
                <p className="text-muted-foreground text-sm">Same ₹499 per seat. Add or remove seats anytime.</p>
              </div>
              <a href="/contact" className="shrink-0 inline-flex items-center gap-1.5 text-[#FF3D00] font-bold text-sm hover:gap-3 transition-all">
                Talk to us <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
