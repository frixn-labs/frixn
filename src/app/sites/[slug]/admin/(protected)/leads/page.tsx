"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Magnet, 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Building2,
  Loader2,
  Trash2
} from 'lucide-react'

export default function LeadsPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [slug])

  const fetchLeads = async () => {
    try {
      const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single()
      if (!org) return

      const { data } = await supabase
        .from('leads')
        .select(`
          *,
          employees (name)
        `)
        .eq('org_id', org.id)
        .order('captured_at', { ascending: false })
      
      setLeads(data || [])
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => 
    (lead.visitor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.visitor_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.visitor_company || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Captured By', 'Date']
    const rows = filteredLeads.map(l => [
      l.visitor_name,
      l.visitor_email,
      l.visitor_phone,
      l.visitor_company,
      l.employees?.name || 'N/A',
      new Date(l.captured_at).toLocaleDateString()
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      headers.join(",") + "\n" + 
      rows.map(e => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `leads_${slug}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 uppercase">Captured Leads</h1>
          <p className="text-secondary font-medium">Manage leads captured by your team.</p>
        </div>
        <button onClick={handleExport} className="bg-white border-2 border-black/5 px-6 py-4 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-sm">
          <Download className="w-5 h-5 text-primary" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-black/[0.03] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#f5f5f7] rounded-xl py-2.5 pl-10 pr-6 text-sm font-bold outline-none focus:bg-white transition-all"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#fbfbfd]">
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Lead Name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Contact</th>
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Company</th>
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Captured By</th>
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Date</th>
                        <th className="px-8 py-5 text-[10px] font-black text-secondary/40 uppercase tracking-widest">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {loading ? (
                        <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/20" /></td></tr>
                    ) : filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-black/5 transition-colors cursor-default group">
                            <td className="px-8 py-6 font-bold text-foreground">{lead.visitor_name}</td>
                            <td className="px-8 py-6">
                                <div className="space-y-1 text-xs font-medium text-secondary">
                                    <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-40" /> {lead.visitor_email}</div>
                                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 opacity-40" /> {lead.visitor_phone}</div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-tight">
                                    <Building2 className="w-3.5 h-3.5 opacity-40" /> {lead.visitor_company || 'Personal'}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-xs font-black text-[#0071e3] uppercase tracking-widest">{lead.employees?.name}</td>
                            <td className="px-8 py-6 text-xs font-medium text-secondary/60">{new Date(lead.captured_at).toLocaleDateString()}</td>
                            <td className="px-8 py-6">
                                <button className="p-2 text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}
