"use client";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, styled, Typography } from "@mui/material";

interface Props {
  value: number;
  Increase: () => void;
  Decrease: () => void;
}



const QuantityButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));

export default function QualitySelector({ value, Increase, Decrease }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        bgcolor: "background.paper",
        borderRadius: "10px",
        
        maxWidth: "full",
        margin: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <QuantityButton onClick={Decrease}>
          <RemoveIcon />
        </QuantityButton>
        <Typography sx={{ mx: 2, minWidth: "20px", textAlign: "center" }}>
          {value}
        </Typography>
        <QuantityButton onClick={Increase}>
          <AddIcon />
        </QuantityButton>
      </Box>
      
    </Box>
  );
}
