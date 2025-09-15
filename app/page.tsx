import React from "react"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Guide from "@/components/Guide"
import NewsSection from "@/components/NewsSection"
import BarangayOfficials from "@/components/BarangayOfficials"
import ScrollToTop from "@/components/ScrollToTop"

export default function Home() {
  

  return (
    <main>
      <ScrollToTop />
      <Hero />
      <Services />
      <Guide />
      <BarangayOfficials />
      <NewsSection />
    </main>
  )
} 