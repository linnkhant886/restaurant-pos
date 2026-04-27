import * as React from "react";
import { MenuCategories } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  selected: number | undefined;
  setSelected: Dispatch<SetStateAction<number | undefined>>;
  items: MenuCategories[];
}

export default function SingleSelected({
  title,
  items,
  selected,
  setSelected,
}: Props) {
  return (
    <div className="w-full text-slate-900 border-2 mt-4 px-2 py-4">
      <label className="block text-sm font-medium text-slate-900 mb-1">
        {title}
      </label>
      <select
        value={selected || ""}
        onChange={(event) => setSelected(Number(event.target.value))}
        className="block w-full text-slate-900 rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <option value="" disabled>Select {title}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
