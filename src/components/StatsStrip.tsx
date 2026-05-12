"use client"

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

const stats = [
  { target: 48, prefix: "", suffix: "%", label: "of salespeople never follow up after first contact" },
  { target: 95, prefix: "", suffix: "%+", label: "NFC-ready smartphones in India" },
  { target: 535, prefix: "", suffix: "M", label: "WhatsApp users in India" },
  { target: 10, prefix: "<", suffix: "s", label: "Handshake to pipeline completion" }
]

function AnimatedNumber({ target, prefix, suffix }: { target: number, prefix: string, suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 45 })

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, target, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`
      }
    })
  }, [springValue, prefix, suffix])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

export default function StatsStrip() {
  return (
    <section className="py-16 md:py-20 border-b border-border/50 bg-background relative z-20 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF3D00]/30 to-transparent" />
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 divide-x-0 divide-y-0 lg:divide-x lg:divide-border/50"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.3 }}
              className="flex flex-col items-center text-center px-4"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#FF3D00] to-[#FF6D3A] mb-4 drop-shadow-sm">
                <AnimatedNumber target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </h3>
              <p className="text-sm md:text-[15px] font-medium text-muted-foreground leading-relaxed max-w-[200px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
