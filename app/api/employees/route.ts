import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["employeeCode","firstName","lastName","email","department","designation","joinDate"];
    for (const key of required) if (!body[key]) return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    const employee = await prisma.employee.create({
      data: {
        employeeCode: String(body.employeeCode).trim(), firstName: String(body.firstName).trim(), lastName: String(body.lastName).trim(), email: String(body.email).trim().toLowerCase(), phone: body.phone ? String(body.phone).trim() : null,
        department: String(body.department), designation: String(body.designation).trim(), joinDate: new Date(`${body.joinDate}T00:00:00`), salary: body.salary === null || body.salary === "" ? null : Number(body.salary)
      }
    });
    return NextResponse.json({ employee }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message.includes("Unique constraint") ? "Employee ID or email already exists." : "Could not create employee.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
