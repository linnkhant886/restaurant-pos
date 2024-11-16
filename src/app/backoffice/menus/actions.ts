"use server";

import { getSelectedLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z
    .number({ message: "Required field id is missing" })
    .gt(0, { message: "Id cannot be 0" }),
  name: z
    .string()
    .min(5, { message: "Menu name must be at least 5 characters long" }),
  price: z.number({ message: "Price must be a number" }),
  isAvailable: z.boolean(),
  imageUrl: z.string(),
  menuCategoryIds: z
    .array(z.number())
    .min(1, { message: "Required menu category ids is missing" }),
  addOnCategoryIds: z
    .array(z.number())
    .min(1, { message: "Required addon category ids is missing" }),
});

const createMenuValidator = FormSchema.omit({ id: true, isAvailable: true });
const updateMenuValidator = FormSchema.omit({
  isAvailable: true,
  imageUrl: true,
  menuCategoryIds: true,
  addOnCategoryIds: true,
});
export async function CreateMenu(formData: FormData) {
  try {
    const { name, price, menuCategoryIds, imageUrl } =
      createMenuValidator.parse({
        name: formData.get("name"),
        price: Number(formData.get("price")),
        menuCategoryIds: formData
          .getAll("menuCategoryIds")
          .map((item) => Number(item)),
        imageUrl:
          formData.get("imageUrl") ||
          "https://images.squarespace-cdn.com/content/v1/5a81c36ea803bb1dd7807778/1610403788186-K2ATWJRYLHVC4ENCZZ7D/Shan+khaut+swe+%28Shan+sticky+noodles%29",
      });

    const menu = await prisma.menus.create({
      data: {
        name: name,
        price: Number(price),
        imageUrl,
      },
    });

    const data = menuCategoryIds.map((menuCategory) => ({
      menuId: menu.id,
      menuCategoryId: Number(menuCategory),
    }));

    await prisma.menuCategoriesMenus.createMany({
      data,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message).join(",");
      return { error: errorMessages };
    }
    return { error: "Something went wrong , please contact support" };
  }
  return {};
}

export async function getMenu(id: number) {
  const Menu = await prisma.menus.findFirst({
    where: { id },
    include: {
      menuCategoriesMenus: true,
      DisabledLocationsMenus: true,
      menuAddonCategories: true,
    },
  });

  return Menu;
}

export async function UpdateMenu(formData: FormData) {
  try {
    const { id, name, price } = updateMenuValidator.parse({
      id: Number(formData.get("id")),
      name: formData.get("name"),
      price: Number(formData.get("price")),
    });

    const imageUrl = formData.get("imageUrl") as string;
    const isAvailable = formData.get("isAvailable") ? true : false;
    const updateMenuCategoriesIds = formData.getAll("menuCategories");
    const updateAddOnCategoriesIds = formData.getAll("addonCategories");

    const menu = await prisma.menus.findFirst({
      where: {
        id: Number(id),
      },
    });

    await prisma.menus.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        price: Number(price),
        imageUrl: imageUrl ? imageUrl : menu?.imageUrl,
      },
    });
    //update MenuCategroy array
    const menuCategoriesMenus = await prisma.menuCategoriesMenus.findMany({
      where: {
        menuId: Number(id),
      },
    });
    const menuCategoriesIds = menuCategoriesMenus.map(
      (item) => item.menuCategoryId
    );

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

      await prisma.menuCategoriesMenus.createMany({
        data,
      });
    }

    //update addonCategory Array
    const addonCategoryMenu = await prisma.menuAddonCategories.findMany({
      where: {
        menuId: Number(id),
      },
    });

    const addonCategoryIds = addonCategoryMenu.map(
      (item) => item.addonCategoryId
    );

    const isSameAddonCategory =
      addonCategoryIds.length === updateAddOnCategoriesIds.length &&
      addonCategoryIds.every((addonCategoryId) =>
        updateAddOnCategoriesIds.includes(String(addonCategoryId))
      );

    if (!isSameAddonCategory) {
      await prisma.menuAddonCategories.deleteMany({
        where: {
          menuId: Number(id),
        },
      });
      const data = updateAddOnCategoriesIds.map((addonCategoryId) => ({
        menuId: Number(id),
        addonCategoryId: Number(addonCategoryId),
      }));

      await prisma.menuAddonCategories.createMany({ data });
    }

    if (!isAvailable) {
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message).join(",");
      return { error: errorMessages };
    }
    return { error: "Something went wrong , please contact support" };
  }
}


export async function DeleteMenu(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.menuCategoriesMenus.deleteMany({
    where: {
      menuId: Number(id),
    },
  });

  await prisma.menuAddonCategories.deleteMany({
    where: {
      menuId: Number(id),
    },
  })
  await prisma.menus.delete({
    where: {
      id: Number(id),
    },
  });
  redirect("/backoffice/menus");
}
