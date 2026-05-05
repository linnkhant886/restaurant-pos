// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { DeleteMenuCategoryID, UpdateMenuCategoryID } from "../actions";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/shared/SubmitButton";

export interface prop {
  params: { id: string };
}

export default async function UpdateMenuCategory({ params }: prop) {
  const { id } = params;
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
    include: { DisabledLocationsMenuCategories: true },
  });

  const isAvailable = (menuCategory?.DisabledLocationsMenuCategories.length ?? 0) === 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Back */}
      <Link
        href="/backoffice/menus-categories"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "rgba(27,31,59,0.5)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "var(--rf-paper)", borderColor: "var(--rf-line)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold" style={{ color: "var(--rf-ink)" }}>
            Edit Category
          </h1>

          {/* Delete */}
          <form action={DeleteMenuCategoryID}>
            <input type="hidden" name="DeleteID" value={menuCategory?.id} />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </form>
        </div>

        <form action={UpdateMenuCategoryID} className="space-y-5">
          <input type="hidden" name="MenuCategoryId" value={menuCategory?.id} />

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--rf-ink)" }}>
              Category Name
            </label>
            <input
              type="text"
              defaultValue={menuCategory?.name}
              name="MenuCategoryName"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{
                borderColor: "var(--rf-line)",
                backgroundColor: "var(--rf-cream)",
                color: "var(--rf-ink)",
              }}
            />
          </div>

          {/* Available toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{ borderColor: "var(--rf-line)", backgroundColor: "var(--rf-cream)" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--rf-ink)" }}>
                Available at location
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(27,31,59,0.45)" }}>
                Show this category on the POS &amp; QR menu
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                defaultChecked={isAvailable}
                className="sr-only peer"
              />
              <div
                className="w-10 h-6 rounded-full border-2 transition-all peer-checked:border-transparent"
                style={{
                  backgroundColor: isAvailable ? "var(--rf-ink)" : "var(--rf-line-2)",
                  borderColor: "transparent",
                }}
              >
                <div
                  className="absolute top-1 left-1 w-4 h-4 rounded-full transition-all peer-checked:translate-x-4"
                  style={{ backgroundColor: isAvailable ? "var(--rf-yellow)" : "white" }}
                />
              </div>
            </label>
          </div>

          <SubmitButton text="Save changes" />
        </form>
      </div>
    </div>
  );
}
