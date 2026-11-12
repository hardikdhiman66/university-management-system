import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Wallet,
  Library,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Clock,
  Building2,
  UserRound,
  LogOut,
  Trash2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Students from "../components/ui/Students";
import {
  fetchDashboardData,
  createDepartment,
  deleteDepartment,
  createFacultyRecord,
  deleteFacultyRecord,
  createCourseRecord,
  deleteCourseRecord,
  recordAttendance,
  createExaminationRecord,
  deleteExaminationRecord,
  createStudentFeeRecord,
  markFeePaid,
  createBookRecord,
  deleteBookRecord,
} from "../lib/umsApi";

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

const moduleQuotes: Record<string, { badge: string; title: string; quote: string; gradient: string }> = {
  Faculty: {
    badge: "Academic Leadership",
    title: "Faculty & Mentors Hub",
    quote: "“A good teacher can inspire hope, ignite the imagination, and instill a love of learning.” — Brad Henry",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Departments: {
    badge: "Academic Structure",
    title: "University Departments",
    quote: "“Great institutions are built on strong foundations and collaborative disciplines.” — Academic Excellence",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Courses: {
    badge: "Curriculum & Credits",
    title: "Course Catalog & Syllabus",
    quote: "“Live as if you were to die tomorrow. Learn as if you were to live forever.” — Mahatma Gandhi",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Attendance: {
    badge: "Daily Discipline",
    title: "Attendance Tracking",
    quote: "“Success is the sum of small efforts, repeated day in and day out.” — Robert Collier",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Examinations: {
    badge: "Assessments & Evaluation",
    title: "Examinations & Schedules",
    quote: "“Excellence is a continuous process and not an accident.” — Dr. A.P.J. Abdul Kalam",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  "Fees & Payments": {
    badge: "Finance & Billing",
    title: "Student Fee Invoices & Ledger",
    quote: "“An investment in knowledge always pays the best interest.” — Benjamin Franklin",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Library: {
    badge: "Knowledge Repository",
    title: "Digital & Central Library",
    quote: "“A room without books is like a body without a soul.” — Marcus Tullius Cicero",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Reports: {
    badge: "Real-Time Analytics",
    title: "Institutional Intelligence & Reports",
    quote: "“Without data, you're just another person with an opinion.” — W. Edwards Deming",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
  Settings: {
    badge: "Infrastructure & Config",
    title: "System & Database Configuration",
    quote: "“Simplicity is the ultimate sophistication.” — Leonardo da Vinci",
    gradient: "from-white via-slate-50 to-slate-100/80",
  },
};

function UmsLogo({ size = "md" }: { size?: "md" | "lg" }) {
  const dims = size === "lg" ? "h-16 w-16 rounded-2xl" : "h-10 w-10 rounded-xl";
  return (
    <div className={`${dims} relative flex shrink-0 items-center justify-center border border-slate-200 bg-slate-900 text-white shadow-xs transition-transform duration-300 hover:scale-105`}>
      <svg viewBox="0 0 40 40" fill="none" className={size === "lg" ? "h-9 w-9" : "h-6 w-6"}>
        <path
          d="M20 5L32 10V19.5C32 27.2 26.8 33.8 20 36C13.2 33.8 8 27.2 8 19.5V10L20 5Z"
          fill="white"
          fillOpacity="0.08"
          stroke="white"
          strokeWidth="2.2"
        />
        <path d="M20 12L28.5 16L20 20L11.5 16L20 12Z" fill="white" />
        <path
          d="M15 18.5V23C15 25.1 17.2 26.8 20 26.8C22.8 26.8 25 25.1 25 23V18.5"
          stroke="#94A3B8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function Index() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@ums.edu");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [feesList, setFeesList] = useState<any[]>([]);
  const [booksList, setBooksList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  // Department form
  const [deptCode, setDeptCode] = useState("");
  const [deptName, setDeptName] = useState("");

  // Faculty form
  const [empNo, setEmpNo] = useState("");
  const [designation, setDesignation] = useState("");
  const [facultyDeptId, setFacultyDeptId] = useState("");

  // Course form
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCredits, setCourseCredits] = useState(4);
  const [courseDeptId, setCourseDeptId] = useState("");

  // Attendance form
  const [attStudentId, setAttStudentId] = useState("");
  const [attCourseId, setAttCourseId] = useState("");
  const [attDate, setAttDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attStatus, setAttStatus] = useState<"present" | "absent" | "late" | "excused">("present");

  // Exam form
  const [examCourseId, setExamCourseId] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("Mid-Term");
  const [examMaxMarks, setExamMaxMarks] = useState(100);
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Fees form
  const [feeStudentId, setFeeStudentId] = useState("");
  const [feeName, setFeeName] = useState("Semester Tuition Fee");
  const [feeBilled, setFeeBilled] = useState(65000);
  const [feePaid, setFeePaid] = useState(0);
  const [feeDueDate, setFeeDueDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Library form
  const [bookIsbn, setBookIsbn] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookCopies, setBookCopies] = useState(5);

  async function loadLiveData() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetchDashboardData();
      setDepartments(res.departments);
      setStudents(res.students);
      setFacultyList(res.faculty);
      setCoursesList(res.courses);
      setAttendanceList(res.attendance);
      setExamsList(res.examinations);
      setFeesList(res.fees);
      setBooksList(res.books);

      if (res.departments.length > 0) {
        if (!facultyDeptId) setFacultyDeptId(res.departments[0].id);
        if (!courseDeptId) setCourseDeptId(res.departments[0].id);
      }
      if (res.students.length > 0) {
        if (!attStudentId) setAttStudentId(res.students[0].id);
        if (!feeStudentId) setFeeStudentId(res.students[0].id);
      }
      if (res.courses.length > 0) {
        if (!attCourseId) setAttCourseId(res.courses[0].id);
        if (!examCourseId) setExamCourseId(res.courses[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to load data from Supabase");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLiveData();
  }, [active]);

  async function runAction(fn: () => Promise<void>, successText = "Changes saved successfully") {
    try {
      setSaving(true);
      setErrorMsg(null);
      await fn();
      await loadLiveData();
      showToast(successText);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Operation failed");
    } finally {
      setSaving(false);
    }
  }

  const totalFeesCollected = feesList.reduce((sum, f) => sum + Number(f.amount_paid || 0), 0);
  const totalFeesBilled = feesList.reduce((sum, f) => sum + Number(f.billed_amount || 0), 0);
  const presentCount = attendanceList.filter((a) => a.status === "present").length;
  const attendancePct =
    attendanceList.length > 0 ? `${Math.round((presentCount / attendanceList.length) * 100)}%` : "0%";

  const stats = [
    { label: "Total Students", value: loading ? "..." : String(students.length), change: "Live DB", icon: Users },
    { label: "Faculty Members", value: loading ? "..." : String(facultyList.length), change: "Live DB", icon: GraduationCap },
    { label: "Departments", value: loading ? "..." : String(departments.length), change: "Live DB", icon: Building2 },
    { label: "Active Courses", value: loading ? "..." : String(coursesList.length), change: "Live DB", icon: BookOpen },
  ];

  const currentBanner = moduleQuotes[active];

  if (signedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (loginEmail.trim().toLowerCase() === "admin@ums.edu" && loginPass === "admin123") {
              setLoginError("");
              setLoginPass("");
              setSignedOut(false);
            } else {
              setLoginError("Invalid email or password.");
            }
          }}
          className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg"
        >
          <div className="flex justify-center">
            <UmsLogo size="lg" />
          </div>
          <h2 className="mt-4 text-center text-xl font-bold text-slate-900">UMS Admin Login</h2>
          <p className="mt-1 text-center text-xs text-slate-500">Enter administrator credentials to unlock ERP</p>

          {loginError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600">
              {loginError}
            </div>
          )}

          <div className="mt-5 space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            Sign In
          </button>
          
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] text-slate-800">
      {/* Subtle Architectural Grid Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200/80 bg-white/95 text-slate-800 backdrop-blur-md transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className={`flex h-20 items-center border-b border-slate-100 ${sidebarCollapsed ? "justify-center px-2" : "gap-3.5 px-6"}`}>
          <UmsLogo size="md" />
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-wider text-slate-900">
                  UMS
                </h1>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-700">
                  ERP
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
                Academic Management
              </p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="px-5 pt-7 pb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </div>
        )}

        <nav className={`flex-1 space-y-1.5 overflow-y-auto px-3 ${sidebarCollapsed ? "pt-6" : ""}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                title={sidebarCollapsed ? item.label : undefined}
                onClick={() => {
                  setActive(item.label);
                  setMenuOpen(false);
                }}
                className={`group flex w-full items-center rounded-xl py-3 text-left text-sm transition-all duration-200 ${
                  sidebarCollapsed ? "justify-center px-2" : "gap-3 px-4"
                } ${
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className={`flex items-center rounded-xl bg-slate-100 p-2.5 ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
              AD
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">Administrator</p>
                  <p className="truncate text-xs text-slate-400">System Admin</p>
                </div>
                <button
                  onClick={() => setSignedOut(true)}
                  title="Sign Out"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-900"
                >
                  <LogOut size={17} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      <main className={`relative min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Rich Aurora Ambient Glows */}
        <div className="pointer-events-none fixed right-6 top-16 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none fixed bottom-6 left-1/4 -z-10 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none fixed top-1/2 right-1/3 -z-10 h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" />

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMenuOpen(!menuOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              title="Toggle Sidebar"
              className="rounded-lg border border-slate-200/80 bg-white p-2 text-slate-600 shadow-2xs transition hover:bg-slate-50"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold">{active}</h2>
              <p className="hidden text-xs text-slate-500 sm:block">University Management System</p>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            {searchOpen && (
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search students, courses, dept..."
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
                />
                {globalQuery.trim() && (
                  <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {[
                      ...students.map((s) => ({ label: `${s.registration_no} — ${s.first_name} ${s.last_name}`, tab: "Students" })),
                      ...coursesList.map((c) => ({ label: `${c.code} — ${c.title}`, tab: "Courses" })),
                      ...departments.map((d) => ({ label: `${d.code} — ${d.name}`, tab: "Departments" })),
                      ...facultyList.map((f) => ({ label: `${f.employee_no} — ${f.designation}`, tab: "Faculty" })),
                    ]
                      .filter((item) => item.label.toLowerCase().includes(globalQuery.toLowerCase()))
                      .slice(0, 6)
                      .map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActive(item.tab);
                            setSearchOpen(false);
                            setGlobalQuery("");
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-blue-50"
                        >
                          <span className="truncate font-medium text-slate-800">{item.label}</span>
                          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{item.tab}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              title="Global Search"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
            >
              <Search size={19} />
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setNotifRead(true);
                  setSearchOpen(false);
                  setProfileOpen(false);
                }}
                title="Notifications"
                className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
              >
                <Bell size={19} />
                {!notifRead && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}
              </button>

              {notifOpen && (
                <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  <p className="border-b border-slate-100 pb-2 text-xs font-bold uppercase text-slate-500">Live Alerts</p>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-800">
                      Database synced: <strong>{students.length}</strong> students & <strong>{coursesList.length}</strong> courses active.
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2.5 text-amber-800">
                      Pending Fee Dues: <strong>{feesList.filter((f) => f.status !== "paid").length}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                  setSearchOpen(false);
                }}
                className="flex items-center gap-2 border-l border-slate-200 pl-3 text-left"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">Admin User</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">A</div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 z-40 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-xs shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="font-bold text-slate-800">System Admin</p>
                    <p className="text-slate-400">admin@ums.edu</p>
                  </div>
                  <button
                    onClick={() => {
                      setActive("Settings");
                      setProfileOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={14} /> System Settings
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setSignedOut(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="space-y-7 p-5 sm:p-8">
          {toastMsg && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
              <span className="h-2 w-2 rounded-full bg-white" />
              {toastMsg}
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {active === "Dashboard" && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin! 👋</h1>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-900" />
                  </span>
                  Connected to live Supabase PostgreSQL database.
                </p>
              </div>
              <button
                onClick={() => setActive("Students")}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <Plus size={17} /> Manage Students
              </button>
            </div>
          )}

          {/* Creative Quote Banner for Non-Dashboard / Non-Student Tabs */}
          {currentBanner && (
            <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r ${currentBanner.gradient} p-6 text-slate-900 shadow-xs`}>
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  <Sparkles size={13} /> {currentBanner.badge}
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{currentBanner.title}</h2>
                <p className="mt-1.5 text-sm italic text-slate-500">{currentBanner.quote}</p>
              </div>
            </div>
          )}

          {active === "Students" ? (
            <Students />
          ) : active === "Departments" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAction(async () => {
                    await createDepartment(deptCode.trim().toUpperCase(), deptName.trim());
                    setDeptCode("");
                    setDeptName("");
                  });
                }}
                className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CSE"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="mt-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="min-w-[240px] flex-1">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science & Engineering"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Department"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Departments ({departments.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Code</th>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                        <td className="px-6 py-4 font-semibold text-slate-900">{dept.code}</td>
                        <td className="px-6 py-4 font-medium">{dept.name}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => runAction(() => deleteDepartment(dept.id), "Department deleted successfully")}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Faculty" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!facultyDeptId) return setErrorMsg("Create a department first.");
                  runAction(async () => {
                    await createFacultyRecord({
                      employee_no: empNo.trim().toUpperCase(),
                      designation: designation.trim(),
                      department_id: facultyDeptId,
                    });
                    setEmpNo("");
                    setDesignation("");
                  });
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-4"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Employee No</label><input
                  type="text"
                  placeholder="Employee No (e.g. EMP101)"
                  value={empNo}
                  onChange={(e) => setEmpNo(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Designation</label><input
                  type="text"
                  placeholder="Designation (e.g. Professor)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                /></div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Department</label><select
                  value={facultyDeptId}
                  onChange={(e) => setFacultyDeptId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add Faculty"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Faculty ({facultyList.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Employee No</th>
                      <th className="px-6 py-3.5">Designation</th>
                      <th className="px-6 py-3.5">Department</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No faculty added yet.
                        </td>
                      </tr>
                    ) : (
                      facultyList.map((f) => (
                        <tr key={f.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 font-semibold text-slate-900">{f.employee_no}</td>
                          <td className="px-6 py-4 font-medium">{f.designation}</td>
                          <td className="px-6 py-4 text-slate-500">{f.departments?.name || "—"}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => runAction(() => deleteFacultyRecord(f.id), "Faculty member deleted")}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Courses" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!courseDeptId) return setErrorMsg("Create a department first.");
                  runAction(async () => {
                    await createCourseRecord({
                      code: courseCode.trim().toUpperCase(),
                      title: courseTitle.trim(),
                      credits: Number(courseCredits),
                      department_id: courseDeptId,
                    });
                    setCourseCode("");
                    setCourseTitle("");
                  });
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-5"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Code</label><input
                  type="text"
                  placeholder="Code (e.g. 25CST-201)"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Course Title</label><input
                  type="text"
                  placeholder="Course Title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none sm:col-span-2"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Status</label><input
                  type="number"
                  min={1}
                  max={10}
                  value={courseCredits}
                  onChange={(e) => setCourseCredits(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                /></div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Department</label><select
                  value={courseDeptId}
                  onChange={(e) => setCourseDeptId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code}
                    </option>
                  ))}
                </select></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 sm:col-span-5"
                >
                  {saving ? "Saving..." : "Add Course"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Courses ({coursesList.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Code</th>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Credits</th>
                      <th className="px-6 py-3.5">Department</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No courses added yet.
                        </td>
                      </tr>
                    ) : (
                      coursesList.map((c) => (
                        <tr key={c.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 font-semibold text-slate-900">{c.code}</td>
                          <td className="px-6 py-4 font-medium">{c.title}</td>
                          <td className="px-6 py-4 text-slate-500">{c.credits}</td>
                          <td className="px-6 py-4 text-slate-500">{c.departments?.name || "—"}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => runAction(() => deleteCourseRecord(c.id), "Course deleted successfully")}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Attendance" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!attStudentId || !attCourseId) {
                    return setErrorMsg("Add at least 1 Student and 1 Course first.");
                  }
                  runAction(() =>
                    recordAttendance({
                      student_id: attStudentId,
                      course_id: attCourseId,
                      attendance_date: attDate,
                      status: attStatus,
                    })
                  );
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-5"
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Student</label><select
                  value={attStudentId}
                  onChange={(e) => setAttStudentId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                >
                  {students.length === 0 && <option value="">No students</option>}
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.registration_no} - {s.first_name}
                    </option>
                  ))}
                </select></div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Course</label><select
                  value={attCourseId}
                  onChange={(e) => setAttCourseId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                >
                  {coursesList.length === 0 && <option value="">No courses</option>}
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Date</label><input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Status</label><select
                  value={attStatus}
                  onChange={(e) => setAttStatus(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Marking..." : "Mark Attendance"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Attendance Logs ({attendanceList.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Student</th>
                      <th className="px-6 py-3.5">Course</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                          No attendance marked yet.
                        </td>
                      </tr>
                    ) : (
                      attendanceList.map((a) => (
                        <tr key={a.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 text-slate-500">{a.attendance_date}</td>
                          <td className="px-6 py-4 font-semibold">
                            {a.students?.registration_no} — {a.students?.first_name} {a.students?.last_name}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{a.courses?.code}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                a.status === "present"
                                  ? "bg-slate-100 text-slate-900"
                                  : a.status === "absent"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Examinations" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!examCourseId) return setErrorMsg("Create a course first.");
                  runAction(async () => {
                    await createExaminationRecord({
                      course_id: examCourseId,
                      title: examTitle.trim(),
                      exam_type: examType,
                      maximum_marks: Number(examMaxMarks),
                      held_on: examDate,
                    });
                    setExamTitle("");
                  });
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-5"
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Course</label><select
                  value={examCourseId}
                  onChange={(e) => setExamCourseId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                >
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Exam Title</label><input
                  type="text"
                  placeholder="Exam Title (e.g. MST-1)"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Status</label><select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                >
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="End-Term">End-Term</option>
                  <option value="Practical">Practical</option>
                  <option value="Quiz">Quiz</option>
                </select></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Status</label><input
                  type="number"
                  min={10}
                  max={500}
                  value={examMaxMarks}
                  onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Scheduling..." : "Schedule Exam"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Examinations ({examsList.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Course</th>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Type</th>
                      <th className="px-6 py-3.5">Max Marks</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No examinations scheduled yet.
                        </td>
                      </tr>
                    ) : (
                      examsList.map((ex) => (
                        <tr key={ex.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {ex.course_offerings?.courses?.code || "—"}
                          </td>
                          <td className="px-6 py-4 font-medium">{ex.title}</td>
                          <td className="px-6 py-4 text-slate-500">{ex.exam_type}</td>
                          <td className="px-6 py-4 text-slate-600">{ex.maximum_marks}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => runAction(() => deleteExaminationRecord(ex.id), "Examination deleted")}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Fees & Payments" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!feeStudentId) return setErrorMsg("Add a student first.");
                  runAction(() =>
                    createStudentFeeRecord({
                      student_id: feeStudentId,
                      fee_name: feeName.trim(),
                      billed_amount: Number(feeBilled),
                      amount_paid: Number(feePaid),
                      due_on: feeDueDate,
                    })
                  );
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-5"
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Student</label><select
                  value={feeStudentId}
                  onChange={(e) => setFeeStudentId(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.registration_no} - {s.first_name}
                    </option>
                  ))}
                </select></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Fee Title</label><input
                  type="text"
                  placeholder="Fee Title"
                  value={feeName}
                  onChange={(e) => setFeeName(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Billed ₹</label><input
                  type="number"
                  placeholder="Billed ₹"
                  value={feeBilled}
                  onChange={(e) => setFeeBilled(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Paid ₹</label><input
                  type="number"
                  placeholder="Paid ₹"
                  value={feePaid}
                  onChange={(e) => setFeePaid(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Generate Fee Invoice"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">
                    Fee Records ({feesList.length}) • Collected ₹{totalFeesCollected.toLocaleString()} / ₹
                    {totalFeesBilled.toLocaleString()}
                  </h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Student</th>
                      <th className="px-6 py-3.5">Fee Head</th>
                      <th className="px-6 py-3.5">Billed</th>
                      <th className="px-6 py-3.5">Paid</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          No fee records created yet.
                        </td>
                      </tr>
                    ) : (
                      feesList.map((f) => (
                        <tr key={f.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 font-semibold">
                            {f.students?.registration_no} — {f.students?.first_name}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{f.fee_structures?.name || "Tuition Fee"}</td>
                          <td className="px-6 py-4">₹{Number(f.billed_amount).toLocaleString()}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            ₹{Number(f.amount_paid).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                f.status === "paid"
                                  ? "bg-slate-100 text-slate-900"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {f.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {f.status !== "paid" && (
                              <button
                                onClick={() => runAction(() => markFeePaid(f.id, f.billed_amount), "Fee invoice marked as paid")}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-200"
                              >
                                <CheckCircle2 size={14} /> Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Library" ? (
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAction(async () => {
                    await createBookRecord({
                      isbn: bookIsbn.trim(),
                      title: bookTitle.trim(),
                      author: bookAuthor.trim(),
                      total_copies: Number(bookCopies),
                    });
                    setBookIsbn("");
                    setBookTitle("");
                    setBookAuthor("");
                  });
                }}
                className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs sm:grid-cols-5"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">ISBN</label><input
                  type="text"
                  placeholder="ISBN (e.g. 978-0134685991)"
                  value={bookIsbn}
                  onChange={(e) => setBookIsbn(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Book Title</label><input
                  type="text"
                  placeholder="Book Title"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Author</label><input
                  type="text"
                  placeholder="Author"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <div className="flex flex-col gap-1 min-w-0 flex-1"><label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Status</label><input
                  type="number"
                  min={1}
                  value={bookCopies}
                  onChange={(e) => setBookCopies(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                  required
                /></div>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add Book"}
                </button>
              </form>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="font-bold text-slate-900">Library Catalog ({booksList.length})</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">ISBN</th>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Author</th>
                      <th className="px-6 py-3.5">Copies</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booksList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No books in library catalog yet.
                        </td>
                      </tr>
                    ) : (
                      booksList.map((b) => (
                        <tr key={b.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                          <td className="px-6 py-4 font-semibold text-slate-900">{b.isbn}</td>
                          <td className="px-6 py-4 font-medium">{b.title}</td>
                          <td className="px-6 py-4 text-slate-500">{b.author}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {b.available_copies} / {b.total_copies}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => runAction(() => deleteBookRecord(b.id), "Book removed from catalog")}
                              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : active === "Reports" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100/60 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase text-slate-400">Attendance Rate</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">{attendancePct}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {presentCount} present out of {attendanceList.length} records
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase text-slate-400">Fee Collection</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  ₹{totalFeesCollected.toLocaleString()}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Out of ₹{totalFeesBilled.toLocaleString()} total billed
                </p>
              </div>
              <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/40 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase text-slate-400">Library Inventory</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {booksList.reduce((sum, b) => sum + Number(b.total_copies || 0), 0)} Books
                </h3>
                <p className="mt-1 text-xs text-slate-500">{booksList.length} unique titles</p>
              </div>
            </div>
          ) : active === "Settings" ? (
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs">
              <h3 className="text-lg font-bold text-slate-900">System & Database Connection</h3>
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Supabase Project</p>
                  <p className="mt-1 font-semibold text-slate-800">unisphere-ums (ap-northeast-2)</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-700">Connection Status</p>
                  <p className="mt-1 font-semibold text-slate-900">Connected & Synced (Live PostgreSQL)</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const cardThemes = [
                    {
                      card: "border-slate-200/80 bg-white",
                      icon: "bg-slate-900 text-white shadow-sm",
                    },
                    {
                      card: "border-slate-200/80 bg-white",
                      icon: "bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-sm",
                    },
                    {
                      card: "border-slate-200/80 bg-white",
                      icon: "bg-slate-900 text-white shadow-sm",
                    },
                    {
                      card: "border-slate-200/80 bg-white",
                      icon: "bg-slate-900 text-white shadow-sm",
                    },
                  ][idx % 4];
                  return (
                    <div
                      key={stat.label}
                      className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cardThemes.card}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`rounded-xl p-3 ${cardThemes.icon}`}>
                          <Icon size={22} />
                        </div>
                        <span className="flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900">
                          <ArrowUpRight size={14} /> {stat.change}
                        </span>
                      </div>
                      <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
                      <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs xl:col-span-2">
                  {(() => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const allRecords = [
                      ...students,
                      ...facultyList,
                      ...departments,
                      ...coursesList,
                      ...attendanceList,
                      ...examsList,
                      ...feesList,
                      ...booksList,
                    ];
                    const counts = Array(12).fill(0);
                    allRecords.forEach((item) => {
                      if (item?.created_at) {
                        const m = new Date(item.created_at).getMonth();
                        if (!Number.isNaN(m)) counts[m] += 1;
                      }
                    });
                    const maxCount = Math.max(...counts, 1);

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900">University Overview</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              Real-time monthly database records ({allRecords.length} total entries)
                            </p>
                          </div>
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900">
                            Live Sync
                          </span>
                        </div>
                        <div className="mt-8 flex h-52 items-end justify-around gap-2.5 border-b border-slate-100 pb-2">
                          {counts.map((count, i) => {
                            const heightPct = count === 0 ? 6 : Math.max(18, Math.round((count / maxCount) * 100));
                            return (
                              <div key={months[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                                <span className={`text-[11px] font-semibold ${count > 0 ? "text-slate-900" : "text-slate-300"}`}>
                                  {count}
                                </span>
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  title={`${months[i]}: ${count} records`}
                                  className={`w-full rounded-t-xl transition-all duration-300 ${
                                    count > 0
                                      ? "cursor-pointer bg-slate-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_4px_10px_rgba(37,99,235,0.2)] hover:scale-y-105"
                                      : "bg-slate-200/70"
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex justify-around text-xs font-medium text-slate-400">
                          {months.map((m) => (
                            <span key={m}>{m}</span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-xs">
                  <h3 className="font-bold text-slate-900">Quick Actions</h3>
                  <p className="mt-1 text-xs text-slate-500">Frequently used operations</p>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Manage Students", Users, "Students"],
                      ["Manage Departments", Building2, "Departments"],
                      ["Manage Faculty", UserRound, "Faculty"],
                      ["Manage Courses", BookOpen, "Courses"],
                    ].map(([label, Icon, target]: any) => (
                      <button
                        key={label}
                        onClick={() => setActive(target)}
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 text-left text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md"
                      >
                        <span className="rounded-lg bg-blue-50 p-2 text-slate-900">
                          <Icon size={18} />
                        </span>
                        {label}
                        <ArrowUpRight size={15} className="ml-auto text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                  <div>
                    <h3 className="font-bold text-slate-900">Recent Students</h3>
                    <p className="mt-1 text-xs text-slate-500">Live records from Supabase database</p>
                  </div>
                  <button onClick={() => setActive("Students")} className="text-sm font-semibold text-slate-900 hover:underline">
                    View all students
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Registration ID</th>
                        <th className="px-5 py-4">Department</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                            No students in database yet. Click "View all students" to add one!
                          </td>
                        </tr>
                      ) : (
                        students.slice(0, 5).map((student) => (
                          <tr key={student.id} className="border-t border-slate-100 transition hover:bg-blue-50/30">
                            <td className="px-5 py-4 font-semibold">
                              {student.first_name} {student.last_name}
                            </td>
                            <td className="px-5 py-4 text-slate-500">{student.registration_no}</td>
                            <td className="px-5 py-4 text-slate-500">
                              {student.programs?.departments?.name || "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-900">
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={14} /> Connected to Supabase (`ums`).
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
