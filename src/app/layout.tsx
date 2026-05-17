import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Outfit, DM_Sans, Sora } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CookieConsent } from '@/components/CookieConsent'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { cn } from "@/lib/utils";

const fontInter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fontJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const fontOutfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const fontDMSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans' });
const fontSora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'frixn | Smart Digital Identity',
  description: 'Tap. Connect. Share Instantly. frixn turns your NFC card into a powerful digital identity.',
  icons: {
    icon: '/brandlogo.png',
    apple: '/brandlogo.png',
    shortcut: '/brandlogo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-font="outfit" className={cn("font-sans scroll-smooth", fontInter.variable, fontJakarta.variable, fontOutfit.variable, fontDMSans.variable, fontSora.variable)}>
      <head>
        <script
          id="theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let chart = localStorage.getItem('app-chart-theme');
                if (!chart) { chart = 'signal'; localStorage.setItem('app-chart-theme', 'signal'); }
                document.documentElement.dataset.chart = chart;
                
                let font = localStorage.getItem('app-font');
                if (font === 'Inter') document.documentElement.dataset.font = 'inter';
                else if (font === 'Jakarta') document.documentElement.dataset.font = 'jakarta';
                else if (font === 'Outfit') document.documentElement.dataset.font = 'outfit';
                else if (font === 'DM Sans') document.documentElement.dataset.font = 'dmsans';
                else if (font === 'Sora') document.documentElement.dataset.font = 'sora';
                
                let accent = localStorage.getItem('app-accent');
                if (!accent) { accent = '#FF3D00'; localStorage.setItem('app-accent', '#FF3D00'); }
                document.documentElement.style.setProperty('--primary', accent);
                document.documentElement.style.setProperty('--ring', accent);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen antialiased bg-background text-foreground transition-colors duration-300">
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
