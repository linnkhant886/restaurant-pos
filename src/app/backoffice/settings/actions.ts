"use server";

import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateCompanyDataValidator = z.object({
  id: z.number(),
  name: z
    .string()
    .min(5, { message: "Company name must be at least 5 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .number({ message: "Phone number must be a number" })
    .min(8, { message: "Phone number must be at least 8 characters long" }),

  streetAddress: z
    .string()
    .min(5, { message: "Street address must be at least 5 characters long" }),
  city: z
    .string()
    .min(3, { message: "City must be at least 3 characters long" }),
  state: z
    .string()
    .min(3, { message: "State must be at least 3 characters long" }),
});

export async function updateCompanyData(formData: FormData) {
  // return console.log(formData);
  try {
    const { id, name, email, phoneNumber, streetAddress, city, state } =
      updateCompanyDataValidator.parse({
        id: Number(formData.get("id")),
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phoneNumber: Number(formData.get("phoneNumber")),
        streetAddress: formData.get("streetAddress") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
      });

    await prisma.company.update({
      where: {
        id,
      },
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        streetAddress: streetAddress,
        city: city,
        state: state,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((item) => item.message);
      console.log("errorMessages", errorMessages);
      return { error: errorMessages };
    }
    return { error: "Something went wrong , please contact support" };
  }

  revalidatePath("/backoffice/settings");
}
