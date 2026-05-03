"use client";

import { useState } from "react";
import MenuCard from "@/components/menu/MenuCard";
import { MenuwithDisableLocation } from "@/app/backoffice/menus/page";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { EditMenuPanel } from "@/app/backoffice/menus/EditMenuPanel";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import Link from "next/link";

interface MenuWithRelations extends Menus {
  menuCategoriesMenus: { menuCategoryId: number }[];
  menuAddonCategories: { addonCategoryId: number }[];
  isAvailable: boolean;
}

interface Props {
  menus: MenuwithDisableLocation[];
  selectedLocation: number | undefined;
  menuCategories: MenuCategories[];
  addonCategories: AddonCategories[];
}

export default function MenuPagination({ 
  menus, 
  selectedLocation, 
  menuCategories, 
  addonCategories 
}: Props) {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingMenu, setEditingMenu] = useState<MenuWithRelations | null>(null);
  
  const totalPages = Math.ceil(menus.length / itemsPerPage);

  const paginatedMenus = menus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditClick = (menu: MenuwithDisableLocation) => {
    const isAvailable = !menu.DisabledLocationsMenus.find(
      (item) => item.menuId === menu.id && item.locationId === selectedLocation
    );
    
    setEditingMenu({
      ...menu,
      isAvailable,
      menuCategoriesMenus: (menu as any).menuCategoriesMenus || [],
      menuAddonCategories: (menu as any).menuAddonCategories || [],
    });
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-120px)] flex flex-col">
      <EditMenuPanel 
        menu={editingMenu} 
        onClose={() => setEditingMenu(null)}
        menuCategories={menuCategories}
        addonCategories={addonCategories}
      />
      
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
            Menus
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
            {menus.length} {menus.length === 1 ? "menu" : "menus"}
          </p>
        </div>

        <Link
          href="/backoffice/menus/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
        >
          <Plus className="h-4 w-4" />
          New menu
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow content-start">
        {paginatedMenus.map((menu) => {
          const isAvailable = !menu.DisabledLocationsMenus.find(
            (item) => item.menuId === menu.id && item.locationId === selectedLocation
          );
          return (
            <MenuCard 
              key={menu.id}
              menu={menu} 
              isAvailable={isAvailable} 
              onClick={() => handleEditClick(menu)}
            />
          );
        })}

        {/* Ghost "new menu" card */}
        <Link
          href="/backoffice/menus/new"
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-10 transition-all duration-200 hover:bg-black/[0.02]"
          style={{ borderColor: "var(--rf-line-2)", minHeight: 160 }}
        >
          <Plus className="h-5 w-5" style={{ color: "rgba(27,31,59,0.3)" }} />
          <span className="text-sm" style={{ color: "rgba(27,31,59,0.35)" }}>
            new menu
          </span>
        </Link>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 py-4 bg-white sticky bottom-0 border-t border-slate-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center p-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-medium text-sm transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border border-blue-600"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center p-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
