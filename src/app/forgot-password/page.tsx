"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Mail, 
  KeyRound, 
  Loader2, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

function ForgotPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isChangePassword = searchParams.get("source") === "change-password"

  const [step, setStep] = React.useState<1 | 2>(1)
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [debugLink, setDebugLink] = React.useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugLink("")
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to send password recovery request.")
        return
      }

      if (data.debugLink) {
        setDebugLink(data.debugLink)
      }
      setStep(2)
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  // ── Content variants ──────────────────────────────────────────────────────
  const content = isChangePassword
    ? {
        title: "Change Your Password",
        subtitle:
          step === 1
            ? "Enter the email linked to your account and we'll send a reset link"
            : "A secure reset link has been sent to your inbox",
        iconBg: "from-[#FF3D00] to-[#E8A020]",
        iconShadow: "shadow-[#FF3D00]/20",
        icon: <Lock className="w-7 h-7 text-white" strokeWidth={2.5} />,
        backHref: "/login",
        backLabel: "Back to Login",
        footer: "Secure password change · frixn Platform",
      }
    : {
        title: "Password Recovery",
        subtitle:
          step === 1
            ? "Enter your email to receive a recovery link"
            : "A secure recovery link has been sent to your email",
        iconBg: "from-[#FF3D00] to-[#E8A020]",
        iconShadow: "shadow-[#FF3D00]/20",
        icon: <KeyRound className="w-7 h-7 text-white" strokeWidth={2.5} />,
        backHref: "/login",
        backLabel: "Back to Login",
        footer: "frixn Platform Security Layer",
      }

  const accentFocus = "focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40"
  const btnBg = "bg-[#FF3D00] hover:bg-[#FF3D00]/90 shadow-[#FF3D00]/20"
  const iconFocusTint = "group-focus-within/input:text-[#FF3D00]"

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
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${content.iconBg} flex items-center justify-center shadow-xl ${content.iconShadow}`}
          >
            {content.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {content.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{content.subtitle}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email Address
                </Label>
                <div className="relative group/input">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`pl-11 pr-4 h-12 bg-background/50 border-border/50 rounded-xl focus:ring-2 ${accentFocus} transition-all`}
                    required
                  />
                  <Mail
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 ${iconFocusTint} transition-colors`}
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
                  disabled={loading}
                  className={`w-full h-12 ${btnBg} text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.98]`}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    <span className="flex items-center gap-2 select-none">
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
              <div className="py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 mb-4 animate-bounce">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Recovery Link Sent</h3>
                <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed">
                  We've sent a secure password recovery link to <span className="font-bold text-foreground">{email}</span>. Click the link in the email to set your new password.
                </p>
              </div>

              {debugLink && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-left space-y-3">
                  <div className="flex items-center gap-2 text-orange-500">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider">Developer Debug Console</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Resend API key is not configured locally, so the email wasn't sent. You can click the link below to test resetting the password:
                  </p>
                  <Button
                    onClick={() => { window.location.href = debugLink }}
                    className="w-full h-10 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all"
                  >
                    Go to Reset Password
                  </Button>
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Re-enter Email
                </Button>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <Link
              href={content.backHref}
              className="text-xs font-bold tracking-wider text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" /> {content.backLabel}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-muted-foreground/50 font-medium uppercase tracking-[0.2em]">
          {content.footer}
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0B0C10]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ForgotPasswordContent />
    </React.Suspense>
  )
}
