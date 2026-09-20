import {
  resetDatabase,
  seedAttendance,
  seedEmployee,
  seedLeave
} from "../lib/db";

const today = new Date().toISOString().slice(0, 10);

function main() {
  resetDatabase();
  const employees = [
    { employeeCode: "EMP001", firstName: "Aarav", lastName: "Sharma", email: "aarav@company.com", phone: "9876543210", department: "Engineering", designation: "Software Engineer", joinDate: "2025-07-01T00:00:00.000Z", salary: 650000 },
    { employeeCode: "EMP002", firstName: "Priya", lastName: "Singh", email: "priya@company.com", phone: "9876543211", department: "Human Resources", designation: "HR Executive", joinDate: "2024-11-18T00:00:00.000Z", salary: 520000 },
    { employeeCode: "EMP003", firstName: "Rohan", lastName: "Verma", email: "rohan@company.com", phone: "9876543212", department: "Design", designation: "UI/UX Designer", joinDate: "2025-02-10T00:00:00.000Z", salary: 580000 },
    { employeeCode: "EMP004", firstName: "Meera", lastName: "Gupta", email: "meera@company.com", phone: "9876543213", department: "Finance", designation: "Finance Analyst", joinDate: "2023-08-21T00:00:00.000Z", salary: 610000 },
    { employeeCode: "EMP005", firstName: "Kabir", lastName: "Khan", email: "kabir@company.com", phone: "9876543214", department: "Engineering", designation: "QA Engineer", joinDate: "2025-03-05T00:00:00.000Z", salary: 550000 }
  ];
  const created = employees.map(seedEmployee);

  created.forEach((employee, index) => seedAttendance({
    employeeId: Number((employee as { id: number }).id),
    date: today,
    checkIn: index === 2 ? "09:38" : "09:10",
    checkOut: index === 1 ? "18:00" : null,
    status: index === 3 ? "WORK_FROM_HOME" : "PRESENT"
  }));

  seedLeave({ employeeId: Number((created[1] as { id: number }).id), type: "SICK", startDate: "2026-09-22T00:00:00.000Z", endDate: "2026-09-23T00:00:00.000Z", reason: "Medical appointment", status: "PENDING" });
  seedLeave({ employeeId: Number((created[2] as { id: number }).id), type: "CASUAL", startDate: "2026-09-25T00:00:00.000Z", endDate: "2026-09-26T00:00:00.000Z", reason: "Personal work", status: "APPROVED" });
  seedLeave({ employeeId: Number((created[0] as { id: number }).id), type: "EARNED", startDate: "2026-10-05T00:00:00.000Z", endDate: "2026-10-07T00:00:00.000Z", reason: "Family function", status: "PENDING" });
  console.log(`Seeded ${created.length} employees.`);
}

main();
