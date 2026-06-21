"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Building2, Users, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ThemeToggle"
import { supabase } from "@/lib/supabase"

// ── Role pill shown after resolving login ─────────────────────────────────────
function RolePill({ role }: { role: 'superadmin' | 'org_admin' | 'employee' | null }) {
  if (!role) return null
  const map = {
    superadmin: { icon: ShieldCheck, label: "Super Admin",  cls: "bg-[#FF3D00]/10 text-[#FF3D00] border-[#FF3D00]/20" },
    org_admin:  { icon: Building2,   label: "Org Admin",    cls: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    employee:   { icon: Users,       label: "Employee",     cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  }
  const { icon: Icon, label, cls } = map[role]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {label} — Redirecting…
    </motion.div>
  )
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [resolvedRole, setResolvedRole] = React.useState<'superadmin' | 'org_admin' | 'employee' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResolvedRole(null)

    const emailTrimmed = email.trim().toLowerCase()

    try {
      // ── Single Supabase auth call ───────────────────────────────────────────
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password,
      })


      if (authError || !authData?.user) {
        throw new Error("Invalid email or password.")
      }

      const uid = authData.user.id

      // ── TIER 1: super_admins ────────────────────────────────────────────────
      const { data: superAdmin, error: saErr } = await supabase
        .from('super_admins')
        .select('id, is_active')
        .eq('id', uid)
        .maybeSingle()


      if (superAdmin) {
        if (!superAdmin.is_active) {
          throw new Error("Your super admin account has been deactivated.")
        }
        await supabase
          .from('super_admins')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', uid)

        // Call the internal API to set session cookies for superadmin
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orgId: uid, 
            orgSlug: 'superadmin', 
            role: 'superadmin', 
            accessToken: authData.session?.access_token 
          })
        })

        setResolvedRole('superadmin')
        setTimeout(() => router.push('/sites/superadmin'), 800)
        return
      }

      // ── TIER 2: organizations ───────────────────────────────────────────────
      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .select('id, slug, status')
        .eq('id', uid)
        .maybeSingle()

      if (org) {
        if (org.status === 'suspended') {
          throw new Error("This organization account is suspended. Please contact support.")
        }
        // Call the internal API to set session cookies (important for Slug Guard)
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orgId: org.id, 
            orgSlug: org.slug, 
            role: 'org_admin',
            accessToken: authData.session?.access_token
          })
        })
        
        setResolvedRole('org_admin')
        setTimeout(() => router.push(`/sites/${org.slug}/admin/dashboard`), 800)
        return
      }

      // ── TIER 3: employees ───────────────────────────────────────────────────
      const { data: employee, error: empErr } = await supabase
        .from('employees')
        .select('id, is_active, organizations(slug, status)')
        .eq('id', uid)
        .maybeSingle()


      if (employee) {
        if (!employee.is_active) {
          throw new Error("Your employee account is inactive. Please contact your administrator.")
        }
        const empOrg = employee.organizations as any
        if (!empOrg?.slug) {
          throw new Error("Unable to find your organization. Please contact support.")
        }
        if (empOrg.status === 'suspended') {
          throw new Error("Your organization account is suspended.")
        }

        // Call the internal API to set session cookies (important for Slug Guard)
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orgId: employee.id, 
            orgSlug: empOrg.slug, 
            role: 'employee',
            accessToken: authData.session?.access_token
          })
        })

        setResolvedRole('employee')
        setTimeout(() => router.push(`/sites/${empOrg.slug}/admin/dashboard`), 800)
        return
      }

      // ── No match ────────────────────────────────────────────────────────────
      throw new Error("No account found with these credentials.")

    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
      setResolvedRole(null)
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row selection:bg-primary/30 relative bg-background font-sans">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* ── Left: Branding Panel ──────────────────────────────────────────────── */}
      <section className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-4 lg:p-6 overflow-hidden bg-[#0A0A0B]">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-[15s] ease-out hover:scale-105"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/9b/51/75/9b5175e2e9b44b35b49c106e43f49ab1.jpg')` }}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top_left,rgba(255,61,0,0.15),transparent_50%)]" />

        <div className="relative z-10 w-full flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/brandlogo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-white">frixn.</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-5 tracking-tighter">
              Your leads <br />
              <span className="text-[#FF3D00]">are waiting.</span>
            </h1>
            <p className="text-base xl:text-lg text-white/60 leading-relaxed font-medium mb-12 max-w-md">
              The people you met. The conversations you started. The opportunities that still matter. Frixn helps you capture every connection, organize follow-ups, and keep your pipeline moving without losing momentum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Right: Login Form ─────────────────────────────────────────────────── */}
      <section className="lg:w-1/2 w-full flex flex-col p-4 lg:p-6 bg-background relative z-20 min-h-screen lg:min-h-0">

        {/* Mobile Logo */}
        <div className="lg:hidden flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <img src="/brandlogo.png" alt="frixn logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-foreground">frixn.</span>
          </Link>
        </div>

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

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                    className="pl-10 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background focus:border-[#FF3D00]/50 focus:ring-4 focus:ring-[#FF3D00]/10 transition-all text-sm font-medium"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-[#FF3D00] transition-colors" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/80">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00] hover:text-[#FF3D00]/80 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
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

              {/* Animated error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
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

              {/* Role pill — shown on success before redirect */}
              <AnimatePresence>
                {resolvedRole && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center lg:justify-start"
                  >
                    <RolePill role={resolvedRole} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !!resolvedRole}
                className="w-full h-11 mt-2 rounded-xl bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold text-sm shadow-lg shadow-[#FF3D00]/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
              >
                {loading || resolvedRole ? (
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

        {/* Footer */}
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
