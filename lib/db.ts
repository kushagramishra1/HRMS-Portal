import Database from "better-sqlite3";
import path from "node:path";

type EmployeeInput = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string;
  designation: string;
  joinDate: string;
  salary: number | null;
};

type AttendanceInput = {
  employeeId: number;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
};

type LeaveWithEmployee = {
  id: number;
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
  employee: { employeeCode: string; firstName: string; lastName: string };
};

type EmployeeRow = {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string;
  designation: string;
  joinDate: string;
  status: string;
  salary: number | null;
  createdAt: string;
  updatedAt: string;
};

const isVercel = Boolean(process.env.VERCEL);
const databasePath = isVercel ? ":memory:" : process.env.DATABASE_PATH ?? path.join(process.cwd(), "dev.db");
const globalForDatabase = globalThis as unknown as { db?: Database.Database };
const db = globalForDatabase.db ?? new Database(databasePath);

db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS Employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeCode TEXT NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    joinDate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    salary REAL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS Attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    date TEXT NOT NULL,
    checkIn TEXT,
    checkOut TEXT,
    status TEXT NOT NULL DEFAULT 'PRESENT',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employeeId, date),
    FOREIGN KEY(employeeId) REFERENCES Employee(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS LeaveRequest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'CASUAL',
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employeeId) REFERENCES Employee(id) ON DELETE CASCADE
  );
`);

if (process.env.NODE_ENV !== "production") globalForDatabase.db = db;

export function listEmployees(): EmployeeRow[] {
  return db.prepare("SELECT * FROM Employee ORDER BY datetime(createdAt) DESC").all() as EmployeeRow[];
}

export function createEmployee(input: EmployeeInput) {
  const result = db.prepare(`
    INSERT INTO Employee (employeeCode, firstName, lastName, email, phone, department, designation, joinDate, salary, createdAt, updatedAt)
    VALUES (@employeeCode, @firstName, @lastName, @email, @phone, @department, @designation, @joinDate, @salary, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(input);
  return getEmployee(Number(result.lastInsertRowid));
}

export function getEmployee(id: number) {
  return db.prepare("SELECT * FROM Employee WHERE id = ?").get(id) as EmployeeRow | undefined;
}

export function updateEmployee(id: number, input: EmployeeInput) {
  db.prepare(`
    UPDATE Employee SET employeeCode=@employeeCode, firstName=@firstName, lastName=@lastName,
    email=@email, phone=@phone, department=@department, designation=@designation,
    joinDate=@joinDate, salary=@salary, updatedAt=CURRENT_TIMESTAMP WHERE id=@id
  `).run({ ...input, id });
  return getEmployee(id);
}

export function deleteEmployee(id: number) {
  return db.prepare("DELETE FROM Employee WHERE id = ?").run(id);
}

export function listAttendance(date: string) {
  return db.prepare(`
    SELECT a.*, e.employeeCode, e.firstName, e.lastName, e.department, e.designation
    FROM Attendance a JOIN Employee e ON e.id = a.employeeId
    WHERE a.date = ? ORDER BY e.firstName ASC, e.lastName ASC
  `).all(date);
}

export function saveAttendance(input: AttendanceInput) {
  db.prepare(`
    INSERT INTO Attendance (employeeId, date, status, checkIn, checkOut)
    VALUES (@employeeId, @date, @status, @checkIn, @checkOut)
    ON CONFLICT(employeeId, date) DO UPDATE SET status=@status, checkIn=@checkIn, checkOut=@checkOut
  `).run(input);
  return db.prepare("SELECT * FROM Attendance WHERE employeeId = ? AND date = ?").get(input.employeeId, input.date);
}

export function listLeaves(): LeaveWithEmployee[] {
  const rows = db.prepare(`
    SELECT l.*, e.employeeCode, e.firstName, e.lastName
    FROM LeaveRequest l JOIN Employee e ON e.id = l.employeeId
    ORDER BY datetime(l.createdAt) DESC
  `).all() as Record<string, unknown>[];
  return rows.map(withEmployee);
}

export function createLeave(input: { employeeId: number; type: string; startDate: string; endDate: string; reason: string }) {
  const result = db.prepare(`
    INSERT INTO LeaveRequest (employeeId, type, startDate, endDate, reason)
    VALUES (@employeeId, @type, @startDate, @endDate, @reason)
  `).run(input);
  return getLeave(Number(result.lastInsertRowid));
}

export function updateLeaveStatus(id: number, status: string) {
  db.prepare("UPDATE LeaveRequest SET status = ? WHERE id = ?").run(status, id);
  return getLeave(id);
}

