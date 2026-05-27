"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, User, Loader2, CheckCircle2,
  AlertCircle, Building2, CreditCard, Mail, Phone, Briefcase, Hash, Link as LinkIcon,
  Trash2, Edit, Save, X, ShieldAlert, Trash
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Status badge helper ────────────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      active 
        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
    )}>
      {active ? "Active" : "Inactive"}
    </span>
  )
}

function CardStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    active: { label: "Active", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    inactive: { label: "Inactive", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    lost: { label: "Lost/Stolen", class: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
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

export default function EmployeeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [employee, setEmployee] = React.useState<any>(null)
  const [nfcCard, setNfcCard] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [copying, setCopying] = React.useState(false)

  // Edit / Delete States
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [departments, setDepartments] = React.useState<{ id: string; name: string }[]>([])

  const [editForm, setEditForm] = React.useState({
    name: "",
    designation: "",
    employee_code: "",
    phone: "",
    is_active: true,
    photo_url: "",
    dept_id: "",
  })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    setError("")
    
    // 1. Fetch employee data
    const { data: empData, error: empError } = await supabase
      .from('employees')
      .select('*, organizations(id, name, slug)')
      .eq('id', id)
      .single()

    if (empError) {
      setError(empError.message)
      setLoading(false)
      return
    }
    
    setEmployee(empData)
    setEditForm({
      name: empData.name || "",
      designation: empData.designation || "",
      employee_code: empData.employee_code || "",
      phone: empData.phone || "",
      is_active: empData.is_active ?? true,
      photo_url: empData.photo_url || "",
      dept_id: empData.dept_id || "",
    })

    // 2. Fetch NFC Card data
    const { data: cardData, error: cardError } = await supabase
      .from('nfc_cards')
      .select('*')
      .eq('employee_id', id)
      .single()

    if (!cardError && cardData) {
      setNfcCard(cardData)
    } else {
      setNfcCard(null)
    }

    setLoading(false)
  }, [id])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Fetch departments for employee's organization
  React.useEffect(() => {
    if (employee?.org_id) {
      supabase
        .from('departments')
        .select('id, name')
        .eq('org_id', employee.org_id)
        .order('name')
        .then(({ data }) => {
          setDepartments(data ?? [])
        })
    }
  }, [employee?.org_id])

  const handleCopyCard = () => {
    if (!nfcCard?.card_url) return
    navigator.clipboard.writeText(nfcCard.card_url)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.name.trim()) {
      alert("Name is required.")
      return
    }

    setIsSaving(true)
    try {
      const { error: updateError } = await supabase
        .from('employees')
        .update({
          name: editForm.name.trim(),
          designation: editForm.designation.trim() || null,
          employee_code: editForm.employee_code.trim() || null,
          phone: editForm.phone.trim() || null,
          is_active: editForm.is_active,
          photo_url: editForm.photo_url.trim() || null,
          dept_id: editForm.dept_id || null,
        })
        .eq('id', id)

      if (updateError) throw updateError

      setIsEditing(false)
      fetchData()
    } catch (err: any) {
      console.error("Error updating employee:", err)
      alert(err.message || "Failed to update employee details.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/superadmin/employees/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete employee and auth user.")
      }

      setConfirmDelete(false)
      router.push("/sites/superadmin/employees")
    } catch (err: any) {
      console.error("Error deleting employee:", err)
      alert(err.message || "Failed to delete employee.")
      setConfirmDelete(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#FF3D00] animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading employee details...</p>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Failed to Load Data</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">{error || "Employee not found."}</p>
        </div>
        <Button onClick={() => router.push("/sites/superadmin/employees")} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Employees
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/sites/superadmin/employees"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Employees
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">
            {employee.name}
          </span>
        </div>

        {/* Action Buttons */}
        {!isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="font-bold border-border"
            >
              <Edit className="w-4 h-4 mr-1.5" /> Edit
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false)
                setEditForm({
                  name: employee.name || "",
                  designation: employee.designation || "",
                  employee_code: employee.employee_code || "",
                  phone: employee.phone || "",
                  is_active: employee.is_active ?? true,
                  photo_url: employee.photo_url || "",
                  dept_id: employee.dept_id || "",
                })
              }}
              variant="outline"
              size="sm"
              className="font-semibold"
            >
              <X className="w-4 h-4 mr-1.5" /> Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF3D00]/10 flex items-center justify-center shrink-0 overflow-hidden text-[#FF3D00] border-2 border-[#FF3D00]/20">
            {editForm.photo_url ? (
              <img src={editForm.photo_url} alt={editForm.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight">{isEditing ? editForm.name : employee.name}</h1>
              <StatusBadge active={isEditing ? editForm.is_active : employee.is_active} />
            </div>
            <p className="text-sm font-mono text-muted-foreground mt-0.5">
              ID: {employee.id}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content Grid ──────────────────────────────────────────────────── */}
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Identity & Contact) */}
          <div className="xl:col-span-2 space-y-6">
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <SectionHeader>Identity & Organization</SectionHeader>
              
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoField label="Full Name">{employee.name}</InfoField>
                  <InfoField label="Designation">
                    {employee.designation && (
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground/70" /> {employee.designation}
                      </span>
                    )}
                  </InfoField>
                  <InfoField label="Employee Code">
                    {employee.employee_code && <span className="font-mono">{employee.employee_code}</span>}
                  </InfoField>
                  <InfoField label="Department">
                    {departments.find(d => d.id === employee.dept_id)?.name || ""}
                  </InfoField>
                  <InfoField label="Organization">
                    {employee.organizations ? (
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#FF3D00]" /> 
                        <Link href={`/sites/superadmin/organizations/${employee.organizations.id}`} className="hover:underline hover:text-[#FF3D00]">
                          {employee.organizations.name}
                        </Link>
                      </span>
                    ) : null}
                  </InfoField>
                  <InfoField label="Created On">
                    {employee.created_at ? new Date(employee.created_at).toLocaleString() : ""}
                  </InfoField>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Full Name *</Label>
                    <Input 
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Designation</Label>
                    <Input 
                      value={editForm.designation}
                      onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                      placeholder="e.g. Sales Director"
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Employee Code</Label>
                    <Input 
                      value={editForm.employee_code}
                      onChange={e => setEditForm({ ...editForm, employee_code: e.target.value })}
                      className="h-10 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Department</Label>
                    {departments.length > 0 ? (
                      <Select
                        value={editForm.dept_id || "none"}
                        onValueChange={v => setEditForm({ ...editForm, dept_id: v === "none" ? "" : v })}
                      >
                        <SelectTrigger className="h-10 w-full rounded-xl">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {departments.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-xs text-muted-foreground italic pt-2">No departments in this organization</div>
                    )}
                  </div>

                  <div className="space-y-2 col-span-full">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Account Status</Label>
                    <div className="flex gap-2 max-w-xs">
                      {[{ v: true, label: "Active", theme: "emerald" }, { v: false, label: "Inactive", theme: "rose" }].map(opt => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, is_active: opt.v })}
                          className={cn(
                            "flex-1 h-10 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all",
                            editForm.is_active === opt.v
                              ? opt.theme === "emerald"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                                : "border-rose-500 bg-rose-500/10 text-rose-600"
                              : "border-border bg-muted/30 text-muted-foreground hover:border-border/80"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <SectionHeader>Contact Information</SectionHeader>
              
              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoField label="Email Address">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground/70" />
                      <a href={`mailto:${employee.email}`} className="hover:underline">{employee.email}</a>
                    </span>
                  </InfoField>
                  <InfoField label="Phone Number">
                    {employee.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground/70" />
                        <a href={`tel:${employee.phone}`} className="hover:underline">{employee.phone}</a>
                      </span>
                    )}
                  </InfoField>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Email Address (Cannot Edit)</Label>
                    <Input 
                      value={employee.email}
                      disabled
                      className="h-10 rounded-xl bg-muted/50 cursor-not-allowed opacity-80"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Email address is linked to platform login and cannot be altered.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Phone Number</Label>
                    <Input 
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="h-10 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (NFC Card Details) */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full">
              <SectionHeader>NFC Card Provisioning</SectionHeader>
              
              {nfcCard ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold text-foreground">Card Details</span>
                    </div>
                    <CardStatusBadge status={nfcCard.status} />
                  </div>
                  
                  <div className="space-y-4">
                    <InfoField label="Card Code">
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                        {nfcCard.card_code}
                      </span>
                    </InfoField>
                    <InfoField label="UID (Chip ID)">
                      <span className="font-mono text-xs">{nfcCard.uid || '—'}</span>
                    </InfoField>
                    <InfoField label="Chip Type">
                      {nfcCard.chip_type || '—'}
                    </InfoField>
                    <InfoField label="Activated At">
                      {nfcCard.activated_at ? new Date(nfcCard.activated_at).toLocaleString() : "Not activated"}
                    </InfoField>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Public URL</p>
                    {nfcCard.card_url ? (
                      <div className="flex items-center gap-2 bg-muted p-2.5 rounded-xl border border-border">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono truncate text-foreground">{nfcCard.card_url}</p>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyCard}
                          className="shrink-0 h-8 px-3"
                        >
                          {copying ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <LinkIcon className="w-3.5 h-3.5 mr-1.5" />}
                          {copying ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No URL generated.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-60">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm font-semibold">No NFC Card Assigned</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Danger Zone</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Deleting this employee will permanently remove their profile and delete all associated taps, leads, and NFC cards from Auth and Database. This action cannot be undone.
          </p>
        </div>
        
        <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
                "h-11 px-6 rounded-xl font-bold transition-all shrink-0 md:min-w-[180px]",
                confirmDelete 
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 animate-pulse" 
                    : "text-rose-600 hover:bg-rose-600/10 hover:text-rose-700 border border-rose-500/20"
            )}
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : confirmDelete ? (
                "Confirm Deletion"
            ) : (
                <><Trash className="w-4 h-4 mr-2" /> Delete Employee</>
            )}
        </Button>
      </div>
    </div>
  )
}
