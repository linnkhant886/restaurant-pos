import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { DeleteMenu, getMenu, UpdateMenu } from "../actions";
import { prisma } from "@/libs/prisma";

export interface prop {
  params: { id: string };
}

export default async function SingleMenu({ params }: prop) {
  const { id } = params;

  const menu = await getMenu(Number(id));
  const selected = menu?.menuCategoriesMenus.map((item) => item.menuCategoryId);
  const menuCategories = await prisma.menuCategories.findMany();
  //   console.log(menu);

  return (
    <>
      <Box
        component={"form"}
        sx={{ display: "flex", justifyContent: "flex-end" }}
        action={DeleteMenu}
      >
        <input type="hidden" name="id" value={id} />

        <Button type="submit" variant="contained" color="error">
          Delete
        </Button>
      </Box>
      <Box
        component={"form"}
        action={UpdateMenu}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input type="hidden" name="id" value={id} />
        <TextField placeholder="Name" name="name" defaultValue={menu?.name} />
        <TextField
          placeholder="Price"
          sx={{ my: 2 }}
          name="price"
          defaultValue={menu?.price}
        />
        <Typography variant="h4">Menu Category</Typography>
        <Box sx={{ display: "flex", border: "1px solid black", p: 1, my: 2 }}>
          {menuCategories.map((menuCategory) => (
            <FormControlLabel
              key={menuCategory.id}
              control={
                <Checkbox
                  defaultChecked={selected?.includes(menuCategory.id)}
                  name="menuCategories"
                  value={menuCategory.id}
                />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={
            <Checkbox defaultChecked={menu?.isAvailable ? true : false} />
          }
          label="Available"
          name="isAvailable"
        />
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          type="submit"
        >
          Update
        </Button>
      </Box>
    </>
  );
}
