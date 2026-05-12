"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Plus, Search, MessageSquare, Wand2, History, Palette, LayoutDashboard, Settings, Activity, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIAssistantUIProps {
  isOpen: boolean
  onClose: () => void
  aiUsage?: any
}

const ICON_MAP: Record<string, any> = {
  Wand2,
  MessageSquare,
  Plus,
  Search,
  History,
  Palette,
  LayoutDashboard,
  Settings,
  Activity,
  Bell
}

const DEFAULT_PROMPTS = [
  { icon: 'Wand2', prompt: "Generate Analytics Report" },
  { icon: 'MessageSquare', prompt: "Draft AI Response" },
  { icon: 'Plus', prompt: "Add Workspace Member" },
  { icon: 'Search', prompt: "Search Employee ID" },
  { icon: 'History', prompt: "Review Audit History" },
  { icon: 'Palette', prompt: "Customize Brand Settings" }
]

export function AIAssistantUI({ isOpen, onClose, aiUsage }: AIAssistantUIProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto-focus when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const prompts = (aiUsage?.prompts && Array.isArray(aiUsage.prompts) && aiUsage.prompts.length > 0)
    ? aiUsage.prompts
    : DEFAULT_PROMPTS

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-background/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              className="w-full max-w-2xl bg-card/60 backdrop-blur-3xl border border-border/50 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] pointer-events-auto overflow-hidden relative"
            >
              {/* Top Accent Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="p-6 space-y-6">
                {/* Search Header */}
                <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="How can I help you today?"
                      className="w-full bg-transparent text-xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground/40 hover:text-foreground transition-colors group"
                  >
                    <X className="w-5 h-5 group-hover:scale-95 duration-200" />
                  </button>
                </div>

                {/* Body Content (Dynamic Prompts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {prompts.map((p: any, i: number) => (
                      <QuickAction 
                        key={i}
                        icon={ICON_MAP[p.icon] || Sparkles} 
                        prompt={p.prompt} 
                      />
                   ))}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>AI Model Active: FRIXN-OMEGA-1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 rounded border border-border/50 bg-muted/30 text-[9px] font-mono text-muted-foreground uppercase">Esc</div>
                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">to close</span>
                  </div>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 opacity-50" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function QuickAction({ icon: Icon, prompt }: { icon: any, prompt: string }) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-2xl border border-border/20 bg-muted/5 hover:bg-primary/[0.03] hover:border-primary/20 transition-all text-left group">
      <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center shrink-0 group-hover:scale-95 transition-transform duration-300">
        <Icon className="w-5 h-5 text-muted-foreground/60 group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground leading-tight">{prompt}</p>
      </div>
    </button>
  )
}
