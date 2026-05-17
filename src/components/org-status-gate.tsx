"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Construction, 
  Sparkles, 
  ShieldAlert, 
  CreditCard, 
  Mail, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OrgStatusGateProps {
  initialOrg: any
  initialEmployeeCount: number
  slug: string
}

export function OrgStatusGate({ initialOrg, initialEmployeeCount, slug }: OrgStatusGateProps) {
  const router = useRouter()
  const [org, setOrg] = React.useState(initialOrg)
  const [count, setCount] = React.useState(initialEmployeeCount)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // ── Realtime Subscriptions ──────────────────────────────────────────────────
  React.useEffect(() => {
    // 1. Listen for Organization Status Changes
    const orgChannel = supabase
      .channel('org_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'tapconnect',
          table: 'organizations',
          filter: `id=eq.${org.id}`
        },
        (payload) => {
          // If status changes to anything different, trigger a page refresh 
          // to properly lock/unlock the Server Component layout
          if (payload.new.status !== org.status) {
            setOrg(payload.new)
            setIsRefreshing(true)
            window.location.reload()
          }
        }
      )
      .subscribe()

    // 2. Listen for Employee Count Changes (for setup progress)
    const empChannel = supabase
      .channel('emp_count_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to inserts/deletes
          schema: 'tapconnect',
          table: 'employees',
          filter: `org_id=eq.${org.id}`
        },
        async () => {
          // Re-fetch the exact count for accuracy
          const { count: newCount } = await supabase
            .from('employees')
            .select('*', { count: 'exact', head: true })
            .eq('org_id', org.id)
          
          if (newCount !== null) setCount(newCount)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(orgChannel)
      supabase.removeChannel(empChannel)
    }
  }, [org.id])

  if (org.status === 'active' || isRefreshing) {
    return null // Layout will handle rendering the dashboard
  }

  const maxEmployees = parseInt(org.max_employees || "0")
  const progress = Math.min(Math.round((count / maxEmployees) * 100), 100)

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 overflow-hidden select-none font-sans">
      {/* Brand Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <img src="/brandlogo.png" alt="frixn logo" className="w-7 h-7 object-contain grayscale hover:grayscale-0 transition-all" />
          <span className="text-lg font-bold tracking-tight text-foreground">frixn.</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Security Node Active
          </span>
        </div>
      </div>

      {/* Background Decor (Minimal) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Simplified Status Area */}
        <div className="space-y-6 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-border/50",
            org.status === 'setup' && "bg-primary/10 text-primary",
            org.status === 'suspended' && "bg-rose-500/10 text-rose-500",
            org.status === 'overdue' && "bg-amber-500/10 text-amber-500"
          )}>
            {org.status === 'setup' && <Construction className="w-7 h-7 animate-bounce" />}
            {org.status === 'suspended' && <ShieldAlert className="w-7 h-7 animate-pulse" />}
            {org.status === 'overdue' && <CreditCard className="w-7 h-7" />}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-foreground">
              {org.status === 'setup' && "Setting Up Your Workspace"}
              {org.status === 'suspended' && "Access Temporarily Suspended"}
              {org.status === 'overdue' && "Action Required: Billing"}
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
              {org.status === 'setup' && "We're currently provisioning your organization data and team members. We'll notified you once the setup is complete."}
              {org.status === 'suspended' && "Your organization's access is restricted. Please reach out to your account manager or our support desk."}
              {org.status === 'overdue' && "Your subscription payment is overdue. Please settle the balance to restore full access."}
            </p>
          </div>
        </div>

        {/* Progress Tracker (Clean & Minimal) */}
        {org.status === 'setup' && (
          <div className="space-y-6">
            <div className="flex items-end justify-between px-1">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Onboarding Progress</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tabular-nums">{count}</span>
                  <span className="text-sm font-bold text-muted-foreground/40 uppercase">/ {maxEmployees} Employees</span>
                </div>
              </div>
              <span className="text-sm font-black text-primary tabular-nums tracking-widest">{progress}% COMPLETE</span>
            </div>

            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-muted/10 border border-border/20">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Syncing database operations in real-time...</span>
            </div>
          </div>
        )}

        {/* Minimal Actions */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              asChild
              className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <a href="mailto:contactus@frixn.in">Contact Base</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.push('/login')}
              className="flex-1 h-12 rounded-xl border-border/50 font-bold text-xs uppercase tracking-widest"
            >
              Back to Login
            </Button>
          </div>
          
          <p className="text-center text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20">
            frixn Identity Protocol v2.4.0
          </p>
        </div>
      </div>
    </div>
  )
}
