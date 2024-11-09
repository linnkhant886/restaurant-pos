"use client";

import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  AccessTime as PendingIcon,
  Restaurant as CookingIcon,
  CheckCircle as CompleteIcon,
} from "@mui/icons-material";
import { OrderStatus } from "./OrderCard";
import { ORDERSTATUS } from "@prisma/client";
import { OrderWithOrdersAddons } from "@/app/order/menu/[id]/page";
import { useRouter } from "next/navigation";
import { StatusUpdate } from "@/app/backoffice/orders/[status]/action";
import { useEffect } from "react";

interface Props {
  order: OrderWithOrdersAddons;
  isAdmin?: boolean;
}

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <PendingIcon fontSize="small" />;
    case "COOKING":
      return <CookingIcon fontSize="small" />;
    case "COMPLETE":
      return <CompleteIcon fontSize="small" />;
  }
};

export const getStatusColor = (
  status: OrderStatus
): "warning" | "info" | "success" => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "COOKING":
      return "info";
    case "COMPLETE":
      return "success";
    default:
      return "warning";
  }
};

export const getStatusBgColor = (status: OrderStatus): string => {
  switch (status) {
    case "PENDING":
      return "#ED6C02"; // Light orange for warning
    case "COOKING":
      return "#0288D1"; // Light blue for info
    case "COMPLETE":
      return "#2E7D32"; // Light green for success
    default:
      return "#FFF3E0"; // Default color for fallback
  }
};

export function OrderStatusUpdate({ order, isAdmin }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (order.status !== ORDERSTATUS.COMPLETE) {
      const invalidId = setInterval(() => {
        router.refresh();
      }, 5000);
      return () => clearInterval(invalidId);
    }
  }, [order, router]);

  const handleOrderStatusUpdate = async (
    evt: SelectChangeEvent<"CART" | "PENDING" | "COOKING" | "COMPLETE">
  ) => {
    await StatusUpdate(order.id, evt.target.value as ORDERSTATUS);
  };
  return (
    <>
      {isAdmin ? (
        <FormControl size="small" >
          <Select
            value={order.status}
            onChange={handleOrderStatusUpdate}
            renderValue={(selected) => (
              <Chip
                icon={getStatusIcon(selected)}
                label={selected}
                color={getStatusColor(selected)}
                size="small"
                sx={{
                  "& .MuiChip-icon": {
                    fontSize: "1rem",
                  },
                }}
              />
            )}
           
          >
            <MenuItem value={ORDERSTATUS.PENDING}>
              {ORDERSTATUS.PENDING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COOKING}>
              {ORDERSTATUS.COOKING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COMPLETE}>
              {ORDERSTATUS.COMPLETE}
            </MenuItem>
          </Select>
        </FormControl>
      ) : (
        <Box
          sx={{
            bgcolor: getStatusBgColor(order.status),
            minWidth: "120px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
            sx={{
              "& .MuiChip-icon": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      )}
    </>
  );
}
