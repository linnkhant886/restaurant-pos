"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";

interface Props {
  itemName: string;
  cartCount: number;
  onViewCart: () => void;
  onDismiss: () => void;
}

export default function CartToast({ itemName, cartCount, onViewCart, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [itemName, onDismiss]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl animate-slide-up"
      style={{
        backgroundColor: "var(--rf-ink)",
        minWidth: 300,
        maxWidth: "calc(100vw - 2rem)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--rf-yellow)" }}
      >
        <ShoppingBag className="h-4 w-4" style={{ color: "var(--rf-ink)" }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">Added: {itemName}</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
          {cartCount} {cartCount === 1 ? "item" : "items"} in cart
        </p>
      </div>

      <button
        onClick={onViewCart}
        className="text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-opacity hover:opacity-80"
        style={{ backgroundColor: "var(--rf-yellow)", color: "var(--rf-ink)" }}
      >
        View Cart
      </button>
    </div>
  );
}
