import ItemCard from "@/components/menu/ItemCard";
import { Egg } from "lucide-react";
import Link from "next/link";
import { getCompanyAddon } from "@/lib/actions/action";

export default async function MenusPage() {
  const Addons = await getCompanyAddon()
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Addons</h1>
        <Link href="/backoffice/addons/new">
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow-sm hover:bg-blue-700 transition-colors">
            New Addon
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {Addons.map((addon) => (
          <ItemCard
            key={addon.id}
            icon={<Egg className="w-8 h-8 text-slate-700" />}
            title={addon.name}
            href={`/backoffice/addons/${addon.id}`}
            isAvailable
          />
        ))}
      </div>
    </div>
  );
}

