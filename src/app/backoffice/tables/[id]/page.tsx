import { getCompanyTables, getLocation } from "@/libs/action";
import { Box, Button, TextField } from "@mui/material";
import { DeleteTable, UpdateTable } from "../actions";

export interface prop {
  params: { id: string };
}
export default async function UpdateAddonCategoryPage({ params }: prop) {
  const { id } = params;
  const table =
    (await getCompanyTables()).find((item) => item.id == Number(id)) || null;
  const locationIds = (await getLocation())[0].id;

  // console.log(table);

  return (
    <>
      <Box
        component={"form"}
        sx={{ display: "flex", justifyContent: "flex-end" }}
        action={DeleteTable}
      >
        <Button type="submit" variant="contained" color="error">
          {" "}
          Delete
        </Button>
        <input type="hidden" defaultValue={id} name="DeleteID" />
      </Box>
      <Box
        component={"form"}
        action={UpdateTable}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" defaultValue={table?.name} name="name" />
        <input type="hidden" name="id" value={id} />

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
