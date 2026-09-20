"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarCheck2, ClipboardList, LayoutDashboard, LogOut, Users, X } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck2 },
  { href: "/leaves", label: "Leave Requests", icon: ClipboardList }
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3 pb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white">P</div>
            <div><div className="font-bold">PeopleHub</div><div className="text-xs text-slate-500">HR Management</div></div>
          </div>
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={onClose}><X size={18}/></button>
        </div>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={18}/>{label}</Link>;
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AD</div><div><div className="text-sm font-semibold">Admin</div><div className="text-xs text-slate-500">HR Manager</div></div></div>
            <button className="mt-4 flex w-full items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900" onClick={() => { localStorage.removeItem("hrms-demo-auth"); window.location.href = "/login"; }}><LogOut size={15}/> Sign out</button>
          </div>
        </div>
      </aside>
    </>
  );
}
