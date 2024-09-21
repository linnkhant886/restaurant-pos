"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function CreateAddonCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const isRequired = formData.get("isRequired") ? true : false;
  const menus = formData.getAll("menus");
  // return console.log(formData)
  const AddonCategory = await prisma.addonCategories.create({
    data: {
      name: name,
      isRequired,
    },
  });

  const data = menus.map((menu) => ({
    menuId: Number(menu),
    addonCategoryId: AddonCategory.id,
  }));
  await prisma.menuAddonCategories.createMany({
    data,
  });
  redirect("/backoffice/addon-categories");
}

export async function getAddonCategory(id: number) {
  const addonCategories = await prisma.addonCategories.findFirst({
    where: { id },
    include: { menuAddonCategories: true },
  });

  return addonCategories;
}

export async function UpdateAddonCategory(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const isRequired = formData.get("isRequired") ? true : false;
  const Updatemenus = formData.getAll("menus").map((menu) => Number(menu));
  
  // console.log(formData);
  await prisma.addonCategories.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      isRequired,
    },
  });

  const menuAddonCategories = await prisma.menuAddonCategories.findMany({
    where: {
      addonCategoryId: Number(id),
    },
  });
  
  const menuAddonCategoriesIds = menuAddonCategories.map(
    (item) => item.menuId
  );
  // console.log(menuAddonCategories);

  // console.log(menuAddonCategoriesIds);

  const isSame =
  Updatemenus.length === menuAddonCategoriesIds.length &&
  menuAddonCategoriesIds.every((menuId) =>
    Updatemenus.includes(menuId)
    );

  if (!isSame) {
    await prisma.menuAddonCategories.deleteMany({
      where: {
        addonCategoryId: Number(id),
      },
    });

    const data = Updatemenus.map((menuId) => ({
      menuId: Number(menuId),
      addonCategoryId: Number(id),
    }));

    // console.log(data);
    await prisma.menuAddonCategories.createMany({
      data,
    });
  }

  redirect("/backoffice/addon-categories");  
}

// if (!isSame) {
//     console.log("not same");
//   }else{
//     console.log("same")
//   }
export async function DeleteAddonCategory(formData: FormData) {
  const id = Number(formData.get("DeleteID"));
  // return console.log(formData);
  await prisma.menuAddonCategories.deleteMany({
    where: {
      addonCategoryId: Number(id),
    },
  });
  await prisma.addonCategories.delete({
    where: {
      id: Number(id),
    },
  });
  redirect("/backoffice/addon-categories");
}
