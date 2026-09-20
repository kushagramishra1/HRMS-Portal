import type { Metadata } from "next";
import "./globals.css";
import AppShell from "../components/app-shell";

export const metadata: Metadata = {
  title: "PeopleHub HRMS",
  description: "Simple Human Resource Management System for academic project"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
