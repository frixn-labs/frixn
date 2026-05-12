"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { Building2, Users, CreditCard, Activity, Loader2, TrendingUp } from "lucide-react"

export default function SuperAdminOverview() {
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState({
    orgs: 0,
    employees: 0,
    activeCards: 0,
    activeOrgs: 0,
  })

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const [
        { count: orgCount },
        { count: empCount },
        { count: cardCount },
        { count: activeOrgCount },
      ] = await Promise.all([
        supabase.from('organizations').select('id', { count: 'exact', head: true }),
        supabase.from('employees').select('id', { count: 'exact', head: true }),
        supabase.from('nfc_cards').select('id', { count: 'exact', head: true }),
        supabase.from('organizations').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      ])
      setStats({
        orgs: orgCount ?? 0,
        employees: empCount ?? 0,
        activeCards: cardCount ?? 0,
        activeOrgs: activeOrgCount ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: "Total Organizations", value: stats.orgs, icon: Building2, color: "text-[#FF3D00]", bg: "bg-[#FF3D00]/10" },
    { label: "Active Organizations", value: stats.activeOrgs, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Employees", value: stats.employees, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "NFC Cards Issued", value: stats.activeCards, icon: CreditCard, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Live metrics across all frixn organizations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              {loading
                ? <div className="w-12 h-7 bg-muted animate-pulse rounded" />
                : <span className="text-2xl font-extrabold tracking-tight">{value.toLocaleString()}</span>}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col items-center justify-center py-16 text-center">
        <Activity className="w-8 h-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">Detailed analytics coming soon</p>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">Use the sidebar to manage Organizations and Employees.</p>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
