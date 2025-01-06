"use client";

import { Button, CircularProgress } from "@mui/material";

type SubmitButtonProp = {
  sx?: object;
  text: string;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined";
  loading?: boolean;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
};

export function SubmitButton({
  sx,
  text,
  size,
  variant,
  loading,
  color,
}: SubmitButtonProp) {
  return (
    <Button
      type="submit"
      sx={sx}
      disabled={loading}
      size={size}
      variant={variant}
      color={color}
    >
      {loading ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} /> Please Wait....
        </>
      ) : (
        text
      )}
    </Button>
  );
}
