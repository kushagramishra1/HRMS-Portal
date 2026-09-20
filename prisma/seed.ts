import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const today = new Date();
today.setHours(0, 0, 0, 0);

async function main() {
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employee.deleteMany();

  const employees = await prisma.employee.createManyAndReturn({
    data: [
      { employeeCode: "EMP001", firstName: "Aarav", lastName: "Sharma", email: "aarav@company.com", phone: "9876543210", department: "Engineering", designation: "Software Engineer", joinDate: new Date("2025-07-01"), salary: 650000 },
      { employeeCode: "EMP002", firstName: "Priya", lastName: "Singh", email: "priya@company.com", phone: "9876543211", department: "Human Resources", designation: "HR Executive", joinDate: new Date("2024-11-18"), salary: 520000 },
      { employeeCode: "EMP003", firstName: "Rohan", lastName: "Verma", email: "rohan@company.com", phone: "9876543212", department: "Design", designation: "UI/UX Designer", joinDate: new Date("2025-02-10"), salary: 580000 },
      { employeeCode: "EMP004", firstName: "Meera", lastName: "Gupta", email: "meera@company.com", phone: "9876543213", department: "Finance", designation: "Finance Analyst", joinDate: new Date("2023-08-21"), salary: 610000 },
      { employeeCode: "EMP005", firstName: "Kabir", lastName: "Khan", email: "kabir@company.com", phone: "9876543214", department: "Engineering", designation: "QA Engineer", joinDate: new Date("2025-03-05"), salary: 550000 }
    ]
  });

  await prisma.attendance.createMany({
    data: employees.map((employee, index) => ({
      employeeId: employee.id,
      date: today,
      checkIn: index === 2 ? "09:38" : "09:10",
      checkOut: index === 1 ? "18:00" : undefined,
      status: index === 3 ? "WORK_FROM_HOME" : "PRESENT"
    }))
  });

  await prisma.leaveRequest.createMany({
    data: [
      { employeeId: employees[1].id, type: "SICK", startDate: new Date("2026-09-22"), endDate: new Date("2026-09-23"), reason: "Medical appointment", status: "PENDING" },
      { employeeId: employees[2].id, type: "CASUAL", startDate: new Date("2026-09-25"), endDate: new Date("2026-09-26"), reason: "Personal work", status: "APPROVED" },
      { employeeId: employees[0].id, type: "EARNED", startDate: new Date("2026-10-05"), endDate: new Date("2026-10-07"), reason: "Family function", status: "PENDING" }
    ]
  });

  console.log(`Seeded ${employees.length} employees.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
