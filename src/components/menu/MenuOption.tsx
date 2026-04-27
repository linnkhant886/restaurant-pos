"use client";

import { AddonCategories, Addons, Menus } from "@prisma/client";
import { AddonCategoryAndAddon } from "@/components/menu/AddonCategoryAndAddon";
import QualitySelector from "@/components/menu/QualitySelector";
import { useEffect, useState } from "react";
import { createCartOrder } from "@/app/order/cart/action";
import { OrderWithOrdersAddons } from "@/app/order/menu/[id]/page";

interface Props {
  menu: Menus;
  addOns: Addons[];
  addOnCategories: AddonCategories[];
  tableId: number;
  order: OrderWithOrdersAddons | null;
}

export function MenuOption({
  menu,
  addOns,
  addOnCategories,
  tableId,
  order,
}: Props) {
  const [value, setvalue] = useState<number>(1);
  const [selected, setSelected] = useState<Addons[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const requiredAddonCategories = addOnCategories.filter(
      (item) => item.isRequired
    );

    const selectedRequiredAddon = selected.filter((selectedAddon) => {
      const addonCategory = addOnCategories.find(
        (addonCategory) => addonCategory.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });

    const isDisabled =
      requiredAddonCategories.length !== selectedRequiredAddon.length;
    setIsDisabled(isDisabled);
  }, [selected, addOnCategories]);

  useEffect(() => {
    if (order) {
      const { quantity, OrdersAddons } = order;
      setvalue(quantity);
      const addonIds = OrdersAddons.map((item) => item.addonId);
      setSelected(addOns.filter((item) => addonIds.includes(item.id)));
    }
  }, [order, addOns]);

  const Increase = () => {
    setvalue(value + 1);
  };
  const Decrease = () => {
    const newValue = value - 1 === 0 ? 1 : value - 1;
    setvalue(newValue);
  };

  const handleCartOrder = async () => {
    await createCartOrder({
      menuId: menu.id,
      tableId: tableId,
      quantity: value,
      addonIds: selected.map((item) => item.id),
      orderId: order?.id,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <AddonCategoryAndAddon
        menu={menu}
        addOns={addOns}
        addOnCategories={addOnCategories}
        selected={selected}
        setSelected={setSelected}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 p-4 bg-white rounded-xl shadow-sm border border-slate-100 gap-4">
        <div className="w-full sm:w-auto">
          <QualitySelector
            value={value}
            Increase={Increase}
            Decrease={Decrease}
          />
        </div>

        <button
          disabled={isDisabled}
          onClick={handleCartOrder}
          className={`w-full sm:flex-1 py-3 px-6 rounded-full text-base font-bold transition-all shadow-sm
            ${isDisabled 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
            }`}
        >
          {order ? "Update Order" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
