"use client";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { CreateMenu } from "../actions";
import { AddonCategories, MenuCategories } from "@prisma/client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import React from "react";

interface Props {
  menuCategories: MenuCategories[];
  addOnCategories: AddonCategories[];
}
export default function NewFormData({ menuCategories ,addOnCategories}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleCreateMenuClientUpload = async (formData: FormData) => {
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
      const response = await CreateMenu(formData);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Success");
        router.push("/backoffice/menus");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>New Menu Page</h1>

      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleCreateMenuClientUpload(formData);
        }}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="name" />
        <TextField placeholder="Price" sx={{ my: 2 }} name="price" />
        <Typography variant="h4">Menu Category</Typography>
        <Box sx={{ display: "flex", border: "1px solid black", p: 1, my: 2 }}>
          {menuCategories.map((menuCategory) => (
            <FormControlLabel
              key={menuCategory.id}
              control={
                <Checkbox name="menuCategoryIds" value={menuCategory.id} />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>

       

        <TextField sx={{ my: 2 }} type="file" name="file"></TextField>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Available"
          name="isAvailable"
        />
        <Button
        variant="contained"
          sx={{ width: "fit-content", mt: 3 }}
          type="submit"
        >
          {loading ? <CircularProgress color="inherit" /> : "Create"}
        </Button>
      </Box>
    </>
  );
}
