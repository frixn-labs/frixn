"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Users, CreditCard, Zap, Magnet, ArrowUpRight, ArrowDownRight, Activity, Loader2 } from 'lucide-react'

export default function DashboardHome() {
  const params = useParams()
  const slug = params.slug as string
  
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [slug])

  const fetchStats = async () => {
    try {
      const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single()
      if (!org) return

      // Parallel fetching for performance
      const [empCount, cardCount, tapCount, leadCount] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact', head: true }).eq('org_id', org.id),
        supabase.from('nfc_cards').select('id', { count: 'exact', head: true }).eq('org_id', org.id),
        supabase.from('taps').select('id', { count: 'exact', head: true }).eq('org_id', org.id),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('org_id', org.id),
      ])

      setStats([
        { label: 'Total Employees', value: empCount.count || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Active Cards', value: cardCount.count || 0, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Total Taps', value: tapCount.count || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Leads Captured', value: leadCount.count || 0, icon: Magnet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 uppercase">Overview</h1>
        <p className="text-secondary font-medium">Real-time performance metrics for <span className="text-primary font-bold">@{slug}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
            Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-44 bg-white rounded-[2rem] animate-pulse border border-black/[0.03]" />
            ))
        ) : stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/[0.03] hover:shadow-xl transition-all duration-500 group cursor-default"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                Live
              </div>
            </div>
            <div className="text-4xl font-black text-foreground tracking-tight mb-1">{stat.value}</div>
            <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-black/[0.03] shadow-sm h-[400px] flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-secondary/20 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">Activity Heatmap</h3>
            <p className="text-sm text-secondary font-medium px-12">Dynamic tap density charts will populate as your team spreads their digital identity.</p>
         </div>
         <div className="bg-white rounded-[2.5rem] p-8 border border-black/[0.03] shadow-sm h-[400px] flex flex-col">
            <h3 className="text-xl font-black text-foreground mb-6 tracking-tight uppercase">Platform Mix</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full border-[12px] border-[#0071e3]/10 border-t-[#0071e3] animate-[spin_3s_linear_infinite] mb-6" />
                <p className="text-xs font-bold text-secondary uppercase tracking-widest opacity-40">Analyzing Lead Sources...</p>
            </div>
         </div>
      </div>
    </div>
  )
}
