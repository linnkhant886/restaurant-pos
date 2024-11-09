import { redirect } from "next/navigation";

export default async function Orders() {
  return redirect("/backoffice/orders/cooking");
}
