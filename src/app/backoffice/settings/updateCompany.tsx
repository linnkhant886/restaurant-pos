"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { Company } from "@prisma/client";
import { updateCompanyData } from "./actions";
import toast from "react-hot-toast";
import { SubmitButton } from "@/components/shared/SubmitButton";

interface Props {
  company: Company | null;
}

export default function UpdateCompany({ company }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpdateCompany = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await updateCompanyData(formData);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Company updated successfully!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Building2 className="w-8 h-8 mr-3 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-800">
          Update Your Company Information
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleUpdateCompany(formData);
        }}
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <input type="hidden" name="id" defaultValue={company?.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              defaultValue={company?.name}
              name="name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              defaultValue={company?.streetAddress || ""}
              name="streetAddress"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              defaultValue={company?.city || ""}
              name="city"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              defaultValue={company?.state || ""}
              name="state"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={company?.phoneNumber || ""}
              placeholder="+1 (555) 000-0000"
              name="phoneNumber"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={company?.email || ""}
              name="email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
             <SubmitButton text="Update Information" size="lg" loading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
}

