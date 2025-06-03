import React from "react"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Guide from "@/components/Guide"
import NewsSection from "@/components/NewsSection"

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Guide />
      <NewsSection />
    </main>
  )
} 