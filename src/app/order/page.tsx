import OrderApp from "@/components/OrderApp";
import {
  getCompanyByTableId,
  getMenuByTableId,
  getMenuCategoryByTableId,
} from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { Box } from "@mui/material";
import { ORDERSTATUS, Prisma } from "@prisma/client";

interface Props {
  searchParams: { tableId: string };
}

export type MenuCategoryType = Prisma.MenuCategoriesGetPayload<{
  include: { menuCategoriesMenus: true };
}>;

export default async function Order({ searchParams }: Props) {
  const { tableId } = searchParams;
  const Company = await getCompanyByTableId(tableId);
  const MenuCategories = await getMenuCategoryByTableId(tableId);
  const menuCategoriesIds = MenuCategories.map((item) => item.id);
  const Menu = await getMenuByTableId(menuCategoriesIds);

  const cartOrders = await prisma.orders.findMany({
    where: { tableId: Number(tableId), status: ORDERSTATUS.CART },
  });

  if (!Company) {
    return null;
  }
  return (
    <Box>
      <OrderApp
        cartOrders={cartOrders}
        menuCategories={MenuCategories}
        company={Company}
        menu={Menu}
        tableId={tableId}
      />
    </Box>
  );
}
