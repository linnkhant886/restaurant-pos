

import { CreateMenu } from "../actions";
import { prisma } from "@/lib/prisma";
import { getCompanyAddonCategories, getCompanyId } from "@/lib/actions/action";
import NewFormData from "./newFormData";

export default async function NewMenuPage() {
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: await getCompanyId() },
  });

  const addOnCategories = await getCompanyAddonCategories();
  

  return <NewFormData menuCategories={menuCategories} addOnCategories={addOnCategories}/>
}

