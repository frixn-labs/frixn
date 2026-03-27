"use client"
import { motion } from 'framer-motion'
import { Shield, Palette, User, FileText, Link as LinkIcon, Search, ThumbsUp, Layers, Smartphone, RefreshCw } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="py-24 relative z-10 bg-[#fbfbfd]">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">Powerful <span className="gradient-text">Features</span></h2>
          <p className="text-secondary max-w-2xl mx-auto text-lg">Everything you need to network effortlessly and leave a lasting impression.</p>
        </motion.div>
        
        {/* Bento Grid Layout matching reference mockup */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

          {/* Card 1: Instant NFC Sharing (Span 4) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="w-full bg-[#f7f7f9] rounded-2xl p-6 mb-8 flex items-center justify-center gap-4 sm:gap-6 border border-black/[0.02]">
              {[ 
                { icon: User, text: "Share Profile" }, 
                { icon: FileText, text: "Share PDF" }, 
                { icon: LinkIcon, text: "Social Links" } 
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-black/[0.02] flex flex-col items-center justify-center w-1/3 hover:scale-105 transition-transform cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-4 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-foreground mb-4 text-center">{item.text}</div>
                  <div className="text-[10px] font-bold text-secondary bg-gray-50 px-4 py-1.5 rounded-full uppercase tracking-wider">Tap Now</div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Instant NFC Sharing</h3>
              <p className="text-secondary text-sm leading-relaxed max-w-md">As an advanced user, you can work smarter with tools that instantly share your digital identity. Tap to connect securely and transfer data with natural accuracy—no apps required.</p>
            </div>
          </motion.div>

          {/* Card 2: Real-Time Updates (Span 2) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative"
          >
            <div className="w-full bg-[#f7f7f9] rounded-2xl h-[180px] mb-8 border border-black/[0.02] relative overflow-hidden flex items-center justify-center">

              {/* Syncing Nodes Mockup */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.05] flex items-center justify-center z-10">
                  <Smartphone className="w-5 h-5 text-secondary" />
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-primary/30" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-primary/60" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#0071e3] shadow-[0_8px_16px_rgba(0,113,227,0.25)] flex items-center justify-center z-10">
                  <RefreshCw className="w-5 h-5 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Real-Time Updates</h3>
              <p className="text-secondary text-sm leading-relaxed">Brainstorm ideas or change details on the fly. Your NFC card instantly syncs to the latest version, ideal for hands-free adjustments on the go.</p>
            </div>
          </motion.div>

          {/* Card 3: Enterprise RBAC (Span 2) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative"
           >
             <div className="w-full bg-[#f7f7f9] rounded-2xl h-[180px] mb-8 flex flex-col items-start justify-center p-6 border border-black/[0.02] gap-4">
                {/* Chat Bubble Mockup emulating AI Chat UI */}
                <div className="flex items-center gap-3 self-start max-w-[90%] relative">
                  <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-white shadow-md flex-shrink-0 z-10 relative">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm text-xs font-medium text-secondary">
                    Grant admin access to Marketing?
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end mt-2 max-w-[90%] relative">
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm text-xs font-medium text-foreground text-right border border-black/5">
                    Permission granted<br/>system wide.
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#e0e5ff] border-[3px] border-[#f7f7f9] absolute -right-3 -bottom-3 flex items-center justify-center text-[#0071e3]">
                    <Shield className="w-3 h-3" />
                  </div>
                </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Enterprise RBAC</h3>
               <p className="text-secondary text-sm leading-relaxed">Need to structure access for a team? Get fast, reliable, step-by-step role definitions mapped to organizational hierarchies.</p>
             </div>
           </motion.div>

          {/* Card 4: Analytics Dashboard (Span 2) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative"
           >
             <div className="w-full bg-[#f7f7f9] rounded-2xl h-[180px] mb-8 flex flex-col items-center justify-center p-6 border border-black/[0.02]">
                {/* Search / Analytics elements strictly matching AI Web Search UI */}
                <div className="w-full max-w-[220px] bg-white rounded-full h-12 shadow-sm flex items-center px-2 mb-6 border border-black/[0.03] gap-3">
                  <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center bg-white flex-shrink-0 shadow-sm">
                    <Search className="w-4 h-4 text-[#0071e3]" strokeWidth={2} />
                  </div>
                  <div className="h-2 w-28 bg-[#e0e5ff] rounded-full mx-auto mr-4" />
                </div>
                <div className="w-full flex flex-col gap-3 px-6">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} transition={{ duration: 1 }} className="h-2.5 bg-[#0071e3] rounded-full" />
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "50%" }} transition={{ duration: 1, delay: 0.2 }} className="h-2.5 bg-[#0071e3]/80 rounded-full" />
                </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Analytics Dashboard</h3>
               <p className="text-secondary text-sm leading-relaxed">If you're tracking daily taps or verifying conversions for a report, our analytics cleanly summarizes deep insights automatically.</p>
             </div>
           </motion.div>

          {/* Card 5: Custom Branding (Span 2) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.4 }}
             className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden relative"
           >
             <div className="w-full bg-[#f7f7f9] rounded-2xl h-[180px] mb-8 flex items-center justify-center border border-black/[0.02] relative">
                {/* Background Texture mock */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#0071e3 1px, transparent 1px)", backgroundSize: "12px 12px" }}></div>
                {/* Big Blue Icon Box strictly matching AI Image Editor UI */}
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 bg-[#0071e3] shadow-[0_15px_30px_rgba(0,113,227,0.3)] rounded-[1.2rem] flex items-center justify-center relative z-10"
                >
                  <Palette className="w-8 h-8 text-white" />
                </motion.div>
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">Custom Branding</h3>
               <p className="text-secondary text-sm leading-relaxed">Creating visuals for connections or corporate cards? You don't need to be a Photoshop wizard to improve your brand instantly.</p>
             </div>
           </motion.div>

           {/* Card 6: Web-Based Access (Span 6) */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5 }}
             className="md:col-span-6 bg-white rounded-[2rem] p-8 lg:p-12 border border-black/5 shadow-sm hover:shadow-lg transition-shadow flex flex-col md:flex-row items-center justify-between overflow-hidden relative gap-10"
           >
             <div className="flex-1 w-full bg-[#f7f7f9] rounded-[2rem] h-[240px] flex items-center justify-center border border-black/[0.02] p-6 lg:p-10 relative overflow-hidden">
                {/* Minimalist Browser Mockup */}
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="w-full max-w-lg bg-white rounded-2xl h-[200px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col overflow-hidden relative z-10"
                >
                  <div className="h-10 bg-[#f7f7f9] border-b border-black/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5" />
                    <div className="ml-6 h-6 w-64 bg-white rounded-md border border-black/5 flex items-center justify-center shadow-sm">
                      <div className="h-1.5 w-24 bg-black/10 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-4 relative">
                    <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 self-center mb-2 flex items-center justify-center border border-[#0071e3]/20">
                      <ThumbsUp className="w-6 h-6 text-[#0071e3]" />
                    </div>
                    <div className="h-2.5 w-48 bg-[#0071e3]/30 rounded-full self-center" />
                    <div className="h-2 w-32 bg-black/5 rounded-full self-center mb-4" />
                    <div className="flex gap-4 px-10">
                       <div className="flex-1 h-10 bg-black/5 rounded-xl border border-black/5" />
                       <div className="flex-1 h-10 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-xl" />
                    </div>
                  </div>
                </motion.div>
             </div>
             <div className="flex-1 max-w-xl">
               <h3 className="text-3xl font-bold mb-4 text-foreground tracking-tight">Web-Based Access</h3>
               <p className="text-secondary text-base leading-relaxed mb-6">Your connections don't need to download anything. Our platform operates entirely through the mobile web, rendering beautifully across all major smartphone browsers for zero-friction sharing.</p>
               <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                 Experience it now <Search className="w-4 h-4" />
               </button>
             </div>
           </motion.div>

        </div>
      </div>
    </section>
  )
}
