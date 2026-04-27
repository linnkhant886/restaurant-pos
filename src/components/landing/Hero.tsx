import Link from "next/link"
import Image from "next/image"

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden flex flex-col-reverse md:flex-row items-center justify-center p-6 md:p-10 min-h-[500px]"
    >
      <div 
        className="absolute inset-0 z-0 bg-[url('/bg.jpg')] bg-cover opacity-10" 
      />
      
      <div className="z-10 animate-fade-in-down max-w-xl md:mr-8 mt-12 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-8 text-shadow-sm">
          Revolutionize Your Restaurant Management
        </h1>
        <p className="text-base md:text-lg text-slate-800 mb-8 max-w-lg">
          Simplify operations, enhance customer experiences, and streamline your workflow with our all-in-one POS
          system. With powerful back-office control and an innovative mobile QR menu, managing your restaurant has
          never been easier. Elevate your service and efficiency today!
        </p>

        <div className="flex relative">
          <Link href={`/order?tableId=1`}>
            <button className="bg-slate-900 text-[#FFCA40] text-sm md:text-base font-medium px-6 py-3 rounded hover:bg-slate-800 hover:-translate-y-0.5 transition-all mr-4 shadow-md">
              Order App
            </button>
          </Link>
          <Link href={`/backoffice`}>
            <button className="bg-transparent text-slate-900 border-2 border-slate-900 text-sm md:text-base font-medium px-6 py-3 rounded hover:bg-black/5 hover:-translate-y-0.5 transition-all shadow-sm">
              Backoffice App
            </button>
          </Link>
        </div>
      </div>

      <div className="z-10 animate-fade-in-up w-[300px] h-[300px] md:w-[600px] md:h-[600px] relative">
        <Image 
          src="/heroVector.png" 
          alt="header-image" 
          fill
          className="object-contain" 
        />
      </div>
    </section>
  )
}

export default Hero

