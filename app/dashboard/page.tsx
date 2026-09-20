export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowUpRight, CalendarCheck2, ClipboardList, UserPlus, Users, UserRoundCheck } from "lucide-react";
import { prisma } from "../../lib/prisma";
import { formatDate, initials } from "../../lib/utils";

export default async function DashboardPage() {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const [employees, attendance, pendingLeaves, recentEmployees, recentLeaves, presentToday] = await Promise.all([
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.attendance.count({ where: { date: start } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.employee.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.leaveRequest.findMany({ where: { status: "PENDING" }, include: { employee: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.attendance.count({ where: { date: start, status: { in: ["PRESENT", "HALF_DAY", "WORK_FROM_HOME"] } } })
  ]);
  const attendanceRate = employees ? Math.round((presentToday / employees) * 100) : 0;
  const stats = [
    { label: "Active employees", value: employees, note: "Current workforce", icon: Users },
    { label: "Attendance today", value: `${attendanceRate}%`, note: `${presentToday} marked present`, icon: UserRoundCheck },
    { label: "Pending leaves", value: pendingLeaves, note: "Need HR action", icon: ClipboardList },
    { label: "Marked today", value: attendance, note: "Attendance records", icon: CalendarCheck2 }
  ];
  return <div className="space-y-7">
    <div><div className="text-sm font-semibold text-indigo-600">Good evening, Admin</div><h1 className="mt-1 text-3xl font-black tracking-tight">HR overview</h1><p className="mt-2 text-sm text-slate-500">A simple snapshot of your workforce and today’s activity.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({label,value,note,icon:Icon})=><div key={label} className="card p-5"><div className="flex items-center justify-between"><div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Icon size={18}/></div><span className="text-xs font-semibold text-slate-400">LIVE</span></div><div className="mt-5 text-3xl font-black">{value}</div><div className="mt-1 text-sm font-semibold">{label}</div><div className="mt-2 text-xs text-slate-500">{note}</div></div>)}</div>
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">Recently added employees</h2><p className="mt-0.5 text-xs text-slate-500">Latest people added to the system</p></div><Link href="/employees" className="text-xs font-bold text-indigo-600">View all</Link></div><div className="divide-y divide-slate-100">{recentEmployees.map(e=><div key={e.id} className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">{initials(e.firstName,e.lastName)}</div><div><div className="text-sm font-bold">{e.firstName} {e.lastName}</div><div className="text-xs text-slate-500">{e.designation} · {e.department}</div></div></div><div className="text-right"><div className="badge bg-emerald-50 text-emerald-700">Active</div><div className="mt-1 text-[11px] text-slate-400">Joined {formatDate(e.joinDate)}</div></div></div>)}</div></section>
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">Leave approvals</h2><p className="mt-0.5 text-xs text-slate-500">Pending requests needing a decision</p></div><Link href="/leaves" className="text-xs font-bold text-indigo-600">Open</Link></div><div className="divide-y divide-slate-100">{recentLeaves.length === 0 ? <div className="p-5 text-sm text-slate-500">No pending requests.</div> : recentLeaves.map(l=><div key={l.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><div className="text-sm font-bold">{l.employee.firstName} {l.employee.lastName}</div><div className="mt-1 text-xs text-slate-500">{l.type.replace("_"," ")} · {formatDate(l.startDate)} - {formatDate(l.endDate)}</div></div><div className="badge bg-amber-50 text-amber-700">Pending</div></div>)}</div></section>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Link href="/employees" className="card group p-5"><div className="flex items-center justify-between"><div><div className="text-sm font-bold">Add employee</div><div className="mt-1 text-xs text-slate-500">Create a staff profile</div></div><UserPlus size={18} className="text-indigo-600"/></div><div className="mt-5 flex items-center gap-1 text-xs font-bold text-indigo-600">Manage employees <ArrowUpRight size={14}/></div></Link>
      <Link href="/attendance" className="card group p-5"><div className="flex items-center justify-between"><div><div className="text-sm font-bold">Mark attendance</div><div className="mt-1 text-xs text-slate-500">Record today’s status</div></div><CalendarCheck2 size={18} className="text-indigo-600"/></div><div className="mt-5 flex items-center gap-1 text-xs font-bold text-indigo-600">Open attendance <ArrowUpRight size={14}/></div></Link>
      <Link href="/leaves" className="card group p-5"><div className="flex items-center justify-between"><div><div className="text-sm font-bold">Review leaves</div><div className="mt-1 text-xs text-slate-500">Approve or reject requests</div></div><ClipboardList size={18} className="text-indigo-600"/></div><div className="mt-5 flex items-center gap-1 text-xs font-bold text-indigo-600">Review requests <ArrowUpRight size={14}/></div></Link>
    </div>
  </div>;
}
