import React from "react";
import { Menus } from "@prisma/client";
import Image from 'next/image';

interface Props {
  menu: Menus;
  isAvailable: boolean;
  onClick: () => void;
}

export default function MenuCard({ menu, isAvailable, onClick }: Props) {
  const { id, name, price } = menu;

  const image = menu.imageUrl
    ? menu.imageUrl
    : "https://images.squarespace-cdn.com/content/v1/5a81c36ea803bb1dd7807778/1610403788186-K2ATWJRYLHVC4ENCZZ7D/Shan+khaut+swe+%28Shan+sticky+noodles%29";
  
  return (
    <div
      onClick={onClick}
      className="block no-underline cursor-pointer"
    >
      <div className="w-full max-w-[300px] rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-100 bg-white overflow-hidden mr-4 mb-4">
        <div className="relative w-full h-[120px]">
          <Image
            src={image}
            alt="Menu Item"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{name}</h3>
            <span className="font-semibold text-yellow-600">${price}</span>
          </div>
          <div className="flex justify-between items-center">
            {isAvailable ? (
              <span className="text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Available
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-widest uppercase bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
