import React from "react";
import {
  AddonWithAddonCategory,
  OrderWithMenusTableOrdersAddons,
} from "@/app/backoffice/orders/[status]/page";
import { ORDERSTATUS } from "@prisma/client";
import { OrderStatusUpdate } from "@/components/order/OrderStatusUpate";

export type OrderStatus = ORDERSTATUS;

interface Props {
  order: OrderWithMenusTableOrdersAddons;
  addons: AddonWithAddonCategory[];
}

export default async function Component({ order, addons }: Props) {
  const orderTimeStamp = order.updatedAt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {order.menu.name}
            </h3>
            <p className="text-sm text-slate-500">
              {order.table.name}
            </p>
          </div>
          <OrderStatusUpdate order={order} isAdmin />
        </div>

        {/* Addons Section */}
        <h4 className="text-base font-semibold text-slate-800 mb-3">
          Addons
        </h4>
        <div className="flex flex-col gap-2 mb-6 min-h-[160px]">
          {addons.map((addon, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-100"
            >
              <span className="text-sm font-medium text-slate-700">{addon.name}</span>
              <span className="text-sm text-slate-500">
                {addon.addonCategory.name}
              </span>
            </div>
          ))}
          {addons.length === 0 && (
            <span className="text-sm text-slate-400 italic py-2">No addons selected</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <span className="text-sm text-slate-500">
            Order Time
          </span>
          <span className="text-sm font-medium text-slate-700">{orderTimeStamp}</span>
        </div>
      </div>
    </div>
  );
}
