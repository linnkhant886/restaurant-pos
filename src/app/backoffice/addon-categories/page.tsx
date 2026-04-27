import ItemCard from "@/components/menu/ItemCard";
import { FolderPlus } from "lucide-react";
import Link from "next/link";
import { getCompanyAddonCategories } from "@/lib/actions/action";

export default async function MenusPage() {
  const AddonCategories = await getCompanyAddonCategories();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Addon Categories</h1>
        <Link href="/backoffice/addon-categories/new">
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow-sm hover:bg-blue-700 transition-colors">
            New AddonCategory
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {AddonCategories.map((addonCategory) => (
          <ItemCard
            key={addonCategory.id}
            icon={<FolderPlus className="w-8 h-8 text-slate-700" />}
            title={addonCategory.name}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
            isAvailable
          />
        ))}
      </div>
    </div>
  );
}

