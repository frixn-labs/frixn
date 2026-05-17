"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft, Building2, Upload, X, Loader2, CheckCircle2,
  AlertCircle, ImageIcon, Eye, EyeOff, Hash
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ── Logo Upload Box ──────────────────────────────────────────────────────────
function LogoUpload({
  slug, value, onChange,
}: { slug: string; value: string; onChange: (url: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const [uploadError, setUploadError] = React.useState("")

  const uploadFile = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) { setUploadError("Please upload an image file."); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be under 5MB."); return }

    const folderName = (slug || "unnamed").toLowerCase().replace(/[^a-z0-9-]/g, "-")
    const ext = file.name.split(".").pop()
    const path = `${folderName}/logo.${ext}`

    setUploading(true)
    setUploadError("")

    const { error } = await supabase.storage
      .from("tapconnect")
      .upload(path, file, { upsert: true, contentType: file.type })

    if (error) {
      setUploadError(`Upload failed: ${error.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from("tapconnect").getPublicUrl(path)
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
      <Label className="text-xs font-semibold">Logo</Label>
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
            <p className="text-xs font-semibold text-muted-foreground">Uploading…</p>
          </>
        ) : value ? (
          <>
            <img src={value} alt="logo" className="w-16 h-16 object-contain rounded-xl border border-border bg-white p-1" />
            <p className="text-xs text-muted-foreground font-medium">Click to replace</p>
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
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Drop logo here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG · Max 5MB</p>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f) }} />
      </div>
      {uploadError && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />{uploadError}
        </p>
      )}
    </div>
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

// ── Color picker row ─────────────────────────────────────────────────────────
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3 border border-border rounded-xl px-3 h-10 bg-background hover:border-[#FF3D00]/40 transition-colors cursor-pointer"
        onClick={() => document.getElementById(`color-${label}`)?.click()}>
        <input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-6 h-6 rounded-lg cursor-pointer border-0 bg-transparent"
        />
        <span className="text-sm font-mono text-muted-foreground flex-1">{value}</span>
        <div className="w-5 h-5 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: value }} />
      </div>
    </Field>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function NewOrganizationPage() {
  const router = useRouter()

  const [form, setForm] = React.useState({
    name: "", slug: "", logo_url: "",
    brand_color: "#1A3C6E", accent_color: "#E8A020",
    plan: "starter", max_employees: "50", status: "setup",
    admin_name: "", admin_email: "", admin_password: "", admin_phone: "",
  })
  const [showPass, setShowPass] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  // Reset Link Flow
  const [generatingLink, setGeneratingLink] = React.useState(false)
  const [resetLink, setResetLink] = React.useState("")
  const [copying, setCopying] = React.useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleNameChange = (v: string) => {
    set("name", v)
    // Auto-generate slug only if user hasn't manually edited it
    const autoSlug = v.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    setForm(f => ({ ...f, name: v, slug: autoSlug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (!form.name.trim()) return setError("Organization name is required.")
    if (!form.slug.trim()) return setError("Slug is required.")
    if (!form.admin_email.trim()) return setError("Admin email is required.")
    if (!form.admin_password.trim()) return setError("Admin password is required.")
    if (form.admin_password.length < 8) return setError("Admin password must be at least 8 characters.")

    setSaving(true)
    try {
      const res = await fetch("/api/superadmin/create-organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          logo_url: form.logo_url || null,
          brand_color: form.brand_color,
          accent_color: form.accent_color,
          plan: form.plan,
          max_employees: form.max_employees,
          status: form.status,
          admin_name: form.admin_name.trim() || null,
          admin_email: form.admin_email.trim().toLowerCase(),
          admin_password: form.admin_password,
          admin_phone: form.admin_phone.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to create organization."); return }

      setSuccess(true)
      // We no longer redirect automatically to allow generating the setup link
      // setTimeout(() => router.push("/sites/superadmin/organizations"), 1500)
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
        body: JSON.stringify({ email: form.admin_email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResetLink(data.link)

        // Trigger onboarding email via Node server
        try {
          await fetch("https://server.frixn.in/api/email/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              FullName: form.admin_name.trim() || "Organization Admin",
              Email: form.admin_email.trim(),
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

  const handleCopy = () => {
    navigator.clipboard.writeText(resetLink)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  return (
    <div className="min-h-full animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/sites/superadmin/organizations"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Organizations
        </Link>
        <span className="text-muted-foreground/30">/</span>
        <span className="text-sm font-semibold text-foreground">New Organization</span>
      </div>

      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[#FF3D00]/10 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-[#FF3D00]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Create Organization</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Provisions a new tenant on the frixn platform and creates an admin login.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── Left column: main details ──────────────────────────────── */}
          <div className="xl:col-span-2 space-y-8">

            {/* Identity */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <SectionHeader>Organization Identity</SectionHeader>
              <div className="space-y-4">
                <Field label="Organization Name" required>
                  <Input
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Acme Corporation"
                    className="h-10 rounded-xl"
                  />
                </Field>

                <Field label="Slug — URL identifier" required>
                  <div className="flex items-center">
                    <span className="px-3 h-10 bg-muted border border-r-0 border-border rounded-l-xl text-xs text-muted-foreground flex items-center font-mono shrink-0">
                      /sites/
                    </span>
                    <Input
                      value={form.slug}
                      onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="acme-corp"
                      className="h-10 rounded-l-none rounded-r-xl font-mono text-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Dashboard URL: <span className="font-mono">frixn.app/sites/{form.slug || "your-slug"}/admin/dashboard</span>
                  </p>
                </Field>

                <LogoUpload slug={form.slug} value={form.logo_url} onChange={v => set("logo_url", v)} />
              </div>
            </div>

            {/* Admin Account */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <SectionHeader>Admin Account</SectionHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Admin Full Name">
                  <Input value={form.admin_name} onChange={e => set("admin_name", e.target.value)}
                    placeholder="John Doe" className="h-10 rounded-xl" />
                </Field>
                <Field label="Admin Phone">
                  <Input type="tel" value={form.admin_phone} onChange={e => set("admin_phone", e.target.value)}
                    placeholder="+91 98765 43210" className="h-10 rounded-xl" />
                </Field>
                <Field label="Admin Email" required>
                  <Input type="email" value={form.admin_email} onChange={e => set("admin_email", e.target.value)}
                    placeholder="admin@acme.com" className="h-10 rounded-xl" />
                </Field>
                <Field label="Admin Password" required>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      value={form.admin_password}
                      onChange={e => set("admin_password", e.target.value)}
                      placeholder="Min 8 characters"
                      className="h-10 rounded-xl pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Used to log in to the admin dashboard</p>
                </Field>
              </div>
            </div>

          </div>

          {/* ── Right column: plan, colors, actions ────────────────────── */}
          <div className="space-y-6">

            {/* Plan & Status */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <SectionHeader>Plan & Limits</SectionHeader>
              <div className="space-y-4">
                <Field label="Plan">
                  <Select value={form.plan} onValueChange={v => set("plan", v)}>
                    <SelectTrigger className="w-full h-10 rounded-xl">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onValueChange={v => set("status", v)}>
                    <SelectTrigger className="w-full h-10 rounded-xl">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="setup">Setup</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Max Employees">
                  <Input type="number" min="1" value={form.max_employees}
                    onChange={e => set("max_employees", e.target.value)}
                    className="h-10 rounded-xl" />
                </Field>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <SectionHeader>Brand Colors</SectionHeader>
              <div className="space-y-4">
                <ColorField label="Brand Color" value={form.brand_color} onChange={v => set("brand_color", v)} />
                <ColorField label="Accent Color" value={form.accent_color} onChange={v => set("accent_color", v)} />
                {/* Preview */}
                <div className="mt-4 rounded-xl overflow-hidden">
                  <div className="h-8" style={{ background: `linear-gradient(135deg, ${form.brand_color}, ${form.accent_color})` }} />
                  <div className="h-2 flex">
                    <div className="flex-1" style={{ backgroundColor: form.brand_color }} />
                    <div className="flex-1" style={{ backgroundColor: form.accent_color }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              {success && !resetLink && (
                <div className="space-y-3 pt-4 border-t border-border animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Organization Created</p>
                      <p className="text-xs font-semibold opacity-90 leading-tight">The organization and admin account are ready. Generate a reset link to let the owner set their own password.</p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerateLink}
                    disabled={generatingLink}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10"
                  >
                    {generatingLink ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                    ) : (
                      <>Generate Admin Reset Link</>
                    )}
                  </Button>
                </div>
              )}

              {resetLink && (
                <div className="space-y-4 pt-4 border-t border-border animate-in zoom-in-95 duration-300">
                  <div className="bg-muted px-4 py-3 rounded-xl border border-border relative group">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">Admin Setup Link</p>
                    <p className="text-[10px] font-mono break-all text-foreground pr-8 leading-relaxed">
                      {resetLink}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-background border border-border hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm"
                    >
                      {copying ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/10">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <p className="text-[10px] font-bold">Copy this link and send it to the organization owner.</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/sites/superadmin/organizations")}
                    className="w-full h-10 rounded-xl font-bold"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              )}

              {!success && (
                <>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-11 bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold rounded-xl shadow-lg shadow-[#FF3D00]/20 disabled:opacity-70"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</>
                    ) : (
                      <><Building2 className="w-4 h-4 mr-2" />Create Organization</>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/sites/superadmin/organizations")}
                    className="w-full h-10 rounded-xl"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
