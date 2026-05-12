"use client"

import { motion } from "framer-motion"

export default function ImpactStatement() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden border-t border-border/50 z-10">
      
      {/* Central Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FF3D00]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like spring
        >
          <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
            The real problem
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05] mb-8">
            You don't lose leads in the CRM. <br className="hidden lg:block"/>
            <span className="text-muted-foreground/60">You lose them in the scroll between meetings.</span>
          </h2>
          
          <div className="w-16 h-1 bg-[#FF3D00]/40 rounded-full mx-auto mb-10" />

          <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground max-w-3xl mx-auto leading-relaxed">
            Frixn captures what every other tool misses. <br className="hidden md:block" />
            <span className="text-[#FF3D00] font-bold">The handshake.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
