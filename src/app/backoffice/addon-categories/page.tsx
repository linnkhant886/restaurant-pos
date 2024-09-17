import ItemCard from "@/components/ItemCard";
import { prisma } from "@/libs/prisma";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import ClassIcon from "@mui/icons-material/Class";
import { getCompanyAddonCategories } from "@/libs/action";

export default async function MenusPage() {
  const AddonCategories = await getCompanyAddonCategories();
  const IDs = AddonCategories.map((item) => item.id);
  // console.log(AddonCategories)
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>AddonCategories </h1>
        <Link href="/backoffice/addon-categories/new">
          <Button variant="contained">New AddonCategory</Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        {AddonCategories.map((addonCategory) => (
          <ItemCard
            key={addonCategory.id}
            icon={<ClassIcon fontSize="large" />}
            title={addonCategory.name}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
