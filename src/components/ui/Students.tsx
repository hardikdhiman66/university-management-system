import { useMemo, useState } from "react";
import { Search, Plus, X } from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  status: "Active" | "Inactive";
};

const initialStudents: Student[] = [
  {
    id: "UNI001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    department: "Computer Science",
    year: "2nd Year",
    status: "Active",
  },
  {
    id: "UNI002",
    name: "Priya Verma",
    email: "priya@example.com",
    department: "Business",
    year: "1st Year",
    status: "Active",
  },
  {
    id: "UNI003",
    name: "Kabir Singh",
    email: "kabir@example.com",
    department: "Engineering",
    year: "3rd Year",
    status: "Inactive",
  },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [year, setYear] = useState("1st Year");

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();

    return students.filter((student) =>
      [
        student.id,
        student.name,
        student.email,
        student.department,
        student.year,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [students, search]);

  function addStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newStudent: Student = {
      id: `UNI${String(students.length + 1).padStart(3, "0")}`,
      name: name.trim(),
      email: email.trim(),
      department,
      year,
      status: "Active",
    };

    setStudents((current) => [...current, newStudent]);
    setName("");
    setEmail("");
    setDepartment("Computer Science");
    setYear("1st Year");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage student records and information.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative mb-5 max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-medium">Student ID</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Year</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4 font-medium text-slate-700">
                    {student.id}
                  </td>
                  <td className="px-3 py-4 font-medium text-slate-900">
                    {student.name}
                  </td>
                  <td className="px-3 py-4 text-slate-600">
                    {student.email}
                  </td>
                  <td className="px-3 py-4 text-slate-600">
                    {student.department}
                  </td>
                  <td className="px-3 py-4 text-slate-600">{student.year}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={addStudent}
            className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Add New Student
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Business</option>
                <option>Mathematics</option>
                <option>Arts</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Academic year
              </label>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Student
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}