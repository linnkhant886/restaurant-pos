"use client";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/backoffice/",
  },
  {
    id: 2,
    label: "Menu Categories",
    icon: <CategoryIcon />,
    route: "/backoffice/menus-categories",
  },
  {
    id: 3,
    label: "Menus",
    icon: <LocalDiningIcon />,
    route: "/backoffice/menus",
  },
  {
    id: 4,
    label: "Addon Categories",
    icon: <ClassIcon />,
    route: "/backoffice/addon-categories",
  },
  {
    id: 5,
    label: "Addons",
    icon: <EggIcon />,
    route: "/backoffice/addons",
  },
  {
    id: 6,
    label: "Tables",
    icon: <TableBarIcon />,
    route: "/backoffice/tables",
  },
  {
    id: 7,
    label: "Locations",
    icon: <LocationOnIcon />,
    route: "/backoffice/locations",
  },
  {
    id: 8,
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/backoffice/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Box
      sx={{
        height: "100vh",
        width: 280,
        backgroundColor: "#F8F8F7",
        borderRight: "1px solid #DDE6ED",
        px: 1,
      }}
    >
      <List sx={{ mt: 1 }}>
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.route || // Exact match for the main route
            (item.route === "/backoffice/" &&
              pathname.startsWith("/backoffice/orders"));

          return (
            <Box
              key={item.id}
              component={Link} // Use the `component` prop to render the `<Link>`
              href={item.route}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#000000",
              }}
            >
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: isActive ? "#FFCA40" : "transparent",
                  ":hover": {
                    backgroundColor: "#FFCA40",
                  },
                  borderRadius: "6px",
                  mt: 1,
                }}
              >
                <ListItemButton>
                  <ListItemIcon sx={{ color: "#000000" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ color: "#000000" }}
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}
