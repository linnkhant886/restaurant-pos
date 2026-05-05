"use client";

import { useRouter } from "next/navigation";
import { DollarSign, ShoppingBag, Receipt, Users, TrendingUp, BarChart3, MapPin } from "lucide-react";

interface Props {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  activeTables: number;
  topMenus: { name: string; quantity: number; revenue: number }[];
  locationStats: { id: number; name: string; revenue: number }[];
}

export function ReportsClient({
  period,
  totalRevenue,
  totalOrders,
  avgTicket,
  activeTables,
  topMenus,
  locationStats,
}: Props) {
  const router = useRouter();

  const handleTabChange = (newPeriod: string) => {
    router.push(`/backoffice/reports?period=${newPeriod}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxMenuRevenue = topMenus.length > 0 ? Math.max(...topMenus.map(m => m.revenue)) : 1;
  const totalCompanyRevenue = locationStats.reduce((sum, loc) => sum + loc.revenue, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
            Reports & Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
            Monitor your restaurant's performance
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl" style={{ backgroundColor: "var(--rf-cream-2)" }}>
          {["today", "week", "month"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                period === tab
                  ? "bg-white shadow-sm"
                  : "hover:bg-black/5"
              }`}
              style={{
                color: period === tab ? "var(--rf-ink)" : "rgba(27,31,59,0.5)",
              }}
            >
              {tab === "week" ? "This Week" : tab === "month" ? "This Month" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(245,197,24,0.15)", color: "#b48e0b" }}>
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "rgba(27,31,59,0.6)" }}>Total Revenue</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--rf-ink)" }}>{formatCurrency(totalRevenue)}</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(27,31,59,0.05)", color: "var(--rf-ink)" }}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "rgba(27,31,59,0.6)" }}>Completed Orders</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--rf-ink)" }}>{totalOrders}</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(27,31,59,0.05)", color: "var(--rf-ink)" }}>
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "rgba(27,31,59,0.6)" }}>Avg Ticket</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--rf-ink)" }}>{formatCurrency(avgTicket)}</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(27,31,59,0.05)", color: "var(--rf-ink)" }}>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold" style={{ color: "rgba(27,31,59,0.6)" }}>Active Tables</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--rf-ink)" }}>{activeTables}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Menus Chart */}
        <div className="p-6 rounded-2xl border flex flex-col" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5" style={{ color: "var(--rf-ink)" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--rf-ink)" }}>Top Selling Items</h2>
          </div>
          
          <div className="flex-1 space-y-5">
            {topMenus.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "rgba(27,31,59,0.4)" }}>No sales data available for this period.</p>
            ) : (
              topMenus.map((menu, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>
                    <span className="truncate pr-4">{menu.name}</span>
                    <span className="flex-shrink-0">{formatCurrency(menu.revenue)} <span style={{ color: "rgba(27,31,59,0.4)" }}>({menu.quantity})</span></span>
                  </div>
                  <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--rf-cream-2)" }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${(menu.revenue / maxMenuRevenue) * 100}%`,
                        backgroundColor: "var(--rf-yellow)"
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Location Comparison */}
        <div className="p-6 rounded-2xl border flex flex-col" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5" style={{ color: "var(--rf-ink)" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--rf-ink)" }}>Location Performance</h2>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {locationStats.map((loc) => {
              const percentage = totalCompanyRevenue > 0 ? ((loc.revenue / totalCompanyRevenue) * 100).toFixed(1) : "0.0";
              return (
                <div 
                  key={loc.id}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ backgroundColor: "var(--rf-cream)", borderColor: "var(--rf-line)" }}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm" style={{ color: "var(--rf-ink)" }}>{loc.name}</span>
                    <span className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>{percentage}% of company revenue</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: "var(--rf-ink)" }}>{formatCurrency(loc.revenue)}</span>
                    <div 
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold"
                      style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
