"use client";

import { useState, useTransition, useMemo } from "react";
import { ORDERSTATUS, Prisma } from "@prisma/client";
import { 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  ChevronRight, 
  Archive, 
  ShoppingBag,
  Utensils
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
  { id: "ALL", label: "All Tables", icon: ShoppingBag },
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
  const [isPending, startTransition] = useTransition();

  // Group orders by table
  const groupedByTable = useMemo(() => {
    const groups = new Map<number, { tableId: number, tableName: string, orders: OrderItem[], updatedAt: number }>();
    for (const order of initialOrders) {
      if (!groups.has(order.tableId)) {
        groups.set(order.tableId, {
          tableId: order.tableId,
          tableName: order.table.name,
          orders: [],
          updatedAt: new Date(order.createdAt).getTime()
        });
      }
      const group = groups.get(order.tableId)!;
      group.orders.push(order);
      const orderTime = new Date(order.createdAt).getTime();
      if (orderTime > group.updatedAt) group.updatedAt = orderTime;
    }
    return Array.from(groups.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [initialOrders]);

  const getTableOverallStatus = (orders: OrderItem[]) => {
    if (orders.some(o => o.status === ORDERSTATUS.PENDING)) return ORDERSTATUS.PENDING;
    if (orders.some(o => o.status === ORDERSTATUS.COOKING)) return ORDERSTATUS.COOKING;
    if (orders.every(o => o.status === ORDERSTATUS.COMPLETE)) return ORDERSTATUS.COMPLETE;
    return ORDERSTATUS.COMPLETE; // Fallback
  };

  const filteredGroups = groupedByTable.filter((g) => {
    if (filter === "ALL") return true;
    return getTableOverallStatus(g.orders) === filter;
  });

  const [selectedTableId, setSelectedTableId] = useState<number | null>(
    filteredGroups.length > 0 ? filteredGroups[0].tableId : null
  );

  // Keep selected order in sync if current selected table disappears from filters
  const selectedGroup = groupedByTable.find(g => g.tableId === selectedTableId) || (filteredGroups.length > 0 ? filteredGroups[0] : null);

  // Actions
  const handleStatusUpdate = (orderId: number, status: ORDERSTATUS) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
      router.refresh();
    });
  };

  const handleItemArchive = (orderId: number) => {
    startTransition(async () => {
      await archiveOrder(orderId);
      router.refresh();
    });
  };

  const handleTableStatusUpdate = (ordersToUpdate: OrderItem[], targetStatus: ORDERSTATUS) => {
    startTransition(async () => {
      await Promise.all(ordersToUpdate.map(o => updateOrderStatus(o.id, targetStatus)));
      router.refresh();
    });
  };

  const handleTableArchive = (ordersToArchive: OrderItem[]) => {
    startTransition(async () => {
      await Promise.all(ordersToArchive.map(o => archiveOrder(o.id)));
      if (selectedTableId === ordersToArchive[0].tableId) {
          setSelectedTableId(null);
      }
      router.refresh();
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      {/* --- Left Panel: Table List --- */}
      <div className="w-[320px] flex flex-col border-r bg-white shadow-sm shrink-0">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Table Orders</h1>
          
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
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No active tables</p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const overallStatus = getTableOverallStatus(group.orders);
              const theme = STATUS_THEME[overallStatus as keyof typeof STATUS_THEME] || STATUS_THEME.PENDING;
              const isSelected = selectedGroup?.tableId === group.tableId;

              const totalItems = group.orders.reduce((acc, curr) => acc + curr.quantity, 0);

              return (
                <button
                  key={group.tableId}
                  onClick={() => setSelectedTableId(group.tableId)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all relative group-btn",
                    isSelected 
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-md" 
                      : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-slate-900">
                      {group.tableName}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(group.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} total
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
      <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        )}
        
        {selectedGroup ? (() => {
          const overallStatus = getTableOverallStatus(selectedGroup.orders);
          const pendingOrders = selectedGroup.orders.filter(o => o.status === ORDERSTATUS.PENDING);
          const cookingOrders = selectedGroup.orders.filter(o => o.status === ORDERSTATUS.COOKING);
          const doneOrders = selectedGroup.orders.filter(o => o.status === ORDERSTATUS.COMPLETE);

          const subtotal = selectedGroup.orders.reduce((acc, order) => {
            const itemTotal = (order.menu.price ?? 0) * order.quantity;
            const addonsTotal = order.OrdersAddons.reduce((sum, oa) => sum + (oa.addon.price ?? 0), 0);
            return acc + itemTotal + addonsTotal;
          }, 0);

          const vat = subtotal * 0.07;
          const grandTotal = subtotal + vat;

          return (
          <div className="max-w-5xl mx-auto p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-slate-900">
                    {selectedGroup.tableName}
                  </h2>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                    STATUS_THEME[overallStatus as keyof typeof STATUS_THEME].badge,
                    "text-white shadow-sm"
                  )}>
                    {STATUS_THEME[overallStatus as keyof typeof STATUS_THEME].label}
                  </div>
                </div>
                <p className="text-slate-500 font-medium">
                  {selectedGroup.orders.length} unique items ordered
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                 {/* Table-level Action Buttons */}
                 {pendingOrders.length > 0 && (
                    <button 
                      onClick={() => handleTableStatusUpdate(pendingOrders, ORDERSTATUS.COOKING)}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                      <ChefHat className="w-4 h-4" />
                      Start Preparing All Pending
                    </button>
                 )}

                 {cookingOrders.length > 0 && (
                    <button 
                      onClick={() => handleTableStatusUpdate(cookingOrders, ORDERSTATUS.COMPLETE)}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark All Cooking as Done
                    </button>
                 )}

                 {pendingOrders.length === 0 && cookingOrders.length === 0 && doneOrders.length > 0 && (
                    <button 
                      onClick={() => handleTableArchive(doneOrders)}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg transition-all active:scale-95"
                    >
                      <Archive className="w-4 h-4" />
                      Archive Table Orders
                    </button>
                 )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Items Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Ordered Items</h3>
                     <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded shadow-sm">{selectedGroup.orders.length} total rows</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {selectedGroup.orders.map((order) => {
                       const itemTheme = STATUS_THEME[order.status as keyof typeof STATUS_THEME];
                       const itemTotal = (order.menu.price ?? 0) * order.quantity + order.OrdersAddons.reduce((sum, oa) => sum + (oa.addon.price ?? 0), 0);
                       
                       return (
                        <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                                 <Utensils className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-base font-bold text-slate-900">
                                    {order.menu.name}
                                  </p>
                                  <span className="text-xs font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    x{order.quantity}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-slate-400">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                
                                {order.OrdersAddons.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                     {order.OrdersAddons.map((oa) => (
                                       <div key={oa.id} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-100 rounded-md shadow-sm">
                                          <span className="text-[10px] font-bold text-slate-600">{oa.addon.name}</span>
                                          <span className="text-[10px] font-black text-slate-400">+${oa.addon.price ?? 0}</span>
                                       </div>
                                     ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-2 sm:mt-0 ml-16 sm:ml-0">
                               <div className="flex items-center gap-3">
                                  <span className="text-base font-black text-slate-900">
                                     ${itemTotal}
                                  </span>
                                  <div className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                    itemTheme.badge,
                                    "text-white"
                                  )}>
                                    {itemTheme.label}
                                  </div>
                               </div>
                               
                               {/* Item level actions */}
                               <div className="flex items-center gap-1.5 mt-2">
                                 {order.status === ORDERSTATUS.PENDING && (
                                   <>
                                     <button onClick={() => handleStatusUpdate(order.id, ORDERSTATUS.COOKING)} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                       Prepare
                                     </button>
                                     <button onClick={() => handleItemArchive(order.id)} className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors">
                                       Cancel
                                     </button>
                                   </>
                                 )}
                                 {order.status === ORDERSTATUS.COOKING && (
                                   <>
                                     <button onClick={() => handleStatusUpdate(order.id, ORDERSTATUS.COMPLETE)} className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors">
                                       Done
                                     </button>
                                     <button onClick={() => handleStatusUpdate(order.id, ORDERSTATUS.PENDING)} className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                                       Undo
                                     </button>
                                   </>
                                 )}
                                 {order.status === ORDERSTATUS.COMPLETE && (
                                   <button onClick={() => handleStatusUpdate(order.id, ORDERSTATUS.COOKING)} className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                                     Undo
                                   </button>
                                 )}
                               </div>
                            </div>
                        </div>
                       )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary Card with VAT */}
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <ShoppingBag className="w-24 h-24 rotate-12" />
                  </div>
                  
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Grand Total</p>
                  <h3 className="text-5xl font-black mb-6">
                    ${grandTotal.toFixed(2)}
                  </h3>
                  
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Subtotal</span>
                       <span className="font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">VAT (7%)</span>
                       <span className="font-bold">${vat.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Table Status</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Pending Items</span>
                      <span className="font-bold text-amber-600">{pendingOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Preparing Items</span>
                      <span className="font-bold text-blue-600">{cookingOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Completed Items</span>
                      <span className="font-bold text-green-600">{doneOrders.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })() : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                <Utensils className="w-10 h-10" />
             </div>
             <p className="text-lg font-black uppercase tracking-widest">Select a table to view orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
