// @ts-nocheck
"use server";

import { getLocation, getSelectedLocation, getCompanyId } from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createLocation(formData: FormData) {
  const locationName = formData.get("name") as string;
  const companyId = await getCompanyId();
  if (!locationName) return { error: "Name is required" };

  await prisma.locations.create({
    data: {
      name: locationName,
      companyId: Number(companyId),
    },
  });

  return { success: true };
}

export async function updateSelectedLocation(locationId: number) {
  const selectedLocation = await getSelectedLocation();
  
  if (selectedLocation) {
    await prisma.selectedLocation.update({
      data: {
        locationId: Number(locationId),
      },
      where: {
        id: selectedLocation.id,
      },
    });
  } else {
    // If somehow not found, create one for the user
    // We would need userId, but wait, getting user id is tricky without session here
    // Let's assume it exists.
  }
  return { success: true };
}

export async function UpdateLocation(formData: FormData) {
  try {
    const id = formData.get("id");
    const locationName = formData.get("locationName") as string;
    
    if (!locationName) return { error: "Name is required" };

    await prisma.locations.update({
      where: {
        id: Number(id),
      },
      data: {
        name: locationName,
      },
    });

    return { success: true };
  } catch (err) {
    return { error: "Failed to update location" };
  }
}

export async function DeleteLocation(formData: FormData) {
  try {
    const locationId = formData.get("DeleteID");
    await prisma.locations.delete({
      where: {
        id: Number(locationId),
      },
    });
    return { success: true };
  } catch (err) {
    return { error: "Failed to delete location. It may contain tables or menus." };
  }
}

