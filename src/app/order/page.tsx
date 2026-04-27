import OrderApp from "@/components/order/OrderApp";
import {
  getCompanyByTableId,
  getMenuByTableId,
  getMenuCategoryByTableId,
} from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import { ORDERSTATUS, Prisma } from "@prisma/client";

interface Props {
  searchParams: { tableId: string };
}

export type MenuCategoryType = Prisma.MenuCategoriesGetPayload<{
  include: { menuCategoriesMenus: true };
}>;

export type MenuWithAddons = Prisma.MenusGetPayload<{
  include: { menuAddonCategories: true };
}>;

export type CartOrderWithMenu = Prisma.OrdersGetPayload<{
  include: { menu: true; OrdersAddons: { include: { addon: true } } };
}>;

export default async function Order({ searchParams }: Props) {
  const { tableId } = searchParams;
  const Company = await getCompanyByTableId(tableId);
  const MenuCategories = await getMenuCategoryByTableId(tableId);
  const menuCategoriesIds = MenuCategories.map((item) => item.id);
  const Menu = await getMenuByTableId(menuCategoriesIds);

  const cartOrders = await prisma.orders.findMany({
    where: { tableId: Number(tableId), status: ORDERSTATUS.CART },
    include: { menu: true, OrdersAddons: { include: { addon: true } } },
  });

  if (!Company) return null;

  return (
    <OrderApp
      cartOrders={cartOrders}
      menuCategories={MenuCategories}
      company={Company}
      menu={Menu}
      tableId={tableId}
    />
  );
}
