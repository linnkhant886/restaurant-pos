"use client";

import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { UpdateMenu } from "../actions";
import { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import React from "react";

interface Props {
  id: string;
  menuCategories: MenuCategories[];
  selected: number[] | undefined;
  isAvailable: boolean;
  menu: Menus | null;
  selectedAddon: number[] ;
  addOncategories: AddonCategories[];
}
export default function UpdateMenuFormData({
  id,
  menuCategories,
  selected,
  isAvailable,
  menu,
  selectedAddon,
  addOncategories,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // console.log(menu);

  const handleUpdateMenu = async (formData: FormData) => {
    try {
      setLoading(true);
      const file = formData.get("file") as File;
      if (file.size) {
        const { url } = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        formData.set("imageUrl", url);
      }
      const response = await UpdateMenu(formData);
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Update Success");
        router.push("/backoffice/menus");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component={"form"}
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <input type="hidden" name="id" value={id} />

        <Button type="submit" variant="contained" color="error">
          Delete
        </Button>
      </Box>
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleUpdateMenu(formData);
        }}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <input type="hidden" name="id" value={id} />
        <TextField placeholder="Name" name="name" defaultValue={menu?.name} />
        <TextField
          placeholder="Price"
          sx={{ my: 2 }}
          name="price"
          defaultValue={menu?.price}
        />

        <Card sx={{ maxWidth: 345, mb: 2 }}>
          {menu?.imageUrl && (
            <CardMedia
              component="img"
              height="200"
              alt="Example image"
              src={menu?.imageUrl}
            />
          )}
        </Card>

        <TextField type="file" name="file" />

        <Typography variant="h4">Menu Category</Typography>
        <Box sx={{ display: "flex", border: "1px solid black", p: 1, my: 2 }}>
          {menuCategories.map((menuCategory) => (
            <FormControlLabel
              key={menuCategory.id}
              control={
                <Checkbox
                  defaultChecked={selected?.includes(menuCategory.id)}
                  name="menuCategories"
                  value={menuCategory.id}
                />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
        <Typography variant="h6">Addon Category</Typography>
        <Box sx={{ display: "flex", border: "1px solid black", p: 1, mt: 1 }}>
          {addOncategories.map((addonCategory) => (
            <FormControlLabel
              key={addonCategory.id}
              control={
                <Checkbox
                  defaultChecked={selectedAddon?.includes(addonCategory.id)}
                  name="addonCategories"
                  value={addonCategory.id}
                />
              }
              label={addonCategory.name}
            />
          ))}
        </Box>

        <FormControlLabel
          control={<Checkbox defaultChecked={isAvailable} />}
          label="Available"
          name="isAvailable"
        />
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 1 }}
          type="submit"
        >
          {loading ? <CircularProgress color="inherit" />: "Update"}
        </Button>
      </Box>
    </>
  );
}
