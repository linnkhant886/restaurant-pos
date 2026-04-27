import OrderCard from "@/components/order/OrderCard";
import { getSelectedLocationTables } from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import { ORDERSTATUS, Prisma } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: { status: ORDERSTATUS };
}

export type OrderWithMenusTableOrdersAddons = Prisma.OrdersGetPayload<{
  include: { menu: true; table: true; OrdersAddons: true };
}>;

export type AddonWithAddonCategory = Prisma.AddonsGetPayload<{
  include: { addonCategory: true };
}>;

export default async function OrderPage({ params }: Props) {
  const status = params.status.toUpperCase();

  const tables = await getSelectedLocationTables();
  const tableIds = tables.map((table) => table.id);
  const orders: OrderWithMenusTableOrdersAddons[] =
    await prisma.orders.findMany({
      where: {
        tableId: {
          in: tableIds,
        },
        status: status as keyof typeof ORDERSTATUS,
      },
      include: {
        menu: true,
        table: true,
        OrdersAddons: true,
      },
    });
    
  return (
    <div className="w-full">
      <div className="p-6 max-w-md mx-auto">
        <div className="flex flex-row gap-4 justify-end">
          <Link href={"/backoffice/orders/pending"}>
            <button
              className={cn(
                "px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm",
                status === ORDERSTATUS.PENDING 
                  ? "bg-amber-500 text-white hover:bg-amber-600" 
                  : "border border-amber-500 text-amber-500 hover:bg-amber-50"
              )}
            >
              PENDING
            </button>
          </Link>
          <Link href={"/backoffice/orders/cooking"}>
            <button
              className={cn(
                "px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm",
                status === ORDERSTATUS.COOKING 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : "border border-blue-500 text-blue-500 hover:bg-blue-50"
              )}
            >
              COOKING
            </button>
          </Link>
          <Link href={"/backoffice/orders/complete"}>
            <button
              className={cn(
                "px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm",
                status === ORDERSTATUS.COMPLETE 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "border border-green-500 text-green-500 hover:bg-green-50"
              )}
            >
              COMPLETE
            </button>
          </Link>
        </div>
        <p className="mt-4 text-center text-slate-700">
          Current Status: {status}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {orders.map(async (order) => {
          const addonIds = order.OrdersAddons.map((addon) => addon.addonId);
          const addons: AddonWithAddonCategory[] = await prisma.addons.findMany(
            {
              where: {
                id: {
                  in: addonIds,
                },
              },
              include: {
                addonCategory: true,
              },
            }
          );
          return <OrderCard key={order.id} order={order} addons={addons} />;
        })}
      </div>
    </div>
  );
}
