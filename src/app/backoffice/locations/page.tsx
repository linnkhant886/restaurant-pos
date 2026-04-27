import ItemCard from "@/components/menu/ItemCard";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { getLocation } from "@/lib/actions/action";

export default async function MenuCategoriesPage() {
  const locations = await getLocation();
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Locations</h1>
        <Link href="/backoffice/locations/new">
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow-sm hover:bg-blue-700 transition-colors">
            Add Locations
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            icon={<MapPin className="w-8 h-8 text-slate-700" />}
            title={location.name}
            href={`/backoffice/locations/${location.id}`}
            isAvailable
          />
        ))}
      </div>
    </div>
  );
}

