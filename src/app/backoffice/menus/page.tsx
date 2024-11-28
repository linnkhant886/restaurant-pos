import MenuPagniation from "@/components/MenuPagniation";
import {
  getCompanyMenu,
  getSelectedLocation,
} from "@/libs/action";
import { Prisma } from "@prisma/client";

export type MenuwithDisableLocation = Prisma.MenusGetPayload<{
  include: { DisabledLocationsMenus: true };
}>;


export default async function MenusPage() {
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const menus : MenuwithDisableLocation[] = await getCompanyMenu();
  
  return (
    <>
      <MenuPagniation menus={menus} selectedLocation={selectedLocation} />
    </>
  );
}
