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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { prisma } from "@/libs/prisma";
import Link from "next/link";
import { confrimCartOrder, deleteOrder, getTotalPrice } from "./action";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { ORDERSTATUS } from "@prisma/client";

interface Props {
  searchParams: { tableId: string };
}

export default async function CartPage({ searchParams }: Props) {
  const tableId = Number(searchParams.tableId);
  const cartOrders = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
    include: {
      menu: true,
    },
  });

 
  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
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

        <Typography variant="h5">My cart</Typography>

        <IconButton edge="start" color="inherit" aria-label="back">
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
      {cartOrders.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 20,
            textAlign: "center", // Center the text inside
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            No Order In Cart
          </Typography>
          <Link href={`/order?tableId=${tableId}`} passHref>
            <Button variant="contained" sx={{ mt: 1 }}>
              Add More Menu
            </Button>
          </Link>
        </Box>
      ) : (
        <>
          <List>
            {cartOrders.map(async (cartOrder) => {
              const { id, menu, quantity } = cartOrder;
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
                            menu.imageUrl ||
                            "/placeholder.svg?height=80&width=80"
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
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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

                      <Box>
                        {/* //   quantity section */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            sx={{ border: "1px solid grey" }}
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>

                          <Typography fontSize={"20px"} sx={{ mx: 1 }}>
                            {" "}
                            {quantity}
                          </Typography>

                          <IconButton
                            sx={{ border: "1px solid grey" }}
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        {/* //   edit and delete section */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            cursor: "pointer",
                            justifyContent: "space-between",
                            mx: 1,
                            mt: 2,
                            size: "small",
                          }}
                        >
                          <Box
                            sx={{
                              borderColor: "grey.300",
                              color: "#00a152",
                              ":hover": { color: "#00e676" },
                            }}
                            component={"form"}
                          >
                            <Link
                              href={`/order/menu/${cartOrder.menuId}?tableId=${cartOrder.tableId}&orderId=${cartOrder.id}`}
                            >
                              <IconButton
                                type="submit"
                                sx={{
                                  ":hover": {
                                    backgroundColor: "#00e676",
                                  },
                                }}
                              >
                                <BorderColorIcon sx={{ color: "#00a152" }} />
                              </IconButton>
                            </Link>
                          </Box>

                          <Box
                            sx={{
                              borderColor: "grey.300",
                              px: 1,
                            }}
                            component={"form"}
                            action={deleteOrder}
                          >
                            <input
                              type="hidden"
                              name="id"
                              defaultValue={cartOrder.id}
                            />
                            <IconButton
                              type="submit"
                              sx={{
                                ":hover": {
                                  color: "#b2102f",
                                  backgroundColor: "#ff1744",
                                },
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Box>
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
              {getTotalPrice(tableId)} $
            </Typography>
          </Box>

          <Box
            component={"form"}
            action={confrimCartOrder}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <input type="hidden" name="tableId" value={tableId} />
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "fit-content" }}
            >
              Confirm Orders
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
