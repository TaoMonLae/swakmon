import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { getLocale } from '@/lib/i18n-server'
import { LocaleProvider } from '@/components/LocaleProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

const pyidaungsu = localFont({
  src: './fonts/pyidaungsu.ttf',
  variable: '--font-pyidaungsu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Swak Mon သွက်မန် — Classifieds for Mon, Karen & Thanintharyi',
  description: 'Buy and sell in Mon State, Karen State, and Thanintharyi Region, Myanmar.',
  openGraph: {
    title: 'Swak Mon သွက်မန်',
    description: 'Classifieds marketplace for Mon State, Karen State & Thanintharyi Region.',
    locale: 'my_MM',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale()
  return (
    <html lang={locale} className={`${inter.variable} ${pyidaungsu.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.6.0/tabler-icons.min.css"
        />
      </head>
      <body className="font-body bg-canvas text-ink antialiased">
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
