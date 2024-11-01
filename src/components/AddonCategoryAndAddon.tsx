"use client";

import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import { Menus } from "@prisma/client";
import { AddonCategories, Addons } from "@prisma/client";
import Addon from "./Addon";
import { Dispatch, SetStateAction } from "react";

interface Props {
  menu: Menus;
  addOns: Addons[];
  addOnCategories: AddonCategories[];
  selected: Addons[];
  setSelected: Dispatch<SetStateAction<Addons[]>>;
}

export function AddonCategoryAndAddon({
  menu,
  addOns,
  addOnCategories,
  selected,
  setSelected,
}: Props) {
  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <CardMedia
        component="img"
        height="300"
        image={menu?.imageUrl as string}
        alt={menu?.name}
      />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {menu?.name}
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            ฿{menu?.price}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          helloo
        </Typography>
      </CardContent>
      <Box>
        {addOnCategories.map((item) => {
          const addOnsInCategory = addOns.filter(
            (addOn) => addOn.addonCategoryId === item.id
          );
          return (
            <Box key={item.id}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {item.name}
                </Typography>

                <Typography variant="h6" color="warning.main" gutterBottom>
                  {item.isRequired ? "Required" : "Optional"}
                </Typography>
              </Box>

              <Addon
                addonCategory={item}
                addonCategoryAddons={addOnsInCategory}
                selectedAddons={selected}
                setSelectedAddons={setSelected}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
