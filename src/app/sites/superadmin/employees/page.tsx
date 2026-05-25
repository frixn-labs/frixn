"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Users, Plus, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// â”€â”€â”€ Avatar helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getInitials(name: string) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}




// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PAGE_SIZE = 12

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = React.useState<any[]>([])
  const [orgs, setOrgs] = React.useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [orgFilter, setOrgFilter] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)

  // Fetch all orgs for filter dropdown and add form
  React.useEffect(() => {
    supabase.from('organizations').select('id, name').order('name').then(({ data }) => {
      setOrgs(data ?? [])
    })
  }, [])

  const fetchEmployees = React.useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let q = supabase
      .from('employees')
      .select('id, name, designation, email, phone, employee_code, is_active, created_at, photo_url, organizations(name, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (orgFilter) q = q.eq('org_id', orgFilter)
    if (search.trim()) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%,designation.ilike.%${search}%`)

    const { data, count, error } = await q
    if (!error) { setEmployees(data ?? []); setTotal(count ?? 0) }
    setLoading(false)
  }, [page, search, orgFilter])

  React.useEffect(() => { fetchEmployees() }, [fetchEmployees])

  // Real-time
  React.useEffect(() => {
    const channel = supabase.channel('superadmin-employees')
      .on('postgres_changes', { event: '*', schema: 'frixn', table: 'employees' }, () => fetchEmployees())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchEmployees])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading..." : `${total.toLocaleString()} employee${total !== 1 ? 's' : ''} across all organizations`}
          </p>
        </div>
        <Button 
          onClick={() => router.push("/sites/superadmin/employees/new")} 
          className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold h-10 px-5 shadow-lg shadow-[#FF3D00]/20 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email, codeâ€¦" className="pl-9 h-10 text-sm" />
        </div>
        <Select
          value={orgFilter}
          onValueChange={v => { setOrgFilter(v === "all" ? "" : v); setPage(1) }}
        >
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-xl">
            <SelectValue placeholder="All Organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Employee", "Organization", "Designation", "Contact", "Code", "Status", "Joined"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border/40">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-muted animate-pulse rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-muted-foreground">No employees found</p>
                  </td>
                </tr>
              ) : employees.map(emp => (
                <tr 
                  key={emp.id} 
                  onClick={() => router.push(`/sites/superadmin/employees/${emp.id}`)}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  {/* Name + avatar */}
                  <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF3D00]/10 flex items-center justify-center text-[#FF3D00] text-xs font-black shrink-0 overflow-hidden">
                        {emp.photo_url
                          ? <img src={emp.photo_url} alt="" className="w-full h-full object-cover" />
                          : getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">{emp.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">#{emp.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  {/* Org */}
                  <td className="px-4 py-3 min-w-[140px]">
                    <p className="text-xs font-semibold">{(emp.organizations as any)?.name ?? 'â€”'}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{(emp.organizations as any)?.slug}</p>
                  </td>
                  {/* Designation */}
                  <td className="px-4 py-3">
                    <p className="text-xs">{emp.designation || 'â€”'}</p>
                  </td>
                  {/* Contact */}
                  <td className="px-4 py-3 min-w-[160px]">
                    <p className="text-xs">{emp.email || 'â€”'}</p>
                    <p className="text-[11px] text-muted-foreground">{emp.phone || ''}</p>
                  </td>
                  {/* Code */}
                  <td className="px-4 py-3">
                    {emp.employee_code
                      ? <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{emp.employee_code}</span>
                      : <span className="text-muted-foreground/50">â€”</span>}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      emp.is_active
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", emp.is_active ? "bg-emerald-500" : "bg-rose-500")} />
                      {emp.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {/* Created */}
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'â€”'}
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
              {(page - 1) * PAGE_SIZE + 1}â€“{Math.min(page * PAGE_SIZE, total)} of {total}
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

