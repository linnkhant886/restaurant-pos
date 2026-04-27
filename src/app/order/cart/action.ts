"use server";

import { redirect } from "next/navigation";
import { Orders, ORDERSTATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

interface CartItem {
  menuId: number;
  quantity: number;
  addonIds: number[];
  tableId: number;
  orderId?: number;
}

export async function createCartOrder(payload: CartItem) {
  const { menuId, quantity, addonIds, tableId, orderId } = payload;
  let order: Orders;
  if (orderId) {
    const orderAddons = await prisma.ordersAddons.findMany({ where: { orderId } });
    if (orderAddons.length) {
      await prisma.ordersAddons.deleteMany({ where: { orderId } });
    }
    order = await prisma.orders.update({ where: { id: orderId }, data: { quantity } });
  } else {
    order = await prisma.orders.create({ data: { menuId, quantity, tableId } });
  }

  if (addonIds.length) {
    for (const addonId of addonIds) {
      await prisma.ordersAddons.create({ data: { orderId: order.id, addonId } });
    }
  }

  revalidatePath("/order");
}

export async function addItemToCart(menuId: number, tableId: number) {
  const existing = await prisma.orders.findFirst({
    where: { menuId, tableId, status: ORDERSTATUS.CART },
  });
  if (existing) {
    await prisma.orders.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.orders.create({ data: { menuId, tableId, quantity: 1 } });
  }
  revalidatePath("/order");
}

export async function removeItemFromCart(orderId: number) {
  const order = await prisma.orders.findFirst({ where: { id: orderId } });
  if (!order) return;
  if (order.quantity > 1) {
    await prisma.orders.update({
      where: { id: orderId },
      data: { quantity: { decrement: 1 } },
    });
  } else {
    await prisma.ordersAddons.deleteMany({ where: { orderId } });
    await prisma.orders.delete({ where: { id: orderId } });
  }
  revalidatePath("/order");
}

export async function clearCartItem(orderId: number) {
  await prisma.ordersAddons.deleteMany({ where: { orderId } });
  await prisma.orders.delete({ where: { id: orderId } });
  revalidatePath("/order");
}

export async function getTotalPrice(tableId: number) {
  const orders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: { menu: true, OrdersAddons: true },
  });
  let total = 0;
  for (const order of orders) {
    total += (order.menu.price ?? 0) * order.quantity;
    for (const oa of order.OrdersAddons) {
      const addon = await prisma.addons.findFirst({ where: { id: oa.addonId } });
      if (addon) total += (addon.price ?? 0) * order.quantity;
    }
  }
  return total;
}

export async function getActiveOrderTotalPrice(tableId: number) {
  const orders = await prisma.orders.findMany({
    where: { tableId, status: { not: ORDERSTATUS.CART } },
    include: { menu: true, OrdersAddons: true },
  });
  let total = 0;
  for (const order of orders) {
    total += (order.menu.price ?? 0) * order.quantity;
    for (const oa of order.OrdersAddons) {
      const addon = await prisma.addons.findFirst({ where: { id: oa.addonId } });
      if (addon) total += (addon.price ?? 0) * order.quantity;
    }
  }
  return total;
}

export async function fetchActiveOrdersWithDetails(tableId: number) {
  return prisma.orders.findMany({
    where: { tableId, status: { not: ORDERSTATUS.CART } },
    include: { menu: true, OrdersAddons: { include: { addon: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getMenuAddons(menuId: number) {
  const menu = await prisma.menus.findFirst({
    where: { id: menuId },
    include: { menuAddonCategories: true },
  });
  const ids = menu?.menuAddonCategories.map((m) => m.addonCategoryId) ?? [];
  const [addonCategories, addons] = await Promise.all([
    prisma.addonCategories.findMany({ where: { id: { in: ids } } }),
    prisma.addons.findMany({ where: { addonCategoryId: { in: ids } } }),
  ]);
  return { addonCategories, addons };
}

export async function sendToKitchen(tableId: number) {
  await prisma.orders.updateMany({
    where: { tableId, status: ORDERSTATUS.CART },
    data: { status: ORDERSTATUS.PENDING },
  });
  revalidatePath("/order");
  revalidatePath("/backoffice/orders/pending");
}

export async function deleteOrder(formdata: FormData) {
  const id = formdata.get("id");
  if (!id) return;
  await prisma.ordersAddons.deleteMany({ where: { orderId: Number(id) } });
  await prisma.orders.delete({ where: { id: Number(id) } });
  revalidatePath("/order/cart");
}

export async function confrimCartOrder(formdata: FormData) {
  const tableId = formdata.get("tableId");
  if (!tableId) return;
  await prisma.orders.updateMany({
    where: { tableId: Number(tableId), status: ORDERSTATUS.CART },
    data: { status: ORDERSTATUS.PENDING },
  });
  revalidatePath("/order/cart");
  revalidatePath("/backoffice/orders/pending");
  redirect(`/order/active-orders?tableId=${tableId}`);
}
