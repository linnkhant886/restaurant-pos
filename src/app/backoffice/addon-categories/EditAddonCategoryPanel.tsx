// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { UpdateAddonCategory, DeleteAddonCategory } from "./actions";
import toast from "react-hot-toast";
import { Loader2, X, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddonCategories, Menus } from "@prisma/client";

interface AddonCategoryWithRelations extends AddonCategories {
  menuAddonCategories: { menuId: number }[];
}

interface Props {
  category: AddonCategoryWithRelations | null;
  onClose: () => void;
  menus: Menus[];
}

export function EditAddonCategoryPanel({ category, onClose, menus }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync state when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsRequired(category.isRequired);
      setSelectedMenus(category.menuAddonCategories.map(m => m.menuId));
    }
  }, [category?.id]);

  const isOpen = !!category;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    
    try {
      const fd = new FormData();
      fd.set("id", String(category.id));
      fd.set("name", name);
      if (isRequired) fd.set("isRequired", "on");
      
      selectedMenus.forEach(id => fd.append("menus", String(id)));

      const res = await UpdateAddonCategory(fd);
      if (res?.error) {
        const msg = Array.isArray(res.error) ? res.error[0] : res.error;
        toast.error(msg);
      } else {
        toast.success("Category updated!");
        onClose();
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setDeleting(true);
    const fd = new FormData();
    fd.set("DeleteID", String(category.id));
    try {
      const res = await DeleteAddonCategory(fd);
      if (res?.error) {
        toast.error(res.error);
        setDeleting(false);
      } else {
        toast.success("Category deleted.");
        onClose();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
      setDeleting(false);
    }
  };

  const toggleMenu = (id: number) => {
    setSelectedMenus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
            Edit Addon Category
          </p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/6 transition-colors">
            <X className="h-4 w-4" style={{ color: "rgba(27,31,59,0.45)" }} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-y-auto pb-6">
          <div className="px-6 py-5 space-y-6 flex-1">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-transparent transition-all focus:border-[#1b1f3b]"
                style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
              />
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            {/* Menus */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "var(--rf-ink)" }}>Menus</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl border" style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)" }}>
                {menus.map(menu => (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => toggleMenu(menu.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedMenus.includes(menu.id) 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 shadow-sm"
                    }`}
                  >
                    {menu.name}
                  </button>
                ))}
                {menus.length === 0 && <p className="text-xs text-slate-400 p-2">No menus available.</p>}
              </div>
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            {/* Required */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--rf-ink)" }}>Required</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>Must select an addon</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRequired(!isRequired)}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0"
                style={{ backgroundColor: isRequired ? "var(--rf-ink)" : "var(--rf-line-2)" }}
              >
                <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 shadow-sm" style={{ backgroundColor: isRequired ? "var(--rf-yellow)" : "white", left: isRequired ? "calc(100% - 1.375rem)" : "0.125rem" }} />
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
