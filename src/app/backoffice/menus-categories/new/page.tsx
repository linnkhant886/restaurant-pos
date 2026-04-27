"use client";

import { CreateMenuCategory } from "../actions";
import toast from "react-hot-toast";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewMenuPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const response = await CreateMenuCategory(data);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Menu category created!");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Back link */}
      <Link
        href="/backoffice/menus-categories"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "rgba(27,31,59,0.55)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}
      >
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--rf-ink)" }}>
          New Menu Category
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--rf-ink)" }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Appetizers"
              name="createMenuCategory"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{
                borderColor: "var(--rf-line)",
                backgroundColor: "var(--rf-cream)",
                color: "var(--rf-ink)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--rf-ink)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--rf-line)")}
            />
          </div>

          <SubmitButton text="Create category" loading={loading} />
        </form>
      </div>
    </div>
  );
}
