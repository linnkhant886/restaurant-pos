"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { AddonCategories, Addons } from "@prisma/client";
import { getMenuAddons, createCartOrder } from "@/app/order/cart/action";
import { MenuWithAddons, CartOrderWithMenu } from "@/app/order/page";

interface Props {
  item: MenuWithAddons | null;
  existingOrder: CartOrderWithMenu | null;
  tableId: string;
  onClose: () => void;
  onAdded: (name: string) => void;
}

export default function MenuDetailModal({ item, existingOrder, tableId, onClose, onAdded }: Props) {
  const router = useRouter();
  const isOpen = !!item;

  const [addonCategories, setAddonCategories] = useState<AddonCategories[]>([]);
  const [addons, setAddons] = useState<Addons[]>([]);
  const [selected, setSelected] = useState<Addons[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch addons + pre-fill when item changes
  useEffect(() => {
    if (!item) return;
    setFetching(true);
    setSelected([]);
    setQty(1);

    getMenuAddons(item.id).then(({ addonCategories, addons }) => {
      setAddonCategories(addonCategories);
      setAddons(addons);
      setFetching(false);

      // Pre-fill existing order selections
      if (existingOrder) {
        setQty(existingOrder.quantity);
        const existingAddonIds = existingOrder.OrdersAddons.map((oa) => oa.addonId);
        setSelected(addons.filter((a) => existingAddonIds.includes(a.id)));
      }
    });
  }, [item?.id, existingOrder?.id]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const requiredCategories = addonCategories.filter((c) => c.isRequired);
  const isValid = requiredCategories.every((cat) =>
    selected.some((s) => s.addonCategoryId === cat.id)
  );

  const addonTotal = selected.reduce((s, a) => s + (a.price ?? 0), 0);
  const lineTotal = ((item?.price ?? 0) + addonTotal) * qty;

  const toggleAddon = (addon: Addons, isRequired: boolean) => {
    if (isRequired) {
      const others = selected.filter((s) => s.addonCategoryId !== addon.addonCategoryId);
      setSelected([...others, addon]);
    } else {
      const already = selected.find((s) => s.id === addon.id);
      setSelected(already
        ? selected.filter((s) => s.id !== addon.id)
        : [...selected, addon]
      );
    }
  };

  const handleSubmit = async () => {
    if (!item || !isValid) return;
    setLoading(true);
    await createCartOrder({
      menuId: item.id,
      tableId: Number(tableId),
      quantity: qty,
      addonIds: selected.map((a) => a.id),
      orderId: existingOrder?.id,
    });
    onAdded(item.name);
    onClose();
    router.refresh();
    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(27,31,59,0.5)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl shadow-2xl transition-transform duration-350 ease-in-out"
        style={{
          backgroundColor: "var(--rf-paper)",
          maxHeight: "92vh",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--rf-line-2)" }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/6 transition-colors z-10"
          style={{ color: "rgba(27,31,59,0.5)" }}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero image */}
          {item?.imageUrl ? (
            <div className="relative w-full h-48 mx-0">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
          ) : (
            <div
              className="w-full h-40 flex items-center justify-center text-6xl"
              style={{ backgroundColor: "var(--rf-cream-2)" }}
            >
              🍽️
            </div>
          )}

          <div className="px-5 pt-4 pb-2">
            {/* Title + price */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold leading-tight" style={{ color: "var(--rf-ink)" }}>
                {item?.name}
              </h2>
              <p className="text-xl font-bold flex-shrink-0" style={{ color: "var(--rf-ink)" }}>
                ${item?.price?.toFixed(2)}
              </p>
            </div>

            {/* Addons */}
            {fetching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--rf-ink)" }} />
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {addonCategories.map((cat) => {
                  const catAddons = addons.filter((a) => a.addonCategoryId === cat.id);
                  return (
                    <div key={cat.id}>
                      {/* Category header */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold" style={{ color: "var(--rf-ink)" }}>
                          {cat.name}
                        </p>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={
                            cat.isRequired
                              ? { backgroundColor: "#FEF3C7", color: "#92400E" }
                              : { backgroundColor: "var(--rf-cream-2)", color: "rgba(27,31,59,0.5)" }
                          }
                        >
                          {cat.isRequired ? "Required" : "Optional"}
                        </span>
                      </div>

                      {/* Addon options */}
                      <div className="space-y-2">
                        {catAddons.map((addon) => {
                          const isChecked = !!selected.find((s) => s.id === addon.id);
                          return (
                            <label
                              key={addon.id}
                              className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
                              style={{
                                backgroundColor: isChecked ? "#F0F7FF" : "var(--rf-cream)",
                                border: `1.5px solid ${isChecked ? "var(--rf-ink)" : "var(--rf-line)"}`,
                              }}
                              onClick={() => toggleAddon(addon, cat.isRequired ?? false)}
                            >
                              <div className="flex items-center gap-3">
                                {/* Custom radio/checkbox */}
                                <div
                                  className="w-5 h-5 flex items-center justify-center flex-shrink-0 transition-all"
                                  style={{
                                    borderRadius: cat.isRequired ? "50%" : "6px",
                                    border: `2px solid ${isChecked ? "var(--rf-ink)" : "var(--rf-line-2)"}`,
                                    backgroundColor: isChecked ? "var(--rf-ink)" : "transparent",
                                  }}
                                >
                                  {isChecked && (
                                    <div
                                      className="rounded-full"
                                      style={{
                                        width: cat.isRequired ? 8 : 10,
                                        height: cat.isRequired ? 8 : 10,
                                        backgroundColor: "var(--rf-yellow)",
                                      }}
                                    />
                                  )}
                                </div>
                                <span className="text-sm font-medium" style={{ color: "var(--rf-ink)" }}>
                                  {addon.name}
                                </span>
                              </div>
                              <span className="text-sm font-semibold" style={{ color: "rgba(27,31,59,0.55)" }}>
                                {addon.price ? `+$${addon.price.toFixed(2)}` : "Free"}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-paper)" }}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* Qty control */}
            <div
              className="flex items-center rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--rf-ink)" }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-black/5"
              >
                <Minus className="h-4 w-4" style={{ color: "var(--rf-ink)" }} />
              </button>
              <span className="w-10 text-center text-base font-bold" style={{ color: "var(--rf-ink)" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-black/5"
              >
                <Plus className="h-4 w-4" style={{ color: "var(--rf-ink)" }} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {existingOrder ? "Update Order" : "Add to Cart"}
                  <span className="font-normal opacity-70">· ${lineTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

          {!isValid && addonCategories.some((c) => c.isRequired) && (
            <p className="text-xs text-center" style={{ color: "rgba(27,31,59,0.45)" }}>
              Please select required options above
            </p>
          )}
        </div>
      </div>
    </>
  );
}
