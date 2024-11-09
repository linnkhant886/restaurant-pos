"use server";

import { ORDERSTATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function StatusUpdate(orderId: number, status: ORDERSTATUS) {
  await prisma.orders.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
  revalidatePath("/order/active-orders");
}
