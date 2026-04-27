import { CreateTable } from "../actions";
import { getSelectedLocation } from "@/lib/actions/action";
import React from "react";
import { SubmitButton } from "@/components/shared/SubmitButton";

export default async function Tables() {
  const locationIds = (await getSelectedLocation())?.locationId;

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add table</h1>

      <form action={CreateTable} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Table Name
          </label>
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <input type="hidden" name="locationId" value={locationIds} />
        
        <div className="pt-2">
           <SubmitButton text="Create" />
        </div>
      </form>
    </div>
  );
}

