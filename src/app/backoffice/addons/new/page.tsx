import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { CreateAddon } from "../actions";
import { getCompanyAddonCategories } from "@/libs/action";

export default async function AddonCategories() {
  const AddonCategories = await getCompanyAddonCategories();

  return (
    <>
      <h1>Addon  </h1>

      
      <Box
        component={"form"}
        action={CreateAddon}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="name" />
        <TextField sx={{ my: 2 }} placeholder="Price" name="price" />
        <Typography variant="h4" sx={{ mt: 2 }}>AddonCategories</Typography>
        <Box sx={{ display: "flex" , border: "1px solid black", p: 1, my: 2}}>
          {AddonCategories.map((AddonCategory) => (
            <FormControlLabel
              key={AddonCategory.id}
              control={
                <Checkbox name="addonCategoryId" value={AddonCategory.id} />
              }
              label={AddonCategory.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="isAvailable"
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
