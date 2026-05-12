"use client"
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, MapPin, Activity, GitCommit, CheckCircle2, Search, Filter, Clock, Smartphone, Share2 } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 relative z-10 bg-background border-t border-border/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="text-[13px] font-bold tracking-[0.2em] uppercase text-[#FF3D00] mb-4">
            Powerful features
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">Features your team will actually <span className="text-[#FF3D00]">use.</span></h2>
          <p className="text-muted-foreground font-medium max-w-2xl text-base md:text-lg">Not a CRM. Not a digital card. The missing layer between them.</p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

          {/* Feature 1: Admin Dashboard (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="w-full bg-muted/40 rounded-2xl p-4 lg:p-6 mb-8 flex flex-col border border-border/50 h-[240px] overflow-hidden relative shadow-inner">
              {/* Browser Top */}
              <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 h-6 w-1/3 bg-background border border-border/50 rounded-md flex items-center px-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 mr-2" />
                  <div className="h-1.5 w-1/2 bg-muted-foreground/20 rounded-full" />
                </div>
              </div>
              {/* Content area */}
              <div className="flex gap-4 h-full relative z-10">
                {/* Sidebar */}
                <div className="w-16 flex flex-col gap-3">
                  <div className="h-5 w-full bg-[#FF3D00]/10 rounded text-[9px] text-[#FF3D00] flex items-center px-1.5 font-bold border border-[#FF3D00]/20">ALL</div>
                  <div className="h-4 w-5/6 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-full bg-muted-foreground/10 rounded" />
                </div>
                {/* Main Table */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-24 bg-foreground/10 rounded" />
                    <div className="flex gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  {/* Table Rows */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center bg-background p-2.5 rounded-lg border border-border/50 shadow-sm transition-transform group-hover:translate-x-1" style={{ transitionDelay: `${i * 100}ms` }}>
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-[#FF3D00] text-xs font-bold bg-background">JD</div>
                      <div className="flex-1 h-1.5 bg-muted rounded-full" />
                      <div className="w-10 h-1.5 bg-muted rounded-full" />
                      <div className="w-12 h-5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-[9px] flex items-center justify-center font-bold">HOT</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Admin Dashboard</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[90%]">Every lead from every agent, in one place. Filter by event, city, date, rep. Find your top performer at last month's expo in three clicks. The dashboard your VP will open every morning.</p>
            </div>
          </motion.div>

          {/* Feature 2: Multi-agent capture (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="w-full bg-muted/40 rounded-2xl h-[240px] mb-8 border border-border/50 relative overflow-hidden flex flex-col items-center justify-center py-6 shadow-inner">
              <div className="relative w-full flex justify-center items-center">
                {/* Stacked Profiles */}
                <div className="w-24 h-32 bg-background border border-border rounded-xl shadow-md absolute -rotate-12 -translate-x-16 z-0 opacity-70 flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 bg-muted rounded-full mb-2" />
                  <div className="w-10 h-1.5 bg-muted rounded-full" />
                </div>
                <div className="w-28 h-40 bg-background border border-border rounded-xl shadow-xl relative z-10 flex flex-col items-center p-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center rounded-full mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="w-16 h-2 bg-foreground/20 rounded-full mb-2" />
                  <div className="w-12 h-1.5 bg-muted rounded-full mb-4" />
                  <div className="w-full h-8 bg-[#FF3D00] text-white rounded border border-[#FF3D00]/20 text-[8px] font-bold flex items-center justify-center uppercase tracking-widest">
                    Shared
                  </div>
                </div>
                <div className="w-24 h-32 bg-background border border-border rounded-xl shadow-md absolute rotate-12 translate-x-16 z-0 opacity-70 flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 bg-muted rounded-full mb-2" />
                  <div className="w-10 h-1.5 bg-muted rounded-full" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Multi-agent capture</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">Every rep gets their own card and login. Capture, contact, qualify, close, all in one interface. No shared sheets. No "whose lead is this?" fights. When a rep leaves, the pipeline stays.</p>
            </div>
          </motion.div>

          {/* Feature 3: Location & time config (Span 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="w-full bg-muted/40 rounded-2xl h-[220px] mb-8 flex flex-row items-center justify-center p-6 border border-border/50 gap-6 shadow-inner">
              <div className="flex-1 h-full bg-background rounded-xl border border-border shadow-sm relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center relative shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute" />
                  <MapPin className="w-6 h-6 text-red-500 relative z-10" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-foreground font-bold text-[15px]">
                  <Clock className="w-4 h-4 text-[#FF3D00]" />
                  Peak: 3:00 PM
                </div>
                <div className="flex items-end gap-1.5 h-24 border-b border-border/50 pb-1 w-full relative">
                  {[30, 45, 60, 100, 80, 50, 20].map((h, i) => (
                    <motion.div key={i} className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-[#FF3D00]' : 'bg-muted-foreground/20'}`} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 0.7, delay: i * 0.1, type: "spring", bounce: 0.3 }} />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Location & time intelligence</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">Every tap logs where, when, and by whom. Over 90 days, patterns emerge. Your best capture point is the entry door, not the booth. Your peak hour is 3 PM. This is data no spreadsheet can tell you.</p>
            </div>
          </motion.div>

          {/* Feature 4: Pulse point tracking (Span 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="w-full bg-muted/40 rounded-2xl h-[220px] mb-8 flex flex-col items-center justify-center p-6 border border-border/50 shadow-inner relative overflow-hidden">
              <div className="w-full max-w-[320px] flex flex-col gap-3 relative z-10">
                {[
                  { status: "New", color: "bg-[#22C55E]" },
                  { status: "Contacted", color: "bg-yellow-400" },
                  { status: "Qualified", color: "bg-[#FF3D00]" }
                ].map((pill, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.15, duration: 0.5 }} className="flex items-center justify-between bg-background border border-border p-3 rounded-xl shadow-sm hover:border-[#FF3D00]/50 transition-colors">
                    <span className="text-[13px] font-bold text-foreground tracking-wide">{pill.status}</span>
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${pill.color}`} />
                  </motion.div>
                ))}

                {/* WhatsApp Nudge Popout */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                  className="absolute -right-4 top-14 bg-[#25D366] text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 group-hover:scale-110 transition-transform"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Nudge Sent
                </motion.div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Pulse point tracking</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">Every lead carries a status: new, contacted, qualified, warm, closed. Agents update in one tap. Dormant leads trigger WhatsApp nudges. Hot ones escalate. Closed deals auto-attribute revenue to the event.</p>
            </div>
          </motion.div>

          {/* Feature 5: Full activity lifecycle (Span 6) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-6 bg-card rounded-[2rem] p-8 lg:p-12 border border-border shadow-sm hover:shadow-lg transition-shadow flex flex-col md:flex-row items-center justify-between overflow-hidden relative gap-12 group"
          >
            <div className="flex-1 w-full bg-muted/40 rounded-[2rem] min-h-[220px] flex items-center justify-center border border-border/50 p-6 shadow-inner relative overflow-hidden">

              <div className="flex w-full items-center justify-between max-w-3xl relative z-10 px-4 md:px-12 py-8">
                {/* Connecting line */}
                <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-border -translate-y-1/2 z-0" />
                {/* Progress fill line */}
                <motion.div className="absolute left-[10%] opacity-50 top-1/2 h-1 bg-[#FF3D00] -translate-y-1/2 z-0 origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.2 }} />

                {[
                  { label: "Tap", icon: Smartphone },
                  { label: "Capture", icon: Users },
                  { label: "Contact", icon: Share2 },
                  { label: "Qualify", icon: Activity },
                  { label: "Close", icon: CheckCircle2 }
                ].map((node, i) => (
                  <motion.div key={i} className="flex flex-col items-center gap-4 relative z-10 group/node cursor-default" initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2, type: "spring", bounce: 0.6 }}>
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-background border-[3px] rounded-full flex items-center justify-center shadow-md transition-colors ${i === 4 ? 'border-[#FF3D00] text-[#FF3D00]' : 'border-border text-muted-foreground group-hover/node:border-foreground group-hover/node:text-foreground'}`}>
                      <node.icon className={`w-5 h-5 md:w-6 md:h-6 group-hover/node:scale-110 transition-transform ${i === 4 ? 'text-[#FF3D00]' : ''}`} />
                    </div>
                    <span className={`text-[10px] md:text-[12px] font-bold uppercase tracking-widest ${i === 4 ? 'text-[#FF3D00]' : 'text-muted-foreground'}`}>{node.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex-1 max-w-xl">
              <h3 className="text-3xl font-bold mb-4 text-foreground tracking-tight">Full activity lifecycle</h3>
              <p className="text-muted-foreground text-base md:text-[17px] leading-relaxed mb-6">Tap, capture, contact, qualify, close, all in one place. Agent activities, admin oversight, team leaderboards, event ROI, WhatsApp threads. One dashboard, multiple lenses.</p>
              <button className="text-[#FF3D00] font-bold flex items-center gap-2 hover:gap-3 transition-all text-[15px] uppercase tracking-wide">
                Experience it now <Search className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
