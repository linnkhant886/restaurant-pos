import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  styled,
} from "@mui/material";
import { Menus } from "@prisma/client";
import Link from "next/link";
import { text } from "stream/consumers";

interface Props {
  items: Menus[];
  href: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  backgroundColor: "rgba(255, 253, 240, 0.7)",
}));

const StyledCardMedia = styled(CardMedia)({
  width: 150,
  height: 150,
  flexShrink: 0,
});

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flexGrow: 1,
});

const MenuCard: React.FC<Props> = ({ items, href }) => {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "#000000" }}>
      <Box sx={{ width: "100%", margin: "auto", p: 2, bgcolor: "#FFFFFF" }}>
        {items.map((item) => (
          <StyledCard key={item.id}>
            <StyledCardMedia image={item.imageUrl ?? ""} title={item.name} />
            <StyledCardContent>
              <Box>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  ${item.price!.toFixed(0)}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#ffd700",
                    color: "#000",
                    "&:hover": {
                      bgcolor: "#ffcc00",
                    },
                    padding: { xs: "6px 12px", sm: "8px 16px" }, // Smaller padding on mobile
                    fontSize: { xs: "0.8rem", sm: "1rem" }, // Adjust font size for mobile
                    minWidth: { xs: "100px", sm: "120px" }, // Ensure button remains clickable
                  }}
                >
                  Order Now
                </Button>
              </Box>
            </StyledCardContent>
          </StyledCard>
        ))}
      </Box>
    </Link>
  );
};

export default MenuCard;
