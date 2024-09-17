"use server";

import { getLocation, getSelectedLocation } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { redirect } from "next/navigation";

export async function createLocation(formData: FormData) {
  const selectedLocation = await getSelectedLocation();
  const locationName = formData.get("createLocation") as string;
  const companyId = formData.get("companyId");
  // return console.log(formData)
  const location = await prisma.locations.create({
    data: {
      name: locationName,
      companyId: Number(companyId),
    },
  });

  // await prisma.selectedLocation.create({
  //   data: {
  //     userId: selectedLocation?.userId as number,
  //     locationId: location.id,
  //   },
  // });
  redirect("/backoffice/locations");
}

export async function UpdateLocation(formData: FormData) {
  //   return console.log(formData);
  const selectedLocation = await getSelectedLocation();
  const id = formData.get("id");
  const locationName = formData.get("locationName") as string;
  const isSelected = formData.get("isSelected") ? true : false;
  const companyLocation = await getLocation();

  // return console.log(formData, isSelected);
  await prisma.locations.update({
    where: {
      id: Number(id),
    },
    data: {
      name: locationName,
    },
  });

  if (isSelected) {
    await prisma.selectedLocation.update({
      data: {
        userId: selectedLocation?.userId,
        locationId: Number(id),
      },
      where: {
        id: selectedLocation?.id,
      },
    });
  } else {
    console.log("not selected");
    await prisma.selectedLocation.update({
      data: {
        userId: selectedLocation?.userId,
        locationId: companyLocation[0].id,
      },
      where: {
        id: selectedLocation?.id,
      },
    });
  }

  redirect("/backoffice/locations");
}

export async function DeleteLocation(formData: FormData) {
  //   return console.log(formData)
  const locationId = formData.get("DeleteID");
  await prisma.locations.delete({
    where: {
      id: Number(locationId),
    },
  });
  redirect("/backoffice/locations");
}
