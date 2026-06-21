"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ThemeToggle"
import { supabase } from "@/lib/supabase"

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const emailTrimmed = email.trim().toLowerCase()

    try {
      // 1. Supabase auth sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password,
      })

      if (authError || !authData?.user) {
        throw new Error("Invalid email or password.")
      }

      const uid = authData.user.id

      // 2. Verify role is superadmin
      const { data: superAdmin, error: saErr } = await supabase
        .from('super_admins')
        .select('id, is_active')
        .eq('id', uid)
        .maybeSingle()

      if (!superAdmin) {
        // Sign out immediately if they are not a superadmin
        await supabase.auth.signOut()
        throw new Error("Access denied. Authorized super admin account required.")
      }

      if (!superAdmin.is_active) {
        await supabase.auth.signOut()
        throw new Error("Your super admin account has been deactivated.")
      }

      // Update last login timestamp
      await supabase
        .from('super_admins')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', uid)

      // 3. Set server-side session cookie with access token
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orgId: uid, 
          orgSlug: 'superadmin', 
          role: 'superadmin', 
          accessToken: authData.session?.access_token 
        })
      })

      if (!res.ok) {
        throw new Error("Failed to establish secure session.")
      }

      setSuccess(true)
      setTimeout(() => router.push('/sites/superadmin'), 800)

    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center selection:bg-primary/30 relative bg-background font-sans overflow-hidden">
      {/* Glow Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,61,0,0.08),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,61,0,0.05),transparent_40%)] pointer-events-none" />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FF3D00] to-[#FF7043] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#FF3D00]/25">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">Superadmin Portal</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Access secure administrative console controls
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">
              Admin Email
            </label>
            <div className="relative group">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="superadmin@frixn.com"
                required
                autoComplete="email"
                className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-[#FF3D00]/50 focus:ring-4 focus:ring-[#FF3D00]/10 transition-all text-sm font-medium"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-[#FF3D00] transition-colors" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">
              Password
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="pl-10 pr-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-[#FF3D00]/50 focus:ring-4 focus:ring-[#FF3D00]/10 transition-all text-sm font-medium tracking-[0.2em] placeholder:tracking-normal"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-[#FF3D00] transition-colors" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Pill */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider"
              >
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Authorized. Redirecting...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || success}
            className="w-full h-11 mt-2 rounded-xl bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold text-sm shadow-lg shadow-[#FF3D00]/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2 w-full">
                Verify and Authenticate <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest border-t border-border/40 pt-5">
          Secure Administration Console
        </div>
      </motion.div>
    </main>
  )
}
