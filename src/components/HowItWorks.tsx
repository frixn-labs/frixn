"use client"
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { NfcIcon } from './NfcIcon'

const steps = [
  { 
    stepText: 'STEP ONE', 
    title: 'Get Your Card', 
    tag: 'Fast Delivery!',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center -mt-4">
        <div className="w-40 h-28 bg-white rounded-xl border border-black/5 shadow-md relative overflow-hidden flex flex-col p-4 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4 group-hover:shadow-2xl">
          <div className="w-6 h-6 rounded-full bg-black/5 mx-auto mb-4" />
          <div className="w-full h-2 bg-black/10 rounded-full mb-2" />
          <div className="w-2/3 h-2 bg-black/5 rounded-full mx-auto" />
          {/* Gradient overlay mimicking glass fold/cover, sweeping away on hover */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#f0f0f4] via-[#f7f7f9] to-transparent z-10 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
        </div>
      </div>
    )
  },
  { 
    stepText: 'STEP TWO', 
    title: 'Build Profile', 
    tag: 'No Coding!',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center -mt-4">
        <div className="w-44 bg-white rounded-xl p-4 flex flex-col gap-3 shadow-md border border-black/5 transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-2 group-hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full h-2 bg-black/10 rounded-full" />
              <div className="w-1/2 h-2 bg-black/5 rounded-full" />
            </div>
          </div>
          <div className="w-full h-10 bg-black/5 rounded-lg mt-1" />
        </div>
        {/* Floating check bubble popping up */}
        <div className="absolute top-1/4 -right-1 w-10 h-10 rounded-full bg-[#e8f5e9] border border-[#c8e6c9] flex items-center justify-center shadow-lg transform rotate-12 transition-all duration-500 group-hover:scale-125 group-hover:rotate-0 group-hover:-translate-y-4 group-hover:translate-x-3 delay-75">
          <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
        </div>
      </div>
    )
  },
  { 
    stepText: 'STEP THREE', 
    title: 'Tap to Connect', 
    tag: 'Zero Friction!',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center -mt-4">
        {/* Fanning stack of cards on hover */}
        <div className="absolute w-28 h-40 bg-white/40 rounded-2xl border border-black/5 transform -rotate-12 translate-x-3 shadow-sm transition-all duration-500 group-hover:-rotate-[20deg] group-hover:-translate-x-4 group-hover:bg-white/60" />
        <div className="absolute w-28 h-40 bg-white/70 rounded-2xl border border-black/5 transform -rotate-6 translate-x-1 shadow-md transition-all duration-500 group-hover:-rotate-12 group-hover:-translate-x-1 group-hover:bg-white/80" />
        <div className="relative w-32 h-44 bg-white rounded-2xl border border-black/5 flex flex-col items-center py-6 shadow-xl z-10 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:-rotate-3">
          <div className="w-12 h-12 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] mb-6 transition-all duration-500 group-hover:scale-125 group-hover:bg-[#0071e3] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]">
            <NfcIcon size={28} className="opacity-80 transition-all group-hover:brightness-[100] group-hover:opacity-100" />
          </div>
          <div className="w-20 h-2bg-black/10 rounded-full mb-3" />
          <div className="w-24 h-2 bg-black/5 rounded-full mb-2" />
          <div className="w-24 h-2 bg-black/5 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    stepText: 'STEP FOUR', 
    title: 'Grow Network', 
    tag: 'Analytics Ready!',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center flex-col gap-3 -mt-4">
        {/* Scattering bubbles on hover */}
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-md border border-black/5 transform -rotate-6 text-xs font-bold text-secondary transition-all duration-500 group-hover:-rotate-12 group-hover:-translate-x-6 group-hover:-translate-y-4">
          Contact Captured
        </div>
        <div className="bg-[#1d1d1f] px-6 py-3.5 rounded-2xl shadow-xl transform rotate-2 text-sm font-bold text-white z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-0 group-hover:shadow-2xl">
          Connection Saved!
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-md border border-black/5 transform -rotate-3 translate-x-6 text-xs font-bold text-secondary transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-12 group-hover:translate-y-4 delay-75">
          And keep growing
        </div>
      </div>
    )
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">How It <span className="gradient-text">Works</span></h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Four simple steps to revolutionize your networking connection pipeline.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="relative flex"
            >
              {/* Card Container exactly mimicking the reference screenshot layout with a hover group */}
              <div className="w-full bg-[#fbfbfc] border border-black/[0.04] rounded-[2rem] p-6 lg:p-8 flex flex-col h-[420px] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                
                {/* Subtle gradient hover wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0071e3]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header Text */}
                <div className="mb-8 relative z-10">
                  <div className="text-[11px] font-semibold text-secondary/60 tracking-widest uppercase mb-1">
                    {step.stepText}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                </div>

                {/* Central UI Mockup Space */}
                <div className="flex-1 w-full relative z-10 mt-4">
                   {step.renderMockup()}
                </div>

                {/* Bottom Tag Pill */}
                <div className="mt-8 flex relative z-10">
                  <div className="bg-white px-5 py-2.5 rounded-full text-xs font-bold text-secondary border border-black/5 shadow-sm group-hover:border-[#0071e3]/20 group-hover:text-[#0071e3] transition-colors duration-300">
                    {step.tag}
                  </div>
                </div>

              </div>

              {/* Connecting Arrow (Desktop Only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute right-0 top-1/2 -mt-4 -mr-5 z-20 w-8 h-8 bg-[#e8e8eb] border-2 border-white rounded-full items-center justify-center transform translate-x-1/2 shadow-sm text-secondary/60 transition-transform duration-500 hover:scale-110">
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
