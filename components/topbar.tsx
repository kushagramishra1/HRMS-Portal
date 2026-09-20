"use client";
import { Bell, Menu, Search } from "lucide-react";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  return <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-[rgba(246,247,251,0.88)] px-4 backdrop-blur md:px-8">
    <div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden"><Menu size={18}/></button><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex"><Search size={16} className="text-slate-400"/><input className="w-52 bg-transparent text-sm outline-none" placeholder="Search employees..."/></div></div>
    <div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 bg-white p-2.5"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500"/></button><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">AD</div><div className="hidden text-left sm:block"><div className="text-xs font-semibold">Admin</div><div className="text-[11px] text-slate-500">HR Manager</div></div></div></div>
  </header>;
}
