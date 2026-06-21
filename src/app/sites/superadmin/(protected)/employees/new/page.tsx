"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, Users, Upload, X, Loader2, CheckCircle2,
  AlertCircle, ImageIcon, Eye, EyeOff, Building2, Briefcase, Mail, Phone, Hash, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// â”€â”€ Section header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-3 border-b border-border/50 mb-4">
      {children}
    </p>
  )
}

// â”€â”€ Field wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground/80">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      {children}
    </div>
  )
}

// â”€â”€ Photo Upload Box â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotoUpload({
  orgSlug, email, value, onChange,
}: { orgSlug: string; email: string; value: string; onChange: (url: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const [uploadError, setUploadError] = React.useState("")

  const uploadFile = async (file: File) => {
    if (!file) return
    if (!orgSlug) { setUploadError("Please select an organization first."); return }
    if (!file.type.startsWith("image/")) { setUploadError("Please upload an image file."); return }
    if (file.size > 2 * 1024 * 1024) { setUploadError("Image must be under 2MB."); return }

    const ext = file.name.split(".").pop()
    const folder = orgSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    const fileName = (email || Date.now().toString()).toLowerCase().replace(/[^a-z0-9@.-]/g, "-")
    const path = `${folder}/${fileName}.${ext}`

    setUploading(true)
    setUploadError("")

    const { error } = await supabase.storage
      .from("frixn")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) {
      setUploadError(`Upload failed: ${error.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from("frixn").getPublicUrl(path)
    onChange(urlData.publicUrl)
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold">Employee Photo</Label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[140px]",
          dragOver ? "border-[#FF3D00] bg-[#FF3D00]/5" : "border-border hover:border-[#FF3D00]/50 hover:bg-muted/30",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-[#FF3D00] animate-spin" />
            <p className="text-xs font-semibold text-muted-foreground">Uploading...</p>
          </>
        ) : value ? (
          <>
            <img src={value} alt="photo" className="w-20 h-20 object-cover rounded-full border-2 border-[#FF3D00]/20" />
            <p className="text-xs text-muted-foreground font-medium underline underline-offset-4">Click to replace</p>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange("") }}
              className="absolute top-3 right-3 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Drop photo here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-0.5">Recommended: Square portrait</p>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f) }} />
      </div>
      {uploadError && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5 font-bold">
          <AlertCircle className="w-3 h-3" />{uploadError}
        </p>
      )}
    </div>
  )
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function NewEmployeePage() {
  const router = useRouter()

  const [orgs, setOrgs] = React.useState<{ id: string; name: string; slug: string }[]>([])
  const [loadingOrgs, setLoadingOrgs] = React.useState(true)

  const [form, setForm] = React.useState({
    org_id: "",
    dept_id: "",
    name: "",
    designation: "",
    employee_code: "",
    email: "",
    phone: "",
    password: "",
    is_active: "true",
    photo_url: "",
  })

  const [showPass, setShowPass] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [cardUrl, setCardUrl] = React.useState("")

  // Reset Link Flow
  const [generatingLink, setGeneratingLink] = React.useState(false)
  const [resetLink, setResetLink] = React.useState("")
  const [copyingLink, setCopyingLink] = React.useState(false)
  const [copyingCard, setCopyingCard] = React.useState(false)

  // Departments State
  const [departments, setDepartments] = React.useState<{ id: string; name: string }[]>([])

  // Fetch orgs
  React.useEffect(() => {
    supabase.from('organizations').select('id, name, slug').order('name').then(({ data }) => {
      setOrgs(data ?? [])
      setLoadingOrgs(false)
    })
  }, [])

  // Fetch departments for selected org
  React.useEffect(() => {
    if (!form.org_id) {
      setDepartments([])
      setForm(f => ({ ...f, dept_id: "" }))
      return
    }

    supabase
      .from('departments')
      .select('id, name')
      .eq('org_id', form.org_id)
      .order('name')
      .then(({ data }) => {
        const list = data ?? []
        setDepartments(list)
        // If the current selected dept is not in the new list, reset it
        setForm(f => ({
          ...f,
          dept_id: list.some(d => d.id === f.dept_id) ? f.dept_id : ""
        }))
      })
  }, [form.org_id])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (!form.org_id) return setError("Please select an organization.")
    if (!form.name.trim()) return setError("Employee name is required.")
    if (!form.email.trim()) return setError("Email is required.")
    if (!form.password.trim()) return setError("Initial password is required.")
    if (form.password.length < 8) return setError("Password must be at least 8 characters.")

    setSaving(true)
    try {
      const res = await fetch("/api/superadmin/create-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          is_active: form.is_active === "true",
          org_slug: orgs.find(o => o.id === form.org_id)?.slug || "unnamed"
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to create employee."); return }

      setCardUrl(data.cardUrl || "")
      setSuccess(true)
    } catch (err: any) {
      setError(err.message ?? "Unexpected error occurred.")
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateLink = async () => {
    setGeneratingLink(true)
    try {
      const res = await fetch("/api/superadmin/generate-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          org_slug: orgs.find(o => o.id === form.org_id)?.slug || "unnamed"
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setResetLink(data.link)

        // Trigger onboarding email via Node server
        try {
          await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: "/api/email/onboarding",
              FullName: form.name.trim() || "Employee",
              Email: form.email.trim(),
              OnboardingLink: data.link
            })
          })
        } catch (emailErr) {
          console.error("Failed to send onboarding email:", emailErr)
        }
      }
      else setError(data.error ?? "Failed to generate link")
    } catch (err: any) {
      setError("Failed to generate link")
    } finally {
      setGeneratingLink(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetLink)
    setCopyingLink(true)
    setTimeout(() => setCopyingLink(false), 2000)
  }

  const handleCopyCard = () => {
    navigator.clipboard.writeText(cardUrl)
    setCopyingCard(true)
    setTimeout(() => setCopyingCard(false), 2000)
  }

  const handleResetForm = () => {
    setForm({
      org_id: "",
      dept_id: "",
      name: "",
      designation: "",
      employee_code: "",
      email: "",
      phone: "",
      password: "",
      is_active: "true",
      photo_url: "",
    })
    setSuccess(false)
    setResetLink("")
    setCardUrl("")
    setError("")
  }

  const selectedOrgSlug = orgs.find(o => o.id === form.org_id)?.slug || ""

  return (
    <div className="min-h-full animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/sites/superadmin/employees"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Employees
        </Link>
        <span className="text-muted-foreground/30">/</span>
        <span className="text-sm font-semibold text-foreground">New Employee</span>
      </div>

      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[#FF3D00]/10 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-[#FF3D00]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Add New Employee</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Register a new employee and provision their platform access credentials.
          </p>
        </div>
      </div>

      {success ? (
        <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 mt-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/50">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Employee Created</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Profile provisioned successfully. Share credentials below.</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Credentials Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-semibold text-foreground truncate" title={form.email}>{form.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Initial Password</p>
                  <p className="text-sm font-mono font-semibold text-foreground truncate">{form.password}</p>
                </div>
              </div>

              {/* NFC Card Link Section */}
              {cardUrl && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">NFC Card Link</p>
                    <p className="text-xs font-mono truncate text-foreground">{cardUrl}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCard}
                    className="shrink-0 h-8 text-xs font-bold"
                  >
                    {copyingCard ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <Hash className="w-3.5 h-3.5 mr-1.5" />}
                    {copyingCard ? "Copied" : "Copy"}
                  </Button>
                </div>
              )}

              {/* Setup Link Section */}
              <div className="pt-2">
                {!resetLink ? (
                  <Button
                    type="button"
                    onClick={handleGenerateLink}
                    disabled={generatingLink}
                    className="w-full h-11 bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-xl shadow-lg shadow-[#FF3D00]/20 transition-all"
                  >
                    {generatingLink ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating & Sending...</>
                    ) : (
                      <><Mail className="w-4 h-4 mr-2" />Generate Link & Email Setup</>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in">
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/80 mb-1">Setup Link (Emailed)</p>
                      <p className="text-xs font-mono truncate text-emerald-700 font-medium">{resetLink}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0 h-8 text-xs font-bold border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20"
                    >
                      {copyingLink ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <Hash className="w-3.5 h-3.5 mr-1.5" />}
                      {copyingLink ? "Copied" : "Copy"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/sites/superadmin/employees")}
              className="flex-1 h-11 rounded-xl font-bold"
            >
              Return to Employees
            </Button>
            <Button
              type="button"
              onClick={handleResetForm}
              className="flex-1 h-11 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90"
            >
              Add Another
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
  
            {/* â”€â”€ Left column: main details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="xl:col-span-2 space-y-8">
  
              {/* Organization Assignment */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <SectionHeader>Organization Assignment</SectionHeader>
                <Field label="Organization" required>
                  <div className="relative">
                    <Select
                      value={form.org_id}
                      onValueChange={v => set("org_id", v)}
                    >
                      <SelectTrigger className="w-full h-10 rounded-xl">
                        <SelectValue placeholder={loadingOrgs ? "Loading organizations..." : "Select parent organization"} />
                      </SelectTrigger>
                      <SelectContent>
                        {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {!loadingOrgs && orgs.length === 0 && (
                      <p className="text-[11px] text-rose-500 mt-1">No organizations found. Please create one first.</p>
                    )}
                  </div>
                </Field>
              </div>
  
              {/* Employee Identity */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <SectionHeader>Employee Record</SectionHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <Field label="Full Name" required>
                      <Input
                        value={form.name}
                        onChange={e => set("name", e.target.value)}
                        placeholder="e.g. Jane Smith"
                        className="h-10 rounded-xl"
                      />
                    </Field>
                  </div>
                  <Field label="Designation">
                    <Input
                      value={form.designation}
                      onChange={e => set("designation", e.target.value)}
                      placeholder="e.g. Product Manager"
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Employee Code">
                    <Input
                      value={form.employee_code}
                      onChange={e => set("employee_code", e.target.value)}
                      placeholder="e.g. EMP-101"
                      className="h-10 rounded-xl font-mono text-sm"
                    />
                  </Field>
                  {departments.length > 0 && (
                    <div className="col-span-full">
                      <Field label="Department">
                        <Select
                          value={form.dept_id}
                          onValueChange={v => set("dept_id", v)}
                        >
                          <SelectTrigger className="w-full h-10 rounded-xl">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(d => (
                              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Contact Details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <SectionHeader>Contact Information</SectionHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Address" required>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="jane@company.com"
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Phone Number">
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-10 rounded-xl"
                    />
                  </Field>
                </div>
              </div>
  
            </div>
  
            {/* â”€â”€ Right column: status, security, actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="space-y-6">
  
              {/* Account Security */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <SectionHeader>Security & Access</SectionHeader>
                <div className="space-y-4">
                  <Field label="Initial Password" required>
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={e => set("password", e.target.value)}
                        placeholder="Min 8 characters"
                        className="h-10 rounded-xl pr-10"
                      />
                      <button type="button" onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">This will be the employee's initial login password.</p>
                  </Field>
  
                  <div className="pt-2">
                    <PhotoUpload
                      orgSlug={selectedOrgSlug}
                      email={form.email}
                      value={form.photo_url}
                      onChange={v => set("photo_url", v)}
                    />
                  </div>
                </div>
              </div>
  
              {/* Status */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <SectionHeader>Account Status</SectionHeader>
                <div className="flex gap-2">
                  {[{ v: "true", label: "Active", theme: "emerald" }, { v: "false", label: "Inactive", theme: "rose" }].map(opt => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => set('is_active', opt.v)}
                      className={cn(
                        "flex-1 h-11 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all",
                        form.is_active === opt.v
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
  
              {/* Submit */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                {error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium">{error}</p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-11 bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-xl shadow-lg shadow-[#FF3D00]/20 disabled:opacity-70"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" />Add Employee</>
                  )}
                </Button>
  
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/sites/superadmin/employees")}
                  className="w-full h-10 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
  
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

