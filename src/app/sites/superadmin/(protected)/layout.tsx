import * as React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { getSession } from "@/lib/auth"
import { HeaderProfile } from "@/components/HeaderProfile"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { RoleProvider } from "@/components/role-provider"
import { AIAssistantProvider } from "@/components/ai-assistant-provider"
import Link from "next/link"

// Helper function to instantiate a dedicated server-side client authenticated with the user's token.
// This ensures all database queries respect Row Level Security (RLS) policies by executing as the logged-in user.
function getAuthClient(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'frixn'
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  )
}

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await getSession('superadmin')

    // 1. Verify session exists and the role is explicitly 'superadmin' before querying database
    if (!session || session.role !== 'superadmin' || !session.accessToken) {
      console.error("Superadmin security error: Missing session or invalid role.")
      redirect('/sites/superadmin/login')
    }

    // 2. Instantiate client authenticated as the logged-in user
    const authClient = getAuthClient(session.accessToken)

    // 3. Verify Supabase authentication using the authenticated client
    const { data: { user }, error: authError } = await authClient.auth.getUser()

    if (authError || !user) {
      console.error("Superadmin authentication error: Supabase verification failed.", authError?.message)
      redirect('/sites/superadmin/login')
    }

    // 4. Query the database as the logged-in user (honoring RLS)
    const { data: superAdmin, error: saError } = await authClient
      .from('super_admins')
      .select('id, is_active')
      .eq('id', user.id)
      .single()

    if (saError || !superAdmin || !superAdmin.is_active) {
      console.error("Superadmin authorization error: User not found in super_admins or is inactive.", saError?.message)
      redirect('/sites/superadmin/login')
    }

    // Construct valid session payload for client-side providers
    const activeSession = {
      role: 'superadmin' as const,
      orgId: 'superadmin',
      orgSlug: 'superadmin'
    }

    return (
      <RoleProvider session={activeSession}>
        <AIAssistantProvider initialAiUsage={{}} orgId="superadmin">
          <div className="font-sans antialiased text-[0.95rem] flex h-screen overflow-hidden">
            <SidebarProvider>
              <TooltipProvider>
                <AppSidebar />
                <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4">
                    <div className="flex items-center gap-3">
                      <SidebarTrigger className="-ml-1" />
                      <div className="h-4 w-px bg-border/50 hidden md:block" />
                      <span className="font-semibold text-sm">Super Admin Portal</span>
                    </div>
                    <div className="flex items-center gap-4 align-middle">
                      <HeaderProfile />
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto bg-background">
                    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
                      {children}
                    </div>
                  </main>
                </SidebarInset>
              </TooltipProvider>
            </SidebarProvider>
          </div>
        </AIAssistantProvider>
      </RoleProvider>
    )

  } catch (error: any) {
    // Rethrow Next.js redirect and dynamic rendering bail-out errors
    if (
      error.digest?.startsWith('NEXT_REDIRECT') || 
      error.message === 'NEXT_REDIRECT' ||
      error.digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      throw error
    }

    console.error("Unhandled superadmin layout check error:", error)

    // generic user-facing message, preserving existing layout design
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-black text-rose-500">Security Check Failed</h2>
          <p className="text-muted-foreground text-sm font-medium">
            There was an error verifying your admin session. Please sign in again.
          </p>
          <div className="pt-2">
            <Link 
              href="/sites/superadmin/login" 
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold text-sm shadow-lg shadow-[#FF3D00]/20 transition-all hover:scale-[1.01]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
