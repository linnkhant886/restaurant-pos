import MenuPagination from "@/components/menu/MenuPagniation";
import {
  getCompanyAddonCategories,
  getCompanyMenu,
  getCompanyId,
  getSelectedLocation,
} from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type MenuwithDisableLocation = Prisma.MenusGetPayload<{
  include: { 
    DisabledLocationsMenus: true;
    menuCategoriesMenus: true;
    menuAddonCategories: true;
  };
}>;


export default async function MenusPage() {
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const menus: MenuwithDisableLocation[] = await getCompanyMenu();
  const companyId = await getCompanyId();
  
  const [menuCategories, addonCategories] = await Promise.all([
    prisma.menuCategories.findMany({ where: { companyId: companyId as number } }),
    getCompanyAddonCategories(),
  ]);
  
  return (
    <>
      <MenuPagination 
        menus={menus} 
        selectedLocation={selectedLocation} 
        menuCategories={menuCategories}
        addonCategories={addonCategories}
      />
    </>
  );
}

