import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '字字通 — O-Level Chinese 每日复习',
  description: '每天一点点，错词变熟词。Singapore O-Level Chinese revision for Sec 4 Express.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen chinese-text">{children}</body>
    </html>
  )
}
