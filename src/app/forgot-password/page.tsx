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

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isChangePassword = searchParams.get("source") === "change-password"

  const [step, setStep] = React.useState<1 | 2>(1)
  const [email, setEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [resendLoading, setResendLoading] = React.useState(false)
  const [resendSuccess, setResendSuccess] = React.useState("")
  const [error, setError] = React.useState("")

  const handleResendOtp = async () => {
    setError("")
    setResendSuccess("")
    setResendLoading(true)
    try {
      const { error: sendError } = await supabase.auth.resetPasswordForEmail(email)
      if (sendError) {
        setError(sendError.message)
        return
      }
      setResendSuccess("Code resent successfully!")
      setTimeout(() => setResendSuccess(""), 4000)
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
    } finally {
      setResendLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setLoading(true)
    try {
      const { error: sendError } = await supabase.auth.resetPasswordForEmail(email)
      
      if (sendError) {
        setError(sendError.message)
        return
      }
      
      setStep(2)
    } catch (err: any) {
      setError(err.message ?? "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (otp.length < 6) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }

    setLoading(true)
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({ 
        email, 
        token: otp, 
        type: 'email'
      })

      if (verifyError) {
        setError(verifyError.message)
        return
      }

      router.push("/reset-password")

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
            ? "Enter the email linked to your account and we'll send a reset code"
            : "Enter the 6-digit code sent to your inbox",
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
            ? "Enter your email to receive a recovery code"
            : "Enter the 6-digit code sent to your email",
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
                    <span className="flex items-center gap-2">
                      Send Recovery Code <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Recovery Code
                </Label>
                <div className="relative">
                  <div className="flex justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && isNaN(Number(val))) return;
                          
                          const newOtp = otp.split("");
                          newOtp[index] = val.substring(val.length - 1);
                          const newOtpString = newOtp.join("");
                          setOtp(newOtpString);
                          
                          if (val && index < 5) {
                            const nextInput = document.getElementById(`otp-input-${index + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[index] && index > 0) {
                            const prevInput = document.getElementById(`otp-input-${index - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                          if (pastedData) {
                            setOtp(pastedData);
                            const nextIndex = Math.min(pastedData.length, 5);
                            document.getElementById(`otp-input-${nextIndex}`)?.focus();
                          }
                        }}
                        id={`otp-input-${index}`}
                        className={`w-12 h-14 text-center text-xl font-bold tracking-widest bg-background/50 border-border/50 rounded-xl focus:ring-2 ${accentFocus} transition-all p-0`}
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
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
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify & Continue"}
                </Button>
                
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-muted-foreground pt-2">
                  <button type="button" onClick={() => setStep(1)} className="hover:text-foreground transition-colors flex items-center gap-1">
                     <ArrowLeft className="w-3 h-3"/> Change Email
                  </button>
                  <div className="flex items-center gap-2">
                    {resendSuccess && <span className="text-emerald-500 transition-opacity animate-in fade-in">{resendSuccess}</span>}
                    <button type="button" onClick={handleResendOtp} disabled={resendLoading} className="hover:text-[#FF3D00] transition-colors disabled:opacity-50">
                       {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
