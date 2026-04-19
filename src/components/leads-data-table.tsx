"use client"

import * as React from "react"
import {
  Search, Trash2, Pencil, Check, X, MailPlus, Phone,
  Building2, ChevronDown, FileDown, Loader2, User,
  IndianRupee, CalendarClock, UserCheck, Package, Briefcase,
  Bell, CheckCircle2
} from "lucide-react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export type LeadData = {
  id: string
  org_id: string | null
  visitor_name: string | null
  visitor_email: string | null
  visitor_company: string | null
  visitor_phone: string | null
  status: string | null
  captured_at: string | null
  followup_date: string | null
  lead_designation: string | null
  product: string | null
  revenue: number | null
  reminder_status: string | null
  employees: { name: string } | null
}

const _leadDataCache: Record<string, LeadData[]> = {}

// ── Animated search ─────────────────────────────────────────────────────────
function AnimatedSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = React.useState(false)
  const hints = ["Search by name…", "Search by email…", "Search by company…"]
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    if (focused || value) return
    const t = setInterval(() => setIdx(p => (p + 1) % hints.length), 3000)
    return () => clearInterval(t)
  }, [focused, value])

  return (
    <div className="relative flex items-center h-10 w-full sm:w-72 rounded-xl border bg-background/60 backdrop-blur-sm focus-within:ring-1 focus-within:ring-primary/60 focus-within:border-primary/40 transition-all overflow-hidden">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10 shrink-0" />
      <div className="relative w-full h-full flex items-center">
        <input value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="absolute inset-0 w-full h-full pl-9 pr-3 bg-transparent text-sm outline-none z-20"
        />
        {!focused && !value && (
          <div className="absolute inset-0 pl-9 flex items-center pointer-events-none z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span key={idx} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }} className="text-muted-foreground text-sm absolute">
                {hints[idx]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Inline edit ──────────────────────────────────────────────────────────────
function InlineEdit({ value, leadId, field, type = "text", onSave }: {
  value: string | number | null; leadId: string; field: string
  type?: "text" | "number"
  onSave: (id: string, field: string, val: string | number | null) => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value?.toString() ?? "")
  const commit = () => {
    const v = type === "number" ? (draft === "" ? null : parseFloat(draft)) : draft.trim() || null
    onSave(leadId, field, v); setEditing(false)
  }
  const cancel = () => { setDraft(value?.toString() ?? ""); setEditing(false) }

  if (editing) return (
    <div className="flex items-center gap-1.5 flex-1">
      <Input autoFocus type={type} value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel() }}
        className="h-7 text-xs px-2 flex-1 max-w-[160px] bg-muted/60"
      />
      <button onClick={commit} className="text-emerald-500 hover:text-emerald-400 transition-colors"><Check className="w-3.5 h-3.5" /></button>
      <button onClick={cancel} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-3.5 h-3.5" /></button>
    </div>
  )

  const display = type === "number" && value != null
    ? `₹${Number(value).toLocaleString("en-IN")}`
    : value || null

  if (!display) return (
    <button
      onClick={() => { setDraft(""); setEditing(true) }}
      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-dashed border-border/70 text-xs text-muted-foreground/60 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group/add"
    >
      <span className="text-base leading-none group-hover/add:scale-110 transition-transform">+</span>
      <span className="font-medium">Add</span>
    </button>
  )

  return (
    <button onClick={() => { setDraft(value?.toString() ?? ""); setEditing(true) }}
      className="flex items-center gap-1.5 group/edit flex-1 text-left min-w-0"
    >
      <span className="text-sm truncate font-semibold text-foreground">{display}</span>
      <Pencil className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover/edit:opacity-100 transition-opacity shrink-0" />
    </button>
  )
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; dot: string; badge: string; accent: string }> = {
  new:          { label: "New",         dot: "bg-amber-400",   badge: "text-amber-400 border-amber-400/25 bg-amber-400/10",   accent: "from-amber-500/8" },
  followed_up:  { label: "Followed Up", dot: "bg-blue-400",    badge: "text-blue-400 border-blue-400/25 bg-blue-400/10",      accent: "from-blue-500/8" },
  converted:    { label: "Converted",   dot: "bg-emerald-400", badge: "text-emerald-400 border-emerald-400/25 bg-emerald-400/10", accent: "from-emerald-500/8" },
  lost:         { label: "Lost",        dot: "bg-rose-400",    badge: "text-rose-400 border-rose-400/25 bg-rose-400/10",      accent: "from-rose-500/8" },
}

// ── Avatar gradient per name ─────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
]
function avatarGradient(name: string | null) {
  const n = (name || "?").charCodeAt(0)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

// ── Lead Card ────────────────────────────────────────────────────────────────
function LeadCard({ lead, onUpdateStatus, onInlineSave, onDelete }: {
  lead: LeadData
  onUpdateStatus: (id: string, s: string) => void
  onInlineSave: (id: string, f: string, v: string | number | null) => void
  onDelete: (id: string) => void
}) {
  const key = (lead.status || "new").toLowerCase()
  const cfg = STATUS[key] ?? STATUS.new
  const initials = (lead.visitor_name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const grad = avatarGradient(lead.visitor_name)

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22 }}
      className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-border transition-all duration-300"
    >
      {/* Top-accent gradient */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${cfg.accent} to-transparent pointer-events-none`} />

      <div className="relative p-5 flex flex-col gap-4">

        {/* ── Header: Avatar + Name + Company ── */}
        <div className="flex items-center gap-3 pr-28">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center font-black text-sm text-white shadow-md shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-foreground text-[15px] leading-snug truncate">{lead.visitor_name || "Unknown"}</p>
            {lead.visitor_company ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <Building2 className="w-3 h-3 shrink-0" />{lead.visitor_company}
              </span>
            ) : lead.visitor_phone ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <Phone className="w-3 h-3 shrink-0" />{lead.visitor_phone}
              </span>
            ) : null}
          </div>
        </div>

        {/* Status dropdown — absolute top-right */}
        <div className="absolute top-5 right-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide focus:outline-none transition-colors ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                {cfg.label}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {Object.entries(STATUS).map(([k, { label }]) => (
                <DropdownMenuItem key={k} onClick={() => onUpdateStatus(lead.id, k)}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS[k].dot} mr-2 shrink-0`} />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Chips: phone, product ── */}
        <div className="flex flex-wrap gap-2">
          {lead.visitor_phone && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
              <Phone className="w-3 h-3 shrink-0" />{lead.visitor_phone}
            </span>
          )}
          {lead.product && (
            <span className="flex items-center gap-1.5 text-xs text-primary/70 bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full truncate max-w-[200px]">
              <Package className="w-3 h-3 shrink-0" />{lead.product}
            </span>
          )}
        </div>

        {/* ── Follow-up date + Reminder status combined ── */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {lead.followup_date && (() => {
            const isSent = lead.reminder_status === 'sent'
            return (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border ${
                isSent
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {isSent
                  ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  : <Bell className="w-3.5 h-3.5 shrink-0" />}
                {format(new Date(lead.followup_date), "MMM d, yyyy")}
              </span>
            )
          })()}
          {lead.employees?.name && (
            <span className="flex items-center gap-1.5 truncate">
              <UserCheck className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate">{lead.employees.name}</span>
              {lead.captured_at && <span className="opacity-50 shrink-0">· {format(new Date(lead.captured_at), "MMM d")}</span>}
            </span>
          )}
        </div>

        {/* ── Editable fields ── */}
        <div className="border-t border-border/50 pt-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 w-[110px] shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <span className="text-xs text-muted-foreground/70 font-medium">Designation</span>
            </div>
            <InlineEdit value={lead.lead_designation} leadId={lead.id} field="lead_designation" onSave={onInlineSave} />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 w-[110px] shrink-0">
              <IndianRupee className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <span className="text-xs text-muted-foreground/70 font-medium">Revenue</span>
            </div>
            <InlineEdit value={lead.revenue} leadId={lead.id} field="revenue" type="number" onSave={onInlineSave} />
          </div>
        </div>

        {/* ── Action bar: Email + Delete ── */}
        <div className="border-t border-border/50 pt-3 flex items-center justify-between gap-2">
          {lead.visitor_email ? (
            <a
              href={`mailto:${lead.visitor_email}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary bg-muted/40 hover:bg-primary/8 border border-border/50 hover:border-primary/30 px-3 py-1.5 rounded-lg transition-all"
            >
              <MailPlus className="w-3.5 h-3.5 shrink-0" />
              {lead.visitor_email}
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/40 italic">No email</span>
          )}
          <button
            onClick={() => onDelete(lead.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/50 hover:text-destructive hover:bg-destructive/8 border border-transparent hover:border-destructive/20 px-2.5 py-1.5 rounded-lg transition-all shrink-0"
            title="Delete lead"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export function LeadsDataTable({ slug }: { slug: string }) {
  const [data, setData] = React.useState<LeadData[]>(_leadDataCache[slug] || [])
  const [orgId, setOrgId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(!_leadDataCache[slug])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")
  const [page, setPage] = React.useState(0)
  const PAGE_SIZE = 12

  const fetchData = React.useCallback(async () => {
    const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single()
    if (org) {
      setOrgId(org.id)
      const { data: leads } = await supabase.from('leads').select(`*, employees (name)`).eq('org_id', org.id).order('captured_at', { ascending: false })
      if (leads) { _leadDataCache[slug] = leads as any; setData(leads as any) }
    }
    setLoading(false)
  }, [slug])

  React.useEffect(() => { fetchData() }, [fetchData])

  React.useEffect(() => {
    if (!orgId) return
    const ch = supabase.channel(`leads:${orgId}`).on('postgres_changes', { event: '*', schema: 'tapconnect', table: 'leads', filter: `org_id=eq.${orgId}` }, fetchData).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [orgId, fetchData])

  const handleUpdateStatus = async (id: string, s: string) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, status: s } : p))
    const { error } = await supabase.from('leads').update({ status: s }).eq('id', id)
    if (error) fetchData()
  }
  const handleInlineSave = async (id: string, field: string, value: string | number | null) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    const { error } = await supabase.from('leads').update({ [field]: value }).eq('id', id)
    if (error) fetchData()
  }
  const handleDelete = async (id: string) => {
    setData(prev => prev.filter(p => p.id !== id))
    await supabase.from('leads').delete().eq('id', id)
  }

  const exportExcel = (rows: LeadData[]) => {
    const ws = XLSX.utils.json_to_sheet(rows.map(d => ({
      Name: d.visitor_name || "-", Email: d.visitor_email || "-", Phone: d.visitor_phone || "-",
      Company: d.visitor_company || "-", Designation: d.lead_designation || "-",
      Product: d.product || "-", Revenue: d.revenue ?? "-",
      "Captured By": d.employees?.name || "-",
      "Captured Date": d.captured_at ? format(new Date(d.captured_at), "MMM d, yyyy") : "-",
      "Follow-up": d.followup_date ? format(new Date(d.followup_date), "MMM d, yyyy") : "-",
      Status: d.status?.toUpperCase() || "-",
    })))
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Leads")
    XLSX.writeFile(wb, "leads_export.xlsx")
  }

  const filtered = React.useMemo(() => {
    let r = data
    if (activeTab !== "all") r = r.filter(d => (d.status || "new").toLowerCase() === activeTab)
    if (globalFilter.trim()) {
      const s = globalFilter.toLowerCase()
      r = r.filter(d =>
        (d.visitor_name || "").toLowerCase().includes(s) ||
        (d.visitor_email || "").toLowerCase().includes(s) ||
        (d.visitor_phone || "").toLowerCase().includes(s) ||
        (d.visitor_company || "").toLowerCase().includes(s) ||
        (d.lead_designation || "").toLowerCase().includes(s)
      )
    }
    return r
  }, [data, activeTab, globalFilter])

  React.useEffect(() => setPage(0), [filtered.length, activeTab, globalFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const counts = React.useMemo(() => ({
    all: data.length,
    new: data.filter(d => (d.status || "new").toLowerCase() === "new").length,
    followed_up: data.filter(d => d.status === "followed_up").length,
    converted: data.filter(d => d.status === "converted").length,
    lost: data.filter(d => d.status === "lost").length,
  }), [data])

  const TABS = [
    { key: "all",         label: "All",         countCls: "bg-muted text-muted-foreground" },
    { key: "new",         label: "New",         countCls: "bg-amber-500/10 text-amber-500" },
    { key: "followed_up", label: "Followed Up", countCls: "bg-blue-500/10 text-blue-500" },
    { key: "converted",   label: "Converted",   countCls: "bg-emerald-500/10 text-emerald-500" },
    { key: "lost",        label: "Lost",        countCls: "bg-rose-500/10 text-rose-500" },
  ]

  return (
    <div className="w-full space-y-6">

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v)} className="w-full pt-4">
        <TabsList variant="line" className="w-full justify-start border-b border-border/40 pb-0 mb-0 gap-4 flex-wrap">
          {TABS.map(({ key, label, countCls }) => (
            <TabsTrigger key={key} value={key} className="pb-3 text-sm flex items-center gap-2 shrink-0">
              {label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${countCls}`}>
                {counts[key as keyof typeof counts]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <AnimatedSearch value={globalFilter} onChange={setGlobalFilter} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            <span className="font-semibold text-foreground">{filtered.length}</span> lead{filtered.length !== 1 ? "s" : ""}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="w-4 h-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportExcel(filtered)}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <User className="w-8 h-8 opacity-30" />
          </div>
          <p className="font-semibold text-foreground">No leads found</p>
          <p className="text-sm">Try a different filter or search term</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdateStatus={handleUpdateStatus}
                onInlineSave={handleInlineSave}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{page + 1}</span> of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
