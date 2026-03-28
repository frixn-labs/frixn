"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Link as LinkIcon, 
  Plus, 
  GripVertical, 
  Trash2, 
  Save, 
  Loader2,
  ExternalLink,
  ChevronRight,
  Globe
} from 'lucide-react'

export default function LinksPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    fetchInitialData()
  }, [slug])

  const fetchInitialData = async () => {
    try {
      const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single()
      if (!org) return
      setOrgId(org.id)

      const { data: emps } = await supabase.from('employees').select('id, name').eq('org_id', org.id)
      setEmployees(emps || [])
      if (emps && emps.length > 0) {
        setSelectedEmployee(emps[0].id)
        fetchLinks(emps[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchLinks = async (employeeId: string) => {
    setLoading(true)
    const { data } = await supabase.from('card_links').select('*').eq('employee_id', employeeId).order('display_order')
    setLinks(data || [])
    setLoading(false)
  }

  const handleAddLink = () => {
    const newLink = {
      id: crypto.randomUUID(),
      org_id: orgId,
      employee_id: selectedEmployee,
      platform: 'Custom',
      label: 'New Link',
      url: 'https://',
      is_active: true,
      display_order: links.length
    }
    setLinks([...links, newLink])
  }

  const handleUpdateLink = (id: string, updates: any) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.from('card_links').delete().eq('employee_id', selectedEmployee)
      const toInsert = links.map(({ id, ...rest }, index) => ({
        ...rest,
        display_order: index
      }))
      const { error } = await supabase.from('card_links').insert(toInsert)
      if (error) throw error
      alert('Links updated!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 uppercase">Manage Links</h1>
          <p className="text-secondary font-medium">Customize digital cards for your team.</p>
        </div>
        <div className="flex items-center gap-3">
            <select 
              value={selectedEmployee || ''} 
              onChange={(e) => {
                setSelectedEmployee(e.target.value)
                fetchLinks(e.target.value)
              }}
              className="bg-white border-2 border-black/5 rounded-2xl px-4 py-3.5 font-bold text-sm outline-none shadow-sm"
            >
                {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
            </select>
            <button onClick={handleSave} disabled={saving} className="apple-btn px-6 py-4 rounded-2xl flex items-center gap-2 group shadow-xl">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
            </button>
        </div>
      </div>

      <div className="max-w-3xl bg-white rounded-[2.5rem] border border-black/[0.03] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-black/5 flex items-center justify-between">
            <span className="font-black text-lg uppercase tracking-tight">Link Inventory</span>
            <button onClick={handleAddLink} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all">
                <Plus className="w-6 h-6" />
            </button>
        </div>

        <div className="p-4 space-y-4">
            {links.map((link, index) => (
                <div key={link.id} className="bg-[#f9f9fb] rounded-2xl p-4 flex items-center gap-4 group">
                    <GripVertical className="w-5 h-5 text-secondary/30" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select 
                            value={link.platform}
                            onChange={(e) => handleUpdateLink(link.id, { platform: e.target.value })}
                            className="bg-white border-2 border-black/5 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                        >
                            <option value="Custom">Custom</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Portfolio">Portfolio</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter/X</option>
                        </select>
                        <input type="text" value={link.label} placeholder="Label" onChange={e => handleUpdateLink(link.id, { label: e.target.value })} className="bg-white border rounded-xl px-4 py-2 text-sm font-bold shadow-sm" />
                        <div className="relative group/input">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                            <input type="text" value={link.url} placeholder="URL" onChange={e => handleUpdateLink(link.id, { url: e.target.value })} className="w-full bg-white border rounded-xl px-10 py-2 text-sm font-medium shadow-sm" />
                        </div>
                    </div>
                    <button onClick={() => handleRemoveLink(link.id)} className="p-2 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
