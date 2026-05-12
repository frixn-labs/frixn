"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Industries', href: '#use-cases' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Reach us', href: '#cta' },
  ]

  return (
    <footer className="bg-background pt-16 pb-8 relative overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">

        {/* Top Section: Branding & Links */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <img src="/brandlogo.png" alt="Frixn" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-foreground">frixn.</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The NFC-powered lead capture layer between your handshake and your CRM.
            </p>
            <a href="mailto:contactus@frixn.in" className="text-[12px] font-bold text-[#FF3D00] lowercase tracking-widest hover:underline">
              contactus@frixn.in
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-20 gap-y-10 pr-4 lg:pr-12">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[11px] font-black uppercase tracking-widest text-foreground hover:text-[#FF3D00] transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[11px] font-black uppercase tracking-widest text-foreground hover:text-[#FF3D00] transition-all"
                >
                  {link.name}
                </Link>
              ))}

            </div>
          </div>
        </div>

        {/* Middle Section: Massive Branding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full text-center py-4"
        >
          <h1 className="text-[13vw] font-black text-foreground/10 tracking-[-0.04em] leading-[0.8] select-none">
            frixn.
          </h1>
        </motion.div>

        {/* Bottom Metadata Bar */}
        <div className="pt-12 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/50">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            <span>© {currentYear} frixn inc.</span>
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">privacy policy</Link>
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">terms and condition</Link>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
            v1.0.4 - beta stable
          </div>
        </div>

      </div>
    </footer>
  )
}
