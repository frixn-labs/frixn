"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, ThumbsUp, Sparkles, ArrowRight, Share2, Smartphone } from 'lucide-react'
import { NfcIcon } from './NfcIcon'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] mt-16 flex flex-col justify-center overflow-hidden bg-background">
      
      {/* Wave Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* The Grid Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF3D001A_1px,transparent_1px),linear-gradient(to_bottom,#FF3D001A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)] opacity-70"></div>
        {/* Ambient Core Glow */}
        <div className="absolute w-[800px] h-[600px] bg-[#FF3D00]/10 blur-[120px] rounded-full bottom-0 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center h-full text-center mt-20 md:mt-12">
        
        {/* Center Content */}
        <div className="max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground flex flex-col items-center leading-[1.1]">
            <span>Your meetings,</span>
            <span className="flex items-center justify-center gap-3">
              finally captured.
            </span>
          </h1>
          
          <div className="space-y-6 mb-12 max-w-2xl text-center">
            <p className="text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed">
              You shake 30 hands at an expo. You remember 4. Frixn captures all 30. Fires the follow-ups, tags the event, updates your dashboard. All before you've left the venue.
            </p>
            <p className="text-lg lg:text-xl font-bold text-foreground">
              Ten seconds. One tap. Zero leads lost.
            </p>
          </div>
          
          <div className="mb-20">
            <Link href="/contact" className="bg-[#FF3D00] text-white hover:bg-[#FF3D00] px-10 py-4 font-bold rounded-full text-lg inline-flex items-center justify-center gap-3">
              Talk to Sales <ArrowRight className="w-5 h-5 pointer-events-none" />
            </Link>
          </div>


        </div>
      </div>
    </section>
  )
}
