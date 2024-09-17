"use server";

import { getLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function CreateTable(formData: FormData) {
  const name = formData.get("name") as string;
  const locationId = formData.get("locationId") as string;
  // return console.log(formData)
  await prisma.tables.create({
    data: {
      name,
      locationId: Number(locationId),
    },
  })
  redirect("/backoffice/tables");
}



export async function UpdateTable(formData: FormData) {

  
  const name  = formData.get("name") as string;
  const tableId  = formData.get("id") ;
  // return console.log(formData)
  await prisma.tables.update({
    data: {
      name,
    },
    where: {
      id: Number(tableId),
    },
  })

  redirect("/backoffice/tables");  
}


export async function DeleteTable(formData: FormData) {
  const id = Number(formData.get("DeleteID"));
  await prisma.tables.delete({
    where: {
      id: Number(id),
    },
  })
 
  redirect("/backoffice/tables");
}
