import { NextResponse } from "next/server";
import { createLeave, listLeaves } from "../../../lib/db";

export async function GET() {
  const requests = listLeaves();
  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const request = createLeave({
      employeeId: Number(body.employeeId), type: body.type, startDate: `${body.startDate}T00:00:00.000Z`, endDate: `${body.endDate}T00:00:00.000Z`, reason: String(body.reason).trim()
    });
    return NextResponse.json({ request }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create leave request." }, { status: 400 });
  }
}
