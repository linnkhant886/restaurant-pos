import MenuCard from "@/components/MenuCard";
import {
  getCompanyId,
  getCompanyMenu,
  getSelectedLocation,
} from "@/libs/action";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default async function MenusPage() {
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const menus = await getCompanyMenu();

  //  \
  //   console.log(menus);
  //   console.log(fnd);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Menus page</h1>
        <Link href="/backoffice/menus/new">
          <Button variant="contained">New menu</Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        {menus.map((menu) => {
          const isAvailable = menu.DisabledLocationsMenus.find(
            (item) =>
              item.menuId === menu.id && item.locationId === selectedLocation
          )
            ? false
            : true;

          return (
            <MenuCard key={menu.id} menu={menu} isAvailable={isAvailable} />
          );
        })}
      </Box>
    </>
  );
}
