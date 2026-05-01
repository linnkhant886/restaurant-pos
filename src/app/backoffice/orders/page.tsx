import { getSelectedLocationTables } from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import { ORDERSTATUS } from "@prisma/client";
import OrderManagement, { OrderItem } from "./OrderManagement";

export default async function OrdersPage() {
  const tables = await getSelectedLocationTables();
  const tableIds = tables.map((table) => table.id);

  const orders: OrderItem[] = await prisma.orders.findMany({
    where: {
      tableId: {
        in: tableIds,
      },
      status: {
        not: ORDERSTATUS.CART,
      },
      isArchived: false,
    },
    include: {
      menu: true,
      table: true,
      OrdersAddons: {
        include: {
          addon: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <OrderManagement initialOrders={orders} />;
}
