"use client";

import { useState } from "react";
import ItemCard from "@/components/menu/ItemCard";
import { Egg, Plus } from "lucide-react";
import { Addons, AddonCategories } from "@prisma/client";
import { EditAddonPanel } from "./EditAddonPanel";
import { NewAddonModal } from "./NewAddonModal";

const ICON_COLORS = [
  { bg: "#EDE0C4", fg: "#8B6914" },
  { bg: "#F2C4C4", fg: "#9B2C2C" },
  { bg: "#C4D9F2", fg: "#1A56A0" },
  { bg: "#C4EDD6", fg: "#166534" },
  { bg: "#D9C4F2", fg: "#6B21A8" },
  { bg: "#F2E1C4", fg: "#92400E" },
  { bg: "#C4EEF2", fg: "#0E7490" },
  { bg: "#F2C4E1", fg: "#9D174D" },
];

interface Props {
  addons: Addons[];
  categories: AddonCategories[];
}

export function AddonsClient({ addons, categories }: Props) {
  const [selectedAddon, setSelectedAddon] = useState<Addons | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
            Addons
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
            {addons.length} {addons.length === 1 ? "addon" : "addons"}
          </p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
        >
          <Plus className="h-4 w-4" />
          New addon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {addons.map((addon, i) => {
          const color = ICON_COLORS[i % ICON_COLORS.length];
          return (
            <ItemCard
              key={addon.id}
              onClick={() => setSelectedAddon(addon)}
              icon={<Egg className="w-5 h-5" style={{ color: color.fg }} />}
              title={addon.name}
              isAvailable={addon.isAvailable ?? true}
              colorBg={color.bg}
              colorFg={color.fg}
              subtitle={`$${addon.price ?? 0}`}
            />
          );
        })}
        
        {/* Ghost "new addon" card */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 transition-all duration-200 hover:bg-black/[0.02]"
          style={{ borderColor: "var(--rf-line-2)", minHeight: 160 }}
        >
          <Plus className="h-5 w-5" style={{ color: "rgba(27,31,59,0.3)" }} />
          <span className="text-sm" style={{ color: "rgba(27,31,59,0.35)" }}>
            new addon
          </span>
        </button>
      </div>

      <EditAddonPanel
        addon={selectedAddon}
        onClose={() => setSelectedAddon(null)}
        categories={categories}
      />

      <NewAddonModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        categories={categories}
      />
    </>
  );
}
