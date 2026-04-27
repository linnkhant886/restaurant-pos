import { prisma } from "@/lib/prisma";
import { DeleteAddon, getAddon, UpdateAddon } from "../actions";
import { SubmitButton } from "@/components/shared/SubmitButton";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const addons = await getAddon(Number(id));
  const select = addons?.addonCategoryId
  const addonCategories = await prisma.addonCategories.findMany();
    
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-4">
      <div className="flex justify-end">
        <form action={DeleteAddon}>
          <SubmitButton text="Delete" variant="destructive" />
          <input type="hidden" defaultValue={addons?.id} name="DeleteID" />
        </form>
      </div>

      <form action={UpdateAddon} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Update Addon</h2>
        <input type="hidden" name="id" value={id} />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Addon Name
            </label>
            <input
              type="text"
              placeholder="Name"
              defaultValue={addons?.name}
              name="name"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">
               Price
             </label>
             <input
               type="text"
               placeholder="Price"
               defaultValue={addons?.price ?? ""}
               name="price"
               className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Addon Categories</h3>
          <div className="flex flex-wrap gap-4 border border-slate-200 p-4 rounded-md bg-slate-50">
            {addonCategories.map((addonCategory) => (
              <label key={addonCategory.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="addonCategoryId"
                  value={addonCategory.id}
                  defaultChecked={select === addonCategory.id}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700">{addonCategory.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            defaultChecked={addons?.isAvailable ? true : false}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm font-medium text-slate-900">
            isAvailable
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton text="Update" />
        </div>
      </form>
    </div>
  );
}
