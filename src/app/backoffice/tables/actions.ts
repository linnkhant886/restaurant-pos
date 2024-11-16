"use server";
import QrCode from "qrcode";
import { put } from "@vercel/blob";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";
import { config } from "@/config";
import { Tables } from "@prisma/client";

export async function CreateTable(formData: FormData) {
  const name = formData.get("name") as string;
  const locationId = formData.get("locationId") as string;
  const table = await prisma.tables.create({
    data: {
      name,
      locationId: Number(locationId),
      qrCodeImageUrl: "",
    },
  });

  await prisma.tables.update({
    where: {
      id: table.id,
    },
    data: {
      ...table,
      qrCodeImageUrl: await qrCodeImageUrl(table),
    },
  });
  redirect("/backoffice/tables");
}

export async function UpdateTable(formData: FormData) {
  const name = formData.get("name") as string;
  const tableId = formData.get("id");
  await prisma.tables.update({
    data: {
      name,
    },
    where: {
      id: Number(tableId),
    },
  });

  redirect("/backoffice/tables");
}

export async function DeleteTable(formData: FormData) {
  const id = Number(formData.get("DeleteID"));
  await prisma.tables.delete({
    where: {
      id: Number(id),
    },
  });

  redirect("/backoffice/tables");
}

export async function qrCodeImageUrl(table: Tables) {
  const orderAppUrl = `${config.orderAppUrl}?tableId=${table.id}`;
  const qrCodeImage = await QrCode.toBuffer(orderAppUrl, { scale: 8 });

  const { url } = await put(`foodie-pos/table-${table.id}.png`, qrCodeImage, {
    access: "public",
  });
  return url;
}
