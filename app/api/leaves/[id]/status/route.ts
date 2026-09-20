import { NextResponse } from "next/server";
import { updateLeaveStatus } from "../../../../../lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    const request = updateLeaveStatus(Number(id), status);
    return NextResponse.json({ request });
  } catch {
    return NextResponse.json({ error: "Could not update leave status." }, { status: 400 });
  }
}
