-- CreateEnum
CREATE TYPE "ORDERSTATUS" AS ENUM ('CART', 'PENDING', 'COOKING', 'COMPLETE');

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,
    "status" "ORDERSTATUS" NOT NULL DEFAULT 'CART',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdersAddons" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "addonId" INTEGER NOT NULL,

    CONSTRAINT "OrdersAddons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersAddons" ADD CONSTRAINT "OrdersAddons_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersAddons" ADD CONSTRAINT "OrdersAddons_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
