"use client"

import * as React from "react"
import { AIAssistantUI } from "./ai-assistant-ui"
import { supabase } from "@/lib/supabase"

interface AIAssistantContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  aiUsage: any
}

const AIAssistantContext = React.createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children, initialAiUsage, orgId }: { children: React.ReactNode, initialAiUsage: any, orgId: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [aiUsage, setAiUsage] = React.useState(initialAiUsage)

  const toggle = React.useCallback(() => setIsOpen((v) => !v), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  // â”€â”€ Realtime Subscription â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  React.useEffect(() => {
    if (!orgId) return

    const channel = supabase
      .channel(`ai-sync:${orgId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'frixn',
          table: 'ai_usage',
          filter: `org_id=eq.${orgId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setAiUsage(null)
          } else {
            setAiUsage(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId])

  // Update internal state if initialAiUsage changes (initial load/navigation)
  React.useEffect(() => {
    setAiUsage(initialAiUsage)
  }, [initialAiUsage])

  // â”€â”€ Keyboard Shortcut â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+I (Mac) or Ctrl+I (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        toggle()
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle, close, isOpen])

  return (
    <AIAssistantContext.Provider value={{ isOpen, toggle, open, close, aiUsage }}>
      {children}
      <AIAssistantUI isOpen={isOpen} onClose={close} aiUsage={aiUsage} />
    </AIAssistantContext.Provider>
  )
}

export function useAIAssistant() {
  const context = React.useContext(AIAssistantContext)
  if (context === undefined) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider")
  }
  return context
}

