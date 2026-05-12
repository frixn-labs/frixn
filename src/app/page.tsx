import Header from '@/components/Header'
import Hero from '@/components/Hero'
import StatsStrip from '@/components/StatsStrip'
import ProblemStatement from '@/components/ProblemStatement'
import HowItWorks from '@/components/HowItWorks'
import ImpactStatement from '@/components/ImpactStatement'
import Features from '@/components/Features'
import UseCases from '@/components/UseCases'
import Pricing from '@/components/Pricing'
import MarketStats from '@/components/MarketStats'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Header />
      <Hero />
      <StatsStrip />
      <ProblemStatement />
      <HowItWorks />
      <ImpactStatement />
      <UseCases />
      <Features />
      <Pricing />
      <MarketStats />
      <CTA />
      <Footer />
    </main>
  )
}

