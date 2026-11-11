-- UniSphere phase 1 schema. Apply to a fresh Lovable Cloud PostgreSQL project.
-- This file is synchronized with the hosted migration; seed data is in 02_sample_data_views.sql.

CREATE TYPE public.app_role AS ENUM ('admin', 'faculty', 'student', 'accountant', 'librarian');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE public.fee_status AS ENUM ('pending', 'partial', 'paid');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  duration_years SMALLINT NOT NULL CHECK (duration_years BETWEEN 1 AND 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (department_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_on > starts_on)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_years TO authenticated;
GRANT ALL ON public.academic_years TO service_role;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  sequence_no SMALLINT NOT NULL CHECK (sequence_no BETWEEN 1 AND 12),
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_on > starts_on),
  UNIQUE (academic_year_id, sequence_no),
  UNIQUE (academic_year_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.semesters TO authenticated;
GRANT ALL ON public.semesters TO service_role;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  credits NUMERIC(4,1) NOT NULL CHECK (credits > 0 AND credits <= 30),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  employee_no TEXT NOT NULL UNIQUE,
  designation TEXT NOT NULL,
  hired_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty TO authenticated;
GRANT ALL ON public.faculty TO service_role;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  current_semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL,
  registration_no TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  enrolled_on DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE RESTRICT,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  section TEXT NOT NULL DEFAULT 'A',
  capacity INTEGER NOT NULL DEFAULT 60 CHECK (capacity BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, semester_id, section),
  UNIQUE (id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_offerings TO authenticated;
GRANT ALL ON public.course_offerings TO service_role;
ALTER TABLE public.course_offerings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_offering_id UUID NOT NULL REFERENCES public.course_offerings(id) ON DELETE RESTRICT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  UNIQUE (student_id, course_offering_id),
  UNIQUE (id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  course_offering_id UUID NOT NULL REFERENCES public.course_offerings(id) ON DELETE RESTRICT,
  attendance_date DATE NOT NULL,
  status public.attendance_status NOT NULL,
  recorded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, attendance_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.examinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_offering_id UUID NOT NULL REFERENCES public.course_offerings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('quiz', 'assignment', 'midterm', 'final', 'practical', 'other')),
  maximum_marks NUMERIC(7,2) NOT NULL CHECK (maximum_marks > 0),
  held_on DATE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_offering_id, title)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.examinations TO authenticated;
GRANT ALL ON public.examinations TO service_role;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(7,2) NOT NULL CHECK (marks_obtained >= 0),
  entered_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (examination_id, enrollment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marks TO authenticated;
GRANT ALL ON public.marks TO service_role;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.grade_scale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade TEXT NOT NULL UNIQUE,
  minimum_percentage NUMERIC(5,2) NOT NULL CHECK (minimum_percentage BETWEEN 0 AND 100),
  maximum_percentage NUMERIC(5,2) NOT NULL CHECK (maximum_percentage BETWEEN 0 AND 100),
  grade_points NUMERIC(3,2) NOT NULL CHECK (grade_points BETWEEN 0 AND 10),
  CHECK (maximum_percentage >= minimum_percentage),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grade_scale TO authenticated;
GRANT ALL ON public.grade_scale TO service_role;
ALTER TABLE public.grade_scale ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  due_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (program_id, academic_year_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fee_structures TO authenticated;
GRANT ALL ON public.fee_structures TO service_role;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  fee_structure_id UUID NOT NULL REFERENCES public.fee_structures(id) ON DELETE RESTRICT,
  billed_amount NUMERIC(12,2) NOT NULL CHECK (billed_amount > 0),
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0 AND amount_paid <= billed_amount),
  status public.fee_status NOT NULL DEFAULT 'pending',
  due_on DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, fee_structure_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_fees TO authenticated;
GRANT ALL ON public.student_fees TO service_role;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_fee_id UUID NOT NULL REFERENCES public.student_fees(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'card_simulation', 'other')),
  reference_no TEXT UNIQUE,
  received_by UUID,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fee_payments TO authenticated;
GRANT ALL ON public.fee_payments TO service_role;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  published_year SMALLINT CHECK (published_year BETWEEN 1450 AND 2200),
  total_copies INTEGER NOT NULL CHECK (total_copies >= 0),
  available_copies INTEGER NOT NULL CHECK (available_copies >= 0 AND available_copies <= total_copies),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.book_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_on DATE NOT NULL,
  returned_at TIMESTAMPTZ,
  processed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (returned_at IS NULL OR returned_at >= issued_at)
);
GRANT SELECT ON public.book_issues TO authenticated;
GRANT ALL ON public.book_issues TO service_role;
ALTER TABLE public.book_issues ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  actor_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Role checks inspect only the signed-in caller's protected role rows.
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = _role) $$;
REVOKE ALL ON FUNCTION public.has_role(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role) TO authenticated, service_role;

