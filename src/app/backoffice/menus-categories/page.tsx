import { getCompanyMenuCategories, getSelectedLocation } from "@/lib/actions/action";
import { MenuCategoriesClient } from "./MenuCategoriesClient";

export default async function MenuCategoriesPage() {
  const [menuCategories, selectedLocation] = await Promise.all([
    getCompanyMenuCategories(),
    getSelectedLocation(),
  ]);

  return (
    <MenuCategoriesClient
      categories={menuCategories}
      selectedLocationId={selectedLocation?.locationId}
    />
  );
}
