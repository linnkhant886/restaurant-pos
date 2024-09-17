"use client";

import { signOut } from "next-auth/react";

export default function Topbar() {
  return (
    <div>
      <h2 style={{ cursor: "pointer" }} onClick={() => signOut()}>
        Logout
      </h2>
    </div>
  );
}
