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
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfileClient({ employee, org, links }: { employee: any, org: any, links: any[] }) {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const [sendingLead, setSendingLead] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form State
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })

  useEffect(() => {
    setMounted(true)
    logTap()
  }, [])

  const logTap = async () => {
    try {
      await supabase.from('taps').insert({
        org_id: org.id,
        employee_id: employee.id,
        device: navigator.userAgent,
        os: navigator.platform,
        // Card ID if available, for now null
      })
    } catch (err) {
      console.error('Failed to log tap:', err)
    }
  }

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:${org.name}
TITLE:${employee.designation}
TEL;TYPE=CELL:${employee.phone}
EMAIL:${employee.email}
END:VCARD`
    
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${employee.name.replace(' ', '_')}.vcf`)
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
          employee_id: employee.id,
          visitor_name: form.name,
          visitor_email: form.email,
          visitor_phone: form.phone,
          visitor_company: form.company,
          status: 'new'
       })
       if (error) throw error
       setLeadSent(true)
       setTimeout(() => {
         setShowLeadForm(false)
         setLeadSent(false)
         setForm({ name: '', email: '', phone: '', company: '' })
       }, 2000)
    } catch (err) {
       alert('Failed to send details. Please try again.')
    } finally {
       setSendingLead(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="w-full max-w-md mx-auto relative h-full">
      <div className="fixed inset-0 bg-[#fbfbfd] -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-[#0071e3]/10 to-transparent -z-10" style={{ background: `linear-gradient(to bottom, ${org.brand_color}1a, transparent)` }} />

      <div className="mt-12 mb-10 flex flex-col items-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl p-1 mb-6 relative group"
        >
          <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-muted border border-black/[0.03]">
             <img src={employee.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} alt={employee.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center text-white border-[4px] border-[#fbfbfd] shadow-lg" style={{ backgroundColor: org.brand_color }}>
             <ShieldCheck className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-center"
        >
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">{employee.name}</h1>
          <p className="font-black text-xs uppercase tracking-[0.2em] mb-4" style={{ color: org.brand_color }}>{employee.designation}</p>
          <div className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-black/[0.03] shadow-sm">
             {org.logo_url ? <img src={org.logo_url} className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold" style={{ backgroundColor: org.brand_color }}>{org.name[0]}</div>}
             <span className="text-[10px] font-black text-secondary/60 uppercase tracking-widest">{org.name}</span>
          </div>
        </motion.div>
      </div>

      {/* Action Grid */}
      <div className="px-6 grid grid-cols-3 gap-3 mb-10">
         {[
           { icon: Phone, label: 'Call', href: `tel:${employee.phone}`, bg: 'bg-white text-foreground' },
           { icon: MessageCircle, label: 'Chat', href: `https://wa.me/${employee.phone}`, bg: '#25D366' },
           { icon: Mail, label: 'Email', href: `mailto:${employee.email}`, bg: 'white' },
         ].map((act, i) => (
           <motion.a 
            key={i}
            href={act.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-3xl shadow-sm border border-black/[0.02] active:scale-95 transition-all ${typeof act.bg === 'string' && act.bg.startsWith('#') ? 'text-white' : 'bg-white text-foreground'}`}
            style={{ backgroundColor: typeof act.bg === 'string' && act.bg.startsWith('#') ? act.bg : undefined }}
           >
              <act.icon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{act.label}</span>
           </motion.a>
         ))}
      </div>

      {/* Primary Actions */}
      <div className="px-6 flex flex-col gap-3 mb-10">
         <motion.button 
          onClick={handleSaveContact}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-foreground text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
         >
            <UserPlus className="w-5 h-5" /> Save Contact
         </motion.button>
         
         <div className="grid grid-cols-2 gap-3">
            <button 
             onClick={() => navigator.share && navigator.share({ url: window.location.href })}
             className="bg-white text-foreground font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-sm border border-black/[0.03] active:scale-[0.98] transition-all text-xs uppercase"
            >
                <Share2 className="w-4 h-4" /> Share
            </button>
            <button 
             onClick={() => setShowLeadForm(true)}
             className="text-white font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all text-xs uppercase"
             style={{ backgroundColor: org.brand_color }}
            >
                <Plus className="w-4 h-4" /> Connect
            </button>
         </div>
      </div>

      {/* Links */}
      <div className="px-6 space-y-3 mb-12">
        <div className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] mb-4 text-center">Connected Links</div>
        {links.filter(l => l.is_active).map((link, i) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-[1.5rem] p-5 border border-black/[0.03] shadow-sm flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f5f5f7] rounded-xl flex items-center justify-center group-hover:bg-[#0071e3]/5 transition-colors">
                <Globe className="w-5 h-5 text-secondary transition-colors" />
              </div>
              <span className="font-bold text-foreground">{link.label || link.platform}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-secondary/30" />
          </motion.a>
        ))}
      </div>

      {/* Leads Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLeadForm(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-x-0 bottom-0 bg-white rounded-t-[3rem] p-8 z-[110] max-h-[90vh]">
               <div className="w-12 h-1.5 bg-black/5 rounded-full mx-auto mb-8" />
               {leadSent ? (
                 <div className="py-12 flex flex-col items-center text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-black text-foreground mb-2">Details Sent!</h3>
                    <p className="text-secondary font-medium">I will get in touch with you shortly.</p>
                 </div>
               ) : (
                 <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <h3 className="text-2xl font-black mb-6 tracking-tight">Let's Connect</h3>
                    <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none font-bold" />
                    <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none font-bold" />
                    <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none font-bold" />
                    <input type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-[#f5f5f7] p-4 rounded-2xl outline-none font-bold" />
                    <button type="submit" disabled={sendingLead} className="w-full text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2" style={{ backgroundColor: org.brand_color }}>
                       {sendingLead ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Details'}
                    </button>
                 </form>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
