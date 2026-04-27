"use client"

import { useState } from "react"
import { Link } from "react-scroll"
import { Menu, X } from "lucide-react"

const navigationLinks = [
  { title: "Home", to: "hero" },
  { title: "Testimonial", to: "testimonials" },
  { title: "Feature", to: "features" },
  { title: "Contact", to: "contact" },
]

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFCA40] shadow-md border-b-2 border-[#FFB200]">
        <div className="flex items-center justify-between px-4 md:px-14 py-3 h-16">
          <div className="font-bold text-3xl font-[Pacifico] text-slate-900 cursor-pointer drop-shadow-sm">
            FoodiePOS
          </div>

          <div className="flex xl:hidden md:hidden">
            <button onClick={toggleDrawer} className="text-slate-900 p-2 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                activeClass="active"
                to={link.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-slate-900 text-lg font-medium cursor-pointer transition duration-300 hover:bg-black/5 hover:-translate-y-0.5 px-4 py-2 rounded-md"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 right-0 h-64 w-full bg-[#FFCA40] shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-slate-900 p-2 hover:bg-black/10 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col mt-16 px-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={toggleDrawer}
              className="py-3 px-4 text-slate-900 text-lg border-b border-black/10 cursor-pointer hover:bg-black/5"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Overlay for mobile drawer */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={toggleDrawer}
        />
      )}
    </>
  )
}

export default Header
