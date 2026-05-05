import { prisma } from "@/lib/prisma";
import { getSelectedLocation, getLocation } from "@/lib/actions/action";
import { ORDERSTATUS } from "@prisma/client";
import { ReportsClient } from "./ReportsClient";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const period = searchParams.period || "today";
  const selectedLocation = await getSelectedLocation();
  const allLocations = await getLocation();

  // Determine date range
  const now = new Date();
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  if (period === "week") {
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startDate = new Date(startDate.setDate(diff));
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Get current location's tables
  const locationId = selectedLocation?.locationId;
  const currentTables = await prisma.tables.findMany({
    where: { locationId },
  });
  const currentTableIds = currentTables.map((t) => t.id);

  // Fetch orders for current location within date range
  const currentOrders = await prisma.orders.findMany({
    where: {
      tableId: { in: currentTableIds },
      createdAt: { gte: startDate },
    },
    include: {
      menu: true,
      OrdersAddons: {
        include: { addon: true },
      },
    },
  });

  // Calculate metrics
  const completeOrders = currentOrders.filter((o) => o.status === "COMPLETE");
  
  let totalRevenue = 0;
  completeOrders.forEach((order) => {
    const menuPrice = order.menu.price || 0;
    const addonsPrice = order.OrdersAddons.reduce((acc, oa) => acc + (oa.addon.price || 0), 0);
    totalRevenue += (menuPrice + addonsPrice) * order.quantity;
  });

  const totalOrdersCount = completeOrders.length;

  // Average ticket (revenue per table session)
  const revenuePerTable: Record<number, number> = {};
  completeOrders.forEach((order) => {
    const menuPrice = order.menu.price || 0;
    const addonsPrice = order.OrdersAddons.reduce((acc, oa) => acc + (oa.addon.price || 0), 0);
    const orderTotal = (menuPrice + addonsPrice) * order.quantity;
    revenuePerTable[order.tableId] = (revenuePerTable[order.tableId] || 0) + orderTotal;
  });
  
  const tablesWithOrders = Object.keys(revenuePerTable).length;
  const avgTicket = tablesWithOrders > 0 ? totalRevenue / tablesWithOrders : 0;

  // Active tables
  const activeOrders = currentOrders.filter((o) => ["PENDING", "COOKING"].includes(o.status));
  const activeTablesCount = new Set(activeOrders.map((o) => o.tableId)).size;

  // Top menus
  const menuStats: Record<number, { name: string; quantity: number; revenue: number }> = {};
  completeOrders.forEach((order) => {
    if (!menuStats[order.menuId]) {
      menuStats[order.menuId] = { name: order.menu.name, quantity: 0, revenue: 0 };
    }
    const menuPrice = order.menu.price || 0;
    const addonsPrice = order.OrdersAddons.reduce((acc, oa) => acc + (oa.addon.price || 0), 0);
    
    menuStats[order.menuId].quantity += order.quantity;
    menuStats[order.menuId].revenue += (menuPrice + addonsPrice) * order.quantity;
  });

  const topMenus = Object.values(menuStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Location comparison
  // We need to fetch orders for all locations in the same company
  const locationStats: { id: number; name: string; revenue: number }[] = [];
  
  // To avoid N+1, fetch all tables for all locations, then all orders
  const allTables = await prisma.tables.findMany({
    where: { locationId: { in: allLocations.map((l) => l.id) } },
  });
  
  const allLocationOrders = await prisma.orders.findMany({
    where: {
      tableId: { in: allTables.map((t) => t.id) },
      status: "COMPLETE",
      createdAt: { gte: startDate },
    },
    include: {
      menu: true,
      OrdersAddons: {
        include: { addon: true },
      },
    },
  });

  allLocations.forEach((loc) => {
    const locTableIds = allTables.filter((t) => t.locationId === loc.id).map((t) => t.id);
    const locOrders = allLocationOrders.filter((o) => locTableIds.includes(o.tableId));
    
    let locRev = 0;
    locOrders.forEach((order) => {
      const menuPrice = order.menu.price || 0;
      const addonsPrice = order.OrdersAddons.reduce((acc, oa) => acc + (oa.addon.price || 0), 0);
      locRev += (menuPrice + addonsPrice) * order.quantity;
    });
    
    locationStats.push({ id: loc.id, name: loc.name, revenue: locRev });
  });

  // Sort locations by revenue
  locationStats.sort((a, b) => b.revenue - a.revenue);

  return (
    <ReportsClient
      period={period}
      totalRevenue={totalRevenue}
      totalOrders={totalOrdersCount}
      avgTicket={avgTicket}
      activeTables={activeTablesCount}
      topMenus={topMenus}
      locationStats={locationStats}
    />
  );
}
