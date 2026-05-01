"use server";

import { prisma } from "@/lib/prisma";
import { ORDERSTATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, status: ORDERSTATUS) {
  await prisma.orders.update({
    where: { id: orderId },
    data: { status },
  });
  
  revalidatePath("/backoffice/orders");
}

export async function archiveOrder(orderId: number) {
  await prisma.orders.update({
    where: { id: orderId },
    data: { isArchived: true },
  });

  revalidatePath("/backoffice/orders");
}
