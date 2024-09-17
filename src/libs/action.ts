"use server";

import { getServerSession, User } from "next-auth";
import { prisma } from "./prisma";

export async function getUser(email: string) {
  await prisma.users.findFirst({ where: { email } });
}

export async function CreateDefaultData(nextUser: User) {
  const { name, email } = nextUser;

  const company = await prisma.company.create({
    data: { name: "default Company" },
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

  await prisma.tables.create({
    data: {
      name: "default Table",
      locationId: location.id,
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
  return await prisma.menuCategories.findMany({ where: { companyId } });
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
  return await prisma.menus.findMany({ where: { id: { in: menuId } } });
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
  return await prisma.tables.findMany({ where: { locationId: { in: locationIds } } });
  
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
  return await prisma.selectedLocation.findFirst({ where: { userId } });
}


