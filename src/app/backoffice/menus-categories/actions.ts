"use server";

import { z } from "zod";
import { getCompanyId, getSelectedLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";


 const FormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Menu-Category name must be at least 4 characters long" }),
});

export async function CreateMenuCategory(formData: FormData) {
  try {
    const { name } = FormSchema.parse({
      name: formData.get("createMenuCategory") as string,
    });
    const companyId = (await getCompanyId()) as number;
    await prisma.menuCategories.create({
      data: {
        name: name,
        companyId: companyId,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message);
      return { error: errorMessages };
    }
    return { error: "Something went wrong , please contact support" };
  }
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
