// @ts-nocheck
import { DeleteLocation, UpdateLocation } from "../actions";
import { getLocation, getSelectedLocation } from "@/lib/actions/action";
import { SubmitButton } from "@/components/shared/SubmitButton";

export interface prop {
  params: { id: string };
}
export default async function UpdateMenuCategory({ params }: prop) {
  const { id } = params;
  const location =
    (await getLocation())
      .map((item) => item)
      .find((item) => item.id == Number(id)) || null;

  const selectedLocation = await getSelectedLocation();
  const isSelected = selectedLocation?.locationId === Number(id);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-4">
      <div className="flex justify-end">
        <form action={DeleteLocation}>
          <SubmitButton text="Delete" variant="destructive" />
          <input type="hidden" defaultValue={location?.id} name="DeleteID" />
        </form>
      </div>

      <form action={UpdateLocation} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Update Location
        </h2>
        <input type="hidden" defaultValue={id} name="id" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location Name
          </label>
          <input
            type="text"
            defaultValue={location?.name}
            name="locationName"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isSelected"
            name="isSelected"
            defaultValue={String(isSelected ? true : false)}
            defaultChecked={isSelected}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isSelected" className="ml-2 block text-sm text-slate-900">
            Selected location
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton text="Update" />
        </div>
      </form>
    </div>
  );
}
