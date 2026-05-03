import { prisma } from "@/lib/prisma";
import { AddonsClient } from "./AddonsClient";
import { getCompanyId } from "@/lib/actions/action";

export default async function AddonsPage() {
  const companyId = await getCompanyId();
  
  const { getCompanyAddon, getCompanyAddonCategories } = await import("@/lib/actions/action");
  const companyAddons = await getCompanyAddon();
  const categories = await getCompanyAddonCategories();

  return (
    <AddonsClient 
      addons={companyAddons} 
      categories={categories} 
    />
  );
}

