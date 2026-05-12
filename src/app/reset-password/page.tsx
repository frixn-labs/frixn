"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  ArrowLeft 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  // ── Session Detection ──────────────────────────────────────────────────────
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If we're here via a recovery link, Supabase logic usually sets a session
      // automatically. If not, we might be unauthorized.
      if (!session) {
        setError("Invalid or expired reset session. Please request a new link.")
      }
      setLoading(false)
    }
    checkSession()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setUpdating(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)
      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login")
      }, 2500)

    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#FF3D00] animate-spin mb-4" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">Initializing security layer…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans antialiased selection:bg-[#FF3D00]/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3D00]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF3D00] to-[#E8A020] flex items-center justify-center shadow-xl shadow-[#FF3D00]/20">
            <Lock className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Secure Reset</h1>
            <p className="text-sm text-muted-foreground mt-1">Set a new password for your account</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          {/* Progress loader overlay */}
          {updating && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#FF3D00] animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF3D00]">Updating Identity…</p>
              </div>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Password Updated</h3>
                <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed">
                  Your new password has been successfully applied. Redirecting to login in a moment…
                </p>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[progress_2.5s_linear_forwards]" />
              </div>
            </div>
          ) : error && (error.includes("session") || error.includes("expired")) ? (
            <div className="py-4 space-y-6 text-center animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex flex-col items-center gap-3">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm font-semibold leading-relaxed">{error}</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => router.push("/login")}
                    className="w-full h-11 rounded-xl gap-2 font-bold"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 animate-in slide-in-from-bottom-2 duration-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-bold leading-tight">{error}</p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={updating}
                  className="w-full h-12 bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#FF3D00]/20 transition-all active:scale-[0.98]"
                >
                  {updating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Confirm New Password"}
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  Your connection is military-grade encrypted
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (!error || !(error.includes("session") || error.includes("expired"))) && (
            <p className="text-center text-[11px] text-muted-foreground/50 font-medium uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-500">
                frixn Platform Security Layer
            </p>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
