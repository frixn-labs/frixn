"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Users, CreditCard, LayoutDashboard, ChevronRight, Shield, LogOut, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/sites/superadmin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/sites/superadmin/organizations", label: "Organizations", icon: Building2 },
  { href: "/sites/superadmin/employees", label: "Employees", icon: Users },
  { href: "/sites/superadmin/nfc-cards", label: "NFC Cards", icon: CreditCard, disabled: true },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const activeLabel = navItems.find(n => isActive(n.href, n.exact))?.label ?? "Super Admin"

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex-shrink-0 flex flex-col bg-card">
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-[#FF3D00] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-foreground">Super Admin</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">frixn Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  active
                    ? "bg-[#FF3D00]/10 text-[#FF3D00]"
                    : item.disabled
                    ? "text-muted-foreground/40 cursor-not-allowed select-none"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.disabled && (
                  <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">Soon</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border space-y-2">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest hover:text-muted-foreground transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Landing
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Super Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{activeLabel}</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
