"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
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
            backgroundImage: `url('https://i.pinimg.com/1200x/53/5c/f3/535cf30a8a5e926cd871187f1d979d61.jpg')`,
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top_left,rgba(0,113,227,0.15),transparent_50%)]" />

        {/* Top: Logo */}
        <div className="relative z-10 w-full flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-white">frixn</span>
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
              Redefining <br />
              <span className="text-primary">Digital Connection.</span>
            </h1>
            <p className="text-base xl:text-lg text-white/60 leading-relaxed font-medium mb-12 max-w-md">
              Step into the future of professional networking. Share your story, capture leads, and grow your presence with a single seamless tap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Right Section: Core Form */}
      <section className="lg:w-1/2 w-full flex flex-col p-4 lg:p-6 bg-background relative z-20 min-h-screen lg:min-h-0">
        
        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-foreground">frixn</span>
          </Link>
        </div>

        {/* Main Centered Container */}
        <div className="flex-1 flex flex-col justify-center items-center w-full pt-8 pb-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-full max-w-[380px]"
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2 text-foreground">Welcome Back</h2>
              <p className="text-muted-foreground font-medium text-sm lg:text-base leading-relaxed">
                Log in to your frixn portal to manage your digital identity, analyze interactions, and scale your network.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Email Address</label>
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

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80">Password</label>
                  <Link href="#" className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required
                    className="pl-10 pr-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium tracking-[0.2em] placeholder:tracking-normal"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 mt-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Access Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer Area */}
        <div className="mt-auto w-full max-w-[380px] lg:max-w-none mx-auto">
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
