"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  UserPlus,
  Loader2
} from 'lucide-react'

export default function EmployeesPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    employee_code: '',
  })

  useEffect(() => {
    fetchEmployees()
  }, [slug])

  const fetchEmployees = async () => {
    try {
      const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single()
      if (!org) return
      setOrgId(org.id)

      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false })
      
      setEmployees(data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.from('employees').insert({
        org_id: orgId,
        ...newEmployee,
        is_active: true
      })
      if (error) throw error
      
      setShowAddModal(false)
      setNewEmployee({ name: '', email: '', phone: '', designation: '', employee_code: '' })
      fetchEmployees()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.employee_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 uppercase">Employees</h1>
          <p className="text-secondary font-medium">Manage your team's digital identities.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="apple-btn px-6 py-4 rounded-2xl flex items-center gap-2 group shadow-xl shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] p-4 border border-black/[0.03] shadow-sm flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input 
            type="text" 
            placeholder="Search by name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f5f5f7] rounded-xl py-3 pl-12 pr-6 outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {loading ? (
             <div className="col-span-2 h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
        ) : filteredEmployees.length === 0 ? (
            <div className="col-span-2 h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-black/5">
                <Users className="w-16 h-16 text-secondary/10 mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-2">No employees found</h3>
            </div>
        ) : (
            filteredEmployees.map((emp) => (
                <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2rem] p-6 border border-black/[0.03] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-6"
                >
                    <div className="absolute top-6 right-6">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            emp.is_active ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                            {emp.is_active ? 'Active' : 'Suspended'}
                        </span>
                    </div>

                    <div className="w-24 h-24 rounded-[1.5rem] bg-[#f5f5f7] flex flex-shrink-0 items-center justify-center border border-black/[0.02] overflow-hidden">
                        {emp.photo_url ? (
                            <img src={emp.photo_url} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-10 h-10 text-secondary/20" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="mb-4">
                            <h3 className="text-xl font-black text-foreground truncate tracking-tight">{emp.name}</h3>
                            <p className="text-primary font-bold text-xs uppercase tracking-widest leading-tight">{emp.designation}</p>
                            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1">CODE: {emp.employee_code || '---'}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                                <Mail className="w-4 h-4 text-primary/40" />
                                <span className="truncate">{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                                <Phone className="w-4 h-4 text-primary/40" />
                                <span>{emp.phone}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-secondary hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold uppercase">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button className="p-2 text-secondary hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))
        )}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl relative shadow-2xl border border-white">
                <h2 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tight">Onboard Employee</h2>
                <p className="text-secondary font-medium mb-8">Create a new digital identity for your team member.</p>
                
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-secondary/60">Full Name</label>
                            <input type="text" required value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full bg-[#f5f5f7] rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-secondary/60">Employee Code</label>
                            <input type="text" required value={newEmployee.employee_code} onChange={e => setNewEmployee({...newEmployee, employee_code: e.target.value})} className="w-full bg-[#f5f5f7] rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-secondary/60">Email Address</label>
                        <input type="email" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full bg-[#f5f5f7] rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-secondary/60">Phone</label>
                            <input type="tel" required value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} className="w-full bg-[#f5f5f7] rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-secondary/60">Designation</label>
                            <input type="text" required value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} className="w-full bg-[#f5f5f7] rounded-xl p-4 font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-black/5 font-bold py-4 rounded-2xl hover:bg-black/10 transition-all">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-[2] bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
