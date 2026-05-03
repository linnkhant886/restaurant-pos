import React from "react";
import { Menus } from "@prisma/client";
import Image from 'next/image';
import { Pencil, Utensils } from "lucide-react";

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
      className="group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      style={{
        backgroundColor: "var(--rf-paper)",
        borderColor: "var(--rf-line)",
        opacity: isAvailable ? 1 : 0.55,
      }}
    >
      {/* Image as Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative"
        style={{ backgroundColor: "var(--rf-cream-2)" }}
      >
        {menu.imageUrl ? (
          <Image src={menu.imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <Utensils className="h-5 w-5" style={{ color: "var(--rf-ink)" }} />
        )}
      </div>

      {/* Title */}
      <p className="text-lg font-bold leading-tight line-clamp-1" style={{ color: "var(--rf-ink)" }}>
        {name}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold"
            style={{ color: "var(--rf-ink)" }}
          >
            ${price}
          </span>
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isAvailable ? "#DCFCE7" : "#FEE2E2",
              color: isAvailable ? "#166534" : "#991B1B",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isAvailable ? "#22C55E" : "#EF4444" }}
            />
            {isAvailable ? "Live" : "Off"}
          </span>
        </div>

        {/* Edit button */}
        <button
          onClick={onClick}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-black/6"
          style={{ color: "rgba(27,31,59,0.4)" }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
