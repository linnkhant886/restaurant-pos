"use server";

import { prisma } from "@/lib/prisma";

export async function CreateAddon(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = formData.get("price");
    const isAvailable = formData.get("isAvailable") ? true : false;
    const addonCategoryId = formData.get("addonCategoryId");
    
    if (!name || !price || !addonCategoryId) return { error: "Missing required fields" };

    await prisma.addons.create({
      data: {
        name: name,
        price: Number(price),
        isAvailable,
        addonCategoryId: Number(addonCategoryId),
      },
    });
  } catch (err) {
    return { error: "Something went wrong" };
  }
}

export async function getAddon(id: number) {
  const addons = await prisma.addons.findFirst({
    where: { id },
  });

  return addons;
}

export async function UpdateAddon(formData: FormData) {
  try {
    const id = formData.get("id");
    const name = formData.get("name") as string;
    const price = formData.get("price");
    const isAvailable = formData.get("isAvailable") ? true : false;
    const addonCategoryId = formData.get("addonCategoryId");
    
    if (!name || !price || !addonCategoryId) return { error: "Missing required fields" };

    await prisma.addons.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        price: Number(price),
        isAvailable,
        addonCategoryId: Number(addonCategoryId),
      },
    });
  } catch (err) {
    return { error: "Something went wrong" };
  }
}

export async function DeleteAddon(formData: FormData) {
  try {
    const id = Number(formData.get("DeleteID"));
    
    await prisma.addons.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (err) {
    return { error: "Something went wrong" };
  }
}

