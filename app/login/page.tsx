"use client";
import { useState } from "react";
import { ArrowRight, LockKeyhole, UsersRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@peoplehub.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@peoplehub.com" && password === "admin123") {
      localStorage.setItem("hrms-demo-auth", "true");
      window.location.href = "/dashboard";
    } else setError("Use the demo credentials shown below.");
  };
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
      <div className="hidden bg-indigo-600 p-10 text-white md:block">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-black">P</div>
        <div className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">B.Tech CSE Project</div>
        <h1 className="mt-4 text-4xl font-black leading-tight">Simple HRMS that actually demonstrates full-stack skills.</h1>
        <p className="mt-5 max-w-sm text-sm leading-6 text-indigo-100">Employees, attendance, leaves and a management dashboard backed by a real SQLite database.</p>
        <div className="mt-10 flex items-center gap-3 text-sm"><UsersRound size={18}/><span>React 19.3 + Next.js 16.3 + Prisma 7</span></div>
      </div>
      <div className="p-7 sm:p-10">
        <div className="md:hidden flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black text-white">P</div><div><div className="font-bold">PeopleHub</div><div className="text-xs text-slate-500">HR Management</div></div></div>
        <h2 className="mt-8 text-2xl font-black md:mt-0">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to the HR admin dashboard.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></div>
          {error && <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</div>}
          <button className="btn btn-primary w-full"><LockKeyhole size={16}/> Sign in <ArrowRight size={16}/></button>
        </form>
        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600"><div className="font-bold text-slate-800">Demo credentials</div><div className="mt-1">admin@peoplehub.com / admin123</div></div>
      </div>
    </div>
  </main>;
}
