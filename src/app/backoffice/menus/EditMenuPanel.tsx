"use client";

import { useState, useEffect } from "react";
import { UpdateMenu, DeleteMenu } from "./actions";
import toast from "react-hot-toast";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import { upload } from "@vercel/blob/client";

interface MenuWithRelations extends Menus {
  menuCategoriesMenus: { menuCategoryId: number }[];
  menuAddonCategories: { addonCategoryId: number }[];
  isAvailable: boolean;
}

interface Props {
  menu: MenuWithRelations | null;
  onClose: () => void;
  menuCategories: MenuCategories[];
  addonCategories: AddonCategories[];
}

export function EditMenuPanel({ menu, onClose, menuCategories, addonCategories }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Sync state when menu changes
  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setPrice(String(menu.price || "0"));
      setAvailable(menu.isAvailable);
      setSelectedCategories(menu.menuCategoriesMenus.map(m => m.menuCategoryId));
      setSelectedAddons(menu.menuAddonCategories.map(m => m.addonCategoryId));
      setFile(null);
    }
  }, [menu?.id]);

  const isOpen = !!menu;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu) return;
    setSaving(true);
    
    try {
      const fd = new FormData();
      fd.set("id", String(menu.id));
      fd.set("name", name);
      fd.set("price", price);
      if (available) fd.set("isAvailable", "on");
      
      selectedCategories.forEach(id => fd.append("menuCategories", String(id)));
      selectedAddons.forEach(id => fd.append("addonCategories", String(id)));

      if (file) {
        const { url } = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        fd.set("imageUrl", url);
      } else {
        fd.set("imageUrl", menu.imageUrl || "");
      }

      const res = await UpdateMenu(fd);
      if (res?.error) {
        const msg = Array.isArray(res.error) ? res.error[0] : res.error;
        toast.error(msg);
      } else {
        toast.success("Menu updated!");
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
    if (!menu) return;
    if (!confirm("Are you sure you want to delete this menu?")) return;
    
    setDeleting(true);
    const fd = new FormData();
    fd.set("id", String(menu.id));
    try {
      const res = await DeleteMenu(fd);
      if (res?.error) {
        toast.error(res.error);
        setDeleting(false);
      } else {
        toast.success("Menu deleted.");
        onClose();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
      setDeleting(false);
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAddon = (id: number) => {
    setSelectedAddons(prev => 
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
            Edit Menu Item
          </p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/6 transition-colors">
            <X className="h-4 w-4" style={{ color: "rgba(27,31,59,0.45)" }} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-y-auto pb-6">
          <div className="px-6 py-5 space-y-6 flex-1">
            {/* Image Preview & Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: "var(--rf-ink)" }}>Image</label>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-dashed flex items-center justify-center group" style={{ borderColor: "var(--rf-line)" }}>
                {(file || menu?.imageUrl) ? (
                  <img 
                    src={file ? URL.createObjectURL(file) : menu?.imageUrl || ""} 
                    className="w-full h-full object-cover" 
                    alt="Menu"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-transparent"
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
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none bg-transparent"
                  style={{ borderColor: "var(--rf-line)", color: "var(--rf-ink)" }}
                />
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border" style={{ borderColor: "var(--rf-line)" }}>
                  <span className="text-xs font-semibold" style={{ color: "var(--rf-ink)" }}>Visible</span>
                  <button
                    type="button"
                    onClick={() => setAvailable(!available)}
                    className="relative w-10 h-5 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: available ? "var(--rf-ink)" : "var(--rf-line-2)" }}
                  >
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200" style={{ backgroundColor: available ? "var(--rf-yellow)" : "white", left: available ? "calc(100% - 1.125rem)" : "0.125rem" }} />
                  </button>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "var(--rf-line)" }} />

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "var(--rf-ink)" }}>Categories</label>
              <div className="flex flex-wrap gap-2">
                {menuCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedCategories.includes(cat.id) 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "var(--rf-ink)" }}>Addon Categories</label>
              <div className="flex flex-wrap gap-2">
                {addonCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleAddon(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedAddons.includes(cat.id) 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
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
