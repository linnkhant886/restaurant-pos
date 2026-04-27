import { ReactNode } from "react";
import { Sidebar } from "@/components/backoffice/Sidebar";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { getLocation, getSelectedLocation } from "@/lib/actions/action";

interface Props {
  children: ReactNode;
}

export default async function BackofficeLayout({ children }: Props) {
  const session = await getServerSession();
  const locations = await getLocation();
  const selectedLocation = await getSelectedLocation();
  const selectedLocationName =
    locations.find((l) => l.id === selectedLocation?.locationId)?.name ?? "No location";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--rf-cream)" }}>
      <Sidebar
        userName={session?.user?.name ?? "User"}
        userImage={session?.user?.image ?? ""}
        locationName={selectedLocationName}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      <Toaster position="top-right" />
    </div>
  );
}
