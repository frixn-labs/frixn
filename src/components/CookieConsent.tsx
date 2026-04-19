"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from './ui/button'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already accepted or declined
    const consent = localStorage.getItem('tapconnect-cookie-consent')
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('tapconnect-cookie-consent', 'accepted')
    setShow(false)
  }

  const handleDecline = () => {
    localStorage.setItem('tapconnect-cookie-consent', 'declined')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none flex justify-center"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-6 pointer-events-auto max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 relative">
            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hidden sm:flex">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">We respect your privacy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and serve targeted advertisements. By clicking "Accept All", you consent to our use of cookies. Read our <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <Button variant="outline" onClick={handleDecline} className="w-full md:w-auto rounded-xl h-11 px-6">
                Decline All
              </Button>
              <Button onClick={handleAccept} className="w-full md:w-auto rounded-xl h-11 px-6 bg-primary text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
