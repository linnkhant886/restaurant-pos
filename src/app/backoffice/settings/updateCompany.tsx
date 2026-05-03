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
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
          style={{ backgroundColor: "var(--rf-cream-2)" }}
        >
          <Building2 className="w-6 h-6" style={{ color: "var(--rf-ink)" }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--rf-ink)" }}>
          Update Your Company Information
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleUpdateCompany(formData);
        }}
        className="rounded-2xl border p-8 shadow-sm"
        style={{
          backgroundColor: "var(--rf-paper)",
          borderColor: "var(--rf-line)",
        }}
      >
        <input type="hidden" name="id" defaultValue={company?.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              defaultValue={company?.name}
              name="name"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              Street Address
            </label>
            <input
              type="text"
              defaultValue={company?.streetAddress || ""}
              name="streetAddress"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
            />
          </div>

          <div>
             <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              City
            </label>
            <input
              type="text"
              defaultValue={company?.city || ""}
              name="city"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              State
            </label>
            <input
              type="text"
              defaultValue={company?.state || ""}
              name="state"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={company?.phoneNumber || ""}
              placeholder="+1 (555) 000-0000"
              name="phoneNumber"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: "var(--rf-ink)" }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={company?.email || ""}
              name="email"
              className="w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{ borderColor: "var(--rf-line-2)", backgroundColor: "white" }}
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

