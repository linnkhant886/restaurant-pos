import { AddonCategories, Addons as AddonType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategory: AddonCategories;
  addonCategoryAddons: AddonType[];
  selectedAddons: AddonType[];
  setSelectedAddons: Dispatch<SetStateAction<AddonType[]>>;
}

export default function Addons({
  addonCategory,
  addonCategoryAddons,
  selectedAddons,
  setSelectedAddons,
}: Props) {
  if (!addonCategory) return null;
  return (
    <div className="flex flex-col gap-3 mt-2">
      {addonCategoryAddons.map((addonCategoryAddon) => {
        const isChecked = !!selectedAddons.find(
          (item) => item.id === addonCategoryAddon.id
        );

        return (
          <div
            key={addonCategoryAddon.id}
            className="flex justify-between items-center bg-white p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <label className="flex items-center gap-3 cursor-pointer flex-grow">
              {addonCategory.isRequired ? (
                <input
                  type="radio"
                  name={`addon-category-${addonCategory.id}`}
                  checked={isChecked}
                  onChange={() => {
                    const addonIds = addonCategoryAddons.map((item) => item.id);
                    const others = selectedAddons.filter(
                      (item) => !addonIds.includes(item.id)
                    );
                    setSelectedAddons([...others, addonCategoryAddon]);
                  }}
                  className="w-5 h-5 accent-[#289D8F] cursor-pointer"
                />
              ) : (
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      setSelectedAddons([
                        ...selectedAddons,
                        addonCategoryAddon,
                      ]);
                    } else {
                      const selected = selectedAddons.filter(
                        (item) => item.id !== addonCategoryAddon.id
                      );
                      setSelectedAddons(selected);
                    }
                  }}
                  className="w-5 h-5 accent-[#289D8F] cursor-pointer rounded"
                />
              )}
              <span className="text-slate-800 font-medium select-none">
                {addonCategoryAddon.name}
              </span>
            </label>
            <span className="text-slate-500 italic text-sm">
              ${addonCategoryAddon.price}
            </span>
          </div>
        );
      })}
    </div>
  );
}