import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";

export default async function Orders() {
  
  const session = await getServerSession();
  //  console.log("seesion:",session)
  return <h1>Orders : {session?.user?.name}</h1>;
}
