"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, Building2, Loader2, CheckCircle2,
  AlertCircle, ShieldAlert, Trash2, Save, ExternalLink,
  Plus, FileText, Download, CalendarDays, Upload, X, Users, IndianRupee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-3 border-b border-border/50 mb-4">
      {children}
    </p>
  )
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
        {label}
      </Label>
      <div className="text-sm font-semibold text-foreground">
        {children || <span className="text-muted-foreground/40 font-normal italic">Not provided</span>}
      </div>
    </div>
  )
}

export default function OrganizationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [org, setOrg] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  
  const [updating, setUpdating] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  // Editable fields
  const [editForm, setEditForm] = React.useState({
    plan: "",
    status: ""
  })

  // Billing States
  const [billingList, setBillingList] = React.useState<any[]>([])
  const [loadingBilling, setLoadingBilling] = React.useState(true)
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = React.useState(false)
  const [savingInvoice, setSavingInvoice] = React.useState(false)
  const [pdfFile, setPdfFile] = React.useState<File | null>(null)
  const [pdfName, setPdfName] = React.useState("")
  const [newInvoice, setNewInvoice] = React.useState({
    invoice_number: "",
    plan: "starter",
    payment_method: "",
    status: "pending"
  })
  const [actualEmployeeCount, setActualEmployeeCount] = React.useState(0)

  const fetchOrg = React.useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      setError(error.message)
    } else {
      setOrg(data)
      setEditForm({
        plan: data.plan,
        status: data.status
      })
      
      // Fetch actual employee count for this organization
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', id)
        
      setActualEmployeeCount(count || 0)
    }
    setLoading(false)
  }, [id])

  const fetchBilling = React.useCallback(async () => {
    setLoadingBilling(true)
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .eq('org_id', id)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setBillingList(data)
    }
    setLoadingBilling(false)
  }, [id])

  React.useEffect(() => {
    fetchOrg()
    fetchBilling()
  }, [fetchOrg, fetchBilling])

  const handleUpdate = async () => {
    setUpdating(true)
    setError("")
    try {
      const res = await fetch(`/api/superadmin/organizations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (res.ok) {
        setOrg(data.data)
      } else {
        setError(data.error || "Failed to update organization")
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error")
    } finally {
      setUpdating(false)
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF document.")
        return
      }
      setPdfFile(file)
      setPdfName(file.name)
    }
  }

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInvoice.invoice_number.trim()) {
      alert("Invoice Number is required.")
      return
    }

    setSavingInvoice(true)
    try {
      let uploadUrl = ""

      if (pdfFile) {
        const slugFolder = org?.slug?.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "general"
        const cleanInvNumber = newInvoice.invoice_number.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
        const fileName = `inv-${cleanInvNumber}-${Date.now()}.pdf`
        const path = `billing/${slugFolder}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("frixn")
          .upload(path, pdfFile, { upsert: true, contentType: "application/pdf" })

        if (uploadError) {
          throw new Error(`PDF upload failed: ${uploadError.message}`)
        }

        const { data: urlData } = supabase.storage.from("frixn").getPublicUrl(path)
        uploadUrl = urlData.publicUrl
      }

      const { error } = await supabase
        .from('billing')
        .insert([{
          org_id: id,
          invoice_number: newInvoice.invoice_number.trim(),
          plan: newInvoice.plan,
          payment_method: newInvoice.payment_method.trim() || null,
          status: newInvoice.status,
          invoice_link: uploadUrl || null,
          created_at: new Date().toISOString()
        }])

      if (error) {
        throw new Error(error.message)
      }

      fetchBilling()
      setIsAddInvoiceOpen(false)
      setNewInvoice({
        invoice_number: "",
        plan: "starter",
        payment_method: "",
        status: "pending"
      })
      setPdfFile(null)
      setPdfName("")
    } catch (err: any) {
      alert(err.message || "Failed to save invoice")
    } finally {
      setSavingInvoice(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to permanently delete this invoice?")) return
    
    const { error } = await supabase
      .from('billing')
      .delete()
      .eq('id', invoiceId)

    if (error) {
      alert(`Delete failed: ${error.message}`)
    } else {
      fetchBilling()
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setDeleting(true)
    setError("")
    try {
      const res = await fetch(`/api/superadmin/organizations/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        router.push("/sites/superadmin/organizations")
      } else {
        setError(data.error || "Failed to delete organization")
        setConfirmDelete(false)
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error")
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#FF3D00] animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fetching Data…</p>
      </div>
    )
  }

  if (error && !org) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Organization Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">{error}</p>
        </div>
        <Button onClick={() => router.push("/sites/superadmin/organizations")} variant="outline" className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
        </Button>
      </div>
    )
  }

  const isChanged = editForm.plan !== org.plan || editForm.status !== org.status

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link
          href="/sites/superadmin/organizations"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Organizations
        </Link>
        <span className="text-muted-foreground/30">/</span>
        <span className="text-sm font-semibold text-foreground">Details</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {org.logo_url ? (
              <img src={org.logo_url} alt="" className="w-full h-full object-contain p-2" />
            ) : (
              <Building2 className="w-10 h-10 text-muted-foreground/30" />
            )}
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight leading-none">{org.name}</h1>
              <StatusBadge status={org.status} />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Slug: <span className="font-mono text-[#FF3D00]">{org.slug}</span>
            </p>
            <div className="flex items-center gap-4 pt-2">
                <a 
                    href={`/sites/${org.slug}/admin/dashboard`} 
                    target="_blank" 
                    className="text-[10px] font-black uppercase tracking-widest text-[#FF3D00] hover:underline inline-flex items-center gap-1.5"
                >
                    Visit Dashboard <ExternalLink className="w-3 h-3" />
                </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleUpdate}
            disabled={updating || !isChanged}
            className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-[#FF3D00]/20 gap-2"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* 1. Organization Record - Full Width */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <SectionHeader>Organization Record</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <InfoField label="Unique ID">
              <span className="font-mono text-xs text-muted-foreground">#{org.id}</span>
          </InfoField>
          <InfoField label="Created At">
              {new Date(org.created_at).toLocaleDateString('en-IN', { 
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
              })}
          </InfoField>
          <InfoField label="Plan Tier">
              <span className="uppercase tracking-widest font-bold">Starter</span>
          </InfoField>
          <InfoField label="Max Employees">
              {org.max_employees} seats
          </InfoField>
        </div>
      </div>

      {/* 2. Admin Info & Account Management - Side by Side (Split Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Information */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 flex flex-col justify-between">
          <div>
            <SectionHeader>Admin Information</SectionHeader>
            <div className="grid grid-cols-1 gap-y-5 pt-1">
              <InfoField label="Admin Name">
                  {org.admin_name}
              </InfoField>
              <InfoField label="Admin Phone">
                  {org.admin_phone}
              </InfoField>
              <InfoField label="Admin Email">
                  <div className="flex items-center gap-2">
                      {org.admin_email}
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
              </InfoField>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <SectionHeader>Account Management</SectionHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Plan Tier</Label>
              <Select 
                value={editForm.plan}
                onValueChange={v => setEditForm(f => ({ ...f, plan: v }))}
              >
                <SelectTrigger className="w-full h-11 px-4 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all">
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">System Status</Label>
              <Select 
                value={editForm.status}
                onValueChange={v => setEditForm(f => ({ ...f, status: v }))}
              >
                <SelectTrigger className="w-full h-11 px-4 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="setup">Setup</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Next Billing Cycle Summary Card */}
      {(() => {
          let nextBillingDate = "—"
          if (billingList && billingList.length > 0 && billingList[0]?.created_at) {
              try {
                  const latestDate = new Date(billingList[0].created_at)
                  latestDate.setMonth(latestDate.getMonth() + 1)
                  nextBillingDate = latestDate.toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric'
                  })
              } catch (e) {
                  nextBillingDate = "—"
              }
          } else {
              try {
                  const defaultDate = new Date()
                  defaultDate.setMonth(defaultDate.getMonth() + 1)
                  nextBillingDate = defaultDate.toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'long', year: 'numeric'
                  })
              } catch (e) {
                  nextBillingDate = "—"
              }
          }
          
          const seatCount = actualEmployeeCount
          const nextAmount = seatCount * 499

          return (
              <div className="mb-8 bg-card border border-border/80 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                  {/* Sleek subtle background gradient orb */}
                  <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#FF3D00]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-3 border-b border-border/50 mb-5">
                      Upcoming Subscription Cycle
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      {/* Next Billing Date */}
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                              <CalendarDays className="w-5 h-5 text-[#FF3D00]" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Next Billing Date</p>
                              <p className="text-sm font-black text-foreground">{nextBillingDate}</p>
                          </div>
                      </div>

                      {/* Active Seats (Count) */}
                      <div className="flex items-center gap-4 border-t md:border-t-0 md:border-x border-border/50 pt-4 md:pt-0 md:px-6">
                          <div className="w-10 h-10 rounded-xl bg-[#FF3D00]/10 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-[#FF3D00]" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Active Seats (Employees)</p>
                              <p className="text-sm font-black text-foreground">{seatCount} active {seatCount === 1 ? 'seat' : 'seats'}</p>
                          </div>
                      </div>

                      {/* Projected Invoice Amount */}
                      <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <IndianRupee className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div className="space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Projected Invoice Amount</p>
                              <div className="flex items-baseline gap-1">
                                  <p className="text-base font-black text-emerald-600">₹{nextAmount.toLocaleString('en-IN')}</p>
                                  <span className="text-[10px] font-medium text-muted-foreground">/ month</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )
      })()}

      {/* 4. Billing Ledger - Full Width */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Billing Details & Invoicing Ledger
          </p>
          <Button
            onClick={() => setIsAddInvoiceOpen(true)}
            className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold h-9 px-4 rounded-lg shadow-sm text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Invoice
          </Button>
        </div>

        {loadingBilling ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF3D00]" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading invoices...</span>
          </div>
        ) : billingList.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground space-y-2 border border-dashed border-border/60 rounded-xl">
            <FileText className="w-8 h-8 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-medium">No invoice records found for this organization.</p>
            <p className="text-xs text-muted-foreground/60">Click "Add Invoice" to create a new billing record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50 text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                  <th className="px-6 py-4">Invoice Number</th>
                  <th className="px-6 py-4">Billing Date</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Invoice PDF</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm font-semibold text-foreground">
                {billingList.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{bill.invoice_number}</td>
                    <td className="px-6 py-4 font-normal text-muted-foreground/80">
                      {bill.created_at ? new Date(bill.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="uppercase tracking-widest text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/50">
                        {bill.plan === 'starter' ? 'Starter' : bill.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground/90 font-medium">
                      {bill.payment_method || (
                        <span className="text-muted-foreground/30 font-normal italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const status = (bill.status || 'pending').toLowerCase()
                        let classes = "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        if (status === 'paid') classes = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        if (status === 'overdue') classes = "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        return (
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", classes)}>
                            {status}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {bill.invoice_link ? (
                        <a
                          href={bill.invoice_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-1.5 text-[#FF3D00] hover:bg-[#FF3D00]/10 rounded-lg transition-all"
                          title="Open Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/30 text-xs italic font-normal">No PDF</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvoice(bill.id)}
                        className="text-muted-foreground/50 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 p-0 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Danger Zone - Full Width */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Danger Zone</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Deleting this organization will permanently remove all associated records, including employee configurations, NFC cards, billing ledgers, and administration sessions. This operation cannot be rolled back.
          </p>
        </div>
        
        <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className={cn(
                "h-11 px-6 rounded-xl font-bold transition-all shrink-0 md:min-w-[180px]",
                confirmDelete 
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 animate-pulse" 
                    : "text-rose-600 hover:bg-rose-600/10 hover:text-rose-700 border border-rose-500/20"
            )}
        >
            {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : confirmDelete ? (
                "Confirm Deletion"
            ) : (
                <><Trash2 className="w-4 h-4 mr-2" /> Delete Organization</>
            )}
        </Button>
      </div>

      {/* Add Invoice Custom Modal Dialog */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h2 className="text-base font-bold tracking-tight text-foreground">Add New Billing Invoice</h2>
              <button 
                onClick={() => {
                  setIsAddInvoiceOpen(false)
                  setPdfFile(null)
                  setPdfName("")
                }}
                className="p-1 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Invoice Number</Label>
                <Input
                  required
                  placeholder="e.g. INV-2026-0001"
                  value={newInvoice.invoice_number}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, invoice_number: e.target.value }))}
                  className="h-11 px-4 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Plan Tier</Label>
                  <Select
                    value={newInvoice.plan}
                    onValueChange={(val) => setNewInvoice(prev => ({ ...prev, plan: val }))}
                  >
                    <SelectTrigger className="h-11 px-4 text-sm font-semibold rounded-xl">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Payment Status</Label>
                  <Select
                    value={newInvoice.status}
                    onValueChange={(val) => setNewInvoice(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger className="h-11 px-4 text-sm font-semibold rounded-xl">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Payment Method</Label>
                <Input
                  placeholder="e.g. Credit Card, UPI, Bank Transfer"
                  value={newInvoice.payment_method}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, payment_method: e.target.value }))}
                  className="h-11 px-4 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#FF3D00]/20 focus:border-[#FF3D00]/40 transition-all"
                />
              </div>

              {/* PDF Document Upload Area */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Invoice PDF Document</Label>
                <div className="relative group border-2 border-dashed border-border/60 hover:border-[#FF3D00]/40 hover:bg-[#FF3D00]/5 transition-all rounded-xl p-5 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground/60 group-hover:text-[#FF3D00]/60 transition-colors" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {pdfName ? pdfName : "Drag & Drop or Click to Upload PDF"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {pdfName ? `${(pdfFile?.size || 0) / 1024 > 1024 ? ((pdfFile?.size || 0) / (1024 * 1024)).toFixed(2) + ' MB' : ((pdfFile?.size || 0) / 1024).toFixed(2) + ' KB'}` : "Strictly PDF documents supported"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddInvoiceOpen(false)
                    setPdfFile(null)
                    setPdfName("")
                  }}
                  className="h-11 px-5 rounded-xl font-semibold text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingInvoice}
                  className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-[#FF3D00]/20 gap-2 min-w-[130px]"
                >
                  {savingInvoice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Invoice
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
