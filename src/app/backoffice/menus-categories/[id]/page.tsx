import { prisma } from "@/libs/prisma";
import { Box, Button, TextField } from "@mui/material";
import { DeleteMenuCategoryID, UpdateMenuCategoryID } from "../actions";

export interface prop {
  params: { id: string };
}
export default async function UpdateMenuCategory({ params }: prop) {
  const { id } = params;
  const MenuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
  });
  //   console.log(id);
  return (
    <Box sx={{ display: "flex" , justifyContent: "space-between" }}>
      
      <Box component={"form"} action={UpdateMenuCategoryID}>
        <TextField defaultValue={MenuCategory?.name} name="MenuCategoryName">
          
        </TextField>
        <Box sx={{ mt: 2 }}>
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
        <Button type="submit" variant="contained" color="error"> Delete</Button>
        <input
            type="hidden"
            defaultValue={MenuCategory?.id}
            name="DeleteID"
          />

      </Box>
    </Box>
  );
}
