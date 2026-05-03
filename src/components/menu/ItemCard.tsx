import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface Props {
  icon: ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  isAvailable?: boolean;
  subtitle?: string;
  colorBg?: string;
  colorFg?: string;
}

const ItemCard = ({ icon, title, href, onClick, subtitle, isAvailable = true, colorBg = "var(--rf-cream-2)", colorFg = "var(--rf-ink)" }: Props) => {
  const className = "block group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer text-left w-full";
  const style = {
    backgroundColor: "var(--rf-paper)",
    borderColor: "var(--rf-line)",
    opacity: isAvailable ? 1 : 0.55,
  };

  const innerContent = (
    <>
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: colorBg, color: colorFg }}
      >
        {icon}
      </div>

      {/* Title */}
      <p className="text-lg font-bold leading-tight line-clamp-1" style={{ color: "var(--rf-ink)" }}>
        {title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {subtitle && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--rf-cream-2)", color: "rgba(27,31,59,0.65)" }}
            >
              {subtitle}
            </span>
          )}
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isAvailable ? "#DCFCE7" : "#FEE2E2",
              color: isAvailable ? "#166534" : "#991B1B",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isAvailable ? "#22C55E" : "#EF4444" }}
            />
            {isAvailable ? "Live" : "Off"}
          </span>
        </div>

        {/* Edit button */}
        <div
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors group-hover:bg-black/6"
          style={{ color: "rgba(27,31,59,0.4)" }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} style={style}>
      {innerContent}
    </button>
  );
};

export default ItemCard;
