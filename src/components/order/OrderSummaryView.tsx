"use client";

import { useEffect, useState } from "react";
import { fetchAllOrdersWithDetails, sendToKitchen } from "@/app/order/cart/action";
import { Clock, Utensils, CheckCircle, ChevronDown, Plus, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ActiveOrder = Awaited<ReturnType<typeof fetchAllOrdersWithDetails>>[0];

interface Props {
  open: boolean;
  tableId: string;
  onAddMore: () => void;
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Sent to Kitchen",
    icon: Clock,
    bg: "#FFF7ED",
    color: "#C2410C",
    dot: "#F97316",
  },
  COOKING: {
    label: "Cooking",
    icon: Utensils,
    bg: "#EFF6FF",
    color: "#1D4ED8",
    dot: "#3B82F6",
  },
  COMPLETE: {
    label: "Ready",
    icon: CheckCircle,
    bg: "#F0FDF4",
    color: "#15803D",
    dot: "#22C55E",
  },
  CART: {
    label: "New - In Cart",
    icon: Clock,
    bg: "#FFF7ED",
    color: "#F97316",
    dot: "#F97316",
  },
};

export default function OrderSummaryView({ open, tableId, onAddMore }: Props) {
  const router = useRouter();
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchAllOrdersWithDetails(Number(tableId)).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [open, tableId]);

  // Poll for status updates every 8s while open
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(async () => {
      const data = await fetchAllOrdersWithDetails(Number(tableId));
      setOrders(data);
    }, 8000);
    return () => clearInterval(interval);
  }, [open, tableId]);

  const grandTotal = orders.reduce((sum, o) => {
    const addonTotal = o.OrdersAddons.reduce((a, b) => a + (b.addon?.price ?? 0), 0);
    return sum + ((o.menu.price ?? 0) + addonTotal) * o.quantity;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col transition-transform duration-400 ease-in-out"
      style={{
        backgroundColor: "var(--rf-cream)",
        transform: open ? "translateY(0)" : "translateY(100%)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{
          backgroundColor: "var(--rf-yellow)",
          borderColor: "var(--rf-yellow-2)",
        }}
      >
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--rf-ink)" }}>
            Your Orders
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.6)" }}>
            Table {tableId} · {orders.length} {orders.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={onAddMore}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
        >
          <ChevronDown className="h-4 w-4" />
          Back to Menu
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--rf-ink)" }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm font-medium" style={{ color: "rgba(27,31,59,0.4)" }}>
              No active orders
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {orders.map((order) => {
              const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
              const StatusIcon = config.icon;
              const addonTotal = order.OrdersAddons.reduce((a, b) => a + (b.addon?.price ?? 0), 0);
              const lineTotal = ((order.menu.price ?? 0) + addonTotal) * order.quantity;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border p-4 flex items-start gap-3"
                  style={{
                    backgroundColor: "var(--rf-paper)",
                    borderColor: "var(--rf-line)",
                  }}
                >
                  {/* Food image */}
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--rf-cream-2)" }}
                  >
                    {order.menu.imageUrl ? (
                      <img
                        src={order.menu.imageUrl}
                        alt={order.menu.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold" style={{ color: "var(--rf-ink)" }}>
                        {order.menu.name}
                      </p>
                      <p className="text-sm font-bold flex-shrink-0" style={{ color: "var(--rf-ink)" }}>
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>

                    {order.OrdersAddons.length > 0 && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(27,31,59,0.45)" }}>
                        {order.OrdersAddons.map((a) => a.addon?.name).filter(Boolean).join(", ")}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: "rgba(27,31,59,0.45)" }}>
                        × {order.quantity}
                      </span>

                      {/* Status badge */}
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: config.dot }}
                        />
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-5 border-t"
        style={{
          backgroundColor: "var(--rf-paper)",
          borderColor: "var(--rf-line)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "rgba(27,31,59,0.55)" }}>
              Grand Total
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
              ${grandTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3">
            {orders.some(o => o.status === "CART") ? (
              <button
                onClick={async () => {
                  setLoading(true);
                  await sendToKitchen(Number(tableId));
                  const data = await fetchAllOrdersWithDetails(Number(tableId));
                  setOrders(data);
                  setLoading(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#F97316", color: "white" }}
              >
                Send to Kitchen 🔥
              </button>
            ) : (
              <button
                className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
              >
                <CreditCard className="h-4 w-4" />
                Pay Now
              </button>
            )}
            
            <button
              onClick={onAddMore}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border transition-all hover:bg-black/4"
              style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
            >
              <Plus className="h-4 w-4" />
              Add More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
