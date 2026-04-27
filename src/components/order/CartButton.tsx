import { prisma } from "@/lib/prisma";
import { ShoppingCart } from "lucide-react";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";

interface Props {
  tableId: number;
}

export async function CartButton({ tableId }: Props) {
  const cartOrder = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
  });
  
  return (
    <Link href={`/order/cart?tableId=${tableId}`}>
      <div className="absolute top-2 right-2 md:top-4 md:right-12 flex items-center gap-1 bg-yellow-500/20 p-2 rounded-full hover:bg-yellow-500/40 transition">
        <ShoppingCart className="text-slate-900 h-8 w-8 md:h-10 md:w-10" />
        {cartOrder.length > 0 && (
          <span className="text-slate-900 font-bold text-xl md:text-2xl mr-1">
            {cartOrder.length}
          </span>
        )}
      </div>
    </Link>
  );
}
