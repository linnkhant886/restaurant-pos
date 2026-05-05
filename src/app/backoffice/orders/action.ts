// @ts-nocheck
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

export async function generateBill(tableId: number) {
  const table = await prisma.tables.findUnique({
    where: { id: tableId },
    include: { location: { include: { company: true } } }
  });
  if (!table) return { error: "Table not found" };

  const orders = await prisma.orders.findMany({
    where: { tableId, status: "COMPLETE", isArchived: false },
    include: { menu: true, OrdersAddons: { include: { addon: true } } }
  });

  if (orders.length === 0) return { error: "No completed orders found for billing" };

  let subtotal = 0;
  for (const order of orders) {
    let itemPrice = order.price > 0 ? order.price : (order.menu?.price || 0);
    for (const oa of order.OrdersAddons) {
      itemPrice += oa.addon.price || 0;
    }
    subtotal += itemPrice * order.quantity;
  }

  const company = table.location?.company as any;
  const vatRate = company?.vatRate ?? 0.07;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const bill = await prisma.bills.create({
    data: {
      tableId,
      subtotal,
      vatRate,
      vatAmount,
      total,
    }
  });

  await prisma.tables.update({
    where: { id: tableId },
    data: { status: "BILL_REQUESTED" }
  });

  return { success: true, bill };
}

export async function markAsPaid(billId: number) {
  const bill = await prisma.bills.findUnique({ where: { id: billId } });
  if (!bill) return { error: "Bill not found" };

  await prisma.bills.update({
    where: { id: billId },
    data: { paidAt: new Date() }
  });

  await prisma.tables.update({
    where: { id: bill.tableId },
    data: { status: "AVAILABLE" }
  });

  await prisma.orders.updateMany({
    where: { tableId: bill.tableId, isArchived: false },
    data: { isArchived: true }
  });

  return { success: true };
}
