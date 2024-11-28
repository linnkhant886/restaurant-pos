"use client";

import { Box, Button, Link, Pagination } from "@mui/material";
import { Menus } from "@prisma/client";
import { useState } from "react";
import MenuCard from "./MenuCard";
import { MenuwithDisableLocation } from "@/app/backoffice/menus/page";

interface Props {
  menus: MenuwithDisableLocation[];
  selectedLocation: number | undefined;
}

export default function MenuPagniation({ menus, selectedLocation }: Props) {
  const itemsPerPage = 8; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate the number of pages
  const totalPages = Math.ceil(menus.length / itemsPerPage);

  // Get the items for the current page
  const paginatedMenus = menus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };
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
      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: "repeat(4, 300px)",
          gap: 2
        }}
      >
        {paginatedMenus.map((menu) => {
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

      <Pagination
        count={10}
        page={currentPage}
        onChange={handlePageChange}
        sx={{
          mt: 4,
          right: 0,
          bottom: 0,
          position: "fixed",
          px: 4,
          py:1
        }}
        variant="outlined"
        size="large"
        color="primary"
      />
    </>
  );
}
