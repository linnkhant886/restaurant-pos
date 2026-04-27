"use client";

import Features from "@/components/landing/Feature";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Testimonial from "@/components/landing/Testimonial";

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

