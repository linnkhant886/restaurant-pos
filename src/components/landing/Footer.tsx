"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Utensils } from "lucide-react"

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "Updates"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Help Center", "Guides", "API Docs"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  },
]

const socialIcons = [
  { icon: Facebook, url: "https://facebook.com" },
  { icon: Twitter, url: "https://twitter.com" },
  { icon: Instagram, url: "https://instagram.com" },
  { icon: Linkedin, url: "https://linkedin.com" },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 py-10 xl:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <Utensils className="h-6 w-6 text-slate-900 mr-2" />
              <h2 className="text-xl font-bold font-[Pacifico] text-slate-900">
                Foodie POS
              </h2>
            </div>
            <p className="text-slate-600 text-sm mb-6 max-w-sm">
              Revolutionizing restaurant management with our cutting-edge POS system. Streamline operations, boost
              efficiency, and enhance customer experiences.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-full text-slate-700 hover:text-white hover:bg-slate-900 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((column, index) => (
            <div className="col-span-1 sm:col-span-2 md:col-span-2" key={index}>
              <h3 className="font-bold text-slate-900 text-lg mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href="#"
                      className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center justify-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Foodie POS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
