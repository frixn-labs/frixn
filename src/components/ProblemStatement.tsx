"use client"

import { motion } from 'framer-motion'

const problemStats = [
  {
    target: "80%",
    label: "of in-person leads never make it to a follow-up."
  },
  {
    target: "7x",
    label: "cost to acquire a new lead vs. converting one already in the room."
  },
  {
    target: "95%",
    label: "of event teams say proving ROI is a top priority."
  }
]

export default function ProblemStatement() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden border-b border-border/50">
      
      {/* Very faint red warning glow behind the section */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/[0.03] blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: The Narrative (7 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:col-span-7"
          >
            <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
              The quiet leak
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.1]">
              Your biggest sales leak isn't in your CRM. <br className="hidden lg:block" />
              <span className="block mt-2">
                It's in the <span className="text-[#FF3D00]">six feet</span> between your hand and your pocket.
              </span>
            </h2>
            
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-2xl">
              <p>
                You spent ₹5 lakhs sponsoring that conference.
                You walked out with 50 warm conversations.
                <strong className="block mt-4 text-2xl text-foreground font-semibold">Your CRM received 8.</strong>
              </p>
              <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF3D00] to-[#FF6D3A] rounded-l-2xl" />
                <p className="font-semibold text-foreground text-xl md:text-2xl leading-snug">
                  That's not a sales problem.<br/>
                  <span className="text-[#FF3D00]">That's a capture problem.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Data (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-12 lg:pt-24 relative">
            {/* Connecting subtle line structure */}
            <div className="absolute left-[36px] top-32 bottom-12 w-px bg-border/40 hidden lg:block" />

            {problemStats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.15) }}
                className="flex items-start gap-8 group relative z-10"
              >
                <div className="w-20 shrink-0 text-right bg-background py-2">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-foreground group-hover:text-red-500 transition-colors duration-500">
                    {stat.target}
                  </span>
                </div>
                <div className="flex-1 pt-3">
                  <p className="text-[17px] text-muted-foreground leading-relaxed font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
