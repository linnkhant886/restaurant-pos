import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteAddon, getAddon, UpdateAddon } from "../actions";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const addons = await getAddon(Number(id));
  const select = addons?.addonCategoryId
  const addonCategories = await prisma.addonCategories.findMany();
    
    
  return (
    <>
    <Box component={"form"} sx={{ display: "flex", justifyContent: "flex-end" }} action={DeleteAddon}>
        <Button type="submit" variant="contained" color="error">
          {" "}
          Delete
        </Button>
        <input type="hidden" defaultValue={addons?.id} name="DeleteID" />
      </Box>
      <Box
        component={"form"}
        action={UpdateAddon}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" defaultValue={addons?.name} name="name" />
        <TextField sx={{ my: 2 }} placeholder="Price" defaultValue={addons?.price} name="price" />
        <Typography variant="h4" sx={{ mt: 2 }}>AddonCategories</Typography>
        <input type="hidden" name="id" value={id} />

        <Box sx={{ display: "flex" , border: "1px solid black", p: 1, my: 2}}>
          {addonCategories.map((addonCategory) => (
            <FormControlLabel
              key={addonCategory.id}
              control={
                <Checkbox name="addonCategoryId" value={addonCategory.id} defaultChecked={select === addonCategory.id} />
              }
              label={addonCategory.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={<Checkbox defaultChecked={addons?.isAvailable ? true : false} />}
          label="isAvailable"
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
