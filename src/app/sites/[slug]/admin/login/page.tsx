"use client"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Shield, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Find organization by slug
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id, admin_email, admin_pass, status')
        .eq('slug', slug)
        .single()

      if (orgError || !org) {
        throw new Error('Organization not found')
      }

      if (org.status !== 'active') {
        throw new Error('This account is currently inactive')
      }

      // 2. Validate credentials
      // Note: In production use hashed password comparison
      if (org.admin_email !== email || org.admin_pass !== password) {
        throw new Error('Invalid email or password')
      }

      // 3. Set session via API route (since we need to set HTTP-only cookies)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: org.id, orgSlug: slug })
      })

      if (res.ok) {
        router.push(`/admin/dashboard`)
      } else {
        throw new Error('Failed to establish session')
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6 bg-glow-mesh">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl border border-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase">Admin Portal</h1>
          <p className="text-secondary font-medium">Log in to manage <span className="text-primary font-bold">{slug}</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          <div>
            <label className="text-xs font-black text-secondary uppercase tracking-widest mb-2 block ml-1">Admin Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#f5f5f7] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-medium text-foreground"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-secondary uppercase tracking-widest mb-2 block ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#f5f5f7] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-6 outline-none transition-all font-medium text-foreground"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2"
            >
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-xs text-secondary/50 font-black uppercase tracking-[0.2em]">
          Secure frixn Link
        </div>
      </motion.div>
    </div>
  )
}
