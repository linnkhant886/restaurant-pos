import OrderApp from "@/components/OrderApp";
import { getCompanyByTableId, getMenuByTableId, getMenuCategoryByTableId } from "@/libs/action";
import { Box } from "@mui/material";
import { Prisma } from "@prisma/client";

interface Props {
  searchParams: { tableId: string };
}

export type MenuCategoryType = Prisma.MenuCategoriesGetPayload<{
  include: { menuCategoriesMenus: true };
}>;

export default async function Order({ searchParams }: Props) {
  const { tableId } = searchParams;
  // console.log(tableId);
  const Company = await getCompanyByTableId(tableId);
  const MenuCategories = await getMenuCategoryByTableId(tableId);
  const menuCategoriesIds = MenuCategories.map((item) => item.id);
  const Menu = await getMenuByTableId(menuCategoriesIds);
  // console.log(MenuCategories[0]);
  // console.log(Company);
  // console.log(Menu);
  if (!Company) {
    return null;
  }
  return (
    <Box >
      <OrderApp menuCategories={MenuCategories} company={Company} menu={Menu} tableId={tableId} />
    </Box>
  );
}
