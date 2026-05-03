"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Check, Plus, Loader2, X } from "lucide-react";
import { Locations } from "@prisma/client";
import { updateSelectedLocation, createLocation } from "@/app/backoffice/locations/actions";
import toast from "react-hot-toast";

interface Props {
  locations: Locations[];
  selectedLocationId?: number;
}

export function LocationSwitcher({ locations, selectedLocationId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (id: number) => {
    setIsOpen(false);
    if (id === selectedLocationId) return;
    
    try {
      await updateSelectedLocation(id);
      router.refresh();
      toast.success("Location updated");
    } catch {
      toast.error("Failed to update location");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", newLocationName);
      
      const res = await createLocation(fd);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Location created");
        setNewLocationName("");
        setIsPanelOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors hover:bg-black/5 active:bg-black/10"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.5)", color: "var(--rf-ink)" }}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start min-w-[120px]">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--rf-ink)", opacity: 0.5 }}>
              Location
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold" style={{ color: "var(--rf-ink)" }}>
                {selectedLocation?.name || "Select a location"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-1" style={{ color: "var(--rf-ink)", opacity: 0.5 }} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-64 right-0 rounded-2xl shadow-xl overflow-hidden z-50 border" style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}>
            <div className="py-2 max-h-[300px] overflow-y-auto">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-black/5"
                  style={{ color: "var(--rf-ink)" }}
                >
                  <span className={loc.id === selectedLocationId ? "font-semibold" : "font-medium"}>
                    {loc.name}
                  </span>
                  {loc.id === selectedLocationId && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
            <div className="border-t p-2" style={{ borderColor: "var(--rf-line)" }}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsPanelOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-black/5"
                style={{ color: "var(--rf-ink)" }}
              >
                <Plus className="w-4 h-4" />
                Add new location
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over panel for new location */}
      <div
        className="fixed inset-0 z-[100] transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(27,31,59,0.25)",
          opacity: isPanelOpen ? 1 : 0,
          pointerEvents: isPanelOpen ? "auto" : "none",
        }}
        onClick={() => setIsPanelOpen(false)}
      />

      <div
        className="fixed top-0 right-0 h-full z-[110] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: 420,
          backgroundColor: "var(--rf-paper)",
          transform: isPanelOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--rf-line)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(27,31,59,0.4)" }}>
            New Location
          </p>
          <button onClick={() => setIsPanelOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/6 transition-colors">
            <X className="h-4 w-4" style={{ color: "rgba(27,31,59,0.45)" }} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col flex-1 pb-6">
          <div className="px-6 py-6 space-y-6 flex-1">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>Location Name</label>
              <input 
                type="text" 
                value={newLocationName} 
                onChange={e => setNewLocationName(e.target.value)} 
                required 
                placeholder="e.g. Downtown Branch"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-[#1b1f3b]"
                style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)", color: "var(--rf-ink)" }}
              />
            </div>
          </div>

          <div className="px-6 py-5 border-t" style={{ borderColor: "var(--rf-line)" }}>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--rf-ink)", color: "var(--rf-yellow)" }}
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Location"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
