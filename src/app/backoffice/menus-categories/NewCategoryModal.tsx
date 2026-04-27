"use client";

import { useState } from "react";
import { CreateMenuCategory } from "./actions";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewCategoryModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await CreateMenuCategory(data);
      if (res?.error) {
        const msg = Array.isArray(res.error) ? res.error[0] : res.error;
        toast.error(msg);
        setLoading(false);
      } else {
        toast.success("Category created!");
        setLoading(false);
        onClose();         
        router.refresh();  
      }
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(27,31,59,0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{ backgroundColor: "var(--rf-paper)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--rf-ink)" }}>
              New category
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(27,31,59,0.5)" }}>
              Add a new menu category to your POS.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: "rgba(27,31,59,0.45)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>
              Name
            </label>
            <input
              type="text"
              name="createMenuCategory"
              placeholder="e.g. Brunch specials"
              required
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

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>
              Description <span style={{ color: "rgba(27,31,59,0.4)" }}>(optional)</span>
            </label>
            <input
              type="text"
              name="description"
              placeholder="Short description"
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

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-black/5"
              style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
