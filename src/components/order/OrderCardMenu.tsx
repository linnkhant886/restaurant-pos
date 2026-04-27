import React from "react";
import { Menus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface Props {
  items: Menus[];
  href: string;
}

const MenuCard: React.FC<Props> = ({ items, href }) => {
  return (
    <div className="w-full mx-auto p-4 bg-white">
      {items.map((item) => (
        <Link 
          key={item.id} 
          href={href} 
          className="block no-underline text-slate-900 group"
        >
          <div className="flex mb-4 bg-orange-50/50 rounded-lg overflow-hidden border border-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
            
            {/* Media Area */}
            <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] shrink-0">
              <Image 
                src={item.imageUrl ?? "/placeholder.svg?height=150&width=150"} 
                alt={item.name} 
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content Area */}
            <div className="flex flex-col justify-between flex-grow p-4">
              <div>
                <h3 className="text-lg font-semibold line-clamp-2">
                  {item.name}
                </h3>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-slate-800">
                  ${item.price?.toFixed(0)}
                </span>
                <button
                  className="bg-[#ffd700] text-black hover:bg-[#ffcc00] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors"
                >
                  Order Now
                </button>
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuCard;
