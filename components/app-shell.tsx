"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (pathname === "/login") return;
    if (typeof window !== "undefined" && localStorage.getItem("hrms-demo-auth") !== "true") router.replace("/login");
  }, [pathname, router]);
  if (pathname === "/login") return <>{children}</>;
  return <div><Sidebar open={open} onClose={() => setOpen(false)}/><main className="lg:pl-64"><Topbar onMenu={() => setOpen(true)}/><div className="px-4 py-6 md:px-8 md:py-8">{children}</div></main></div>;
}
