import { getLocation, getSelectedLocation } from "@/lib/actions/action";
import { Bell, Utensils, MapPin } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { getServerSession } from "next-auth";

export async function Topbar() {
  const session = await getServerSession();
  const userImage = session?.user?.image || "/placeholder.svg?height=40&width=40";
  const location = await getLocation();
  const selectedLocation = await getSelectedLocation();
  const selected = location.find((item) => item.id === selectedLocation?.locationId);

  return (
    <header
      className="sticky top-0 z-50 h-16 px-5 flex items-center justify-between shadow-sm"
      style={{ backgroundColor: "var(--rf-yellow)", borderBottom: "1px solid var(--rf-yellow-2)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Utensils className="h-5 w-5" style={{ color: "var(--rf-ink)" }} />
        <span className="text-lg font-bold hidden sm:block" style={{ color: "var(--rf-ink)" }}>
          Foodie POS
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#dc2626" }}>
        <MapPin className="h-4 w-4" />
        <span>{selected?.name || "No Location"}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-black/10"
          title="Notifications"
        >
          <Bell className="h-5 w-5" style={{ color: "var(--rf-ink)" }} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2"
            style={{
              backgroundColor: "var(--rf-red)",
              borderColor: "var(--rf-yellow)",
            }}
          />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 ml-1" style={{ borderColor: "var(--rf-ink)" }}>
          <img src={userImage} alt="avatar" className="w-full h-full object-cover" />
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
