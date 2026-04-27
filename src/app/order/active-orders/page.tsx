import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getActiveOrderTotalPrice } from "../cart/action";
import { ORDERSTATUS } from "@prisma/client";
import { ArrowLeft, Plus } from "lucide-react";

import { OrderStatusUpdate } from "@/components/order/OrderStatusUpate";
import { OrderWithOrdersAddons } from "../menu/[id]/page";

interface Props {
  searchParams: { tableId: string };
}

export default async function CartPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);

  const cartOrders: OrderWithOrdersAddons[] = await prisma.orders.findMany({
    where: { tableId, status: { not: ORDERSTATUS.CART } },
    include: {
      menu: true,
      OrdersAddons: true,
    },
  });

  if (!cartOrders.length) {
    return null;
  }
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/order?tableId=${tableId}`} passHref>
          <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>

        <h1 className="text-xl font-bold text-slate-800">My Orders</h1>
        
        <Link href={`/order?tableId=${tableId}`}>
          <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Add More
            <span className="ml-1 p-0.5 border border-blue-600 rounded">
              <Plus className="w-3 h-3" />
            </span>
          </button>
        </Link>
      </div>

      <ul className="space-y-4">
        {cartOrders.map(async (cartOrder) => {
          const { id, menu, quantity, status } = cartOrder;
          const orderAddon = await prisma.ordersAddons.findMany({
            where: { orderId: id },
            include: { addon: true },
          });

          const addon = orderAddon.map((item) => item.addon);

          return (
            <React.Fragment key={cartOrder.id}>
              <li className="flex flex-col sm:flex-row items-start sm:items-center py-4">
                  <div className="flex-shrink-0 mb-3 sm:mb-0">
                    <img
                      alt={menu.name}
                      src={menu.imageUrl || "/placeholder.svg?height=80&width=80"}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  
                  <div className="ml-0 sm:ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">{menu.name}</h3>
                    
                    <div className="mt-1 flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        ${menu.price}
                      </span>

                      {addon.length > 0 && (
                        <div className="flex flex-col mt-2 space-y-1">
                          <span className="text-xs text-slate-500 font-medium">
                            Add-ons ::
                          </span>
                          {addon.map((item) => (
                            <span
                              key={item.id}
                              className="text-xs text-slate-600 ml-2"
                            >
                              - {item.name}: (${item.price})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end mt-4 sm:mt-0 space-y-4 sm:ml-4">
                    <div className="w-full sm:w-auto">
                      <OrderStatusUpdate order={cartOrder} />
                    </div>

                    <div className="flex items-center bg-white border border-slate-200 rounded shadow-sm">
                      <span className="px-5 py-1.5 text-lg font-medium text-slate-800 w-12 text-center select-none">
                        {quantity}
                      </span>
                    </div>
                  </div>
              </li>
              <hr className="border-slate-100" />
            </React.Fragment>
          );
        })}
      </ul>

      <div className="flex justify-between items-center mt-6 py-4 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">
          TotalPrice
        </h2>
        <span className="text-2xl font-bold text-slate-900">
          ${getActiveOrderTotalPrice(tableId)}
        </span>
      </div>
    </div>
  );
}

