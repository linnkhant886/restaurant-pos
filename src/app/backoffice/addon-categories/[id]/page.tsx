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
import { DeleteAddonCategory, getAddonCategory, UpdateAddonCategory } from "../actions";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const AddonCategory = await getAddonCategory(Number(id));
  const select = AddonCategory?.menuAddonCategories.map((item) => item.menuId);
  const menus = await prisma.menus.findMany();
    // console.log(AddonCategory);
    // console.log(select);
    
  return (
    <>
    <Box component={"form"} sx={{ display: "flex", justifyContent: "flex-end" }} action={DeleteAddonCategory}>
        <Button type="submit" variant="contained" color="error">
          {" "}
          Delete
        </Button>
        <input type="hidden" defaultValue={AddonCategory?.id} name="DeleteID" />
      </Box>
      <Box
        component={"form"}
        action={UpdateAddonCategory}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" defaultValue={AddonCategory?.name} name="name" />
        <Typography variant="h4" sx={{ mt: 2 }}>Menus</Typography>
        <input type="hidden" name="id" value={id} />

        <Box sx={{ display: "flex" , border: "1px solid black", p: 1, my: 2}}>
          {menus.map((menu) => (
            <FormControlLabel
              key={menu.id}
              control={
                <Checkbox name="menus" value={menu.id} defaultChecked={select?.includes(menu.id) } />
              }
              label={menu.name}
            />
          ))}
        </Box>
        <FormControlLabel
          control={<Checkbox defaultChecked={AddonCategory?.isRequired ? true : false} />}
          label="isRequired"
          name="isRequired"
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
