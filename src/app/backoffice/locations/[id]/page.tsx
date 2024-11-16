import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteLocation, UpdateLocation } from "../actions";
import {  getLocation, getSelectedLocation } from "@/libs/action";

export interface prop {
  params: { id: string };
}
export default async function UpdateMenuCategory({ params }: prop) {
  const { id } = params;
  const location =
    (await getLocation())
      .map((item) => item)
      .find((item) => item.id == Number(id)) || null; // Number(id);

 


  const selectedLocation = await getSelectedLocation();
  const companyLocation = await getLocation();

  const isSelected = selectedLocation?.locationId === Number(id)
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box component={"form"} action={UpdateLocation}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          {" "}
          Update Location
        </Typography>
        <input type="hidden" defaultValue={id} name="id" />

        <TextField
          defaultValue={location?.name}
          name="locationName"
        ></TextField>

        <FormControlLabel
        sx={{ display: "block" }}
          control={
            <Checkbox
              
              name="isSelected"
              defaultValue={String(isSelected ? true : false)}
              defaultChecked={isSelected}
              
            />
          }
          label={"Selected location"}
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </Box>

      <Box component={"form"} action={DeleteLocation}>
        <Button type="submit" variant="contained" color="error">
          {" "}
          Delete
        </Button>
        <input type="hidden" defaultValue={location?.id} name="DeleteID" />
      </Box>
    </Box>
  );
}
