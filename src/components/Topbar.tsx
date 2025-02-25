import { getLocation, getSelectedLocation, getUser } from "@/libs/action";
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  RestaurantMenu as RestaurantMenuIcon,
  ExitToApp as ExitToAppIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import LogoutButton from "./LogoutButton";
import { getServerSession } from "next-auth";

export async function Topbar() {
  const session = await getServerSession();
  console.log(session);
  const userImage =
    session?.user?.image || "/placeholder.svg?height=40&width=40";
  const location = await getLocation();
  const selectedLocation = await getSelectedLocation();

  const Selected = location.find(
    (item) => item.id === selectedLocation?.locationId
  );

  return (
    <Box
      position="static"
      sx={{
        background: "#FFCA40",
        boxShadow: "0 3px 5px 2px rgba(248, 233, 234, 0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "#000000",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1, color: "#000000" }} />
            Foodie POS
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <LocationOnIcon sx={{ mr: 1 }} />
          {Selected?.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Notifications">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="User Profile">
            <IconButton sx={{ ml: 1 }}>
              <Avatar alt="User Avatar" src={userImage} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <LogoutButton />
          </Tooltip>
        </Box>
      </Toolbar>
    </Box>
  );
}
