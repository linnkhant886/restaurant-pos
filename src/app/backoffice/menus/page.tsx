import MenuCard from "@/components/MenuCard";
import { prisma } from "@/libs/prisma";
import { Box, Button } from "@mui/material";
import Link from "next/link";

export default async function MenusPage() {
  const menus = await prisma.menus.findMany();
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
