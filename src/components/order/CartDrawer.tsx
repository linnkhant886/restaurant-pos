"use client";

import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { removeItemFromCart, clearCartItem, sendToKitchen } from "@/app/order/cart/action";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface CartItem {
  orderId: number;
  menuId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
  hasAddons: boolean;
  addons: { id: number; name: string; price: number }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  tableId: string;
  onSentToKitchen: () => void;
}

export default function CartDrawer({ open, onClose, items, tableId, onSentToKitchen }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sending, setSending] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const addonTotal = item.addons.reduce((a, b) => a + b.price, 0);
    return sum + (item.price + addonTotal) * item.qty;
  }, 0);

  const handleDecrement = (item: CartItem) => {
    startTransition(async () => {
      await removeItemFromCart(item.orderId);
      router.refresh();
    });
  };

  const handleRemove = (orderId: number) => {
    startTransition(async () => {
      await clearCartItem(orderId);
      router.refresh();
    });
  };

  const handleSendToKitchen = async () => {
    setSending(true);
    await sendToKitchen(Number(tableId));
    setSending(false);
    onClose();
    router.refresh();
    onSentToKitchen();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(27,31,59,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl shadow-2xl transition-transform duration-350 ease-in-out"
        style={{
          backgroundColor: "var(--rf-paper)",
          maxHeight: "85vh",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--rf-line-2)" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "var(--rf-line)" }}
        >
          <p className="text-base font-bold" style={{ color: "var(--rf-ink)" }}>
            Your Cart
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/6 transition-colors"
            style={{ color: "rgba(27,31,59,0.45)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm font-medium" style={{ color: "rgba(27,31,59,0.4)" }}>
                Your cart is empty
              </p>
            </div>
          ) : (
            items.map((item) => {
              const addonTotal = item.addons.reduce((a, b) => a + b.price, 0);
              return (
                <div
                  key={item.orderId}
                  className="flex items-start gap-3 pb-4 border-b last:border-0"
                  style={{ borderColor: "var(--rf-line)" }}
                >
                  {/* Image / Emoji */}
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--rf-cream-2)" }}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--rf-ink)" }}>
                      {item.name}
                    </p>
                    {item.addons.length > 0 && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(27,31,59,0.45)" }}>
                        {item.addons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <p className="text-sm font-bold mt-1" style={{ color: "var(--rf-ink)" }}>
                      ${((item.price + addonTotal) * item.qty).toFixed(2)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleDecrement(item)}
                        disabled={isPending}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all hover:bg-black/5 disabled:opacity-50"
                        style={{ borderColor: "var(--rf-line)" }}
                      >
                        <Minus className="h-3 w-3" style={{ color: "var(--rf-ink)" }} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center" style={{ color: "var(--rf-ink)" }}>
                        {item.qty}
                      </span>
                      {item.hasAddons ? (
                        <Link
                          href={`/order/menu/${item.menuId}?tableId=${tableId}&orderId=${item.orderId}`}
                          onClick={onClose}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all hover:bg-black/5"
                          style={{ borderColor: "var(--rf-line)" }}
                        >
                          <Plus className="h-3 w-3" style={{ color: "var(--rf-ink)" }} />
                        </Link>
                      ) : (
                        <button
                          onClick={async () => {
                            const { addItemToCart } = await import("@/app/order/cart/action");
                            startTransition(async () => {
                              await addItemToCart(item.menuId, Number(tableId));
                              router.refresh();
                            });
                          }}
                          disabled={isPending}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all hover:bg-black/5 disabled:opacity-50"
                          style={{ borderColor: "var(--rf-line)" }}
                        >
                          <Plus className="h-3 w-3" style={{ color: "var(--rf-ink)" }} />
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.orderId)}
                        disabled={isPending}
                        className="w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-red-50 ml-1 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 border-t"
            style={{ borderColor: "var(--rf-line)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium" style={{ color: "rgba(27,31,59,0.55)" }}>
                Subtotal
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--rf-ink)" }}>
                ${subtotal.toFixed(2)}
              </p>
            </div>

            <button
              onClick={handleSendToKitchen}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-base font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              {sending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
              ) : (
                "Send to Kitchen 🔥"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
