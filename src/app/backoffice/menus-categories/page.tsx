import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import Link from "next/link";
import {
  getCompanyId,
  getCompanyMenuCategories,
  getLocation,
  getSelectedLocation,
} from "@/libs/action";

export default async function MenuCategoriesPage() {
  const menuCategories = await getCompanyMenuCategories();
  const selectedLocation = (await getSelectedLocation())?.locationId;
  
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href="/backoffice/menus-categories/new">
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
            }}
          >
            New menu category
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" , flexWrap: "wrap" }}>
        {menuCategories.map((menuCategory) => {
          const isAvailable = menuCategory.DisabledLocationsMenuCategories.find(
            (item) =>
              item.menuCategoryId === menuCategory.id &&
              item.locationId === selectedLocation
          )
            ? false
            : true;
          return (
            <ItemCard
              key={menuCategory.id}
              icon={<CategoryIcon fontSize="large" />}
              title={menuCategory.name}
              href={`/backoffice/menus-categories/${menuCategory.id}`}
              isAvailable={isAvailable}
            />
          );
        })}
      </Box>
    </>
  );
}
