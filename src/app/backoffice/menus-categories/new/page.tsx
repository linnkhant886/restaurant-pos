"use client";

import { Box, colors, TextField } from "@mui/material";
import { CreateMenuCategory } from "../actions";
import toast from "react-hot-toast";
import { SubmitButton } from "@/components/SubmitButton";
import { useState } from "react";

export default function NewMenuPage() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const response = await CreateMenuCategory(data);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Menu-Category created successfully!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <>
      <h1>New Menu-Category Page</h1>
      <Box
        component={"form"}
        onSubmit={handleSubmit}
        sx={{ mt: 2, display: "flex", flexDirection: "column" }}
      >
        <TextField placeholder="Name" name="createMenuCategory" />

        <SubmitButton
          text="Create"
          variant="contained"
          size="medium"
          loading={loading}
          sx={{ width: "fit-content", mt: 2, }}
        />
      </Box>
    </>
  );
}
