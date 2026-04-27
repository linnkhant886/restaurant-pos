"use client";

import { UpdateMenu, DeleteMenu } from "../actions";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import React from "react";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface Props {
  id: string;
  menuCategories: MenuCategories[];
  selected: number[] | undefined;
  isAvailable: boolean;
  menu: Menus | null;
  selectedAddon: number[] ;
  addOncategories: AddonCategories[];
}
export default function UpdateMenuFormData({
  id,
  menuCategories,
  selected,
  isAvailable,
  menu,
  selectedAddon,
  addOncategories,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdateMenu = async (formData: FormData) => {
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
      const response = await UpdateMenu(formData);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Update Success");
        router.push("/backoffice/menus");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-4">
      <div className="flex justify-end">
        <form action={DeleteMenu}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton text="Delete" variant="destructive" />
        </form>
      </div>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleUpdateMenu(formData);
        }}
        className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-800">Update Menu</h2>
        <input type="hidden" name="id" value={id} />
        
        <div className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">
               Name
             </label>
             <input 
               type="text" 
               name="name" 
               placeholder="Name" 
               defaultValue={menu?.name}
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
               defaultValue={menu?.price ?? ""}
               className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>

        {menu?.imageUrl && (
          <div className="w-full max-w-xs rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <img
              alt="Menu image"
              src={menu.imageUrl}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">
             Update Image
           </label>
           <input 
             type="file" 
             name="file" 
             className="w-full px-3 py-2 border border-slate-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
           />
        </div>

        <div>
           <h3 className="text-lg font-medium text-slate-800 mb-2">Menu Category</h3>
           <div className="flex flex-wrap gap-4 border border-slate-200 p-4 rounded-md bg-slate-50">
             {menuCategories.map((menuCategory) => (
                <label key={menuCategory.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selected?.includes(menuCategory.id)}
                    name="menuCategories"
                    value={menuCategory.id}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{menuCategory.name}</span>
                </label>
             ))}
           </div>
        </div>
        
        <div>
           <h3 className="text-lg font-medium text-slate-800 mb-2">Addon Category</h3>
           <div className="flex flex-wrap gap-4 border border-slate-200 p-4 rounded-md bg-slate-50">
             {addOncategories.map((addonCategory) => (
                <label key={addonCategory.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedAddon?.includes(addonCategory.id)}
                    name="addonCategories"
                    value={addonCategory.id}
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
            defaultChecked={isAvailable}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm font-medium text-slate-900">
            Available
          </label>
        </div>
        
        <div className="pt-2">
          <SubmitButton text="Update" loading={loading} />
        </div>
      </form>
    </div>
  );
}
