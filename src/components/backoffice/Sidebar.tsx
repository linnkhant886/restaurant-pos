"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  FolderOpen,
  Utensils,
  Boxes,
  Egg,
  Table,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const OPERATIONS = [
  { id: 1, label: "Orders", icon: ShoppingBag, route: "/backoffice/orders" },
];

const MANAGE = [
  { id: 2, label: "Menu Categories", icon: FolderOpen, route: "/backoffice/menus-categories" },
  { id: 3, label: "Menus", icon: Utensils, route: "/backoffice/menus" },
  { id: 4, label: "Addon Categories", icon: Boxes, route: "/backoffice/addon-categories" },
  { id: 5, label: "Addons", icon: Egg, route: "/backoffice/addons" },
  { id: 6, label: "Tables", icon: Table, route: "/backoffice/tables" },
  { id: 7, label: "Locations", icon: MapPin, route: "/backoffice/locations" },
  { id: 8, label: "Settings", icon: Settings, route: "/backoffice/settings" },
];

interface Props {
  userName: string;
  userImage: string;
  locationName: string;
}

function NavItem({ label, icon: Icon, route }: { label: string; icon: any; route: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === route ||
    (route !== "/backoffice/" && pathname.startsWith(route));

  return (
    <li>
      <Link
        href={route}
        className={cn(
          "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
          isActive
            ? "text-[#FFCA40]"
            : "text-white/55 hover:text-white/90 hover:bg-white/8"
        )}
        style={isActive ? { backgroundColor: "rgba(255,255,255,0.1)" } : undefined}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    </li>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="px-5 mb-1 mt-5 text-[10px] font-semibold uppercase tracking-widest"
      style={{ color: "rgba(255,255,255,0.28)" }}
    >
      {children}
    </p>
  );
}

export function Sidebar({ userName, userImage, locationName }: Props) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{ width: 230, backgroundColor: "var(--rf-ink)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: "var(--rf-yellow)", color: "var(--rf-ink)" }}
        >
          f
        </div>
        <span className="font-bold text-white text-base leading-none">
          Foodie <span className="font-normal opacity-60 text-sm">pos</span>
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        <SectionLabel>Operations</SectionLabel>
        <ul className="space-y-0.5">
          {OPERATIONS.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </ul>

        <SectionLabel>Manage</SectionLabel>
        <ul className="space-y-0.5">
          {MANAGE.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </ul>
      </div>

      {/* User card at bottom */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
          {userImage ? (
            <img src={userImage} alt={userName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--rf-yellow)", color: "var(--rf-ink)" }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {locationName}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
            title="Logout"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
