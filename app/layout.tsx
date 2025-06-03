import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { headers } from "next/headers"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Alma Villa",
  description: "Alma Villa Barangay Portal",
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {!isDashboard && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
} 