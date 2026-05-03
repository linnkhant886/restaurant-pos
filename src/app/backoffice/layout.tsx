import { ReactNode } from "react";
import { Sidebar } from "@/components/backoffice/Sidebar";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { Topbar } from "@/components/backoffice/Topbar";

interface Props {
  children: ReactNode;
}

export default async function BackofficeLayout({ children }: Props) {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--rf-cream)" }}>
      <Sidebar
        userName={session?.user?.name ?? "User"}
        userImage={session?.user?.image ?? ""}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
