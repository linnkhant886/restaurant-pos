"use client";

import { useState } from "react";
import { CreateAddonCategory } from "./actions";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Menus } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menus: Menus[];
}

export function NewAddonCategoryModal({ isOpen, onClose, menus }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const fd = new FormData();
      fd.set("name", name);
      if (isRequired) fd.set("isRequired", "on");
      
      selectedMenus.forEach(id => fd.append("menus", String(id)));

      const res = await CreateAddonCategory(fd);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Category created!");
        setName("");
        setIsRequired(false);
        setSelectedMenus([]);
        onClose();
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const toggleMenu = (id: number) => {
    setSelectedMenus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(27,31,59,0.4)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="w-full max-w-md rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--rf-paper)" }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--rf-line)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--rf-ink)" }}>New Addon Category</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/5 transition-colors">
              <X className="h-5 w-5" style={{ color: "rgba(27,31,59,0.45)" }} />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col max-h-[80vh]">
            <div className="px-6 py-6 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  placeholder="e.g. Size, Toppings"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#1b1f3b]"
                  style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)", color: "var(--rf-ink)" }}
                />
              </div>

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

              <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ borderColor: "var(--rf-line)" }}>
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

            <div className="px-6 py-5 border-t" style={{ borderColor: "var(--rf-line)", backgroundColor: "rgba(0,0,0,0.02)" }}>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
