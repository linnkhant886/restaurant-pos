"use client";

import { useState, useTransition } from "react";
import { ORDERSTATUS, Prisma } from "@prisma/client";
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  ChevronRight, 
  Archive, 
  XCircle, 
  RotateCcw,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import { updateOrderStatus, archiveOrder } from "./action";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- Types ---

export type OrderItem = Prisma.OrdersGetPayload<{
  include: { 
    menu: true; 
    table: true; 
    OrdersAddons: { 
      include: { 
        addon: true 
      } 
    } 
  };
}>;

interface Props {
  initialOrders: OrderItem[];
}

const FILTERS = [
  { id: "ALL", label: "All Orders", icon: ShoppingBag },
  { id: ORDERSTATUS.PENDING, label: "Pending", icon: Clock },
  { id: ORDERSTATUS.COOKING, label: "Preparing", icon: ChefHat },
  { id: ORDERSTATUS.COMPLETE, label: "Done", icon: CheckCircle2 },
];

const STATUS_THEME = {
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-500",
    label: "Pending",
  },
  COOKING: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-500",
    label: "Preparing",
  },
  COMPLETE: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-500",
    label: "Done",
  },
  CART: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    badge: "bg-slate-500",
    label: "In Cart",
  }
};

export default function OrderManagement({ initialOrders }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    initialOrders.length > 0 ? initialOrders[0].id : null
  );
  const [isPending, startTransition] = useTransition();

  const filteredOrders = initialOrders.filter((order) => {
    if (filter === "ALL") return true;
    return order.status === filter;
  });

  const selectedOrder = initialOrders.find((o) => o.id === selectedOrderId);

  const handleStatusUpdate = (orderId: number, status: ORDERSTATUS) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
      router.refresh();
    });
  };

  const handleArchive = (orderId: number) => {
    startTransition(async () => {
      await archiveOrder(orderId);
      if (selectedOrderId === orderId) {
          setSelectedOrderId(null);
      }
      router.refresh();
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* --- Left Panel: Order List --- */}
      <div className="w-[320px] flex flex-col border-r bg-white shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Orders</h1>
          
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                    isActive 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const theme = STATUS_THEME[order.status as keyof typeof STATUS_THEME] || STATUS_THEME.PENDING;
              const isSelected = selectedOrderId === order.id;

              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all relative group",
                    isSelected 
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-md" 
                      : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      #{order.id}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.table.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.quantity} {order.quantity === 1 ? 'item' : 'items'} · ${ (order.menu.price ?? 0) * order.quantity }
                      </p>
                    </div>
                    
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      theme.badge,
                      "text-white"
                    )}>
                      {theme.label}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* --- Right Panel: Detail View --- */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedOrder ? (
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-slate-900">
                    Order #{selectedOrder.id}
                  </h2>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                    STATUS_THEME[selectedOrder.status as keyof typeof STATUS_THEME].badge,
                    "text-white shadow-sm"
                  )}>
                    {STATUS_THEME[selectedOrder.status as keyof typeof STATUS_THEME].label}
                  </div>
                </div>
                <p className="text-slate-500 font-medium">
                  {selectedOrder.table.name} · {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                 {/* Action buttons based on status */}
                 {selectedOrder.status === ORDERSTATUS.PENDING && (
                    <>
                      <button 
                        onClick={() => handleArchive(selectedOrder.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder.id, ORDERSTATUS.COOKING)}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                      >
                        <ChefHat className="w-4 h-4" />
                        Start Preparing
                      </button>
                    </>
                 )}

                 {selectedOrder.status === ORDERSTATUS.COOKING && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder.id, ORDERSTATUS.PENDING)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Back to Pending
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder.id, ORDERSTATUS.COMPLETE)}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Done
                      </button>
                    </>
                 )}

                 {selectedOrder.status === ORDERSTATUS.COMPLETE && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder.id, ORDERSTATUS.COOKING)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reopen
                      </button>
                      <button 
                        onClick={() => handleArchive(selectedOrder.id)}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg transition-all active:scale-95"
                      >
                        <Archive className="w-4 h-4" />
                        Archive Order
                      </button>
                    </>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Items Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Order Items</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    <div className="p-6 flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                           🍽️
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                               <p className="text-lg font-bold text-slate-900">
                                 {selectedOrder.menu.name}
                               </p>
                               <p className="text-sm text-slate-500 font-medium">
                                 Quantity: {selectedOrder.quantity}
                               </p>
                            </div>
                            <p className="text-lg font-black text-slate-900">
                               ${(selectedOrder.menu.price ?? 0) * selectedOrder.quantity}
                            </p>
                          </div>
                          
                          {selectedOrder.OrdersAddons.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                               {selectedOrder.OrdersAddons.map((oa) => (
                                 <div key={oa.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                                    <span className="text-xs font-bold text-slate-600">{oa.addon.name}</span>
                                    <span className="text-xs font-black text-slate-400">+${oa.addon.price ?? 0}</span>
                                 </div>
                               ))}
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <ShoppingBag className="w-24 h-24 rotate-12" />
                  </div>
                  
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Amount</p>
                  <h3 className="text-5xl font-black mb-6">
                    ${(selectedOrder.menu.price ?? 0) * selectedOrder.quantity + selectedOrder.OrdersAddons.reduce((acc, curr) => acc + (curr.addon.price ?? 0), 0)}
                  </h3>
                  
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Subtotal</span>
                       <span className="font-bold">${(selectedOrder.menu.price ?? 0) * selectedOrder.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Addons</span>
                       <span className="font-bold">${selectedOrder.OrdersAddons.reduce((acc, curr) => acc + (curr.addon.price ?? 0), 0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Internal Notes</h3>
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    "Customer requested extra napkins and water refill."
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                <ChefHat className="w-10 h-10" />
             </div>
             <p className="text-lg font-black uppercase tracking-widest">Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
