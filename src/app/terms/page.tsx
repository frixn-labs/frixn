import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary/30">
      <Header hideNavLinks />
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Terms and Conditions</h1>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground space-y-6 text-base leading-relaxed">
          <p className="font-medium text-foreground">Last updated: April 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using frixn, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this service, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">2. Description of Service</h2>
          <p>frixn provides users with access to a rich collection of resources for digital networking, including NFC card integration, analytics, and contact management. You also understand and agree that the service may include certain communications from frixn, such as service announcements and administrative messages.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">3. Registration Obligations</h2>
          <p>In consideration of your use of the Service, you agree to: (a) provide true, accurate, current and complete information about yourself as prompted by the Service's registration form, and (b) maintain and promptly update the Registration Data to keep it true, accurate, current and complete.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">4. User Account, Password, and Security</h2>
          <p>You will receive a password and account designation upon completing the Service's registration process. You are responsible for maintaining the confidentiality of the password and account, and are fully responsible for all activities that occur under your password or account.</p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">5. Modifications to Service</h2>
          <p>frixn reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that frixn shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>
        </div>
      </div>
    </div>
  )
}
