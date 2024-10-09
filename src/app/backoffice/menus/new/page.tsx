

import { CreateMenu } from "../actions";
import { prisma } from "@/libs/prisma";
import { getCompanyAddonCategories, getCompanyId } from "@/libs/action";
import NewFormData from "./newFormData";

export default async function NewMenuPage() {
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: await getCompanyId() },
  });

  const addOnCategories = await getCompanyAddonCategories();
  // console.log(menuCategories);
  console.log(addOnCategories);

  return <NewFormData menuCategories={menuCategories} addOnCategories={addOnCategories}/>
}
