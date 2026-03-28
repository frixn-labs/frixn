"use client"
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Link as LinkIcon, 
  Magnet, 
  LogOut, 
  LayoutDashboard,
  Settings,
  ChevronLeft
} from 'lucide-react'

export default function Sidebar({ org }: { org: any }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const slug = params.slug as string

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: `/admin/dashboard` },
    { icon: Users, label: 'Employees', href: `/admin/employees` },
    { icon: CreditCard, label: 'NFC Cards', href: `/admin/cards` },
    { icon: LinkIcon, label: 'Manage Links', href: `/admin/links` },
    { icon: Magnet, label: 'Leads', href: `/admin/leads` },
    { icon: BarChart3, label: 'Analytics', href: `/admin/analytics` },
  ]

  return (
    <aside className="hidden lg:flex w-[280px] flex-col bg-white border-r border-black/[0.03] p-6 h-screen sticky top-0 overflow-y-auto z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <LinkIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground tracking-tighter uppercase leading-none">{org.name}</h2>
          <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em]">SaaS Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all relative group ${
                  isActive ? 'text-primary bg-primary/5 shadow-[0_4px_12px_rgba(0,113,227,0.05)]' : 'text-secondary hover:text-foreground hover:bg-black/5'
                }`}
              >
                {isActive && (
                  <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-secondary group-hover:text-foreground transition-colors'}`} />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="pt-8 border-t border-black/5 mt-auto space-y-2">
         <Link href={`/admin/settings`}>
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-secondary hover:text-foreground hover:bg-black/5 transition-all`}>
                <Settings className="w-5 h-5" />
                Settings
            </div>
         </Link>
         <button 
           onClick={() => {/* Call logout logic */}}
           className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
         >
            <LogOut className="w-5 h-5" />
            Sign Out
         </button>
      </div>

      <div className="mt-8 px-4 py-4 bg-[#fbfbfd] rounded-2xl border border-black/[0.02]">
        <div className="text-[10px] font-black text-secondary/30 uppercase tracking-widest mb-1">Status</div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">Live & Secure</span>
        </div>
      </div>
    </aside>
  )
}
