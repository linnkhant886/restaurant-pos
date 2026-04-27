import { BookOpen, QrCode, MapPin, CheckSquare, Headset, BarChart } from "lucide-react"

const features = [
  {
    icon: <BookOpen className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Easily manage your menus with Foodie POS",
    delay: "delay-[1000ms]",
  },
  {
    icon: <QrCode className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Scan and order. Quick and easy! Your customers will love it!",
    delay: "delay-[1300ms]",
  },
  {
    icon: <MapPin className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Foodie POS supports multiple locations for your business.",
    delay: "delay-[1500ms]",
  },
  {
    icon: <CheckSquare className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Backoffice and order apps are included in every subscription.",
    delay: "delay-[1700ms]",
  },
  {
    icon: <Headset className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Dedicated customer support so that we are always here to help you.",
    delay: "delay-[2000ms]",
  },
  {
    icon: <BarChart className="w-[90px] h-[90px] text-[#FFCA40]" />,
    text: "Detailed analytics for smarter decisions and optimized operations.",
    delay: "delay-[2200ms]",
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 bg-[#F5F5F5]">
      <div className="text-center mb-16 px-4">
        <span className="text-slate-900 font-medium text-xs md:text-sm tracking-[1.5px] uppercase block mb-2">
          OUR SERVICES
        </span>
        <h2 className="text-slate-900 font-bold text-3xl md:text-5xl drop-shadow-sm">
          We Offer Best Services
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-4 max-w-7xl mx-auto">
        {features.map((item, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-10 max-w-[330px] text-center w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_20px_rgba(0,0,0,0.1)] group ${item.delay}`}
          >
            <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </div>
            <h3 className="text-xl text-slate-900 font-medium leading-relaxed">
              {item.text}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features

