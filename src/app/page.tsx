"use client";

import Features from "@/components/Feature";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Testimonial />
      <Footer />
    </main>
  );
}
