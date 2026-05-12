"use client"
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="py-28 md:py-40 relative overflow-hidden bg-background border-t border-border/50">

      {/* Single off-center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF3D00]/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-8"
        >
          Book your demo
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.05] text-foreground mb-6"
        >
          Some meetings end.{" "}
          <span className="text-[#FF3D00]">The good ones don't.</span>
        </motion.h2>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-muted-foreground text-lg font-medium mb-12 max-w-xl mx-auto"
        >
          We'll show you Frixn in action. You walk out with a working card.
        </motion.p>

        {/* CTA button */}
        <motion.a
          href="/contact"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex items-center gap-3 bg-[#FF3D00] text-white font-bold text-[16px] px-10 py-5 rounded-2xl hover:bg-[#FF6D3A] transition-colors group"
        >
          Book your demo
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.a>

      </div>
    </section>
  )
}
