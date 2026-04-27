import { CreateAddonCategory } from "../actions";
import { getCompanyMenu } from "@/lib/actions/action";
import { SubmitButton } from "@/components/shared/SubmitButton";

export default async function AddonCategories() {
  const menus = await getCompanyMenu();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Addon Categories</h1>

      <form action={CreateAddonCategory} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
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
            defaultChecked
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isRequired" className="ml-2 block text-sm font-medium text-slate-900">
            isRequired
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton text="Create" />
        </div>
      </form>
    </div>
  );
}

