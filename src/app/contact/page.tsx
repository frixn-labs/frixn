"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Mail, Building, User, Phone, Users, MessageSquare, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <main className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row selection:bg-primary/30 relative bg-background font-sans">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left Section: Branding & Visuals */}
      <section className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-4 lg:p-6 overflow-hidden bg-[#050505]">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-[15s] ease-out hover:scale-105"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/fd/14/24/fd1424f35f473c44b3fd1112067d011f.jpg')`,
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top_left,rgba(0,113,227,0.15),transparent_50%)]" />

        {/* Top: Logo */}
        <div className="relative z-10 w-full flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-white">frixn.</span>
          </Link>
        </div>

        {/* Bottom: Hero Text */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-5 tracking-tighter">
              Accelerate <br />
              <span className="text-primary">Your Growth.</span>
            </h1>
            <p className="text-base xl:text-lg text-white/60 leading-relaxed font-medium mb-12 max-w-md">
              Engage with our enterprise experts to customize your networking infrastructure. Scale efficiently and lead your industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Right Section: Core Form */}
      <section className="lg:w-1/2 w-full flex flex-col p-4 lg:p-6 bg-background relative z-20 min-h-screen lg:min-h-0 overflow-y-auto overflow-x-hidden pt-12 lg:pt-6">

        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-start mb-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-foreground">frixn</span>
          </Link>
        </div>

        {/* Main Centered Container */}
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-full max-w-[420px]"
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2 text-foreground">Talk to Sales</h2>
              <p className="text-muted-foreground font-medium text-sm lg:text-base leading-relaxed">
                Tell us a little bit about yourself and we'll get in touch right away.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Full Name</label>
                  <div className="relative group">
                    <Input
                      placeholder="John Doe"
                      required
                      className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Org Email</label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Organization</label>
                  <div className="relative group">
                    <Input
                      placeholder="Company Inc."
                      required
                      className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    />
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Team Size</label>
                  <div className="relative group">
                    <Input
                      placeholder="e.g. 50-100"
                      required
                      className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    />
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Request <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer Area */}
        <div className="mt-6 w-full max-w-[420px] lg:max-w-none mx-auto pb-2">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <div className="flex gap-x-6">
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
            <span className="cursor-default">© {new Date().getFullYear()} frixn Inc.</span>
          </div>
        </div>

      </section>
    </main>
  )
}