-- A trusted operator can assign the first admin once, after creating that user's account.
-- EXECUTE is service_role-only; never expose service credentials to the browser.
CREATE OR REPLACE FUNCTION public.assign_initial_admin(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User account does not exist';
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'An administrator is already assigned';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin');
END;
$$;
REVOKE ALL ON FUNCTION public.assign_initial_admin(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_initial_admin(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''), split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE OR REPLACE FUNCTION public.audit_row_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE old_row JSONB; new_row JSONB; row_id TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN new_row := to_jsonb(NEW); row_id := new_row ->> 'id';
  ELSIF TG_OP = 'UPDATE' THEN old_row := to_jsonb(OLD); new_row := to_jsonb(NEW); row_id := new_row ->> 'id';
  ELSE old_row := to_jsonb(OLD); row_id := old_row ->> 'id'; END IF;
  INSERT INTO public.audit_logs(table_name, operation, record_id, old_values, new_values, actor_id)
  VALUES (TG_TABLE_NAME, TG_OP, row_id, old_row, new_row, auth.uid());
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_attendance_record()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.course_enrollments e
    JOIN public.course_offerings o ON o.id = e.course_offering_id
    WHERE e.id = NEW.enrollment_id AND e.student_id = NEW.student_id
      AND o.id = NEW.course_offering_id AND o.course_id = NEW.course_id
  ) THEN RAISE EXCEPTION 'Attendance must match the student's course enrollment'; END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_mark_record()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE max_marks NUMERIC; exam_offering UUID; enrollment_offering UUID;
BEGIN
  SELECT maximum_marks, course_offering_id INTO max_marks, exam_offering
  FROM public.examinations WHERE id = NEW.examination_id;
  SELECT course_offering_id INTO enrollment_offering FROM public.course_enrollments WHERE id = NEW.enrollment_id;
  IF max_marks IS NULL OR exam_offering IS DISTINCT FROM enrollment_offering THEN
    RAISE EXCEPTION 'Marks must belong to an enrollment in the examination course';
  END IF;
  IF NEW.marks_obtained > max_marks THEN RAISE EXCEPTION 'Marks exceed the examination maximum'; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER attendance_validate BEFORE INSERT OR UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.validate_attendance_record();
CREATE TRIGGER marks_validate BEFORE INSERT OR UPDATE ON public.marks FOR EACH ROW EXECUTE FUNCTION public.validate_mark_record();

CREATE OR REPLACE FUNCTION public.attendance_percentage(_enrollment_id UUID)
RETURNS NUMERIC LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT CASE WHEN count(*) FILTER (WHERE status <> 'excused') = 0 THEN 0
    ELSE round(100.0 * count(*) FILTER (WHERE status IN ('present', 'late')) / count(*) FILTER (WHERE status <> 'excused'), 2)
  END FROM public.attendance WHERE enrollment_id = _enrollment_id
$$;

CREATE OR REPLACE FUNCTION public.outstanding_fee(_student_fee_id UUID)
RETURNS NUMERIC LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public
AS $$ SELECT COALESCE((SELECT billed_amount - amount_paid FROM public.student_fees WHERE id = _student_fee_id), 0) $$;

CREATE OR REPLACE FUNCTION public.calculate_cgpa(_student_id UUID)
RETURNS NUMERIC LANGUAGE SQL STABLE SECURITY INVOKER SET search_path = public
AS $$
  WITH course_results AS (
    SELECT e.id AS enrollment_id, c.credits,
      100.0 * sum(m.marks_obtained) / NULLIF(sum(x.maximum_marks), 0) AS percentage
    FROM public.course_enrollments e
    JOIN public.course_offerings o ON o.id = e.course_offering_id
    JOIN public.courses c ON c.id = o.course_id
    JOIN public.marks m ON m.enrollment_id = e.id
    JOIN public.examinations x ON x.id = m.examination_id AND x.is_published
    JOIN public.students s ON s.id = e.student_id
    WHERE e.student_id = _student_id AND e.status <> 'dropped'
    GROUP BY e.id, c.credits
  ), graded AS (
    SELECT r.credits, g.grade_points FROM course_results r
    JOIN public.grade_scale g ON r.percentage >= g.minimum_percentage AND r.percentage <= g.maximum_percentage
  )
  SELECT COALESCE(round(sum(grade_points * credits) / NULLIF(sum(credits), 0), 2), 0)
  FROM graded
$$;

CREATE OR REPLACE FUNCTION public.enroll_student(_student_id UUID, _course_offering_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE new_id UUID;
BEGIN
  IF NOT (public.has_role('admin') OR (public.has_role('student') AND EXISTS (
    SELECT 1 FROM public.students WHERE id = _student_id AND profile_id = auth.uid()
  ))) THEN RAISE EXCEPTION 'Not authorized to enroll this student'; END IF;
  INSERT INTO public.course_enrollments(student_id, course_offering_id)
  VALUES (_student_id, _course_offering_id) RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Locking the invoice row serializes simultaneous payment requests; any exception rolls back the RPC transaction.
CREATE OR REPLACE FUNCTION public.process_fee_payment(
  _student_fee_id UUID, _amount NUMERIC, _payment_method TEXT, _reference_no TEXT DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE invoice public.student_fees%ROWTYPE; payment_id UUID;
BEGIN
  IF NOT (public.has_role('admin') OR public.has_role('accountant')) THEN RAISE EXCEPTION 'Only finance staff may record payments'; END IF;
  IF _amount IS NULL OR _amount <= 0 THEN RAISE EXCEPTION 'Payment amount must be positive'; END IF;
  SELECT * INTO invoice FROM public.student_fees WHERE id = _student_fee_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Fee record not found'; END IF;
  IF _amount > invoice.billed_amount - invoice.amount_paid THEN RAISE EXCEPTION 'Payment exceeds outstanding balance'; END IF;
  INSERT INTO public.fee_payments(student_fee_id, amount, payment_method, reference_no, received_by)
  VALUES (_student_fee_id, _amount, _payment_method, _reference_no, auth.uid()) RETURNING id INTO payment_id;
  UPDATE public.student_fees SET amount_paid = amount_paid + _amount,
    status = CASE WHEN amount_paid + _amount >= billed_amount THEN 'paid'::public.fee_status
                  WHEN amount_paid + _amount > 0 THEN 'partial'::public.fee_status ELSE 'pending'::public.fee_status END,
    updated_at = now()
  WHERE id = _student_fee_id;
  RETURN payment_id;
END;
$$;

-- Book issue and return serialize inventory changes with row locks on the book record.
CREATE OR REPLACE FUNCTION public.issue_book(_book_id UUID, _student_id UUID, _due_on DATE)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE available INTEGER; new_issue UUID;
BEGIN
  IF NOT (public.has_role('admin') OR public.has_role('librarian') OR (public.has_role('student') AND EXISTS (
    SELECT 1 FROM public.students WHERE id = _student_id AND profile_id = auth.uid()
  ))) THEN RAISE EXCEPTION 'Not authorized to issue a book to this student'; END IF;
  SELECT available_copies INTO available FROM public.books WHERE id = _book_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Book not found'; END IF;
  IF available < 1 THEN RAISE EXCEPTION 'No copies are currently available'; END IF;
  IF _due_on <= CURRENT_DATE THEN RAISE EXCEPTION 'Due date must be in the future'; END IF;
  UPDATE public.books SET available_copies = available_copies - 1, updated_at = now() WHERE id = _book_id;
  INSERT INTO public.book_issues(book_id, student_id, due_on, processed_by)
  VALUES (_book_id, _student_id, _due_on, auth.uid()) RETURNING id INTO new_issue;
  RETURN new_issue;
END;
$$;

CREATE OR REPLACE FUNCTION public.return_book(_issue_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE issue_row public.book_issues%ROWTYPE;
BEGIN
  IF NOT (public.has_role('admin') OR public.has_role('librarian') OR EXISTS (
    SELECT 1 FROM public.book_issues i JOIN public.students s ON s.id = i.student_id
    WHERE i.id = _issue_id AND s.profile_id = auth.uid() AND public.has_role('student')
  )) THEN RAISE EXCEPTION 'Not authorized to return this book'; END IF;
  SELECT * INTO issue_row FROM public.book_issues WHERE id = _issue_id FOR UPDATE;
  IF NOT FOUND OR issue_row.returned_at IS NOT NULL THEN RAISE EXCEPTION 'Active book issue not found'; END IF;
  UPDATE public.book_issues SET returned_at = now() WHERE id = _issue_id;
  UPDATE public.books SET available_copies = available_copies + 1, updated_at = now() WHERE id = issue_row.book_id;
END;
$$;

REVOKE ALL ON FUNCTION public.enroll_student(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.process_fee_payment(UUID, NUMERIC, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.issue_book(UUID, UUID, DATE) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.return_book(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enroll_student(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_fee_payment(UUID, NUMERIC, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.issue_book(UUID, UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.return_book(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attendance_percentage(UUID), public.outstanding_fee(UUID), public.calculate_cgpa(UUID) TO authenticated;

-- Basic tables: caller owns profile; roles are visible only to the user/admin; never self-assign.
CREATE POLICY profiles_read_own_or_admin ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role('admin'));
CREATE POLICY profiles_update_own_or_admin ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role('admin')) WITH CHECK (id = auth.uid() OR public.has_role('admin'));
CREATE POLICY roles_read_own_or_admin ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role('admin'));
CREATE POLICY roles_admin_write ON public.user_roles FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

-- Administrative reference data: all authenticated users can read; only admins can change it.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['departments','programs','academic_years','semesters','courses','grade_scale'] LOOP
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)', t || '_read', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_role(''admin'')) WITH CHECK (public.has_role(''admin''))', t || '_admin_write', t);
  END LOOP;
END $$;

CREATE POLICY faculty_read_self_or_admin ON public.faculty FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.has_role('admin') OR public.has_role('faculty'));
CREATE POLICY faculty_admin_write ON public.faculty FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));
CREATE POLICY students_read_authorized ON public.students FOR SELECT TO authenticated USING (
  profile_id = auth.uid() OR public.has_role('admin') OR public.has_role('accountant') OR
  (public.has_role('faculty') AND EXISTS (
    SELECT 1 FROM public.course_enrollments e JOIN public.course_offerings o ON o.id=e.course_offering_id
    JOIN public.faculty f ON f.id=o.faculty_id WHERE e.student_id=students.id AND f.profile_id=auth.uid()
  ))
);
CREATE POLICY students_admin_write ON public.students FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

CREATE POLICY offerings_read_authorized ON public.course_offerings FOR SELECT TO authenticated USING (
  public.has_role('admin') OR public.has_role('accountant') OR
  (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.faculty f WHERE f.id=course_offerings.faculty_id AND f.profile_id=auth.uid())) OR
  (public.has_role('student') AND EXISTS (SELECT 1 FROM public.course_enrollments e JOIN public.students s ON s.id=e.student_id WHERE e.course_offering_id=course_offerings.id AND s.profile_id=auth.uid()))
);
CREATE POLICY offerings_admin_write ON public.course_offerings FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));
CREATE POLICY enrollments_read_authorized ON public.course_enrollments FOR SELECT TO authenticated USING (
  public.has_role('admin') OR EXISTS (SELECT 1 FROM public.students s WHERE s.id=course_enrollments.student_id AND s.profile_id=auth.uid()) OR
  (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=course_enrollments.course_offering_id AND f.profile_id=auth.uid()))
);
CREATE POLICY enrollments_admin_write ON public.course_enrollments FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

