import ItemCard from "@/components/ItemCard";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {  getSelectedLocationTables } from "@/libs/action";


export default async function MenusPage() {
  const tables = await getSelectedLocationTables();
  // return console.log(tables)
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Tables </h1>
        <Link href="/backoffice/tables/new">
          <Button variant="contained">Add tables</Button>
        </Link>
      </Box>
      <Box sx={{ mt: 3, display: "flex" }}>
        {tables.map((table) => (
          <ItemCard
            key={table.id}
            icon={<TableRestaurantIcon fontSize="large" />}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
}
