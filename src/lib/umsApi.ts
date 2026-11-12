import { supabase } from "../integrations/supabase/client";

export async function fetchDashboardData() {
  const [
    departmentsRes,
    studentsRes,
    facultyRes,
    coursesRes,
    attendanceRes,
    examsRes,
    feesRes,
    booksRes,
  ] = await Promise.all([
    supabase.from("departments").select("*").order("name"),
    supabase
      .from("students")
      .select("*, programs(name, departments(name))")
      .order("created_at", { ascending: false }),
    supabase
      .from("faculty")
      .select("*, departments(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("*, departments(name)")
      .order("code"),
    supabase
      .from("attendance")
      .select("*, students(registration_no, first_name, last_name), courses(code, title)")
      .order("attendance_date", { ascending: false })
      .limit(50),
    supabase
      .from("examinations")
      .select("*, course_offerings(section, courses(code, title))")
      .order("created_at", { ascending: false }),
    supabase
      .from("student_fees")
      .select("*, students(registration_no, first_name, last_name), fee_structures(name)")
      .order("created_at", { ascending: false }),
    supabase.from("books").select("*").order("title"),
  ]);

  if (departmentsRes.error) throw departmentsRes.error;
  if (studentsRes.error) throw studentsRes.error;
  if (facultyRes.error) throw facultyRes.error;
  if (coursesRes.error) throw coursesRes.error;
  if (attendanceRes.error) throw attendanceRes.error;
  if (examsRes.error) throw examsRes.error;
  if (feesRes.error) throw feesRes.error;
  if (booksRes.error) throw booksRes.error;

  return {
    departments: departmentsRes.data ?? [],
    students: studentsRes.data ?? [],
    faculty: facultyRes.data ?? [],
    courses: coursesRes.data ?? [],
    attendance: attendanceRes.data ?? [],
    examinations: examsRes.data ?? [],
    fees: feesRes.data ?? [],
    books: booksRes.data ?? [],
  };
}

// Helper: ensures default academic_year & semester exist for offerings/fees
async function ensureAcademicContext() {
  let { data: year } = await supabase
    .from("academic_years")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (!year) {
    const { data: newYear, error } = await supabase
      .from("academic_years")
      .insert({
        label: "2026-27",
        starts_on: "2026-07-01",
        ends_on: "2027-06-30"
      })
      .select("id")
      .single();
    if (error) throw error;
    year = newYear;
  }

  let { data: semester } = await supabase
    .from("semesters")
    .select("id")
    .eq("academic_year_id", year.id)
    .limit(1)
    .maybeSingle();

  if (!semester) {
    let { data: ays } = await supabase.from("academic_years").select("id").limit(1);
    let ayId = ays?.[0]?.id;
    if (!ayId) {
      const { data: newAy, error: ayErr } = await supabase
        .from("academic_years")
        .insert({ name: "2026-2027" })
        .select("id")
        .single();
      if (ayErr) throw ayErr;
      ayId = newAy.id;
    }
    const { data: newSem, error: semErr } = await supabase
      .from("semesters").insert({ academic_year_id: ayId, name: "Semester 1", sequence_no: 1, starts_on: "2026-07-01", ends_on: "2026-12-31" })
      .select("id")
      .single();
    if (semErr) throw semErr;
    semester = newSem;
  }

  return { academicYearId: year.id, semesterId: semester.id };
}

// Helper: ensures a course_offering exists for a course
async function ensureCourseOffering(courseId: string) {
  let { data: offering } = await supabase
    .from("course_offerings")
    .select("id")
    .eq("course_id", courseId)
    .limit(1)
    .maybeSingle();

  if (!offering) {
    const { semesterId } = await ensureAcademicContext();
    const { data: newOffering, error } = await supabase
      .from("course_offerings")
      .insert({
        course_id: courseId,
        semester_id: semesterId,
        section: "A",
        capacity: 60,
      })
      .select("id")
      .single();
    if (error) throw error;
    offering = newOffering;
  }

  return offering.id;
}

export async function createDepartment(code: string, name: string) {
  const { data, error } = await supabase
    .from("departments")
    .insert({ code, name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDepartment(id: string) {
  const { data: progs } = await supabase.from("programs").select("id").eq("department_id", id);
  const progIds = (progs ?? []).map((p) => p.id);
  if (progIds.length > 0) {
    await supabase.from("fee_structures").delete().in("program_id", progIds);
    await supabase.from("programs").delete().in("id", progIds);
  }
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;
}

export async function createStudentRecord(input: {
  registration_no: string;
  first_name: string;
  last_name: string;
  email: string;
  department_id: string;
}) {
  let { data: program } = await supabase
    .from("programs")
    .select("id")
    .eq("department_id", input.department_id)
    .limit(1)
    .maybeSingle();

  if (!program) {
    const { data: dept } = await supabase
      .from("departments")
      .select("code, name")
      .eq("id", input.department_id)
      .single();

    const { data: createdProg, error: progErr } = await supabase
      .from("programs")
      .insert({
        code: `${dept?.code || "GEN"}-UG`,
        name: `B.Tech ${dept?.name || "General"}`,
        department_id: input.department_id,
        duration_years: 4,
      })
      .select("id")
      .single();
    if (progErr) throw progErr;
    program = createdProg;
  }

  const { data, error } = await supabase
    .from("students")
    .insert({
      registration_no: input.registration_no,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email || null,
      program_id: program.id,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudentRecord(id: string) {
  await supabase.from("attendance").delete().eq("student_id", id);
  await supabase.from("course_enrollments").delete().eq("student_id", id);
  await supabase.from("student_fees").delete().eq("student_id", id);
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}

export async function createFacultyRecord(input: {
  employee_no: string;
  designation: string;
  department_id: string;
}) {
  const { data, error } = await supabase
    .from("faculty")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFacultyRecord(id: string) {
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw error;
}

export async function createCourseRecord(input: {
  code: string;
  title: string;
  credits: number;
  department_id: string;
}) {
  const { data, error } = await supabase
    .from("courses")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCourseRecord(id: string) {
  await supabase.from("attendance").delete().eq("course_id", id);
  const { data: offs } = await supabase.from("course_offerings").select("id").eq("course_id", id);
  const offIds = (offs ?? []).map((o) => o.id);
  if (offIds.length > 0) {
    await supabase.from("examinations").delete().in("course_offering_id", offIds);
    await supabase.from("course_enrollments").delete().in("course_offering_id", offIds);
    await supabase.from("course_offerings").delete().in("id", offIds);
  }
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

export async function recordAttendance(input: {
  student_id: string;
  course_id: string;
  attendance_date: string;
  status: "present" | "absent" | "late" | "excused";
}) {
  const offeringId = await ensureCourseOffering(input.course_id);

  let { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("student_id", input.student_id)
    .eq("course_offering_id", offeringId)
    .maybeSingle();

  if (!enrollment) {
    const { data: newEnroll, error: enrollErr } = await supabase
      .from("course_enrollments")
      .insert({
        student_id: input.student_id,
        course_offering_id: offeringId,
        status: "enrolled",
      })
      .select("id")
      .single();
    if (enrollErr) throw enrollErr;
    enrollment = newEnroll;
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert({
      student_id: input.student_id,
      course_id: input.course_id,
      course_offering_id: offeringId,
      enrollment_id: enrollment.id,
      attendance_date: input.attendance_date,
      status: input.status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createExaminationRecord(input: {
  course_id: string;
  title: string;
  exam_type: string;
  maximum_marks: number;
  held_on: string;
}) {
  const offeringId = await ensureCourseOffering(input.course_id);

  const { data, error } = await supabase
    .from("examinations")
    .insert({
      course_offering_id: offeringId,
      title: input.title,
      exam_type: ((t: string) => { const s = String(t || "").toLowerCase(); if (s.includes("mid")) return "midterm"; if (s.includes("end") || s.includes("final")) return "final"; if (s.includes("quiz")) return "quiz"; if (s.includes("prac") || s.includes("lab")) return "practical"; return "midterm"; })(input.exam_type.toLowerCase().replace(/[-\s]+/g), "_"),
      maximum_marks: input.maximum_marks,
      held_on: input.held_on || null,
      is_published: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExaminationRecord(id: string) {
  const { error } = await supabase.from("examinations").delete().eq("id", id);
  if (error) throw error;
}

export async function createStudentFeeRecord(input: {
  student_id: string;
  fee_name: string;
  billed_amount: number;
  amount_paid: number;
  due_on: string;
}) {
  const { data: student, error: stuErr } = await supabase
    .from("students")
    .select("program_id")
    .eq("id", input.student_id)
    .single();
  if (stuErr) throw stuErr;

  const { academicYearId } = await ensureAcademicContext();

  const { data: structure, error: structErr } = await supabase
    .from("fee_structures").upsert({
      academic_year_id: academicYearId,
      program_id: student.program_id,
      name: input.fee_name,
      amount: input.billed_amount,
      due_on: input.due_on,
    }, { onConflict: "program_id,academic_year_id,name" }).select("id")
    .single();
  if (structErr) throw structErr;

  const status: "paid" | "partial" | "pending" =
    input.amount_paid >= input.billed_amount
      ? "paid"
      : input.amount_paid > 0
      ? "partial"
      : "pending";

  const { data, error } = await supabase
    .from("student_fees")
    .insert({
      student_id: input.student_id,
      fee_structure_id: structure.id,
      billed_amount: input.billed_amount,
      amount_paid: input.amount_paid,
      due_on: input.due_on,
      status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markFeePaid(id: string, billed_amount: number) {
  const { error } = await supabase
    .from("student_fees")
    .update({ amount_paid: billed_amount, status: "paid" })
    .eq("id", id);
  if (error) throw error;
}

export async function createBookRecord(input: {
  isbn: string;
  title: string;
  author: string;
  total_copies: number;
}) {
  const { data, error } = await supabase
    .from("books")
    .insert({
      isbn: input.isbn,
      title: input.title,
      author: input.author,
      total_copies: input.total_copies,
      available_copies: input.total_copies,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBookRecord(id: string) {
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw error;
}
