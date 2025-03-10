import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Company, Orders } from "@prisma/client";
import Link from "next/link";

interface Props {
  company: Company;
  tableId: string;
  cartOrders: Orders[];
}

export default  function OrderAppHeader({ company, cartOrders, tableId }: Props) {

  return (
    <AppBar position="sticky" sx={{ display: "flex" , bgcolor: "#FFCA40", color: "#000000"}}>
      <Toolbar sx={{ display: "flex", mx: 4 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {company.name}
        </Typography>
        <Link href={`/order/cart?tableId=${tableId}`}> 
        <Button
          variant="contained"
          sx={{
            position: "relative",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            bgcolor: "#000000",
            color: "#FFCA40",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#000000" },
          }}
        >
          <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />

          {/* Quantity Badge */}
          <Box
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              bgcolor: "red",
              color: "white",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {cartOrders.length}
          </Box>
        </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
