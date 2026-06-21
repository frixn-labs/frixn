"use client"
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Mail,
  MessageCircle,
  UserPlus,
  Share2,
  ChevronRight,
  Globe,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Briefcase,
  Link as LinkIcon,
  Bookmark,
  Contact
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from "@/components/ThemeToggle"
import { Save, X, Settings2 } from 'lucide-react'
import { format } from "date-fns"
import DeactivatedView from './DeactivatedView'

export default function ProfileClient({
  employee,
  org,
  links,
  isLocked,
  activeCardId
}: {
  employee: any,
  org: any,
  links: any[],
  isLocked: boolean,
  activeCardId: string | null
}) {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const [sendingLead, setSendingLead] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Realtime Live State
  const [liveEmployee, setLiveEmployee] = useState(employee)
  const [liveLinks, setLiveLinks] = useState(links)

  // Form State
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', designation: '', product: '', followup_date: '' })
  const [availableProducts, setAvailableProducts] = useState<string[]>([])
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Edit State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    phone: employee.phone || '',
    email: employee.email || ''
  })
  const [saving, setSaving] = useState(false)

  // Realtime Logic
  const [liveLocked, setLiveLocked] = useState(isLocked)
  const [liveDeactivated, setLiveDeactivated] = useState(false)

  // Re-calculate locked state from card array
  const calculateLockedStatus = (cards: any[]) => {
    const activeCards = cards.filter(c => c.status === 'active')
    if (activeCards.length === 0) return true
    return activeCards.every(c => c.is_locked)
  }

  // Re-calculate deactivated state from employee and cards
  const calculateDeactivatedStatus = (emp: any, cards: any[]) => {
    if (!emp.is_active) return true
    if (cards && cards.length > 0) {
      return cards.every(c => c.status === 'deactivated')
    }
    return false
  }

  useEffect(() => {
    setMounted(true)
    logTap()

    // Fetch available products list
    if (org?.id) {
      supabase.from('products').select('products').eq('org_id', org.id).single().then(({ data }) => {
        if (data && data.products) setAvailableProducts(data.products)
      })
    }

    // Realtime subscriptions
    const channel = supabase.channel(`profile-${employee.id}`)
      .on('postgres_changes', { event: '*', schema: 'frixn', table: 'employees', filter: `id=eq.${employee.id}` }, async (payload: any) => {
        if (payload.new) {
          setLiveEmployee(payload.new)
          // If employee becomes inactive, deactivate immediately
          if (payload.new.is_active === false) setLiveDeactivated(true)
          else {
            // Re-check overall status if they become active
            const { data: cards } = await supabase.from('nfc_cards').select('*').eq('employee_id', employee.id)
            setLiveDeactivated(calculateDeactivatedStatus(payload.new, cards || []))
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'frixn', table: 'nfc_cards', filter: `employee_id=eq.${employee.id}` }, async () => {
        // Re-fetch cards and re-calc everything
        const { data: cards } = await supabase.from('nfc_cards').select('*').eq('employee_id', employee.id)
        if (cards) {
          setLiveLocked(calculateLockedStatus(cards))
          setLiveDeactivated(calculateDeactivatedStatus(liveEmployee, cards))

          // If it becomes locked, exit edit mode
          const locked = calculateLockedStatus(cards)
          if (locked) setIsEditing(false)
        }
      })
      .on('postgres_changes', { event: '*', schema: 'frixn', table: 'card_links', filter: `org_id=eq.${org.id}` }, async () => {
        // Re-fetch links if any change happens, to handle assigned_to matching easily
        const { data } = await supabase.from('card_links').select('*').eq('org_id', org.id)
        if (data) {
          const sorted = data.filter(l => l.assigned_to?.includes(employee.id) && l.is_active)
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          setLiveLinks(sorted)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [employee.id, org.id])

  const logTap = async () => {
    try {
      let city = 'Unknown'
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data.city) city = data.city
      } catch (err) {
        console.warn('Could not fetch geolocation', err)
      }

      await supabase.from('taps').insert({
        org_id: org.id,
        employee_id: employee.id,
        card_id: activeCardId,
        device: navigator.userAgent,
        os: navigator.platform,
        city: city
      })
    } catch (err) {
      console.error('Failed to log tap:', err)
    }
  }

  const handleLinkClick = async (link: any) => {
    try {
      await supabase.from('card_link_clicks').insert({
        org_id: org.id,
        card_link_id: link.id,
        employee_id: liveEmployee.id,
        platform: link.platform
      })
    } catch (err) {
      console.error('Failed to log link click:', err)
    }
  }

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${liveEmployee.name}
ORG:${org.name}
TITLE:${liveEmployee.designation}
TEL;TYPE=CELL:${liveEmployee.phone}
EMAIL:${liveEmployee.email}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${liveEmployee.name.replace(' ', '_')}.vcf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingLead(true)
    try {
      const { error } = await supabase.from('leads').insert({
        org_id: org.id,
        employee_id: liveEmployee.id,
        visitor_name: form.name,
        visitor_email: form.email,
        visitor_phone: form.phone,
        visitor_company: form.company,
        lead_designation: form.designation || null,
        product: form.product || null,
        followup_date: form.followup_date || format(new Date(), 'yyyy-MM-dd'),
        status: 'new'
      })
      if (error) throw error

      setLeadSent(true)

      if (liveEmployee.phone) {
        const phoneBase = liveEmployee.phone.replace(/[^0-9]/g, '');
        const msg = `Hi ${liveEmployee.name.split(' ')[0]}!\nI just shared my contact details via your digital profile.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}${form.company ? `\nCompany: ${form.company}` : ''}${form.designation ? `\nDesignation: ${form.designation}` : ''}${form.product ? `\nProduct Interest: ${form.product}` : ''}${form.followup_date ? `\nFollow-up Date: ${format(new Date(form.followup_date), 'PPP')}` : ''}`;
        const encodedMsg = encodeURIComponent(msg);
        const waUrl = `https://wa.me/${phoneBase}?text=${encodedMsg}`;
        window.location.href = waUrl;
      }

      setTimeout(() => {
        setShowLeadForm(false)
        setLeadSent(false)
        setForm({ name: '', email: '', phone: '', company: '', designation: '', product: '', followup_date: '' })
      }, 2000)
    } catch (err) {
      alert('Failed to send details. Please try again.')
    } finally {
      setSendingLead(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    let p = (platform || '').toLowerCase().trim()
    if (p.includes('linkedin')) p = 'linkedin'
    else if (p.includes('whatsapp') || p.includes('wa.me')) p = 'whatsapp'
    else if (p.includes('insta')) p = 'instagram'
    else if (p.includes('twitter') || p === 'x') p = 'twitter'
    else if (p.includes('calendly')) p = 'calendly'

    const cls = "w-[18px] h-[18px] opacity-60"

    if (p === 'linkedin') return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
    if (p === 'whatsapp') return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    )
    if (p === 'instagram') return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    )
    if (p === 'twitter') return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    )
    if (p === 'calendly') return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
      </svg>
    )

    const fallbackCls = "w-[18px] h-[18px] text-muted-foreground opacity-70"
    switch (p) {
      case 'website': return <Globe className={fallbackCls} />
      case 'vcard': return <Contact className={fallbackCls} />
      case 'form': return <Globe className={fallbackCls} />
      default: return <LinkIcon className={fallbackCls} />
    }
  }

  if (!mounted) return null

  if (liveDeactivated) {
    return <DeactivatedView org={org} />
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0B] text-[#F5F5F5] font-sans overflow-x-hidden flex flex-col items-center px-4 py-8 select-none">
      {/* Background Grid Pattern */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(255,61,0,0.15)_0%,transparent_70%)] blur-[50px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(255,61,0,0.08)_0%,transparent_75%)] blur-[60px] pointer-events-none z-0" />

      {/* Utility controls (ThemeToggle and optional Settings/Edit mode button) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        {!liveLocked && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl bg-[#16161A]/80 border border-zinc-800/80 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
          </button>
        )}
        <ThemeToggle />
      </div>

      {/* Content Wrapper */}
      <div className="w-full max-w-[390px] relative z-10 flex flex-col min-h-screen pt-4">
        {/* Top Left Logo */}
        <div className="flex items-center gap-1 bg-[#121214] border border-zinc-800/80 px-3 py-1.5 rounded-xl self-start mb-8 select-none">
          <span className="text-white font-bold text-xs tracking-tight flex items-center">
            fr
            <svg className="w-3.5 h-3.5 text-[#FF3D00] fill-current mx-[0.5px]" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            xn.
          </span>
        </div>

        {/* Avatar & Name Identity Section */}
        <div className="flex items-center gap-4 w-full mb-8">
          {/* Avatar with Custom Outline and Indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-[84px] h-[84px] rounded-full p-[2.5px] bg-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.25)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0A0A0B] p-[2.5px] flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                  {liveEmployee.photo_url ? (
                    <img src={liveEmployee.photo_url} alt={liveEmployee.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-zinc-400">
                      {liveEmployee.name?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#FF3D00] border-[2.5px] border-[#0A0A0B]" />
          </div>

          {/* Text Identity Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                {liveEmployee.name}
              </h1>
              {/* Verified Badge */}
              <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-[#FF3D00]">
                <svg className="w-2.5 h-2.5 text-white stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-[13px] font-semibold text-[#FF3D00] mt-0.5">
              {liveEmployee.designation || "Founder"}
            </p>
          </div>
        </div>

        {/* Editable info card */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full space-y-4 overflow-hidden mb-6"
            >
              <div className="bg-[#16161A]/95 p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF3D00] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-[#0A0A0B] border border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#FF3D00] transition-all"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={async () => {
                      setSaving(true)
                      try {
                        const { error } = await supabase
                          .from('employees')
                          .update({ phone: editForm.phone, email: editForm.email })
                          .eq('id', liveEmployee.id)

                        if (error) throw error
                        setIsEditing(false)
                      } catch (err) {
                        alert('Failed to save changes.')
                      } finally {
                        setSaving(false)
                      }
                    }}
                    disabled={saving}
                    className="flex-1 bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Info
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headlines Section */}
        <div className="w-full mb-6">
          <h2 className="text-[32px] font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            So, are we going to stay in touch?
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4 font-medium">
            Leave your details and I'll personally make sure the right opportunity finds its way back to you.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium">
            <span className="text-[#FF3D00] font-bold">Frixn?</span> It's the tiny tap that turns a quick hello into your next big deal.
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full">
          {leadSent ? (
            <div className="py-16 w-full flex flex-col items-center text-center bg-[#16161A]/80 rounded-3xl border border-zinc-800/80 shadow-lg animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">Details Sent!</h3>
              <p className="text-sm font-medium text-zinc-400">I will get in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3 w-full">
              <input
                type="text"
                placeholder="What's your name?"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#16161A]/60 border border-zinc-800/85 rounded-2xl px-5 py-4 text-[15px] font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00]/20 transition-all"
              />
              <input
                type="email"
                placeholder="Where can I email you?"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#16161A]/60 border border-zinc-800/85 rounded-2xl px-5 py-4 text-[15px] font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00]/20 transition-all"
              />
              <input
                type="tel"
                placeholder="Your mobile number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#16161A]/60 border border-zinc-800/85 rounded-2xl px-5 py-4 text-[15px] font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00]/20 transition-all"
              />
              <input
                type="text"
                placeholder="Which company are you with?"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-[#16161A]/60 border border-zinc-800/85 rounded-2xl px-5 py-4 text-[15px] font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00]/20 transition-all"
              />

              <button
                type="submit"
                disabled={sendingLead}
                className="w-full bg-gradient-to-r from-[#FF6D3A] to-[#FF3D00] text-white font-bold py-4.5 rounded-2xl mt-4 shadow-[0_4px_20px_rgba(255,61,0,0.25)] hover:shadow-[0_4px_25px_rgba(255,61,0,0.35)] active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                {sendingLead ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Let's stay in touch"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Optional Links Section if configured for the employee */}
        {liveLinks.filter((l: any) => l.is_active).length > 0 && (
          <div className="w-full mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-zinc-800/80" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Or connect on</span>
              <div className="h-[1px] flex-1 bg-zinc-800/80" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {liveLinks.filter((l: any) => l.is_active).map((link: any, i: number) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  onClick={() => handleLinkClick(link)}
                  className="w-full bg-[#16161A]/50 border border-zinc-800/60 rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-zinc-700/80 hover:bg-[#16161A]/80 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A0A0B] border border-zinc-800 text-zinc-400 group-hover:text-[#FF3D00] transition-colors">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white text-[15px] truncate">{link.label || link.platform}</span>
                      <span className="text-[12px] text-zinc-500 truncate tracking-wide mt-0.5">{link.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FF3D00] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Premium Footer */}
        <div className="mt-auto pt-16 pb-8 flex items-center justify-center gap-1.5 text-zinc-500 text-[11px] font-semibold tracking-tight select-none z-10">
          <svg className="w-3.5 h-3.5 text-[#FFB300] fill-current" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span>Your details stay private. Powered by</span>
          <span className="text-white font-bold flex items-center ml-0.5">
            fr
            <svg className="w-3.5 h-3.5 text-[#FF3D00] fill-current mx-[0.5px]" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            xn.
          </span>
        </div>
      </div>
    </div>
  )
}
