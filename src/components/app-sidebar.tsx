"use client"

import * as React from "react"
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Link as LinkIcon, 
  Magnet, 
  LayoutDashboard,
  Sparkles,
  Command,
  Package
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAIAssistant } from '@/components/ai-assistant-provider'
import { useRole } from '@/components/role-provider'
import { cn } from '@/lib/utils'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { Building2, Shield, Mail } from "lucide-react"

export function AppSidebar({ org, ...props }: React.ComponentProps<typeof Sidebar> & { org?: any }) {
  const pathname = usePathname()
  const params = useParams()
  const slug = params?.slug as string
  const { toggle } = useAIAssistant()
  const { role } = useRole()

  const isSuperAdmin = pathname.startsWith('/sites/superadmin')

  // Dynamic router resolving for module locations
  const menuItems = isSuperAdmin ? [
    { icon: LayoutDashboard, label: 'Overview', href: '/sites/superadmin', exact: true },
    { icon: Building2, label: 'Organizations', href: '/sites/superadmin/organizations' },
    { icon: Users, label: 'Employees', href: '/sites/superadmin/employees' },
    { icon: CreditCard, label: 'NFC Cards', href: '/sites/superadmin/nfc-cards', disabled: true },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', href: `/sites/${slug}/admin/dashboard` },
    { icon: Users, label: 'Employees', href: `/sites/${slug}/admin/employees` },
    { icon: CreditCard, label: 'NFC Cards', href: `/sites/${slug}/admin/cards` },
    { icon: LinkIcon, label: 'Manage Links', href: `/sites/${slug}/admin/links` },
    { icon: Package, label: 'Manage Products', href: `/sites/${slug}/admin/products` },
    { icon: Magnet, label: 'Leads', href: `/sites/${slug}/admin/leads` },
    ...(role === 'employee' ? [
      { icon: Mail, label: 'Email Auto-response', href: `/sites/${slug}/admin/settings?tab=email-template` }
    ] : []),
    { icon: BarChart3, label: 'Analytics', href: `/sites/${slug}/admin/analytics` },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-accent/50 transition-colors">
              <Link href={isSuperAdmin ? "/sites/superadmin" : `/sites/${slug}/admin/dashboard`}>
                <div className={cn(
                  "flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden border border-border/50",
                  isSuperAdmin ? "bg-[#FF3D00]" : ""
                )}>
                  {isSuperAdmin ? (
                    <Shield className="size-4 text-white" strokeWidth={2.5} />
                  ) : org?.logo_url ? (
                    <img 
                      src={org.logo_url} 
                      alt={org.name} 
                      className="size-full object-cover bg-background" 
                    />
                  ) : (
                    <Command className="size-4 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">{isSuperAdmin ? 'Super Admin' : (org?.name || 'Enterprise')}</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">
                    {isSuperAdmin ? 'frixn Platform' : (role === 'employee' ? 'Employee Workspace' : 'Admin Workspace')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {/* {!isSuperAdmin && (
              <SidebarMenuItem className="mb-1">
                <SidebarMenuButton 
                  tooltip="Ask Assistant"
                  onClick={toggle}
                  className="hover:bg-primary/5 hover:text-primary border border-border/40 shadow-sm"
                >
                  <Sparkles className="size-4 text-[#FF3D00] shrink-0" />
                  <span>Ask Assistant</span>
                  <kbd className="ml-auto hidden sm:inline-flex h-4 items-center gap-0.5 rounded border border-border/40 bg-muted px-1 font-mono text-[8px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                    <span>⌘</span>I
                  </kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )} */}

            {menuItems.map((item) => {
               const isActive = item.exact ? pathname === item.href : (pathname === item.href || pathname?.startsWith(item.href))
               return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} disabled={item.disabled}>
                      <Link href={item.disabled ? "#" : item.href} onClick={item.disabled ? (e) => e.preventDefault() : undefined}>
                        <item.icon />
                        <span>{item.label}</span>
                        {item.disabled && (
                          <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">Soon</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
               )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter />
    </Sidebar>
  )
}
