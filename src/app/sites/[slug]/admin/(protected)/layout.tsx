import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AppSidebar } from '@/components/app-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AdminBreadcrumb } from '@/components/admin-breadcrumb'
import { OrgStatusGate } from '@/components/org-status-gate'
import { AIAssistantProvider } from '@/components/ai-assistant-provider'
import { RoleProvider } from '@/components/role-provider'
import { cookies } from 'next/headers'
import { getSession, clearSession } from '@/lib/auth'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // ── Slug Sync Guard ────────────────────────────────────────────────────────
  const cookieStore = await cookies()
  const activeSlug = cookieStore.get('tapconnect_active_slug')?.value

  // Security Logic:
  // If no active slug is set, or it doesn't match the URL, trigger redirect. 
  // We don't clearSession here because cookies can't be modified in Layouts.
  if (!activeSlug || activeSlug !== slug) {
    return redirect('/login')
  }

  // Double check the specific session data
  const session = await getSession(slug)
  if (!session) {
    return redirect('/login')
  }

  // ── Data Fetching ──────────────────────────────────────────────────────────
  // Fetch Org Data
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!org) {
    return notFound()
  }

  // Fetch initial employee count for progress tracker
  const { count: employeeCount } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', org.id)

  // Fetch AI Usage & Prompts
  const { data: aiUsage } = await supabase
    .from('ai_usage')
    .select('*')
    .eq('org_id', org.id)
    .single()

  const isActive = org.status === 'active'

  return (
    <RoleProvider session={session}>
      <AIAssistantProvider initialAiUsage={aiUsage} orgId={org.id}>
        <div className="font-sans antialiased text-[0.95rem]">
        {/* Always mount OrgStatusGate so it can listen for realtime status changes (it hides itself when active) */}
        <OrgStatusGate initialOrg={org} initialEmployeeCount={employeeCount || 0} slug={slug} />
        
        {/* 
            If active, show the normal layout. 
            If NOT active, we keep the layout hidden but mounted for a smoother transition 
            when the status changes to active in realtime.
        */}
        <div className={!isActive ? "hidden" : "block"}>
          <SidebarProvider>
            <TooltipProvider>
              <AppSidebar org={org} />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border/50 hidden md:block" />
                    <AdminBreadcrumb />
                  </div>
                  <div className="flex items-center gap-1.5 align-middle">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative group">
                          <div className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </div>
                          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-semibold text-sm leading-none tracking-tight">Notifications</h4>
                          <p className="text-sm text-muted-foreground">You have no new notifications.</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <div className="h-5 w-px bg-border mx-1" />
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 bg-background text-foreground overflow-y-auto">
                  <div className="max-w-[1600px] mx-auto p-4 md:p-8">
                    {children}
                  </div>
                </main>
              </SidebarInset>
            </TooltipProvider>
          </SidebarProvider>
        </div>
      </div>
    </AIAssistantProvider>
    </RoleProvider>
  )
}
