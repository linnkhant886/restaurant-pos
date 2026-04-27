import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { confrimCartOrder, deleteOrder, getTotalPrice } from "./action";
import { ORDERSTATUS } from "@prisma/client";
import { ArrowLeft, Trash2, Edit, Plus, Minus } from "lucide-react";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface Props {
  searchParams: { tableId: string };
}

export default async function CartPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const cartOrders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: {
      menu: true,
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/order?tableId=${tableId}`} passHref>
          <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>

        <h1 className="text-xl font-bold text-slate-800">My Cart</h1>

        <button className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {cartOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
          <p className="text-lg text-slate-500 font-medium">
            No Order In Cart
          </p>
          <Link href={`/order?tableId=${tableId}`} passHref>
            <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-blue-700 transition">
              Add More Menu
            </button>
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cartOrders.map(async (cartOrder) => {
              const { id, menu, quantity } = cartOrder;
              const orderAddon = await prisma.ordersAddons.findMany({
                where: { orderId: id },
                include: { addon: true },
              });

              const addon = orderAddon.map((item) => item.addon);

              return (
                <React.Fragment key={cartOrder.id}>
                  <li className="flex flex-col sm:flex-row items-start py-4">
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

                    <div className="flex flex-col items-end mt-4 sm:mt-0 space-y-3 sm:ml-4">
                      <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-md shadow-sm p-1">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-600 transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-medium text-slate-800 w-6 text-center">
                          {quantity}
                        </span>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-600 transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/order/menu/${cartOrder.menuId}?tableId=${cartOrder.tableId}&orderId=${cartOrder.id}`}
                        >
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>

                        <form action={deleteOrder}>
                          <input type="hidden" name="id" defaultValue={cartOrder.id} />
                          <button
                            type="submit"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
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
              ${getTotalPrice(tableId)}
            </span>
          </div>

          <form
            action={confrimCartOrder}
            className="flex justify-center mt-6"
          >
            <input type="hidden" name="tableId" value={tableId} />
            <SubmitButton text="Confirm Orders" size="lg" />
          </form>
        </>
      )}
    </div>
  );
}

