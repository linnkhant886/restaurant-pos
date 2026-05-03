import { prisma } from "@/lib/prisma";
import { AddonCategoriesClient } from "./AddonCategoriesClient";

export default async function AddonCategoriesPage() {
  const { getCompanyAddonCategories, getCompanyMenu } = await import("@/lib/actions/action");
  
  const baseCategories = await getCompanyAddonCategories();
  const addonCategoryIds = baseCategories.map(c => c.id);

  const addonCategories = await prisma.addonCategories.findMany({
    where: { id: { in: addonCategoryIds } },
    include: {
      menuAddonCategories: true,
    },
  });

  // We should also fetch all company menus so the user can link/unlink them
  const menus = await getCompanyMenu();

  return (
    <AddonCategoriesClient 
      addonCategories={addonCategories} 
      menus={menus} 
    />
  );
}

