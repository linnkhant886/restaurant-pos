"use client";

import { CreateMenu } from "../actions";
import { AddonCategories, MenuCategories } from "@prisma/client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import React from "react";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface Props {
  menuCategories: MenuCategories[];
  addOnCategories: AddonCategories[];
}
export default function NewFormData({ menuCategories ,addOnCategories}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateMenuClientUpload = async (formData: FormData) => {
    try {
      setLoading(true);
      const file = formData.get("file") as File;
      if (file.size) {
        const { url } = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        formData.set("imageUrl", url);
      }
      const response = await CreateMenu(formData);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Success");
        router.push("/backoffice/menus");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl border border-slate-100 shadow-sm mt-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">New Menu</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleCreateMenuClientUpload(formData);
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price
            </label>
            <input 
               type="text" 
               name="price" 
               placeholder="Price" 
               className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>

        <div>
           <h3 className="text-lg font-medium text-slate-800 mb-2">Menu Category</h3>
           <div className="flex flex-wrap gap-4 border border-slate-200 p-4 rounded-md bg-slate-50">
             {menuCategories.map((menuCategory) => (
                <label key={menuCategory.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="menuCategoryIds"
                    value={menuCategory.id}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{menuCategory.name}</span>
                </label>
             ))}
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">
             Image Upload
           </label>
           <input 
             type="file" 
             name="file" 
             className="w-full px-3 py-2 border border-slate-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
           />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            defaultChecked
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm font-medium text-slate-900">
            Available
          </label>
        </div>

        <div className="pt-2">
          <SubmitButton text="Create" loading={loading} />
        </div>
      </form>
    </div>
  );
}

