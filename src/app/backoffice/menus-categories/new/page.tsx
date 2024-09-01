import { Box, Button, TextField } from "@mui/material";
import { CreateMenuCategory } from "../actions";

export default function NewMenuPage() {
  return (
    <>
      <h1>New Menu-Category Page</h1>
      <Box
        component={"form"}
        action={CreateMenuCategory}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="createMenuCategory" />

        <Button type="submit" variant="contained" sx={{ width: "fit-content", mt: 3 }}>
          Create
        </Button>
      </Box>
    </>
  );
}
