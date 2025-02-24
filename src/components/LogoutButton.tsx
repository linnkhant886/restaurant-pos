"use client";

import { IconButton } from "@mui/material";
import { signOut } from "next-auth/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function Topbar() {
  return (
    <div>
      <IconButton onClick={() => signOut()} size="large" color="inherit" sx={{ ml: 1 }}>
        <ExitToAppIcon />
      </IconButton>
    </div>
  );
}
