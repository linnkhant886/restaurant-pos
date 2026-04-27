import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon: ReactNode;
  title: string;
  href: string;
  isAvailable?: boolean;
  subtitle?: string;
}

const ItemCard = ({ icon, title, href, subtitle, isAvailable = true }: Props) => {
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          "group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none",
          "hover:-translate-y-0.5 hover:shadow-md",
          !isAvailable && "opacity-40"
        )}
        style={{
          backgroundColor: "var(--rf-paper)",
          borderColor: "var(--rf-line)",
          minHeight: 140,
        }}
      >
        {!isAvailable && (
          <span
            className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--rf-cream-2)", color: "var(--rf-ink)" }}
          >
            Off
          </span>
        )}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "var(--rf-cream-2)" }}
        >
          {icon}
        </div>
        <p className="text-sm font-semibold text-center leading-snug" style={{ color: "var(--rf-ink)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-center" style={{ color: "rgba(27,31,59,0.5)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
