"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { config } from "@/config";
import { MenuCategories } from "@prisma/client";
import MultiSelect from "@/components/MultiSelect";
import { useRouter } from "next/navigation";
import { Menu } from "../page";

export default function NewMenuPage() {
  const defaultMenu = { name: "", price: 0, isAvailable: true };
  const [selected, setSelected] = useState<number[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategories[]>([]);
  const [newMenu, setNewMenu] = useState<Partial<Menu>>(defaultMenu);
  const router = useRouter();

  useEffect(() => {
    getMenuCategories();
  }, []);

  const handleCreateMenu = async () => {
    const isValid = newMenu.name && selected;
    if (!isValid) return alert("Required menu name and Selected Menu Category");
    await fetch(`${config.backofficeApiUrl}/menus`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...newMenu, menuCategoryIds: selected }),
    });
    router.push("/backoffice/menus");
  };

  const getMenuCategories = async () => {
    const response = await fetch(`${config.backofficeApiUrl}/menu-categories`);
    const dataFromServer = await response.json();
    const { menuCategories } = dataFromServer;
    setMenuCategories(menuCategories);
    // console.log(dataFromServer);
  };

  return (
    <>
      <h1>New Menu Page</h1>
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
        <TextField
          placeholder="Name"
          onChange={(evt) => setNewMenu({ ...newMenu, name: evt.target.value })}
        />
        <TextField
          placeholder="Price"
          sx={{ my: 2 }}
          onChange={(evt) =>
            setNewMenu({ ...newMenu, price: Number(evt.target.value) })
          }
        />
        <MultiSelect
          title="Menu Category"
          items={menuCategories}
          selected={selected}
          setSelected={setSelected}
        ></MultiSelect>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Available"
          onChange={(evt, value) =>
            setNewMenu({ ...newMenu, isAvailable: value })
          }
        />
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          onClick={handleCreateMenu}
        >
          Create
        </Button>
      </Box>
    </>
  );
}
