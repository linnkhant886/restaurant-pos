"use server";

import { getCompanyId, getSelectedLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function CreateMenuCategory(formData: any) {
  const MenuCategory = formData.get("createMenuCategory");
  await prisma.menuCategories.create({
    data: {
      name: MenuCategory,
      companyId: (await getCompanyId()) as number,
    },
  });
  redirect("/backoffice/menus-categories");
}

export async function UpdateMenuCategoryID(formData: FormData) {
  const MenuCategoryId = formData.get("MenuCategoryId");
  const MenuCategoryName = formData.get("MenuCategoryName") as string;
  const isAvailable = formData.get("isAvailable") ? true : false;

  await prisma.menuCategories.update({
    where: {
      id: Number(MenuCategoryId),
    },
    data: {
      name: MenuCategoryName,
    },
  });

  if (!isAvailable) {
    await prisma.disabledLocationsMenuCategories.create({
      data: {
        menuCategoryId: Number(MenuCategoryId),
        locationId: (await getSelectedLocation())?.locationId as number,
      },
    });
  } else {
    const disabledLocationsMenuCategories =
      await prisma.disabledLocationsMenuCategories.findFirst({
        where: {
          menuCategoryId: Number(MenuCategoryId),
        },
      });

    if (disabledLocationsMenuCategories) {
      await prisma.disabledLocationsMenuCategories.delete({
        where: {
          id: disabledLocationsMenuCategories?.id,
        },
      });
    }
  }
  redirect("/backoffice/menus-categories");
}

export async function DeleteMenuCategoryID(formData: any) {
  const MenuCategoryId = formData.get("DeleteID");
  await prisma.menuCategories.delete({
    where: {
      id: Number(MenuCategoryId),
    },
  });
  redirect("/backoffice/menus-categories");
}
