"use client"

import "client-only"

import { CreditCard, X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NfcCardsDataTable } from "@/components/nfc-cards-data-table"
import { useParams } from 'next/navigation'
import { supabase } from "@/lib/supabase"
import { TypewriterSummary } from "@/components/typewriter-summary"
import { useAISettings } from "@/hooks/use-ai-settings"
import { useRole } from "@/components/role-provider"
import { useRouter } from "next/navigation"

const AI_TEXT = "Currently analyzing your NFC fleet distribution and hardware metrics. We have detected a stable assignment rate across new employee on-boarding. The engagement metrics indicate outstanding physical card usage with negligible revocation trends."

export default function CardsPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [orgId, setOrgId] = useState<string | null>(null)
  const [locallyDismissed, setLocallyDismissed] = useState(false)
  const { settings: aiSettings } = useAISettings(orgId)
  const { role, orgId: sessionUserOrOrgId } = useRole()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [noCard, setNoCard] = useState(false)

  useEffect(() => {
    if (role === 'employee' && sessionUserOrOrgId) {
      setRedirecting(true)
      const fetchCard = async () => {
        const { data, error } = await supabase.from('nfc_cards').select('id').eq('employee_id', sessionUserOrOrgId).limit(1).maybeSingle()
        if (data) {
          router.replace(`/sites/${slug}/admin/cards/${data.id}`)
        } else {
          setNoCard(true)
          setRedirecting(false)
        }
      }
      fetchCard()
    }
  }, [role, sessionUserOrOrgId, slug, router])

  useEffect(() => {
    if (role === 'employee') return;
    const fetchOrg = async () => {
      const { data } = await supabase.from('organizations').select('id').eq('slug', slug).single()
      if (data) setOrgId(data.id)
    }
    fetchOrg()
  }, [slug, role])

  const showAiSummary = aiSettings?.nfc_cards_enabled && !locallyDismissed

  if (role === 'employee') {
    if (redirecting) return null;
    if (noCard) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in">
        <CreditCard className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold">No Card Assigned</h2>
        <p className="text-muted-foreground mt-2">You currently do not have any NFC card assigned to your profile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-primary" strokeWidth={1.5} />
        </div>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">NFC Cards</h1>
            <p className="text-sm text-muted-foreground">Provision, assign, and revoke physical hardware.</p>
        </div>
      </div>
      
      {showAiSummary && (
        <Alert className="relative bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-medium">AI Hardware Summary</AlertTitle>
          <AlertDescription className="mt-2 min-h-[60px]">
             <TypewriterSummary text={AI_TEXT} />
          </AlertDescription>
          <button 
            onClick={() => setLocallyDismissed(true)} 
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}

      <NfcCardsDataTable slug={slug} />
      
    </div>
  )
}

