"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-black/10"
      title="Logout"
      style={{ color: "var(--rf-ink)" }}
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
