"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Company } from "@prisma/client";
import { MenuCategoryType, MenuWithAddons, CartOrderWithMenu } from "@/app/order/page";
import { addItemToCart, removeItemFromCart } from "@/app/order/cart/action";
import CartDrawer, { CartItem } from "@/components/order/CartDrawer";
import CartToast from "@/components/order/CartToast";
import OrderSummaryView from "@/components/order/OrderSummaryView";
import MenuDetailModal from "@/components/order/MenuDetailModal";
import { ShoppingBag, MapPin, Minus, Plus, Clock } from "lucide-react";
import Image from "next/image";

/* ─── helpers ─────────────────────────────────────────────── */

function buildCartItems(orders: CartOrderWithMenu[]): CartItem[] {
  return orders.map((o) => ({
    orderId: o.id,
    menuId: o.menuId,
    name: o.menu.name,
    price: o.menu.price ?? 0,
    imageUrl: o.menu.imageUrl,
    qty: o.quantity,
    hasAddons: o.OrdersAddons.length > 0,
    addons: o.OrdersAddons.map((oa) => ({
      id: oa.addon.id,
      name: oa.addon.name,
      price: oa.addon.price ?? 0,
    })),
  }));
}

/* ─── MenuCard ─────────────────────────────────────────────── */

function MenuCard({
  item,
  cartQty,
  cartOrderId,
  hasAddons,
  onAdd,
  onDecrement,
  onOpenDetail,
}: {
  item: MenuWithAddons;
  cartQty: number;
  cartOrderId?: number;
  hasAddons: boolean;
  onAdd: (item: MenuWithAddons) => void;
  onDecrement: (orderId: number) => void;
  onOpenDetail: (item: MenuWithAddons, orderId?: number) => void;
}) {
  const isInCart = cartQty > 0;
  const isNew = item.id % 7 === 0;
  const isPopular = item.id % 4 === 0;

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border p-4 transition-all duration-150 hover:shadow-sm"
      style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}
    >
      {/* Image */}
      <div
        className="relative w-[72px] h-[72px] rounded-xl flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: "var(--rf-cream-2)" }}
      >
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl select-none">
            🍽️
          </div>
        )}
        {(isNew || isPopular) && !isInCart && (
          <span
            className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none"
            style={
              isNew
                ? { backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }
                : { backgroundColor: "var(--rf-yellow)", color: "var(--rf-ink)" }
            }
          >
            {isNew ? "NEW" : "⭐"}
          </span>
        )}
      </div>

      {/* Info — clicking opens detail modal */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onOpenDetail(item, cartOrderId)}
      >
        <p className="text-sm font-bold leading-snug truncate" style={{ color: "var(--rf-ink)" }}>
          {item.name}
        </p>
        <p className="text-base font-bold mt-1" style={{ color: "var(--rf-ink)" }}>
          ${item.price?.toFixed(2) ?? "0.00"}
        </p>
      </div>

      {/* Action button */}
      <div className="flex-shrink-0">
        {hasAddons ? (
          // Items with addons → always open detail modal
          isInCart ? (
            <button
              onClick={() => onOpenDetail(item, cartOrderId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold transition-all hover:opacity-80"
              style={{ borderColor: "var(--rf-ink)", color: "var(--rf-ink)", backgroundColor: "var(--rf-cream)" }}
            >
              <span>{cartQty}×</span>
              <Plus className="h-3 w-3" />
            </button>
          ) : (
            <button
              onClick={() => onOpenDetail(item)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-lg font-bold transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              +
            </button>
          )
        ) : isInCart ? (
          // Inline qty control for no-addon items
          <div
            className="flex items-center rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--rf-ink)" }}
          >
            <button
              onClick={() => cartOrderId && onDecrement(cartOrderId)}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-black/5"
            >
              <Minus className="h-3.5 w-3.5" style={{ color: "var(--rf-ink)" }} />
            </button>
            <span className="w-7 text-center text-sm font-bold" style={{ color: "var(--rf-ink)" }}>
              {cartQty}
            </span>
            <button
              onClick={() => onAdd(item)}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-black/5"
            >
              <Plus className="h-3.5 w-3.5" style={{ color: "var(--rf-ink)" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAdd(item)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-lg font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── OrderApp ─────────────────────────────────────────────── */

interface Props {
  menuCategories: MenuCategoryType[];
  company: Company;
  menu: MenuWithAddons[];
  tableId: string;
  cartOrders: CartOrderWithMenu[];
  activeOrdersCount: number;
}

export default function OrderApp({ menuCategories, company, menu, tableId, cartOrders, activeOrdersCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(menuCategories[0]?.id ?? 0);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => buildCartItems(cartOrders));
  const [cartOpen, setCartOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [toast, setToast] = useState<{ name: string; count: number } | null>(null);
  const [detailItem, setDetailItem] = useState<MenuWithAddons | null>(null);
  const [detailExisting, setDetailExisting] = useState<CartOrderWithMenu | null>(null);
  const [, startTransition] = useTransition();

  // Sync cart from server after refresh
  useEffect(() => {
    setCartItems(buildCartItems(cartOrders));
  }, [cartOrders]);

  const activeMenuIds =
    menuCategories
      .find((c) => c.id === activeCategory)
      ?.menuCategoriesMenus.map((m) => m.menuId) ?? [];

  const visibleMenu = menu.filter((m) => activeMenuIds.includes(m.id));
  const totalCartQty = cartItems.reduce((s, i) => s + i.qty, 0);

  // Open detail modal — find existing order if editing
  const handleOpenDetail = useCallback(
    (item: MenuWithAddons, cartOrderId?: number) => {
      const existing = cartOrderId
        ? cartOrders.find((o) => o.id === cartOrderId) ?? null
        : null;
      setDetailItem(item);
      setDetailExisting(existing);
    },
    [cartOrders]
  );

  const handleAdd = useCallback(
    (item: MenuWithAddons) => {
      const newCount = totalCartQty + 1;
      setCartItems((prev) => {
        const existing = prev.find((c) => c.menuId === item.id);
        if (existing) return prev.map((c) => c.menuId === item.id ? { ...c, qty: c.qty + 1 } : c);
        return [...prev, {
          orderId: -Date.now(),
          menuId: item.id,
          name: item.name,
          price: item.price ?? 0,
          imageUrl: item.imageUrl,
          qty: 1,
          hasAddons: false,
          addons: [],
        }];
      });
      setToast({ name: item.name, count: newCount });
      startTransition(async () => {
        await addItemToCart(item.id, Number(tableId));
        router.refresh();
        if (activeOrdersCount > 0) {
          setSummaryOpen(true);
        }
      });
    },
    [tableId, totalCartQty, activeOrdersCount]
  );

  const handleDecrement = useCallback((orderId: number) => {
    setCartItems((prev) => {
      const item = prev.find((c) => c.orderId === orderId);
      if (!item) return prev;
      if (item.qty <= 1) return prev.filter((c) => c.orderId !== orderId);
      return prev.map((c) => c.orderId === orderId ? { ...c, qty: c.qty - 1 } : c);
    });
    startTransition(async () => {
      await removeItemFromCart(orderId);
      router.refresh();
    });
  }, []);

  const handleModalAdded = (name: string) => {
    setToast({ name, count: totalCartQty + 1 });
    router.refresh();
    if (activeOrdersCount > 0) {
      setSummaryOpen(true);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--rf-cream)" }}>

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-30 h-14 px-4 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: "var(--rf-yellow)" }}
      >
        <p className="text-base font-bold" style={{ color: "var(--rf-ink)" }}>
          {company.name}
        </p>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "rgba(27,31,59,0.1)", color: "var(--rf-ink)" }}
        >
          <MapPin className="h-3 w-3" />
          Table {tableId}
        </div>

        {activeOrdersCount > 0 && (
          <button
            onClick={() => setSummaryOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:opacity-85 active:scale-95"
            style={{ backgroundColor: "var(--rf-paper)", color: "var(--rf-ink)", border: "1px solid var(--rf-line)" }}
          >
            <Clock className="h-4 w-4" />
            Orders
            {totalCartQty > 0 ? (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#F97316", color: "white", outline: "2px solid var(--rf-yellow)" }}
              >
                {totalCartQty}
              </span>
            ) : (
               <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-0.5" />
            )}
          </button>
        )}

        {activeOrdersCount === 0 && (
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:opacity-85 active:scale-95"
            style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {totalCartQty > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: "#EF4444", color: "white", outline: "2px solid var(--rf-yellow)" }}
              >
                {totalCartQty}
              </span>
            )}
          </button>
        )}
      </header>

      {/* ── Category Pills ── */}
      <div
        className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar sticky top-14 z-20"
        style={{ backgroundColor: "var(--rf-cream)" }}
      >
        {menuCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 whitespace-nowrap"
            style={
              activeCategory === cat.id
                ? { backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }
                : {
                    backgroundColor: "var(--rf-paper)",
                    color: "rgba(27,31,59,0.55)",
                    border: "1px solid var(--rf-line)",
                  }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Menu List ── */}
      <main className="px-4 pb-32 max-w-2xl mx-auto pt-2">
        {visibleMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-sm font-medium" style={{ color: "rgba(27,31,59,0.4)" }}>
              No items in this category
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleMenu.map((item) => {
              const cartEntry = cartItems.find((c) => c.menuId === item.id);
              const hasAddons = item.menuAddonCategories.length > 0;
              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  cartQty={cartEntry?.qty ?? 0}
                  cartOrderId={cartEntry?.orderId}
                  hasAddons={hasAddons}
                  onAdd={handleAdd}
                  onDecrement={handleDecrement}
                  onOpenDetail={handleOpenDetail}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* ── Menu Detail Modal (addon selection) ── */}
      <MenuDetailModal
        item={detailItem}
        existingOrder={detailExisting}
        tableId={tableId}
        onClose={() => { setDetailItem(null); setDetailExisting(null); }}
        onAdded={handleModalAdded}
      />

      {/* ── Cart Drawer ── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        tableId={tableId}
        onSentToKitchen={() => { setCartOpen(false); setSummaryOpen(true); }}
        onViewActiveOrders={activeOrdersCount > 0 ? () => { setCartOpen(false); setSummaryOpen(true); } : undefined}
      />

      {/* ── Order Summary ── */}
      <OrderSummaryView
        open={summaryOpen}
        tableId={tableId}
        onAddMore={() => setSummaryOpen(false)}
      />

      {/* ── Toast ── */}
      {toast && (
        <CartToast
          key={toast.name + toast.count}
          itemName={toast.name}
          cartCount={toast.count}
          onViewCart={() => { setToast(null); setCartOpen(true); }}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
