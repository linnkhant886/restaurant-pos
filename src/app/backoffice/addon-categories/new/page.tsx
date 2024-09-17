import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { CreateAddonCategory } from "../actions";
import { prisma } from "@/libs/prisma";
import { getCompanyMenu } from "@/libs/action";

export default async function AddonCategories() {
  const menus = await getCompanyMenu();
  // console.log(menus);

  return (
    <>
      <h1>Addon Categories </h1>

      
      <Box
        component={"form"}
        action={CreateAddonCategory}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="name" />
        <Typography variant="h4" sx={{ mt: 2 }}>Menus</Typography>
        <Box sx={{ display: "flex" , border: "1px solid black", p: 1, my: 2}}>
          {menus.map((menu) => (
            <FormControlLabel
              key={menu.id}
              control={
                <Checkbox name="menus" value={menu.id} />
              }
              label={menu.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="isRequired"
          name="isRequired"
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