CREATE POLICY attendance_read_authorized ON public.attendance FOR SELECT TO authenticated USING (
  public.has_role('admin') OR EXISTS (SELECT 1 FROM public.students s WHERE s.id=attendance.student_id AND s.profile_id=auth.uid()) OR
  (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=attendance.course_offering_id AND f.profile_id=auth.uid()))
);
CREATE POLICY attendance_faculty_write ON public.attendance FOR ALL TO authenticated USING (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=attendance.course_offering_id AND f.profile_id=auth.uid()))
) WITH CHECK (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=attendance.course_offering_id AND f.profile_id=auth.uid()))
);

CREATE POLICY exams_read_authorized ON public.examinations FOR SELECT TO authenticated USING (
  public.has_role('admin') OR (public.has_role('student') AND is_published AND EXISTS (
    SELECT 1 FROM public.course_enrollments e JOIN public.students s ON s.id=e.student_id WHERE e.course_offering_id=examinations.course_offering_id AND s.profile_id=auth.uid()
  )) OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=examinations.course_offering_id AND f.profile_id=auth.uid()))
);
CREATE POLICY exams_staff_write ON public.examinations FOR ALL TO authenticated USING (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=examinations.course_offering_id AND f.profile_id=auth.uid()))
) WITH CHECK (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.course_offerings o JOIN public.faculty f ON f.id=o.faculty_id WHERE o.id=examinations.course_offering_id AND f.profile_id=auth.uid()))
);
CREATE POLICY marks_read_authorized ON public.marks FOR SELECT TO authenticated USING (
  public.has_role('admin') OR EXISTS (SELECT 1 FROM public.examinations x JOIN public.course_enrollments e ON e.id=marks.enrollment_id JOIN public.students s ON s.id=e.student_id WHERE x.id=marks.examination_id AND x.is_published AND s.profile_id=auth.uid()) OR
  (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.examinations x JOIN public.course_offerings o ON o.id=x.course_offering_id JOIN public.faculty f ON f.id=o.faculty_id WHERE x.id=marks.examination_id AND f.profile_id=auth.uid()))
);
CREATE POLICY marks_staff_write ON public.marks FOR ALL TO authenticated USING (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.examinations x JOIN public.course_offerings o ON o.id=x.course_offering_id JOIN public.faculty f ON f.id=o.faculty_id WHERE x.id=marks.examination_id AND f.profile_id=auth.uid()))
) WITH CHECK (
  public.has_role('admin') OR (public.has_role('faculty') AND EXISTS (SELECT 1 FROM public.examinations x JOIN public.course_offerings o ON o.id=x.course_offering_id JOIN public.faculty f ON f.id=o.faculty_id WHERE x.id=marks.examination_id AND f.profile_id=auth.uid()))
);

