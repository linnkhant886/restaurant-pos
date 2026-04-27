"use client";

import { Menus, AddonCategories, Addons } from "@prisma/client";
import Addon from "@/components/menu/Addon";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

interface Props {
  menu: Menus;
  addOns: Addons[];
  addOnCategories: AddonCategories[];
  selected: Addons[];
  setSelected: Dispatch<SetStateAction<Addons[]>>;
}

export function AddonCategoryAndAddon({
  menu,
  addOns,
  addOnCategories,
  selected,
  setSelected,
}: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden mb-6 shadow-sm">
        <Image
          src={(menu?.imageUrl as string) || "/placeholder.svg?height=350&width=600"}
          alt={menu?.name || "Menu item"}
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-slate-900">
            {menu?.name}
          </h1>
          <span className="text-xl font-bold text-[#1976D2]">
            ${menu?.price}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {addOnCategories.map((item) => {
          const addOnsInCategory = addOns.filter(
            (addOn) => addOn.addonCategoryId === item.id
          );
          return (
            <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  {item.name}
                </h2>
                <span 
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    item.isRequired 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.isRequired ? "Required" : "Optional"}
                </span>
              </div>

              <Addon
                addonCategory={item}
                addonCategoryAddons={addOnsInCategory}
                selectedAddons={selected}
                setSelectedAddons={setSelected}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
