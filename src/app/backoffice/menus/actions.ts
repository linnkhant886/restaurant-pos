"use server";

import { getSelectedLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function CreateMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price");
  const menuCategories = formData.getAll("menuCategories");

  const menu = await prisma.menus.create({
    data: {
      name: name,
      price: Number(price),
    },
  });

  const data = menuCategories.map((menuCategory) => ({
    menuId: menu.id,
    menuCategoryId: Number(menuCategory),
  }));
  await prisma.menuCategoriesMenus.createMany({
    data,
  });
  redirect("/backoffice/menus");
}

export async function getMenu(id: number) {
  const Menu = await prisma.menus.findFirst({
    where: { id },
    include: { menuCategoriesMenus: true, DisabledLocationsMenus: true },
  });

  return Menu;
}

export async function UpdateMenu(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const price = formData.get("price");
  const isAvaiable = formData.get("isAvailable") ? true : false;
  const updateMenuCategoriesIds = formData.getAll("menuCategories");
  // return console.log(formData , isAvaiable);

  await prisma.menus.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      price: Number(price),
    },
  });

  const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
    where: {
      menuId: Number(id),
    },
  });
  const menuCategoriesIds = menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );
  // console.log(menuCategoriesIds);

  // console.log(updateMenuCategoriesIds);

  const isSame =
    menuCategoriesIds.length === updateMenuCategoriesIds.length &&
    menuCategoriesIds.every((menuCategoryId) =>
      updateMenuCategoriesIds.includes(String(menuCategoryId))
    );

  if (!isSame) {
    await prisma.menuCategoriesMenus.deleteMany({
      where: {
        menuId: Number(id),
      },
    });

    const data = updateMenuCategoriesIds.map((menuCategoryId) => ({
      menuId: Number(id),
      menuCategoryId: Number(menuCategoryId),
    }));

    // console.log(data);
    await prisma.menuCategoriesMenus.createMany({
      data,
    });
    // console.log("not same");
  }

  if (!isAvaiable) {
    await prisma.disabledLocationsMenus.create({
      data: {
        locationId: (await getSelectedLocation())?.locationId as number,
        menuId: Number(id),
      },
    });
  } else {
    const disabledLocationsMenus =
      await prisma.disabledLocationsMenus.findFirst({
        where: {
          menuId: Number(id),
        },
      });

    if (disabledLocationsMenus) {
      await prisma.disabledLocationsMenus.delete({
        where: {
          id: disabledLocationsMenus?.id,
        },
      });
    }
  }

  redirect("/backoffice/menus");
}

// if (!isSame) {
//     console.log("not same");
//   }else{
//     console.log("same")
//   }
export async function DeleteMenu(formData: FormData) {
  console.log(formData);
  const id = Number(formData.get("id"));
  await prisma.menuCategoriesMenus.deleteMany({
    where: {
      menuId: Number(id),
    },
  });
  await prisma.menus.delete({
    where: {
      id: Number(id),
    },
  });
  redirect("/backoffice/menus");
}