CREATE POLICY fee_structures_read ON public.fee_structures FOR SELECT TO authenticated USING (true);
CREATE POLICY fee_structures_staff_write ON public.fee_structures FOR ALL TO authenticated USING (public.has_role('admin') OR public.has_role('accountant')) WITH CHECK (public.has_role('admin') OR public.has_role('accountant'));
CREATE POLICY student_fees_read_authorized ON public.student_fees FOR SELECT TO authenticated USING (
  public.has_role('admin') OR public.has_role('accountant') OR EXISTS (SELECT 1 FROM public.students s WHERE s.id=student_fees.student_id AND s.profile_id=auth.uid())
);
CREATE POLICY student_fees_staff_write ON public.student_fees FOR ALL TO authenticated USING (public.has_role('admin') OR public.has_role('accountant')) WITH CHECK (public.has_role('admin') OR public.has_role('accountant'));
CREATE POLICY payments_read_authorized ON public.fee_payments FOR SELECT TO authenticated USING (
  public.has_role('admin') OR public.has_role('accountant') OR EXISTS (SELECT 1 FROM public.student_fees sf JOIN public.students s ON s.id=sf.student_id WHERE sf.id=fee_payments.student_fee_id AND s.profile_id=auth.uid())
);

CREATE POLICY books_read ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY books_staff_write ON public.books FOR ALL TO authenticated USING (public.has_role('admin') OR public.has_role('librarian')) WITH CHECK (public.has_role('admin') OR public.has_role('librarian'));
CREATE POLICY issues_read_authorized ON public.book_issues FOR SELECT TO authenticated USING (
  public.has_role('admin') OR public.has_role('librarian') OR EXISTS (SELECT 1 FROM public.students s WHERE s.id=book_issues.student_id AND s.profile_id=auth.uid())
);
CREATE POLICY audit_admin_read ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role('admin'));

