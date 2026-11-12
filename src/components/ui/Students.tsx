import { useEffect, useMemo, useState } from "react";
import { Search, Plus, X, Trash2, Sparkles, Users, GraduationCap } from "lucide-react";
import {
  fetchDashboardData,
  createStudentRecord,
  deleteStudentRecord,
} from "../../lib/umsApi";

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [regNo, setRegNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  async function loadStudents() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await fetchDashboardData();
      setStudents(data.students);
      setDepartments(data.departments);
      if (!departmentId && data.departments.length > 0) {
        setDepartmentId(data.departments[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) =>
      [
        s.registration_no,
        s.first_name,
        s.last_name,
        s.email ?? "",
        s.programs?.departments?.name ?? "",
      ].some((v) => String(v).toLowerCase().includes(term))
    );
  }, [students, search]);

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!departmentId) {
      setErrorMsg("Please create a Department first before adding a student.");
      return;
    }
    try {
      setSaving(true);
      setErrorMsg(null);
      await createStudentRecord({
        registration_no: regNo.trim().toUpperCase(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        department_id: departmentId,
      });
      setRegNo("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setShowForm(false);
      await loadStudents();
      showToast("Student added successfully");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Could not add student");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStudentRecord(id);
      await loadStudents();
      showToast("Student deleted successfully");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Could not delete student");
    }
  }

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <span className="h-2 w-2 rounded-full bg-white" />
          {toastMsg}
        </div>
      )}
      {/* Creative Module Banner with Quote */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-slate-100/80 p-6 text-slate-900 shadow-xs">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-500/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur-xs">
              <Sparkles size={13} /> Student Directory & Enrollment
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Student Records Portal</h2>
            <p className="mt-1.5 text-sm italic text-slate-500">
              “Education is the most powerful weapon which you can use to change the world.” — Nelson Mandela
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 backdrop-blur-xs">
            <Users className="text-slate-700" size={22} />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Enrolled</p>
              <p className="text-xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Reg ID, name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-3 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close Form" : "Add New Student"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddStudent}
          className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
        >
          <input
            type="text"
            placeholder="Reg No (e.g. 25BCS101)"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          >
            {departments.length === 0 && <option value="">No departments found</option>}
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 sm:col-span-2 lg:col-span-5"
          >
            {saving ? "Saving Student..." : "Save Student to Database"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Registered Students ({filteredStudents.length})</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-900">Live Sync</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Reg ID</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <GraduationCap size={32} className="mx-auto mb-2 text-slate-300" />
                    {loading ? "Loading students..." : "No students found. Click Add New Student above!"}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const initials = `${s.first_name?.[0] ?? ""}${s.last_name?.[0] ?? ""}`.toUpperCase();
                  return (
                    <tr key={s.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-2xs">
                            {initials || "ST"}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {s.first_name} {s.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{s.registration_no}</td>
                      <td className="px-6 py-4 text-slate-500">{s.email || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{s.programs?.departments?.name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-900">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
