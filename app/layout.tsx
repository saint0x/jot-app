import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jot.',
  description: 'Minimalist to-do list and notes app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