function getLeave(id: number): LeaveWithEmployee | undefined {
  const row = db.prepare(`
    SELECT l.*, e.employeeCode, e.firstName, e.lastName
    FROM LeaveRequest l JOIN Employee e ON e.id = l.employeeId WHERE l.id = ?
  `).get(id) as Record<string, unknown> | undefined;
  return row ? withEmployee(row) : undefined;
}

export function getDashboardData(date: string) {
  const employees = db.prepare("SELECT COUNT(*) AS count FROM Employee WHERE status = 'ACTIVE'").get() as { count: number };
  const attendance = db.prepare("SELECT COUNT(*) AS count FROM Attendance WHERE date = ?").get(date) as { count: number };
  const pendingLeaves = db.prepare("SELECT COUNT(*) AS count FROM LeaveRequest WHERE status = 'PENDING'").get() as { count: number };
  const presentToday = db.prepare("SELECT COUNT(*) AS count FROM Attendance WHERE date = ? AND status IN ('PRESENT', 'HALF_DAY', 'WORK_FROM_HOME')").get(date) as { count: number };
  const recentEmployees = db.prepare("SELECT * FROM Employee ORDER BY datetime(createdAt) DESC LIMIT 5").all() as EmployeeRow[];
  const recentLeaveRows = db.prepare(`
    SELECT l.*, e.employeeCode, e.firstName, e.lastName
    FROM LeaveRequest l JOIN Employee e ON e.id = l.employeeId
    WHERE l.status = 'PENDING' ORDER BY datetime(l.createdAt) DESC LIMIT 4
  `).all() as Record<string, unknown>[];
  return { employees: employees.count, attendance: attendance.count, pendingLeaves: pendingLeaves.count, presentToday: presentToday.count, recentEmployees, recentLeaves: recentLeaveRows.map(withEmployee) };
}

function withEmployee(row: Record<string, unknown>): LeaveWithEmployee {
  return {
    id: Number(row.id), employeeId: Number(row.employeeId), type: String(row.type),
    startDate: String(row.startDate), endDate: String(row.endDate), reason: String(row.reason),
    status: String(row.status), createdAt: String(row.createdAt),
    employee: { employeeCode: String(row.employeeCode), firstName: String(row.firstName), lastName: String(row.lastName) }
  };
}

export function resetDatabase() {
  db.exec("DELETE FROM LeaveRequest; DELETE FROM Attendance; DELETE FROM Employee;");
}

export function seedEmployee(input: EmployeeInput) {
  return createEmployee(input);
}

export function seedAttendance(input: AttendanceInput) {
  return saveAttendance(input);
}

export function seedLeave(input: { employeeId: number; type: string; startDate: string; endDate: string; reason: string; status: string }) {
  const result = db.prepare(`
    INSERT INTO LeaveRequest (employeeId, type, startDate, endDate, reason, status)
    VALUES (@employeeId, @type, @startDate, @endDate, @reason, @status)
  `).run(input);
  return getLeave(Number(result.lastInsertRowid));
}

function seedVercelDatabase() {
  const existing = db.prepare("SELECT COUNT(*) AS count FROM Employee").get() as { count: number };
  if (existing.count > 0) return;

  const seed = db.transaction(() => {
    const employees = [
      ["EMP001", "Aarav", "Sharma", "aarav@company.com", "Engineering", "Software Engineer"],
      ["EMP002", "Priya", "Singh", "priya@company.com", "Human Resources", "HR Executive"],
      ["EMP003", "Rohan", "Verma", "rohan@company.com", "Design", "UI/UX Designer"],
      ["EMP004", "Meera", "Gupta", "meera@company.com", "Finance", "Finance Analyst"],
      ["EMP005", "Kabir", "Khan", "kabir@company.com", "Engineering", "QA Engineer"]
    ];
    const insertEmployee = db.prepare(`
      INSERT INTO Employee (employeeCode, firstName, lastName, email, department, designation, joinDate, salary, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    const insertAttendance = db.prepare(`
      INSERT INTO Attendance (employeeId, date, checkIn, status) VALUES (?, ?, ?, ?)
    `);
    const today = new Date().toISOString().slice(0, 10);
    employees.forEach((employee, index) => {
      const result = insertEmployee.run(...employee.slice(0, 4), employee[4], employee[5], "2025-01-01T00:00:00.000Z", 500000);
      insertAttendance.run(Number(result.lastInsertRowid), today, index === 2 ? "09:38" : "09:10", index === 3 ? "WORK_FROM_HOME" : "PRESENT");
    });
  });
  seed();
}

if (isVercel) seedVercelDatabase();
