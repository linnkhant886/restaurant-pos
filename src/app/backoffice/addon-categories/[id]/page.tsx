import { prisma } from "@/lib/prisma";
import { DeleteAddonCategory, getAddonCategory, UpdateAddonCategory } from "../actions";
import { SubmitButton } from "@/components/shared/SubmitButton";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const AddonCategory = await getAddonCategory(Number(id));
  const select = AddonCategory?.menuAddonCategories.map((item) => item.menuId);
  const menus = await prisma.menus.findMany();
    
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-4">
      <div className="flex justify-end">
        <form action={DeleteAddonCategory}>
          <SubmitButton text="Delete" variant="destructive" />
          <input type="hidden" defaultValue={AddonCategory?.id} name="DeleteID" />
        </form>
      </div>

      <form action={UpdateAddonCategory} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Update Addon Category</h2>
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            defaultValue={AddonCategory?.name}
            name="name"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Menus</h3>
          <div className="flex flex-wrap gap-4 border border-slate-200 p-4 rounded-md bg-slate-50">
            {menus.map((menu) => (
              <label key={menu.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="menus"
                  value={menu.id}
                  defaultChecked={select?.includes(menu.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700">{menu.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRequired"
            name="isRequired"
            defaultChecked={AddonCategory?.isRequired ? true : false}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isRequired" className="ml-2 block text-sm font-medium text-slate-900">
            isRequired
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton text="Update" />
        </div>
      </form>
    </div>
  );
}
