"use server";

import { redirect } from "next/navigation";
import { Orders, ORDERSTATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    const orderAddons = await prisma.ordersAddons.findMany({
      where: { orderId },
    });
    if (orderAddons.length) {
      await prisma.ordersAddons.deleteMany({ where: { orderId } });
    }

    order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        quantity,
      },
    });
  } else {
    order = await prisma.orders.create({
      data: {
        menuId: menuId,
        quantity,
        tableId,
      },
    });
  }

  if (addonIds.length) {
    for (const addonId of addonIds) {
      await prisma.ordersAddons.create({
        data: {
          orderId: order.id,
          addonId,
        },
      });
    }
  }

  redirect(`/order/cart?tableId=${tableId}`);
}

export async function getTotalPrice(tableId: number) {
  const orders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: { menu: true, OrdersAddons: true },
  });
  let totalPrice = 0;

  for (const order of orders) {
    totalPrice += (order.menu.price ?? 0) * order.quantity;

    const orderAddons = order.OrdersAddons;
    for (const orderAddon of orderAddons) {
      const addonId = orderAddon.addonId;
      const addon = await prisma.addons.findFirst({
        where: { id: addonId },
      });
      if (addon) {
        totalPrice += (addon.price ?? 0) * order.quantity;
      }
    }
  }

  return totalPrice;
}

export async function getActiveOrderTotalPrice(tableId: number) {
  const orders = await prisma.orders.findMany({
    where: { tableId, status: { not: ORDERSTATUS.CART } },
    include: { menu: true, OrdersAddons: true },
  });
  let totalPrice = 0;

  for (const order of orders) {
    totalPrice += (order.menu.price ?? 0) * order.quantity;

    const orderAddons = order.OrdersAddons;
    for (const orderAddon of orderAddons) {
      const addonId = orderAddon.addonId;
      const addon = await prisma.addons.findFirst({
        where: { id: addonId },
      });
      if (addon) {
        totalPrice += (addon.price ?? 0) * order.quantity;
      }
    }
  }

  return totalPrice;
}

export async function clearCart(tableId: number) {
  await prisma.ordersAddons.deleteMany({ where: { orderId: tableId } });
  await prisma.orders.deleteMany({ where: { tableId } });
}

export async function deleteOrder(formdata: FormData) {
  const id = formdata.get("id");
  if (!id) {
    return;
  }
  const orderAddons = await prisma.ordersAddons.findMany({
    where: { orderId: Number(id) },
  });
  if (orderAddons.length) {
    await prisma.ordersAddons.deleteMany({
      where: { orderId: Number(id) },
    });
  }
  await prisma.orders.delete({ where: { id: Number(id) } });
  revalidatePath("/order/cart");
}

export async function confrimCartOrder(formdata: FormData) {
  const tableId = formdata.get("tableId");
  if (!tableId) {
    return;
  }
  await prisma.orders.updateMany({
    where: { tableId: Number(tableId), status: ORDERSTATUS.CART },
    data: { status: ORDERSTATUS.PENDING },
  });
  revalidatePath("/order/cart");
  revalidatePath("/backoffice/orders/pending");
  redirect(`/order/active-orders?tableId=${tableId}`);
}
