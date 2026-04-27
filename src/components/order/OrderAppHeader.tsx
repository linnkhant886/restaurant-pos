import { Company, Orders } from "@prisma/client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface Props {
  company: Company;
  tableId: string;
  cartOrders: Orders[];
}

export default function OrderAppHeader({ company, cartOrders, tableId }: Props) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#FFCA40] text-slate-900 shadow-md">
      <div className="text-xl font-bold flex-1">
        {company.name}
      </div>
      <Link href={`/order/cart?tableId=${tableId}`}>
        <button className="relative flex items-center px-4 py-2 bg-slate-900 text-[#FFCA40] rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
          <ShoppingCart className="mr-2 h-5 w-5" />
          <span className="font-medium">Cart</span>
          
          {/* Quantity Badge */}
          {cartOrders.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-2 ring-[#FFCA40]">
              {cartOrders.length}
            </div>
          )}
        </button>
      </Link>
    </header>
  );
}
