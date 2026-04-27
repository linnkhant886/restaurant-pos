"use client";

import { useState } from "react";
import { NewCategoryModal } from "./NewCategoryModal";
import { EditCategoryPanel } from "./EditCategoryPanel";
import { Layers, Pencil, Plus, GripVertical } from "lucide-react";

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

interface Category {
  id: number;
  name: string;
  menuCategoriesMenus: { id: number }[];
  DisabledLocationsMenuCategories: { menuCategoryId: number; locationId: number }[];
}

interface EditingCategory {
  id: number;
  name: string;
  isAvailable: boolean;
  colorBg: string;
  colorFg: string;
}

interface Props {
  categories: Category[];
  selectedLocationId: number | undefined;
}

export function MenuCategoriesClient({ categories, selectedLocationId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);

  function openEdit(cat: Category, i: number) {
    const color = ICON_COLORS[i % ICON_COLORS.length];
    const isAvailable = !cat.DisabledLocationsMenuCategories.find(
      (d) => d.menuCategoryId === cat.id && d.locationId === selectedLocationId
    );
    setEditingCategory({
      id: cat.id,
      name: cat.name,
      isAvailable,
      colorBg: color.bg,
      colorFg: color.fg,
    });
  }

  return (
    <>
      <NewCategoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditCategoryPanel
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />

      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
            Menu Categories
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
        >
          <Plus className="h-4 w-4" />
          New category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const color = ICON_COLORS[i % ICON_COLORS.length];
          const isAvailable = !cat.DisabledLocationsMenuCategories.find(
            (d) => d.menuCategoryId === cat.id && d.locationId === selectedLocationId
          );
          const itemCount = cat.menuCategoriesMenus.length;

          return (
            <div
              key={cat.id}
              className="group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: "var(--rf-paper)",
                borderColor: "var(--rf-line)",
                opacity: isAvailable ? 1 : 0.55,
              }}
            >
              {/* Drag handle */}
              <div
                className="absolute top-4 right-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                style={{ color: "rgba(27,31,59,0.25)" }}
              >
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: color.bg }}
              >
                <Layers className="h-5 w-5" style={{ color: color.fg }} />
              </div>

              {/* Title */}
              <p className="text-lg font-bold leading-tight" style={{ color: "var(--rf-ink)" }}>
                {cat.name}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--rf-cream-2)", color: "rgba(27,31,59,0.65)" }}
                  >
                    {itemCount} {itemCount === 1 ? "item" : "items"}
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

                {/* Edit button → opens panel */}
                <button
                  onClick={() => openEdit(cat, i)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-black/6"
                  style={{ color: "rgba(27,31,59,0.4)" }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Ghost "new category" card */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 transition-all duration-200 hover:bg-black/[0.02]"
          style={{ borderColor: "var(--rf-line-2)", minHeight: 160 }}
        >
          <Plus className="h-5 w-5" style={{ color: "rgba(27,31,59,0.3)" }} />
          <span className="text-sm" style={{ color: "rgba(27,31,59,0.35)" }}>
            new category
          </span>
        </button>
      </div>
    </>
  );
}
