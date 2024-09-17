import MenuCard from "@/components/MenuCard";
import { getCompanyId } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default async function MenusPage() {
  const menuCategories = await prisma.menuCategories.findMany({
    where: { companyId: await getCompanyId() },
  });
  const menmenuCategoriesIds = menuCategories.map((menuCategory) => menuCategory.id);
  const menuCategoryMenu = await prisma.menuCategoriesMenus.findMany({
    where: { menuCategoryId: { in: menmenuCategoriesIds } },
  })

  const menuId = menuCategoryMenu.map((menu) => menu.menuId);
  const menus = await prisma.menus.findMany({
    where: { id: { in: menuId } },
  });
  // console.log(menuCategories);
  // console.log(menmenuCategoriesIds);

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
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </Box>
    </>
  );
}
