import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { CreateMenu } from "../actions";
import { prisma } from "@/libs/prisma";

export default async function NewMenuPage() {
  const menuCategories = await prisma.menuCategories.findMany();
  console.log(menuCategories);

  return (
    <>
      <h1>New Menu Page</h1>

      
      <Box
        component={"form"}
        action={CreateMenu}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="name" />
        <TextField placeholder="Price" sx={{ my: 2 }} name="price" />
        <Typography variant="h4">Menu Category</Typography>
        <Box sx={{ display: "flex" , border: "1px solid black", p: 1, my: 2}}>
          {menuCategories.map((menuCategory) => (
            <FormControlLabel
              key={menuCategory.id}
              control={
                <Checkbox name="menuCategories" value={menuCategory.id} />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Available"
          name="isAvailable"
        />
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          type="submit"
        >
          Create
        </Button>
      </Box>
    </>
  );
}
