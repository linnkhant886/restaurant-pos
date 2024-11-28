"use server";

import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";
import { qrCodeImageUrl } from "@/app/backoffice/tables/actions";

export async function getUser(email: string) {
  await prisma.users.findFirst({ where: { email } });
}

export async function CreateDefaultData(nextUser: User) {
  const { name, email } = nextUser;

  const company = await prisma.company.create({
    data: {
      name: "default Company",
      email: "default@gmail.com",
      phoneNumber: 912345678,
      streetAddress: "default address",
      city: "default city",
      state: "default state",
    },
  });

  const user = await prisma.users.create({
    data: {
      name: "default user",
      email: email as string,
      companyId: company.id,
    },
  });

  const menuCategories = await prisma.menuCategories.create({
    data: {
      name: "default Menu Category",
      companyId: company.id,
    },
  });

  const menu = await prisma.menus.create({
    data: {
      name: "default Menu",
      price: 0,
    },
  });

  await prisma.menuCategoriesMenus.create({
    data: {
      menuId: menu.id,
      menuCategoryId: menuCategories.id,
    },
  });

  const addonCategories = await prisma.addonCategories.create({
    data: {
      name: "default Addon Category",
    },
  });

  await prisma.menuAddonCategories.create({
    data: {
      menuId: menu.id,
      addonCategoryId: addonCategories.id,
    },
  });

  const Addonitem = ["item1", "item2", "item3"];
  const data = Addonitem.map((item) => ({
    name: item,
    price: 0,
    addonCategoryId: addonCategories.id,
  }));

  await prisma.addons.createMany({
    data,
  });

  const location = await prisma.locations.create({
    data: {
      name: "default Location",
      companyId: company.id,
    },
  });

  const table = await prisma.tables.create({
    data: {
      name: "default Table",
      locationId: location.id,
      qrCodeImageUrl: "",
    },
  });

  await prisma.tables.update({
    where: {
      id: table.id,
    },
    data: {
      ...table,
      qrCodeImageUrl: await qrCodeImageUrl(table),
    },
  });

  await prisma.selectedLocation.create({
    data: {
      userId: user.id,
      locationId: location.id,
    },
  });
}

export async function getCompanyId() {
  const session = await getServerSession();

  const user = await prisma.users.findFirst({
    where: {
      email: session?.user?.email as string,
    },
  });

  const company = await prisma.company.findFirst({
    where: {
      id: user?.companyId,
    },
  });
  return company?.id;
}

export async function getCompanyMenuCategories() {
  const companyId = await getCompanyId();
  return await prisma.menuCategories.findMany({
    where: { companyId },
    include: { DisabledLocationsMenuCategories: true },
  });
}

export async function getCompanyMenu() {
  const menuCategories = await getCompanyMenuCategories();
  const menmenuCategoriesIds = menuCategories.map(
    (menuCategory) => menuCategory.id
  );
  const menuCategoryMenu = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menmenuCategoriesIds } },
  });

  const menuId = menuCategoryMenu.map((menu) => menu.menuId);
  return await prisma.menus.findMany({
    where: { id: { in: menuId } },
    include: { DisabledLocationsMenus: true },
  });
}


export async function getPaginatedCompanyMenu(page: number = 1, pageSize: number = 8) {
  try {
    // Calculate `skip` and `take` for pagination
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch the total number of menus (optional, for returning total pages)
    const totalMenus = await prisma.menus.count();

    // Fetch paginated menus
    const menus = await prisma.menus.findMany({
      skip,
      take,
      include: {
        menuCategoriesMenus: true, // Include relations if needed
      },
    });

    return {
      menus,
      totalPages: Math.ceil(totalMenus / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching paginated company menus:", error);
    throw new Error("Failed to fetch paginated menus.");
  }
}

export async function getCompanyAddonCategories() {
  const menu = await getCompanyMenu();
  const menuId = menu.map((item) => item.id);
  const menuAddonCategories = await prisma.menuAddonCategories.findMany({
    where: { menuId: { in: menuId } },
  });

  const addonCategories = menuAddonCategories.map(
    (item) => item.addonCategoryId
  );
  return await prisma.addonCategories.findMany({
    where: { id: { in: addonCategories } },
  });
}

export async function getCompanyAddon() {
  const addonCategory = await getCompanyAddonCategories();
  const addonCategoryIds = addonCategory.map((item) => item.id);
  return await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds } },
  });
}

export async function getLocation() {
  const companyId = await getCompanyId();
  return await prisma.locations.findMany({ where: { companyId } });
}
export async function getCompanyTables() {
  const locationId = await getLocation();
  const locationIds = locationId.map((item) => item.id);
  return await prisma.tables.findMany({
    where: { locationId: { in: locationIds } },
  });
}

export async function getDBuserId() {
  const session = await getServerSession();
  const user = await prisma.users.findFirst({
    where: {
      email: session?.user?.email as string,
    },
  });
  return user?.id;
}

export async function getSelectedLocation() {
  const userId = await getDBuserId();
  return await prisma.selectedLocation.findFirst({
    where: { userId },
    include: { location: true },
  });
}

export async function getSelectedLocationTables() {
  const selectedLocationId = (await getSelectedLocation())?.locationId;
  return prisma.tables.findMany({ where: { locationId: selectedLocationId } });
}

export async function getCompanyByTableId(tableId: string) {
  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId) },
  });
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId },
  });

  return await prisma.company.findFirst({
    where: { id: location?.companyId },
  });
}

export async function getMenuCategoryByTableId(tableId: string) {
  const company = await getCompanyByTableId(tableId);

  const table = await prisma.tables.findFirst({
    where: { id: Number(tableId) },
  });
  const location = await prisma.locations.findFirst({
    where: { id: table?.locationId },
  });

  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: company?.id, isArchived: false },
    include: { menuCategoriesMenus: true },
  });

  const DisabledLocationsMenuCategories =
    await prisma.disabledLocationsMenuCategories.findMany({
      where: { locationId: location?.id },
    });

  const disabledMenuCategoriesIds = DisabledLocationsMenuCategories.map(
    (item) => item.menuCategoryId
  );
  return menuCategories.filter(
    (item) => !disabledMenuCategoriesIds.includes(item.id)
  );
}

export async function getMenuByTableId(menuCategoriesIds: number[]) {
  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menuCategoriesIds } },
  });

  const menuIds = menuCategoriesMenus.map((item) => item.menuId);
  const menu = await prisma.menus.findMany({
    where: { id: { in: menuIds } },
  });

  const disabledLocationsMenu = await prisma.disabledLocationsMenus.findMany({
    where: { menuId: { in: menuIds } },
  });

  const availableMenu = menu.filter(
    (item) =>
      !disabledLocationsMenu.map((item) => item.menuId).includes(item.id)
  );
  return availableMenu;
}
