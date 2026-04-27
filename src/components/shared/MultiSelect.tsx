import { MenuCategories, Menus } from "@prisma/client";
import { SetStateAction } from "react";

interface Props {
  title: string;
  selected: number[];
  setSelected: (value: SetStateAction<number[]>) => void;
  items: MenuCategories[] | Menus[];
  children?: React.ReactNode;
}

const MultiSelect = ({ title, selected, setSelected, items }: Props) => {
  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };

  return (
    <div className="w-full flex justify-end">
      <div className="w-[300px] bg-white border border-slate-200 rounded-lg shadow-sm border-b overflow-hidden">
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
        </div>
        <div className="max-h-48 overflow-y-auto p-2 flex flex-col gap-1 w-full text-slate-800">
          {items.map((item) => {
            const isChecked = selected.includes(item.id);
            return (
              <label
                key={item.id}
                className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{item.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
