import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        employeeCode: String(body.employeeCode).trim(), firstName: String(body.firstName).trim(), lastName: String(body.lastName).trim(), email: String(body.email).trim().toLowerCase(), phone: body.phone ? String(body.phone).trim() : null,
        department: String(body.department), designation: String(body.designation).trim(), joinDate: new Date(`${body.joinDate}T00:00:00`), salary: body.salary === null || body.salary === "" ? null : Number(body.salary)
      }
    });
    return NextResponse.json({ employee });
  } catch {
    return NextResponse.json({ error: "Could not update employee." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.employee.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete employee." }, { status: 400 });
  }
}
