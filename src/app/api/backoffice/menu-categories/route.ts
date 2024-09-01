import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const menuCategories = await prisma.menuCategories.findMany();
  return NextResponse.json({ menuCategories }, { status: 200 });
}

export async function POST(req: Request) {
  const menuCategory = await req.json();

  console.log(menuCategory.name);
  const isValid = menuCategory.name;
  if (!isValid)
    return NextResponse.json({ error: "Required menu name" }, { status: 200 });
  await prisma.menuCategories.create({
    data: {
      name: menuCategory.name,
    },
  });
  return NextResponse.json({ menuCategory }, { status: 200 });
}
