"use client";

import { useState, useEffect } from "react";
import { UpdateAddon, DeleteAddon } from "./actions";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Addons, AddonCategories } from "@prisma/client";

interface Props {
  addon: Addons | null;
  onClose: () => void;
  categories: AddonCategories[];
}

export function EditAddonPanel({ addon, onClose, categories }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (addon) {
      setName(addon.name);
      setPrice(addon.price ? String(addon.price) : "");
      setIsAvailable(addon.isAvailable ?? true);
      setSelectedCategory(addon.addonCategoryId);
    }
  }, [addon?.id]);

  const isOpen = !!addon;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addon) return;
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("id", String(addon.id));
      fd.set("name", name);
      fd.set("price", price);
      if (isAvailable) fd.set("isAvailable", "on");
      fd.set("addonCategoryId", String(selectedCategory));

      const res = await UpdateAddon(fd);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Addon updated!");
        onClose();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!addon) return;
    if (!confirm("Are you sure you want to delete this addon?")) return;
    
    setDeleting(true);
    const fd = new FormData();
    fd.set("DeleteID", String(addon.id));
    try {
      const res = await DeleteAddon(fd);
      if (res?.error) {
        toast.error(res.error);
        setDeleting(false);
      } else {
        toast.success("Addon deleted.");
        onClose();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(27,31,59,0.25)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: 420,
          backgroundColor: "var(--rf-paper)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--rf-line)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(27,31,59,0.4)" }}>
            Edit Addon
          </p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/6 transition-colors">
            <X className="h-4 w-4" style={{ color: "rgba(27,31,59,0.45)" }} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-y-auto pb-6">
          <div className="px-6 py-5 space-y-6 flex-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Addon Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-transparent transition-all focus:border-[#1b1f3b]"
                  style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Price ($)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required 
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-transparent transition-all focus:border-[#1b1f3b]"
                  style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
                />
              </div>
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "var(--rf-ink)" }}>Addon Category</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl border" style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)" }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedCategory === cat.id 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 shadow-sm"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                {categories.length === 0 && <p className="text-xs text-slate-400 p-2">No categories available.</p>}
              </div>
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--rf-ink)" }}>Available</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>Show on POS</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                style={{ backgroundColor: isAvailable ? "var(--rf-ink)" : "var(--rf-line-2)" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 shadow-sm" style={{ backgroundColor: isAvailable ? "var(--rf-yellow)" : "white", left: isAvailable ? "calc(100% - 1.375rem)" : "0.125rem" }} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: "var(--rf-line)" }}>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
