import { getMenu } from "../actions";
import { prisma } from "@/libs/prisma";
import {
  getCompanyAddon,
  getCompanyAddonCategories,
  getCompanyId,
} from "@/libs/action";
import UpdateMenuFormData from "./updateMenuFormData";
import { get } from "http";

export interface prop {
  params: { id: string };
}

export default async function SingleMenu({ params }: prop) {
  const { id } = params;

  const menu = await getMenu(Number(id));
  // console.log(menu)
  const selected = menu?.menuCategoriesMenus.map((item) => item.menuCategoryId);
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: await getCompanyId() },
  });

  const addonCategory = await getCompanyAddonCategories();
  const addOn = await getCompanyAddon();
  console.log(addonCategory);

  const selectedAddon = menu?.menuAddonCategories.map(
    (item) => item.addonCategoryId 
  ) as number[];
  console.log(selectedAddon);

  const isAvailable = menu?.DisabledLocationsMenus.find(
    (item) => item.menuId === Number(id)
  )
    ? false
    : true;

  return (
    <UpdateMenuFormData
      id={id}
      selectedAddon={selectedAddon}
      addOncategories={addonCategory}
      menuCategories={menuCategories}
      selected={selected}
      isAvailable={isAvailable}
      menu={menu}
    />
  );
}
