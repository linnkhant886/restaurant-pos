import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { prisma } from "@/libs/prisma";
import Link from "next/link";
import { getActiveOrderTotalPrice } from "../cart/action";
import { ORDERSTATUS } from "@prisma/client";
import AddIcon from "@mui/icons-material/Add";

import { OrderStatusUpdate } from "@/components/OrderStatusUpate";
import { OrderWithOrdersAddons } from "../menu/[id]/page";

interface Props {
  searchParams: { tableId: string };
}

export default async function CartPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);

  const cartOrders: OrderWithOrdersAddons[] = await prisma.orders.findMany({
    where: { tableId, status: { not: ORDERSTATUS.CART } },
    include: {
      menu: true,
      OrdersAddons: true,
    },
  });

  if (!cartOrders.length) {
    return null;
  }
  return (
    <Box sx={{ maxWidth: 700, margin: "auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Link href={`/order?tableId=${tableId}`} passHref>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        </Link>

        <Typography variant="h5">My Orders</Typography>
        <Link href={`/order?tableId=${tableId}`}>
          <Button variant="text" sx={{ color: "primary.main" }}>
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              Add More
              <AddIcon
                sx={{
                  ml: 1,
                  border: "1px solid primary.main",
                  color: "primary.main",
                }}
              />
            </Typography>
          </Button>
        </Link>
      </Box>

      <List>
        {cartOrders.map(async (cartOrder) => {
          const { id, menu, quantity, status } = cartOrder;
          const orderAddon = await prisma.ordersAddons.findMany({
            where: { orderId: id },
            include: { addon: true },
          });

          const addon = orderAddon.map((item) => item.addon);

          return (
            <>
              <React.Fragment key={cartOrder.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={menu.name}
                      src={
                        menu.imageUrl || "/placeholder.svg?height=80&width=80"
                      }
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ ml: 2 }}
                    primary={menu.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          ${menu.price}
                        </Typography>

                        {/* addon section*/}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "flex", marginTop: "8px" }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Add-ons ::
                          </Typography>
                          {addon.map((item) => (
                            <Typography
                              sx={{
                                ml: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                              key={item.id}
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.name} : ({item.price}$) ,
                            </Typography>
                          ))}
                        </Typography>
                      </>
                    }
                  />
                  <Box sx={{ mr: 6 }}>
                    <OrderStatusUpdate order={cartOrder} />
                  </Box>

                  <Box>
                    {/* //   quantity section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        fontSize={"20px"}
                        sx={{
                          width: "40px",
                          userSelect: "none",
                          border: "1px groove grey",
                          textAlign: "center",
                          py: 0.5,
                          px: 0,
                        }}
                      >
                        {quantity}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            </>
          );
        })}
      </List>

      <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          TotalPrice
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {getActiveOrderTotalPrice(tableId)} $
        </Typography>
      </Box>
    </Box>
  );
}
