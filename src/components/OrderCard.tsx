import React from "react";
import { Card, CardContent, Typography, Chip, Box, Stack } from "@mui/material";

import {
  AddonWithAddonCategory,
  OrderWithMenusTableOrdersAddons,
} from "@/app/backoffice/orders/[status]/page";
import { ORDERSTATUS } from "@prisma/client";
import { OrderStatusUpdate } from "./OrderStatusUpate";

export type OrderStatus = ORDERSTATUS;

interface Props {
  order: OrderWithMenusTableOrdersAddons;
  addons: AddonWithAddonCategory[];
}

export default async function Component({ order, addons }: Props) {
 

 

  const orderTimeStamp = order.updatedAt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <Card
      sx={{
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            alignContent: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {order.menu.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.table.name}
            </Typography>
          </Box>
          <OrderStatusUpdate order={order} isAdmin/>

          
        </Box>

        {/* Addons Section */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Addons
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 3, minHeight: 160 }}>
          {addons.map((addon, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "grey.50",
                p: 1.5,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">{addon.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {addon.addonCategory.name}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Order Time
          </Typography>
          <Typography variant="body2">{orderTimeStamp}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