-- Timestamp and audit triggers are real PostgreSQL automation.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','departments','programs','academic_years','semesters','courses','faculty','students','course_offerings','examinations','marks','grade_scale','fee_structures','student_fees','books'] LOOP
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t || '_set_updated_at', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['profiles','user_roles','departments','programs','academic_years','semesters','courses','faculty','students','course_offerings','course_enrollments','attendance','examinations','marks','grade_scale','fee_structures','student_fees','fee_payments','books','book_issues'] LOOP
    EXECUTE format('CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.audit_row_change()', t || '_audit', t);
  END LOOP;
END $$;

CREATE INDEX idx_students_program ON public.students(program_id);
CREATE INDEX idx_students_name ON public.students(last_name, first_name);
CREATE INDEX idx_faculty_department ON public.faculty(department_id);
CREATE INDEX idx_offerings_semester ON public.course_offerings(semester_id);
CREATE INDEX idx_offerings_faculty ON public.course_offerings(faculty_id);
CREATE INDEX idx_enrollments_offering ON public.course_enrollments(course_offering_id);
CREATE INDEX idx_attendance_offering_date ON public.attendance(course_offering_id, attendance_date);
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, attendance_date);
CREATE INDEX idx_examinations_offering_published ON public.examinations(course_offering_id, is_published);
CREATE INDEX idx_marks_enrollment ON public.marks(enrollment_id);
CREATE INDEX idx_student_fees_student_status ON public.student_fees(student_id, status);
CREATE INDEX idx_fee_payments_fee_paid_at ON public.fee_payments(student_fee_id, paid_at);
CREATE INDEX idx_books_title_author ON public.books(title, author);
CREATE INDEX idx_book_issues_student_active ON public.book_issues(student_id, due_on) WHERE returned_at IS NULL;
CREATE INDEX idx_audit_logs_occurred_at ON public.audit_logs(occurred_at DESC);

