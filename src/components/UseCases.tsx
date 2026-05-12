"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const useCases = [
  {
    id: 'leadership',
    title: 'Leadership Dashboard',
    today: 'Monday 9 AM weekly review. You ask your 8 regional managers "how did last week go?" Delhi says "good, 40-50 leads captured." Mumbai says "strong week." Pune sends a WhatsApp voice note. You spent ₹4L on a tech expo in Hyderabad. You have no idea if it worked. You\'re running a 120-agent sales org across 8 cities on screenshots, stand-up calls, and gut feel. Tuesday you approve next month\'s event budget anyway.',
    tomorrow: 'One dashboard. 120 agents. 8 cities. Live. Monday 9 AM, before your first coffee, you see it: 847 leads captured last week, Mumbai top at 312, Priya in Pune capturing 3x her peers, the Bangalore expo returning 4x ROI while Hyderabad returned 0.8x. Your event budget decision isn\'t a guess anymore. It\'s a data point.',
    punchline: "Your best performer isn't the one who shouts loudest in Monday review. It's the one the dashboard quietly reveals."
  },
  {
    id: 'high_velocity_sales',
    title: 'High-Velocity Sales',
    today: "Your SaaS AE returns from a conference with 40% memory intact, logging half their leads. Meanwhile, your real estate agents capture 112 walk-ins on paper forms that get lost in glove compartments. High-value leads are slipping through the cracks because manual data entry doesn't scale.",
    tomorrow: "One tap captures it all. Walk-ins and conference connections land instantly in your CRM or dashboard, sorted by conversation temperature and tagged by agent. Follow-ups auto-fire within hours. No paper, no forgotten contexts, just seamless pipeline generation.",
    punchline: "Your top-performing rep isn't the one who sells hardest. It's the one who forgets the least."
  },
  {
    id: 'startup_vc',
    title: 'Startups & VC',
    today: "Founders at TiE lose the context of the angel they met. Investors at Demo Day recall only 2 of the 12 pitches they heard. By Monday, the crucial connection is buried in a pile of LinkedIn DMs and unreturned follow-ups.",
    tomorrow: "One tap captures the person, the context, and the ask. Founders turn handshakes into warm WhatsApp threads. Investors have their associates pulling decks for the right startups before the weekend even starts.",
    punchline: "The ecosystem moves fast. The one who remembers the context, closes the deal."
  },
  {
    id: 'events',
    title: 'Event Enablers',
    today: 'You ran a 2,000-attendee B2B event. Exhibitors paid ₹2–5 lakhs per booth. They got QR scanners, an attendee list, a feedback form. Six weeks later, one exhibitor calls to renew. "We got 12 leads. Signed 1 deal. Not coming back next year."',
    tomorrow: 'You bundle Frixn into every exhibitor package. Every tap lands in that exhibitor\'s dashboard, tagged with your event name. End of day, you hand each exhibitor a real ROI report: 47 leads, 12 active threads, 4 meetings booked. They renew. They double their booth size.',
    punchline: "You're selling booths. You could be selling revenue."
  },
  {
    id: 'finance',
    title: 'Finance & Wealth',
    today: "An insurance agent loses a ₹50L term plan because the competitor called first. A wealth manager forgets the exit size of a VC partner they met at a Worli gala. Between society events and private dinners, high-net-worth clients are slipping through the cracks.",
    tomorrow: "Every interaction is tapped, captured, and contextualized. Leads land in your dashboard before you reach home. Follow-ups fire automatically on Monday morning. Your outreach is sharp, personalized, and first.",
    punchline: "You don't lose HNI clients to better products. You lose them to whoever calls first."
  }
]

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(useCases[0].id)

  const activeData = useCases.find(tc => tc.id === activeTab) || useCases[0]

  return (
    <section id="use-cases" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
            Who this is built for
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">
            Click your world. See your day, <span className="text-[#FF3D00]">rewritten.</span>
          </h2>
          <p className="text-base md:text-lg font-medium text-muted-foreground mb-8">
            Whatever your team sells, Frixn captures what happens in the room
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8 pb-4">
          <div className="flex flex-wrap justify-center gap-2 bg-muted/40 p-2 rounded-3xl border border-border/50">
            {useCases.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 md:px-8 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 bg-[#FF3D00] rounded-full shadow-md z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="bg-muted/10 border border-border/50 rounded-3xl p-6 md:p-12 shadow-sm min-h-[480px] md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-12">
                
                {/* Today Column */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Today, without Frixn
                  </h4>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {activeData.today}
                  </p>
                </div>

                {/* Tomorrow Column */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold tracking-widest text-[#FF3D00] uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
                    Tomorrow, with Frixn
                  </h4>
                  <p className="text-[15px] text-foreground font-medium leading-relaxed">
                    {activeData.tomorrow}
                  </p>
                </div>

              </div>

              {/* Punchline Footer */}
              <div className="mt-auto pt-8 border-t border-border/50">
                <p className="text-base md:text-lg font-bold text-[#FF3D00] italic tracking-tight">
                  "{activeData.punchline}"
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
