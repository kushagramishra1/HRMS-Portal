import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function dateOnly(value?: string) {
  const d = value ? new Date(`${value}T00:00:00`) : new Date();
  d.setHours(0,0,0,0); return d;
}

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? undefined;
  const records = await prisma.attendance.findMany({ where: { date: dateOnly(date) }, include: { employee: true }, orderBy: { employee: { firstName: "asc" } } });
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const date = dateOnly(body.date);
    const record = await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId: Number(body.employeeId), date } },
      create: { employeeId: Number(body.employeeId), date, status: body.status, checkIn: body.checkIn || null, checkOut: body.checkOut || null },
      update: { status: body.status, checkIn: body.checkIn || null, checkOut: body.checkOut || null }
    });
    return NextResponse.json({ record });
  } catch {
    return NextResponse.json({ error: "Could not save attendance." }, { status: 400 });
  }
}
