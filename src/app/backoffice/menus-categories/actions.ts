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

const UpdateSchema = z.object({
  MenuCategoryId: z.string(),
  MenuCategoryName: z
    .string()
    .min(4, { message: "Menu-Category name must be at least 4 characters long" }),
  isAvailable: z.boolean().optional(),
});

export async function UpdateMenuCategoryID(formData: FormData) {
  try {
    const { MenuCategoryId, MenuCategoryName, isAvailable } = UpdateSchema.parse({
      MenuCategoryId: formData.get("MenuCategoryId") as string,
      MenuCategoryName: formData.get("MenuCategoryName") as string,
      isAvailable: formData.get("isAvailable") ? true : false,
    });

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message);
      return { error: errorMessages };
    }
    return { error: "Something went wrong, please contact support" };
  }
}


const DeleteSchema = z.object({
  DeleteID: z.string(),
});

export async function DeleteMenuCategoryID(formData: FormData) {
  try {
    const { DeleteID } = DeleteSchema.parse({
      DeleteID: formData.get("DeleteID") as string,
    });

    await prisma.menuCategories.delete({
      where: {
        id: Number(DeleteID),
      },
    });
    redirect("/backoffice/menus-categories");
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message);
      return { error: errorMessages };
    }
    return { error: "Something went wrong, please contact support" };
  }
}