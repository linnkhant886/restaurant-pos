import ItemCard from "@/components/menu/ItemCard";
import Link from "next/link";
import { TableProperties } from "lucide-react";
import { getSelectedLocationTables } from "@/lib/actions/action";

export default async function MenusPage() {
  const tables = await getSelectedLocationTables();
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tables</h1>
        <Link href="/backoffice/tables/new">
          <button className="bg-[#FFCA40] text-slate-900 font-semibold px-4 py-2 rounded shadow-sm hover:bg-[#e6b639] transition-colors">
            Add tables
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {tables.map((table) => (
          <ItemCard
            key={table.id}
            icon={<TableProperties className="w-8 h-8 text-slate-700" />}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
            isAvailable
          />
        ))}
      </div>
    </div>
  );
}

