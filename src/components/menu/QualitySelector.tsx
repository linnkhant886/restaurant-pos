"use client";
import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  Increase: () => void;
  Decrease: () => void;
}

export default function QualitySelector({ value, Increase, Decrease }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-100 max-w-full m-auto">
      <div className="flex items-center">
        <button
          onClick={Decrease}
          className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Decrease quantity"
        >
          <Minus className="w-5 h-5" />
        </button>
        
        <span className="mx-4 min-w-[24px] text-center font-bold text-slate-800 text-lg">
          {value}
        </span>
        
        <button
          onClick={Increase}
          className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Increase quantity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
