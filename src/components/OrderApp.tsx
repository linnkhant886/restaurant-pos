"use client";

import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuCategoryType } from "@/app/order/page";
import { Company, Menus, Orders } from "@prisma/client";
import OrderCardMenu from "@/components/OrderCardMenu";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  menuCategories: MenuCategoryType[];
  company: Company;
  menu: Menus[];
  tableId: string;
  cartOrders:Orders[]
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 18, // base font size
    fontWeightRegular: 500, // make it slightly bold
    fontWeightBold: 700, // set bold font weight
  },
});

export default function RestaurantMenuMUI({
  menuCategories,
  company,
  menu,
  tableId,
  cartOrders
}: Props) {
  const [showMenu, setShowMenu] = useState<Menus[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategoryType>(menuCategories[0]);
  // console.log(menuCategories)

  useEffect(() => {
    const menuIds = selectedMenuCategory.menuCategoriesMenus.map(
      (item) => item.menuId
    );
    const menutoShow = menu.filter((item) => menuIds.includes(item.id));
    setShowMenu(menutoShow);
  }, [selectedMenuCategory]);
  // console.log(showMenu);

  return (
    <ThemeProvider theme={theme}>
      <OrderAppHeader company={company} cartOrders={cartOrders} tableId={tableId} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Tabs
          value={activeCategory}
          onChange={(_, newValue: number) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {menuCategories.map((category, index) => (
            <Tab
              key={category.id}
              label={category.name}
              onClick={() => setSelectedMenuCategory(category)}
            />
          ))}
        </Tabs>
        <Box sx={{ bgcolor: "grey", width: "100%" }}>
          {showMenu.map((item) => (
            <OrderCardMenu
              key={item.id}
              items={[item]}
              href={`order/menu/${item.id}?tableId=${tableId}`}
            />
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
