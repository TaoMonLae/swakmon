import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })


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
  return (
    <html lang="my" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.6.0/tabler-icons.min.css"
        />
      </head>
      <body className="font-body bg-canvas text-ink antialiased">{children}</body>
    </html>
  )
}
