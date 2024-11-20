import OrderCard from "@/components/OrderCard";
import { getSelectedLocationTables } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ORDERSTATUS, Prisma } from "@prisma/client";
import Link from "next/link";

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
    <>
      <div className="p-6 max-w-md mx-auto">
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Link href={"/backoffice/orders/pending"}>
            <Button
              variant={
                status === ORDERSTATUS.PENDING ? "contained" : "outlined"
              }
              color="primary"
            >
              PENDING
            </Button>
          </Link>
          <Link href={"/backoffice/orders/cooking"}>
            <Button
              variant={
                status === ORDERSTATUS.COOKING ? "contained" : "outlined"
              }
              color="secondary"
            >
              COOKING
            </Button>
          </Link>
          <Link href={"/backoffice/orders/complete"}>
            <Button
              variant={
                status === ORDERSTATUS.COMPLETE ? "contained" : "outlined"
              }
              color="success"
            >
              COMPLETE
            </Button>
          </Link>
        </Stack>
        <Typography variant="body1" className="mt-4 text-center">
          Current Status: {status}
        </Typography>
      </div>

      <Box sx={{ display: "grid ", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {orders.map(async (order) => {
          const addonIds = order.OrdersAddons.map((addon) => addon.addonId);
          const addons: AddonWithAddonCategory[] = await prisma.addons.findMany({
            where: {
              id: {
                in: addonIds,
              },
            },
            include: {
              addonCategory: true,
            }
          });
          return <OrderCard key={order.id} order={order} addons={addons} />;
        })}
      </Box>
    </>
  );
}
