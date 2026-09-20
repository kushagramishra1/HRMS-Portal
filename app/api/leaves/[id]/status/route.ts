import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    const request = await prisma.leaveRequest.update({ where: { id: Number(id) }, data: { status } });
    return NextResponse.json({ request });
  } catch {
    return NextResponse.json({ error: "Could not update leave status." }, { status: 400 });
  }
}
