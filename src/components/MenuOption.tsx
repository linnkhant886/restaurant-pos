"use client";

import { Box, Button, styled } from "@mui/material";
import { AddonCategories, Addons, Menus } from "@prisma/client";
import { AddonCategoryAndAddon } from "./AddonCategoryAndAddon";
import QualitySelector from "./QualitySelector";
import { useEffect, useState } from "react";
import { createCartOrder } from "@/app/order/cart/action";
import { OrderWithOrdersAddons } from "@/app/order/menu/[id]/page";

interface Props {
  menu: Menus;
  addOns: Addons[];
  addOnCategories: AddonCategories[];
  tableId: number;
  order: OrderWithOrdersAddons | null;
}

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "primary.main",
  color: "white",
  "&:hover": {
    backgroundColor: "primary.dark",
  },
  borderRadius: "50px",
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
}));
export function MenuOption({
  menu,
  addOns,
  addOnCategories,
  tableId,
  order,
}: Props) {
  const [value, setvalue] = useState<number>(1);
  const [selected, setSelected] = useState<Addons[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);



  useEffect(() => {
    const requiredAddonCategories = addOnCategories.filter(
      (item) => item.isRequired
    );

    const selectedRequiredAddon = selected.filter((selectedAddon) => {
      const addonCategory = addOnCategories.find(
        (addonCategory) => addonCategory.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });

    const isDisabled =
      requiredAddonCategories.length !== selectedRequiredAddon.length;
    setIsDisabled(isDisabled);
  }, [selected, addOnCategories]);

  useEffect(() => {
    if (order) {
      const { quantity,OrdersAddons } = order;
      setvalue(quantity);
      const addonIds = OrdersAddons.map((item) => item.addonId);
      setSelected(addOns.filter((item) => addonIds.includes(item.id)));
    }
  }, [order, addOns]);

  const Increase = () => {
    setvalue(value + 1);
  };
  const Decrease = () => {
    const newValue = value - 1 === 0 ? 1 : value - 1;
    setvalue(newValue);
  };

  const handleCartOrder = async () => {
    await createCartOrder({
      menuId: menu.id,
      tableId: tableId,
      quantity: value,
      addonIds: selected.map((item) => item.id),
      orderId: order?.id,
    });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 2 }}>
      <AddonCategoryAndAddon
        menu={menu}
        addOns={addOns}
        addOnCategories={addOnCategories}
        selected={selected}
        setSelected={setSelected}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <QualitySelector
          value={value}
          Increase={Increase}
          Decrease={Decrease}
        />

        <StyledButton
          disabled={isDisabled}
          variant="contained"
          onClick={handleCartOrder}
          fullWidth
          sx={{ ml: 2 }}
        >
          {order ? "Update" : "Add to cart"}
        </StyledButton>
      </Box>
    </Box>
  );
}
