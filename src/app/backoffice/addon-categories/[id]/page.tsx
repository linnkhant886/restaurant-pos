// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { DeleteAddonCategory, getAddonCategory, UpdateAddonCategory } from "../actions";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const AddonCategory = await getAddonCategory(Number(id));
  const select = AddonCategory?.menuAddonCategories.map((item) => item.menuId);
  const menus = await prisma.menus.findMany();
    
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-4 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/backoffice/addon-categories"
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h2 className="text-2xl font-bold" style={{ color: "var(--rf-ink)" }}>
          Update Addon Category
        </h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
        <form action={UpdateAddonCategory} className="flex flex-col">
          <div className="p-6 md:p-8 space-y-8">
            <input type="hidden" name="id" value={id} />

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Category Name"
                defaultValue={AddonCategory?.name}
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#1b1f3b]"
                style={{
                  borderColor: "var(--rf-line)",
                  backgroundColor: "var(--rf-cream)",
                  color: "var(--rf-ink)",
                }}
              />
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            {/* Menus */}
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: "var(--rf-ink)" }}>Menus</h3>
              <div className="flex flex-wrap gap-2 p-4 rounded-2xl border" style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)" }}>
                {menus.map((menu) => {
                  const isChecked = select?.includes(menu.id);
                  return (
                    <label key={menu.id} className="relative flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="menus"
                        value={menu.id}
                        defaultChecked={isChecked}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-2 rounded-xl text-sm font-medium transition-all border peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 border-slate-200 bg-white text-slate-600 group-hover:border-slate-400">
                        {menu.name}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Required */}
            <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: "var(--rf-line)" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--rf-ink)" }}>
                  Required
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
                  Customers must select an addon from this category
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isRequired"
                  defaultChecked={AddonCategory?.isRequired ? true : false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 md:px-8 py-5 border-t flex items-center justify-between gap-4" style={{ borderColor: "var(--rf-line)", backgroundColor: "rgba(0,0,0,0.02)" }}>
            <button
              formAction={DeleteAddonCategory}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}
            >
              Delete
            </button>
            <input type="hidden" defaultValue={AddonCategory?.id} name="DeleteID" />
            
            <button
              type="submit"
              className="flex-1 max-w-[200px] px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
