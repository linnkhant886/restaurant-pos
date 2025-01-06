import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { DeleteMenuCategoryID, UpdateMenuCategoryID } from "../actions";
import { SubmitButton } from "@/components/SubmitButton";

export interface prop {
  params: { id: string };
}
export default async function UpdateMenuCategory({ params }: prop) {
  const { id } = params;
  const MenuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
    include: { DisabledLocationsMenuCategories: true },
  });

  const isAvailable =
    MenuCategory?.DisabledLocationsMenuCategories.length === 0 ? true : false;
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box component={"form"} action={UpdateMenuCategoryID}>
        <TextField
          defaultValue={MenuCategory?.name}
          name="MenuCategoryName"
        ></TextField>

        <FormControlLabel
          sx={{ display: "block", mt: 1 }}
          control={<Checkbox defaultChecked={isAvailable} />}
          label="Available"
          name="isAvailable"
        />
        <Box sx={{ mt: 1}}>
          <Button type="submit" variant="contained">
            Update
          </Button>
          <input
            type="hidden"
            defaultValue={MenuCategory?.id}
            name="MenuCategoryId"
          />
        </Box>
      </Box>

      <Box component={"form"} action={DeleteMenuCategoryID}>
        <SubmitButton text="Delete" color="error"  variant="contained"/>
        <input type="hidden" defaultValue={MenuCategory?.id} name="DeleteID" />
      </Box>
    </Box>
  );
}
