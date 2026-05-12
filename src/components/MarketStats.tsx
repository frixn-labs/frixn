"use client"
import { motion } from 'framer-motion'

const stats = [
  {
    value: "12M",
    title: "Field sales professionals in India",
    description: "Whose job depends on in-person meetings, and whose pipeline leaks the day they leave the venue."
  },
  {
    value: "60%",
    title: "Growth in regional field events",
    description: "The offline economy isn't dying. It's scaling faster than the software built for it."
  },
  {
    value: "$1.5B",
    title: "India B2B events market by 2032",
    description: "Growing at 11.72% CAGR. More events, more booths, more handshakes, more leads being lost the old way."
  },
  {
    value: "80%",
    title: "Of buyers trust in-person channels most",
    description: "And 52% of closed-won B2B deals in 2024 trace back to an event. The handshake still wins. The capture is what's broken."
  }
]

export default function MarketStats() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden text-foreground border-y border-border/50">
      {/* Abstract dark glowing accent */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF3D00]/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        <div className="flex flex-col md:flex-row gap-12 items-end justify-between mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl"
          >
            <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
              The numbers nobody else will tell you
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05]">
              India's biggest infrastructure gap isn't logistics or payments. <br className="hidden md:block" />
              <span className="block mt-2">
                It's the <span className="text-[#FF3D00]">handshake.</span>
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50 rounded-[2.5rem] overflow-hidden p-[1px]">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-card p-10 lg:p-14 flex flex-col justify-between hover:bg-muted/30 transition-colors duration-500 relative group overflow-hidden"
            >
              {/* Subtle hover splash */}
              <div className="absolute inset-0 bg-[#FF3D00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <h3 className="text-5xl lg:text-7xl font-black tracking-tighter text-[#FF3D00] mb-6 relative z-10">
                {stat.value}
              </h3>
              <div className="relative z-10">
                <h4 className="text-xl md:text-2xl font-bold mb-4 tracking-tight text-foreground">
                  {stat.title}
                </h4>
                <p className="text-muted-foreground text-[16px] md:text-lg leading-relaxed font-medium">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
