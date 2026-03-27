import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Showcase from '@/components/Showcase'
import UseCases from '@/components/UseCases'
import TechStack from '@/components/TechStack'
import Pricing from '@/components/Pricing'
import Contact from '@/components/Contact'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <UseCases />
      <TechStack />
      <Pricing />
      <Contact />
      <CTA />
      <Footer />
    </main>
  )
}
