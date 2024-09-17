import {
  Box,
  Button,
  TextField,
} from "@mui/material";

import { CreateTable } from "../actions";
import { getLocation } from "@/libs/action";


export default async function Tables() {

  const locationIds = (await getLocation())[0].id;
  // console.log(locationIds);

  return (
    <>
      <h1>Add table </h1>

      
      <Box
        component={"form"}
        action={CreateTable}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="name" />
        <input type="hidden" name="locationId" value={locationIds} />
        
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
