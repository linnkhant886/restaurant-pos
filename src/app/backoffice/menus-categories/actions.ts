"use server";

import { z } from "zod";
import { getCompanyId, getSelectedLocation } from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
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

    const locationId = (await getSelectedLocation())?.locationId as number;

    if (!isAvailable) {
      // Use upsert or check existence to avoid duplicates
      const existing = await prisma.disabledLocationsMenuCategories.findFirst({
        where: {
          menuCategoryId: Number(MenuCategoryId),
          locationId: locationId,
        },
      });

      if (!existing) {
        await prisma.disabledLocationsMenuCategories.create({
          data: {
            menuCategoryId: Number(MenuCategoryId),
            locationId: locationId,
          },
        });
      }
    } else {
      // Only delete the record for THIS specific location
      await prisma.disabledLocationsMenuCategories.deleteMany({
        where: {
          menuCategoryId: Number(MenuCategoryId),
          locationId: locationId,
        },
      });
    }
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
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message);
      return { error: errorMessages };
    }
    return { 
      error: "Could not delete category. Please make sure it has no menus inside it first." 
    };
  }
}
