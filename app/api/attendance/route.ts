import { NextResponse } from "next/server";
import { listAttendance, saveAttendance } from "../../../lib/db";

function dateOnly(value?: string) {
  if (value) return value;
  return new Date().toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? undefined;
  const records = listAttendance(dateOnly(date));
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const date = dateOnly(body.date);
    const record = saveAttendance({
      employeeId: Number(body.employeeId), date, status: body.status, checkIn: body.checkIn || null, checkOut: body.checkOut || null
    });
    return NextResponse.json({ record });
  } catch {
    return NextResponse.json({ error: "Could not save attendance." }, { status: 400 });
  }
}
