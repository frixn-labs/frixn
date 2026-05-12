"use client"
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { NfcIcon } from './NfcIcon'

const steps = [
  { 
    stepText: 'Second 1', 
    title: 'They tap your card', 
    description: 'Their phone touches your Frixn card. A branded page opens instantly with your photo, name, and company. No app. No download. No QR fumble.',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center -mt-4">
        {/* Fanning stack of cards on hover */}
        <div className="absolute w-28 h-40 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 transform -rotate-12 translate-x-3 shadow-sm transition-all duration-500 group-hover:-rotate-[20deg] group-hover:-translate-x-4 group-hover:bg-card/80" />
        <div className="absolute w-28 h-40 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 transform -rotate-6 translate-x-1 shadow-md transition-all duration-500 group-hover:-rotate-12 group-hover:-translate-x-1 group-hover:bg-card" />
        <div className="relative w-32 h-44 bg-card rounded-2xl border border-border/50 flex flex-col items-center py-6 shadow-xl z-10 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:-rotate-3">
          <div className="w-12 h-12 rounded-full bg-[#FF3D00]/10 flex items-center justify-center text-[#FF3D00] mb-6 transition-all duration-500 group-hover:scale-125 group-hover:bg-[#FF3D00] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(255,61,0,0.5)]">
            <NfcIcon size={28} className="transition-all" />
          </div>
          <div className="w-20 h-2 bg-[#FF3D00]/20 rounded-full mb-3" />
          <div className="w-24 h-2 bg-[#FF3D00]/10 rounded-full mb-2" />
          <div className="w-24 h-2 bg-[#FF3D00]/10 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    stepText: 'Second 3–5', 
    title: 'They share their number', 
    description: "One tap. Google autofill fills the rest. WhatsApp opens, pre-loaded with your number. They hit send. You're both in a live thread, while still face to face.",
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center -mt-4">
        <div className="relative w-44 bg-card rounded-xl p-4 flex flex-col gap-3 shadow-md border border-border/50 transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-2 group-hover:-translate-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#25D366]/10 transition-colors duration-500 group-hover:bg-[#25D366]/20" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full h-2 bg-[#FF3D00]/20 rounded-full" />
              <div className="w-1/2 h-2 bg-[#FF3D00]/10 rounded-full" />
            </div>
          </div>
          <div className="w-full h-10 bg-muted rounded-lg mt-1" />

          {/* Floating check bubble popping up */}
          <div className="absolute top-3 -right-5 w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl transform rotate-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:-translate-y-1 group-hover:translate-x-1 delay-75">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        </div>
      </div>
    )
  },
  { 
    stepText: 'Second 5–10', 
    title: 'Your pipeline updates itself', 
    description: 'Lead lands in your dashboard. Event tagged. Location logged. Timestamp locked. Follow-up reminder set. Lead synced. You typed nothing.',
    renderMockup: () => (
      <div className="w-full h-full relative flex items-center justify-center flex-col gap-3 -mt-4">
        {/* Scattering bubbles on hover */}
        <div className="bg-card px-4 py-2.5 rounded-xl shadow-md border border-border/50 transform -rotate-6 text-xs font-bold text-muted-foreground transition-all duration-500 group-hover:-rotate-12 group-hover:-translate-x-6 group-hover:-translate-y-4">
          Location Logged
        </div>
        <div className="bg-[#FF3D00] px-6 py-3.5 rounded-2xl shadow-xl transform rotate-2 text-sm font-bold text-white z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-0 group-hover:shadow-2xl">
          Lead Synced!
        </div>
        <div className="bg-card px-4 py-2.5 rounded-xl shadow-md border border-border/50 transform -rotate-3 translate-x-6 text-xs font-bold text-muted-foreground transition-all duration-500 group-hover:rotate-6 group-hover:translate-x-12 group-hover:translate-y-4 delay-75">
          Reminder Set
        </div>
      </div>
    )
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
            How it works
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
            The 10-second <span className="text-[#FF3D00]">shift.</span>
          </h2>
          <div className="text-muted-foreground text-base md:text-lg max-w-2xl space-y-4 leading-relaxed">
            <p className="font-bold text-foreground">Three things happen. You don't lift a finger.</p>
            <p>No apps. No forms. No "give me your number." Just a tap, a spark, and a captured lead while you're still shaking hands.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
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
              <div className="w-full bg-card border border-border/50 rounded-[2rem] p-8 flex flex-col h-full shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                
                {/* Subtle gradient hover wash */}
                <div className="absolute inset-0 bg-[#FF3D00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header Text */}
                <div className="mb-8 relative z-10">
                  <div className="text-[12px] font-bold text-[#FF3D00] tracking-widest uppercase mb-2">
                    {step.stepText}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground/90 font-medium">
                    {step.description}
                  </p>
                </div>

                {/* Central UI Mockup Space */}
                <div className="flex-1 w-full relative z-10 mt-6 min-h-[220px]">
                   {step.renderMockup()}
                </div>

              </div>

              {/* Connecting Arrow (Desktop Only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute right-0 top-1/2 -mt-4 -mr-6 z-20 w-10 h-10 bg-muted border-[3px] border-background rounded-full items-center justify-center transform translate-x-1/2 shadow-sm text-muted-foreground transition-transform duration-500 hover:scale-110">
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
