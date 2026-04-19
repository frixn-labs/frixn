import React from 'react'
import Header from '@/components/Header'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary/30">
      <Header hideNavLinks />
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground space-y-6 text-base leading-relaxed">
          <p className="font-medium text-foreground">Last updated: April 2026</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, update your profile, use the frixn NFC features, request customer support, or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, organization name, and any other information you choose to provide.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">2. Use of Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, such as to administer your account, to process your payments, to respond to your inquiries, and to send you technical notices, updates, security alerts, and support and administrative messages.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">3. Sharing of Information</h2>
          <p>We may share your information as follows: With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</p>
          
          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">4. Security</h2>
          <p>frixn takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

          <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">5. Cookies</h2>
          <p>Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.</p>
        </div>
      </div>
    </div>
  )
}
