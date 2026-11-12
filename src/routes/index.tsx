import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  CalendarCheck, ClipboardList, Wallet, Library,
  BarChart3, Settings, Bell, Search, Menu,
  ChevronDown, Plus, ArrowUpRight, Clock,
  Building2, UserRound, LogOut
} from "lucide-react";
import Students from "../components/ui/Students";

export const Route = createFileRoute("/")({
  component: Index,
});

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Faculty", icon: GraduationCap },
  { label: "Departments", icon: Building2 },
  { label: "Courses", icon: BookOpen },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Examinations", icon: ClipboardList },
  { label: "Fees & Payments", icon: Wallet },
  { label: "Library", icon: Library },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Students", value: "2,450", change: "+12.5%", icon: Users },
  { label: "Faculty Members", value: "148", change: "+4.2%", icon: GraduationCap },
  { label: "Active Courses", value: "86", change: "+8.1%", icon: BookOpen },
  { label: "Fee Collection", value: "₹18.5L", change: "+10.3%", icon: Wallet },
];

const students = [
  { name: "Aarav Sharma", id: "STU2026001", department: "Computer Science", status: "Active" },
  { name: "Priya Verma", id: "STU2026002", department: "Information Technology", status: "Active" },
  { name: "Rahul Singh", id: "STU2026003", department: "Mechanical Engineering", status: "Pending" },
  { name: "Ananya Gupta", id: "STU2026004", department: "Computer Science", status: "Active" },
];

function Index() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#101d35] text-white transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold">U</div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">UniSphere</h1>
            <p className="text-xs text-slate-400">UNIVERSITY ERP</p>
          </div>
        </div>

        <div className="px-5 pt-7 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActive(item.label);
                  setMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${active === item.label
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold">AD</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-400">System Admin</p>
            </div>
            <LogOut size={17} className="text-slate-400" />
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold">{active}</h2>
              <p className="hidden text-xs text-slate-500 sm:block">University Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 sm:block">
              <Search size={19} />
            </button>
            <button className="relative rounded-lg border border-slate-200 p-2 text-slate-500">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">A</div>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </header>

        <div className="space-y-7 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin! 👋</h1>
              <p className="mt-1 text-sm text-slate-500">Here's what's happening across your university.</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              <Plus size={17} /> Add New Record
            </button>
          </div>

          {active === "Students" ? (
            <Students />
          ) : active !== "Dashboard" ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold">{active}</h2>
              <p className="mt-2 text-sm text-slate-500">
                This module is coming soon.
              </p>
              <button
                onClick={() => setActive("Dashboard")}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                          <Icon size={22} />
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-600">
                          <ArrowUpRight size={15} /> {stat.change}
                        </span>
                      </div>
                      <p className="mt-5 text-sm text-slate-500">{stat.label}</p>
                      <h3 className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">University Overview</h3>
                      <p className="mt-1 text-xs text-slate-500">Illustrative student enrollment data</p>
                    </div>
                    <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">This Year</span>
                  </div>
                  <div className="mt-8 flex h-52 items-end justify-around gap-3 border-b border-slate-100 pb-2">
                    {[42, 65, 53, 80, 62, 92, 72, 100, 78, 88, 68, 95].map((height, i) => (
                      <div key={i} className="flex h-full flex-1 flex-col justify-end">
                        <div style={{ height: `${height}%` }} className="rounded-t-md bg-blue-500 transition hover:bg-blue-700" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900">Quick Actions</h3>
                  <p className="mt-1 text-xs text-slate-500">Frequently used operations</p>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Add Student", Users],
                      ["Add Faculty", UserRound],
                      ["Create Course", BookOpen],
                      ["Record Payment", Wallet],
                    ].map(([label, Icon]: any) => (
                      <button key={label} className="flex w-full items-center gap-3 rounded-lg border border-slate-100 p-3 text-left text-sm font-medium hover:border-blue-200 hover:bg-blue-50">
                        <span className="rounded-lg bg-blue-50 p-2 text-blue-600"><Icon size={18} /></span>
                        {label}
                        <ArrowUpRight size={15} className="ml-auto text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                  <div>
                    <h3 className="font-bold text-slate-900">Recent Students</h3>
                    <p className="mt-1 text-xs text-slate-500">Illustrative records for the dashboard preview</p>
                  </div>
                  <button onClick={() => setActive("Students")} className="text-sm font-semibold text-blue-600 hover:underline">View all students</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Registration ID</th>
                        <th className="px-5 py-4">Department</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t border-slate-100">
                          <td className="px-5 py-4 font-semibold">{student.name}</td>
                          <td className="px-5 py-4 text-slate-500">{student.id}</td>
                          <td className="px-5 py-4 text-slate-500">{student.department}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${student.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{student.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={14} /> Dashboard preview uses sample data, not live database records.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
