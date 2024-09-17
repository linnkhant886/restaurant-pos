import { Box, Button, TextField } from "@mui/material";
import { createLocation } from "../actions";
import { getCompanyId } from "@/libs/action";

export default async function NewMenuPage() {
  const companyId = await getCompanyId();
  // console.log(companyId);
  return (
    <>
      <h1>New Locations Page</h1>
      <Box
        component={"form"}
        action={createLocation}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="createLocation" />
        <input type="hidden" name="companyId" value={companyId} />

        <Button type="submit" variant="contained" sx={{ width: "fit-content", mt: 3 }}>
          Create
        </Button>
      </Box>
    </>
  );
}
