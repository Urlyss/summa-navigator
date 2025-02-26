import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_Khojki } from "next/font/google"
import "./globals.css"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "sonner"
import { Header } from "@/components/Header"

const font = Noto_Serif_Khojki({ subsets: ["latin"] })

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
      <body className={font.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="container mx-auto p-4 mb-32">
                {children}
            </main>
            <Footer/>
            <Toaster richColors  />
          </ThemeProvider>
      </body>
    </html>
  )
}

