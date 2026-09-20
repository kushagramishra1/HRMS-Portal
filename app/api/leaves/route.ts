import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const requests = await prisma.leaveRequest.findMany({ include: { employee: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const request = await prisma.leaveRequest.create({
      data: { employeeId: Number(body.employeeId), type: body.type, startDate: new Date(`${body.startDate}T00:00:00`), endDate: new Date(`${body.endDate}T00:00:00`), reason: String(body.reason).trim() }
    });
    return NextResponse.json({ request }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create leave request." }, { status: 400 });
  }
}
