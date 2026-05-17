"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Building2, Plus, Search, Loader2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ─── Status badge helper ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    active:    { label: "Active",    class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    setup:     { label: "Setup",     class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    suspended: { label: "Suspended", class: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    overdue:   { label: "Overdue",   class: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  }
  const s = map[status] ?? { label: status, class: "bg-muted text-muted-foreground border-border" }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", s.class)}>
      {s.label}
    </span>
  )
}

// ─── Plan badge helper ──────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#FF3D00] dark:bg-[#FF3D00]/10 dark:text-[#FF3D00]">
      Starter
    </span>
  )
}




// ─── Main Page ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 10

export default function OrganizationsPage() {
  const router = useRouter()
  const [orgs, setOrgs] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)

  const fetchOrgs = React.useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let q = supabase.from('organizations')
      .select('id, name, slug, logo_url, status, plan, admin_name, admin_email, admin_phone, max_employees, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (search.trim()) {
      q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,admin_email.ilike.%${search}%`)
    }

    const { data, count, error } = await q
    if (!error) { setOrgs(data ?? []); setTotal(count ?? 0) }
    setLoading(false)
  }, [page, search])

  React.useEffect(() => { fetchOrgs() }, [fetchOrgs])

  // Real-time subscription
  React.useEffect(() => {
    const channel = supabase.channel('superadmin-orgs')
      .on('postgres_changes', { event: '*', schema: 'tapconnect', table: 'organizations' }, () => fetchOrgs())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchOrgs])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading..." : `${total.toLocaleString()} organization${total !== 1 ? 's' : ''} on the platform`}
          </p>
        </div>
        <Button
          onClick={() => router.push("/sites/superadmin/organizations/new")}
          className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold h-10 px-5 shadow-lg shadow-[#FF3D00]/20 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Organization
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name, slug, email…"
          className="pl-9 h-10 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Organization", "Slug / URL", "Admin Contact", "Status", "Employees", "Created"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border/40">
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-muted animate-pulse rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : orgs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">No organizations found</p>
                  </td>
                </tr>
              ) : orgs.map(org => (
                <tr 
                  key={org.id} 
                  onClick={() => router.push(`/sites/superadmin/organizations/${org.id}`)}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  {/* Name + logo */}
                  <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                        {org.logo_url
                          ? <img src={org.logo_url} alt="" className="w-full h-full object-contain p-1" />
                          : <span className="text-xs font-black text-muted-foreground">{org.name?.[0]?.toUpperCase() ?? '?'}</span>}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">{org.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">#{org.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  {/* Slug */}
                  <td className="px-4 py-3 min-w-[140px]">
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{org.slug}</span>
                  </td>
                  {/* Admin */}
                  <td className="px-4 py-3 min-w-[180px]">
                    <p className="font-semibold text-xs">{org.admin_name || '—'}</p>
                    <p className="text-[11px] text-muted-foreground">{org.admin_email}</p>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3"><StatusBadge status={org.status} /></td>
                  {/* Max employees */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold">{org.max_employees}</span>
                  </td>
                  {/* Created */}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {org.created_at ? new Date(org.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border/40 bg-muted/10 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={cn("w-7 h-7 text-xs rounded font-bold transition-colors", page === i + 1 ? "bg-[#FF3D00] text-white" : "hover:bg-muted text-muted-foreground")}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
