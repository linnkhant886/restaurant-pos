import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from "next/link";
import {  getLocation } from "@/libs/action";

export default async function MenuCategoriesPage() {
  const locations = await getLocation();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href="/backoffice/locations/new">
          <Button
            variant="contained"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              ":hover": { bgcolor: "primary.main" },
            }}
          >
            Add  Locations
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        {locations.map((location) => (
          <ItemCard
            key={location.id}
            icon={<LocationOnIcon fontSize="large" />}
            title={location.name}
            href={`/backoffice/locations/${location.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
