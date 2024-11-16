import { prisma } from "@/libs/prisma";
import { MenuOption } from "@/components/MenuOption";
import { Prisma } from "@prisma/client";

interface Props {
  params: { id: string }; // For dynamic route parameter
  searchParams: { tableId: string; orderId: string }; // For query parameter
}

export type OrderWithOrdersAddons = Prisma.OrdersGetPayload<{
  include: { OrdersAddons: true ,menu: true};
}>;

export default async function MenuDetailPage({ params, searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const orderId = Number(searchParams.orderId);
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id) },
    include: {
      menuAddonCategories: true,
    },
  });
  const addOnCategoryIds = menu?.menuAddonCategories.map(
    (item) => item.addonCategoryId
  );
  const addOnCategories = await prisma.addonCategories.findMany({
    where: { id: { in: addOnCategoryIds } },
  });
  const addOns = await prisma.addons.findMany({
    where: { addonCategoryId: { in: addOnCategoryIds } },
  });

  let order: OrderWithOrdersAddons | null = null
  if(orderId) {
    order = await prisma.orders.findFirst({
      where: { id: orderId },
      include: { OrdersAddons: true ,menu: true},
    });
  }

  if (!menu) {
    return null;
  }

  return (
    <MenuOption
      tableId={tableId}
      menu={menu}
      addOns={addOns}
      addOnCategories={addOnCategories}
      order={order}
    />
  );
}
