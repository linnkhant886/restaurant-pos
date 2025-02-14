import ItemCard from "@/components/ItemCard";
import EggIcon from "@mui/icons-material/Egg";
import { prisma } from "@/libs/prisma";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getCompanyAddon } from "@/libs/action";

export default async function MenusPage() {
  const Addons = await getCompanyAddon()
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Addons</h1>
        <Link href="/backoffice/addons/new">
          <Button variant="contained">New Addon</Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" , flexWrap: "wrap"  }}>
        {Addons.map((addon) => (
          <ItemCard
            key={addon.id}
            icon={<EggIcon fontSize="large" />}
            title={addon.name}
            href={`/backoffice/addons/${addon.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
