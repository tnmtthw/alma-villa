import ConditionalLayout from "@/components/ConditionalLayout"
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
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

const session = await auth();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </SessionProvider >
    </html >
  );
}