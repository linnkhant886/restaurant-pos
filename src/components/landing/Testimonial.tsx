"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Kelly Willium",
    location: "Khulna, Bangladesh",
    text: "Foodie POS transformed how we manage our restaurant. The seamless menu updates and mobile QR ordering system keep our customers engaged and satisfied. It's a game-changer for our business!",
    image: "/pic1.jpeg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "Excellent service and attention to detail. The team went above and beyond my expectations. Would highly recommend to anyone.",
    image: "/pic2.jpeg",
  },
  {
    id: 3,
    name: "Mike Chen",
    location: "Singapore",
    text: "The mobile QR menu feature in Foodie POS is a hit with our customers. It's user-friendly, fast, and boosts our service efficiency. Plus, the support team is always there when we need them!",
    image: "/pic3.jpeg",
  },
]

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="bg-[#FFCA40] py-16 md:py-24 my-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center relative">
          
          {/* Left side - Titles */}
          <div>
            <h3 className="text-slate-900 mb-4 font-medium text-xl">
              Testimonials
            </h3>
            <h2 className="text-slate-900 font-bold text-4xl md:text-6xl leading-[1.2] drop-shadow-sm">
              What People Say<br />About Us.
            </h2>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "bg-slate-900" : "bg-black/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right side - Testimonial Slider */}
          <div className="relative">
            <div className="relative bg-white h-[350px] overflow-hidden shadow-xl rounded-2xl py-12">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="absolute inset-0 w-full h-full flex flex-col justify-center p-8 transition-all duration-500 ease-in-out bg-white"
                  style={{
                    opacity: index === activeIndex ? 1 : 0,
                    transform: `translateY(${(index - activeIndex) * 20}px)`,
                    pointerEvents: index === activeIndex ? "auto" : "none"
                  }}
                >
                  <div className="relative mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full border-4 border-[#FFCA40] shadow-md object-cover relative z-10"
                    />
                  </div>
                  <p className="mb-6 text-slate-900 text-lg leading-relaxed max-w-[500px] italic">
                    "{testimonial.text}"
                  </p>
                  <h4 className="font-semibold mb-1 text-slate-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <span className="text-slate-500 text-sm">
                    {testimonial.location}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
              <button
                onClick={prevTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-slate-50 transition-colors text-slate-700 focus:outline-none"
                aria-label="Previous Testimonial"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="bg-white p-3 rounded-full shadow-md hover:bg-slate-50 transition-colors text-slate-700 focus:outline-none"
                aria-label="Next Testimonial"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

