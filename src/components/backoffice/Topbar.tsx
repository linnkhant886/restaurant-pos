import { getLocation, getSelectedLocation } from "@/lib/actions/action";
import { LocationSwitcher } from "./LocationSwitcher";

export async function Topbar() {
  const locations = await getLocation();
  const selectedLocation = await getSelectedLocation();

  return (
    <header
      className="sticky top-0 z-50 h-16 px-5 flex items-center justify-end shadow-sm"
      style={{ backgroundColor: "var(--rf-yellow)", borderBottom: "1px solid var(--rf-yellow-2)" }}
    >
      <LocationSwitcher locations={locations} selectedLocationId={selectedLocation?.locationId} />
    </header>
  );
}