-- Invoker views preserve underlying RLS protections for dashboard/report queries.
CREATE VIEW public.department_student_statistics WITH (security_invoker = true) AS
SELECT d.id AS department_id, d.code, d.name, count(s.id)::INTEGER AS student_count
FROM public.departments d LEFT JOIN public.programs p ON p.department_id=d.id
LEFT JOIN public.students s ON s.program_id=p.id AND s.status='active'
GROUP BY d.id, d.code, d.name;
GRANT SELECT ON public.department_student_statistics TO authenticated;

CREATE VIEW public.student_academic_summary WITH (security_invoker = true) AS
SELECT s.id AS student_id, s.registration_no, s.first_name, s.last_name, p.name AS program_name,
  count(DISTINCT e.id)::INTEGER AS enrollment_count,
  round(avg(public.attendance_percentage(e.id)), 2) AS average_attendance,
  public.calculate_cgpa(s.id) AS cgpa
FROM public.students s JOIN public.programs p ON p.id=s.program_id
LEFT JOIN public.course_enrollments e ON e.student_id=s.id AND e.status <> 'dropped'
GROUP BY s.id, s.registration_no, s.first_name, s.last_name, p.name;
GRANT SELECT ON public.student_academic_summary TO authenticated;

CREATE VIEW public.student_fee_summary WITH (security_invoker = true) AS
SELECT sf.id AS student_fee_id, sf.student_id, s.registration_no, sf.fee_structure_id,
  sf.billed_amount, sf.amount_paid, sf.billed_amount-sf.amount_paid AS outstanding_amount,
  sf.status, sf.due_on
FROM public.student_fees sf JOIN public.students s ON s.id=sf.student_id;
GRANT SELECT ON public.student_fee_summary TO authenticated;

CREATE VIEW public.course_attendance_summary WITH (security_invoker = true) AS
SELECT o.id AS course_offering_id, c.code AS course_code, c.title AS course_title, sem.name AS semester_name,
  count(a.id)::INTEGER AS attendance_entries,
  round(100.0*count(*) FILTER (WHERE a.status IN ('present','late'))/NULLIF(count(*) FILTER (WHERE a.status <> 'excused'),0),2) AS attendance_percentage
FROM public.course_offerings o JOIN public.courses c ON c.id=o.course_id
JOIN public.semesters sem ON sem.id=o.semester_id LEFT JOIN public.attendance a ON a.course_offering_id=o.id
GROUP BY o.id, c.code, c.title, sem.name;
GRANT SELECT ON public.course_attendance_summary TO authenticated;

CREATE VIEW public.faculty_course_summary WITH (security_invoker = true) AS
SELECT f.id AS faculty_id, f.employee_no, f.designation, p.display_name,
  count(DISTINCT o.id)::INTEGER AS course_offerings
FROM public.faculty f LEFT JOIN public.profiles p ON p.id=f.profile_id
LEFT JOIN public.course_offerings o ON o.faculty_id=f.id
GROUP BY f.id, f.employee_no, f.designation, p.display_name;
GRANT SELECT ON public.faculty_course_summary TO authenticated;
