"use client"

import * as React from "react"
import { HeaderProfile } from "@/components/HeaderProfile"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { RoleProvider } from "@/components/role-provider"
import { AIAssistantProvider } from "@/components/ai-assistant-provider"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  // Mock contexts for SuperAdmin
  const mockSession = { role: 'superadmin', orgId: 'superadmin', orgSlug: 'superadmin' }
  const mockAiUsage = {}

  return (
    <RoleProvider session={mockSession as any}>
      <AIAssistantProvider initialAiUsage={mockAiUsage} orgId="superadmin">
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
}
