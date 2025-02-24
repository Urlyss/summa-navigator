import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Summa Theologica Navigator",
  description: "Navigate through Thomas Aquinas' Summa Theologica",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Summa Theologica Navigator</h1>
          {children}
        </main>
      </body>
    </html>
  )
}

