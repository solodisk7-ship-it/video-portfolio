import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { siteConfig } from '@/content/site-config'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: `${siteConfig.publicName} — ${siteConfig.siteTitle}`,
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.publicName} — ${siteConfig.siteTitle}`,
    description: siteConfig.description,
    type: 'website',
    url: '/',
    siteName: siteConfig.publicName,
    locale: 'en_US',
    images: [
      {
        url: '/works/halcyon.webp',
        width: 1600,
        height: 900,
        alt: `${siteConfig.publicName} portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.publicName} — ${siteConfig.siteTitle}`,
    description: siteConfig.description,
    images: ['/works/halcyon.webp'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} bg-background`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
