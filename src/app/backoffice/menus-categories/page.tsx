import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import Link from "next/link";
import { prisma } from "@/libs/prisma";
import { getCompanyId } from "@/libs/action";

export default async function MenuCategoriesPage() {
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: await getCompanyId() },
  });
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
      <Box sx={{ mt: 3, display: "flex" }}>
        {menuCategories.map((menuCategory) => (
          <ItemCard
            key={menuCategory.id}
            icon={<CategoryIcon fontSize="large" />}
            title={menuCategory.name}
            href={`/backoffice/menus-categories/${menuCategory.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
