"use client";

import { ORDERSTATUS } from "@prisma/client";
import { OrderWithOrdersAddons } from "@/app/order/menu/[id]/page";
import { useRouter } from "next/navigation";
import { StatusUpdate } from "@/app/backoffice/orders/[status]/action";
import { useEffect } from "react";
import { Clock, Utensils, CheckCircle } from "lucide-react";

interface Props {
  order: OrderWithOrdersAddons;
  isAdmin?: boolean;
}

export type OrderStatus = ORDERSTATUS;

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-4 h-4 mr-1" />;
    case "COOKING":
      return <Utensils className="w-4 h-4 mr-1" />;
    case "COMPLETE":
      return <CheckCircle className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

export const getStatusColorClasses = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "text-[#ED6C02] bg-[#FFF3E0] border-[#FFB74D]"; 
    case "COOKING":
      return "text-[#0288D1] bg-[#E1F5FE] border-[#4FC3F7]"; 
    case "COMPLETE":
      return "text-[#2E7D32] bg-[#E8F5E9] border-[#81C784]"; 
    default:
      return "text-slate-800 bg-slate-100 border-slate-300"; 
  }
};

export function OrderStatusUpdate({ order, isAdmin }: Props) {
  const router = useRouter();
  
  useEffect(() => {
    if (order.status !== ORDERSTATUS.COMPLETE) {
      const invalidId = setInterval(() => {
        router.refresh();
      }, 5000);
      return () => clearInterval(invalidId);
    }
  }, [order, router]);

  const handleOrderStatusUpdate = async (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {
    await StatusUpdate(order.id, evt.target.value as ORDERSTATUS);
  };

  const statusClasses = getStatusColorClasses(order.status as OrderStatus);

  if (isAdmin) {
    return (
      <div className="relative inline-block">
        <select
          value={order.status}
          onChange={handleOrderStatusUpdate}
          className={`appearance-none font-medium text-xs sm:text-sm pl-8 pr-6 py-1.5 rounded-full border shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-slate-200 transition-colors ${statusClasses}`}
        >
          <option value={ORDERSTATUS.PENDING}>PENDING</option>
          <option value={ORDERSTATUS.COOKING}>COOKING</option>
          <option value={ORDERSTATUS.COMPLETE}>COMPLETE</option>
        </select>
        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
          {getStatusIcon(order.status as OrderStatus)}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 space-x-1 border rounded-full font-medium text-xs sm:text-sm ${statusClasses}`}>
      {getStatusIcon(order.status as OrderStatus)}
      <span>{order.status}</span>
    </div>
  );
}
