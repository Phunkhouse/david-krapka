import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'David Krapka',
  description: 'Portfolio of David Krapka. Under construction.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
