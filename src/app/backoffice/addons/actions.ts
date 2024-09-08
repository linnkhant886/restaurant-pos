"use server";

import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function CreateAddon(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") ;
  const isAvailable = formData.get("isAvailable") ? true : false;
  const addonCategoryId = formData.getAll("addonCategoryId")
  // return console.log(formData)
  const Addon = await prisma.addons.create({
    data: {
      name: name,
      price: Number(price),
      isAvailable,
      addonCategoryId: Number(addonCategoryId),
    },
  });

  
  redirect("/backoffice/addons");
}

export async function getAddon(id: number) {
  const addons = await prisma.addons.findFirst({
    where: { id },
  });

  return addons;
}

export async function UpdateAddon(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const price = formData.get("price") ;
  const isAvailable = formData.get("isAvailable") ? true : false;
  const addonCategoryId = formData.getAll("addonCategoryId")
  
  // return console.log(formData);
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

  redirect("/backoffice/addons");  
}

export async function DeleteAddon(formData: FormData) {
  const id = Number(formData.get("DeleteID"));
  // return console.log(formData);
  
  await prisma.addons.delete({
    where: {
      id: Number(id),
    },
  });
  redirect("/backoffice/addons");
}
