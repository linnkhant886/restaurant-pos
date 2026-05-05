// @ts-nocheck
import { createLocation } from "../actions";
import { getCompanyId } from "@/lib/actions/action";
import { SubmitButton } from "@/components/shared/SubmitButton";

export default async function NewMenuPage() {
  const companyId = await getCompanyId();
  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">New Location</h1>
      
      <form action={createLocation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location Name
          </label>
          <input 
            type="text" 
            placeholder="Name" 
            name="createLocation" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <input type="hidden" name="companyId" value={companyId} />

        <div className="pt-2">
          <SubmitButton text="Create" />
        </div>
      </form>
    </div>
  );
}

