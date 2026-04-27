"use client";

import { useState } from "react";
import MenuCard from "@/components/menu/MenuCard";
import { MenuwithDisableLocation } from "@/app/backoffice/menus/page";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditMenuPanel } from "@/app/backoffice/menus/EditMenuPanel";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";

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
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Menus</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
          New menu
        </button>
      </div>

      <div className="flex flex-wrap flex-grow">
        {paginatedMenus.map((menu) => {
          const isAvailable = !menu.DisabledLocationsMenus.find(
            (item) => item.menuId === menu.id && item.locationId === selectedLocation
          );
          return (
            <div key={menu.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
              <MenuCard 
                menu={menu} 
                isAvailable={isAvailable} 
                onClick={() => handleEditClick(menu)}
              />
            </div>
          );
        })}
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
