# UniSphere — University Management System

## Goal
Build UniSphere as a usable university ERP backed by Lovable Cloud and PostgreSQL, not a dashboard mockup. The database is authoritative for records, access rules, summaries, payments, attendance, and library inventory. Keep the current TanStack Start framework; implement the requested routing intent with its file-based router rather than React Router.

## Proposed relational model
About 21 normalized tables, grouped by responsibility. User identity and application permissions remain separate: `profiles` holds profile fields; `user_roles` holds trusted roles and is the only source for authorization.

- **Identity/access:** `profiles` (one per auth user, display name and contact details); `user_roles` (Admin, Faculty, Student, Accountant, Librarian; unique user/role pair).
- **Academic structure:** `departments`; `programs` (belongs to a department); `academic_years`; `semesters` (belongs to an academic year); `courses` (department-owned, with credits); `faculty` (profile and department); `students` (profile, unique registration number, program and current semester); `course_offerings` (course, semester, assigned faculty); `course_enrollments` (student/offer unique pair, enrollment state).
- **Academic records:** `attendance` (enrollment, offering, date, status; unique student/course/date); `examinations` (offering, type, max marks, publication state); `marks` (exam/enrollment pair, validated against maximum); `grade_scale` (configured grade points and ranges).
- **Finance:** `fee_structures`; `student_fees` (student, structure, billed amount and derived paid/status); `fee_payments` (positive, capped payment entries).
- **Library and audit:** `books` (ISBN and copy inventory); `book_issues` (student/book, issue/return dates); `audit_logs` (table, operation, record ID, old/new values, actor UUID, timestamp).

Enforce primary/foreign keys, unique and check constraints, suitable delete behavior, timestamps, and search/foreign-key indexes. Add at least five database views for academic summary, department distribution, fee summary, course attendance, and faculty offerings. Database functions will calculate attendance, outstanding balances, and CGPA from configured grade/credit rules. Transactional database functions will process payments, enrollments, and book issues/returns. Triggers will maintain timestamps, fee status, and audit records. Include a cursor example, transactional rollback example, and explain/analyze optimization examples.

## Security and sign-in
Use Lovable Cloud Auth with email/password plus the supported Google and Lovable sign-in options. Add a public sign-in flow and protected signed-in workspace; reflect session state in navigation and support sign-out. Create profiles on account creation. Store roles only in `user_roles`, never in editable profile metadata. Enable RLS and explicit Data API grants on every app table. Policies and database functions enforce role/ownership boundaries: students see their own records, faculty see assigned offerings and students therein, accountants manage fees, librarians manage library records, and admins have administrative access. Do not expose privileged credentials or trust client-supplied roles.

## Application structure and experience
- Create an actual ERP workspace at `/` with a role-aware dashboard, compact dark-navy navigation, light data workspace, responsive tables, and clear loading/empty/error/success states.
- Build the requested student, faculty, department, course, semester, enrollment, attendance, exams/results, fees/payments, library, reports, audit, user/role, profile, and settings surfaces as usable database-connected workflows. Use Recharts for database-backed dashboard/report data and Lucide for icons. Provide table search/filter/pagination, confirmation for destructive actions, CSV export, and print views where applicable.
- Use TanStack Start file-based routes, existing UI primitives, and semantic design tokens. Use the generated Cloud browser client and RLS for user-scoped access; use authenticated server functions only where server-side transactional or privileged work is necessary.

## Sample data and demo accounts
Seed fictional academic/business records in the database in dependency order: 4 departments, 6 programs, 20 courses, 30 students, 10 faculty, multiple terms, enrollments, attendance, exams/marks, fee records/payments, and 30 books with issues. Domain seed records will be included in the migration so they are present immediately. Auth accounts cannot safely receive invented passwords or be seeded as ordinary domain rows; document how to create safe demo users in Cloud and assign their separate roles/profile records.

## Deliverables
- Cloud database migration implementing the schema, security, seed data, views, triggers, and functions.
- Standalone ordered SQL source files under `ums/` matching the deployed SQL, plus `ums/README.md`.
- `ums/docs/REPORT.md`, `HOW_TO_RUN.md`, `DATABASE_DOCUMENTATION.md`, and `VIVA_QUESTIONS.md` (at least 30 questions and answers).
- Role-oriented app pages and real database workflows.

## Phases
1. Schema, profiles/roles, sign-in, grants/RLS, and seeded database.
2. ERP shell, database-backed dashboards, and academic structure/student/faculty workflows.
3. Enrollment, attendance, examinations, grades, and CGPA.
4. Fee workflows and library circulation with transactional validation.
5. Audit, reports/exports, advanced SQL demonstrations, and project documentation.
6. Run available app tests and verify key flows and database restrictions; report any hosted-auth steps that cannot be fully exercised in preview.

## Technical details
- Preserve TanStack Start v1 and its existing query/router setup; do not install React Router.
- Use Cloud-managed database migrations for hosted schema changes; all new public tables must have grants before RLS and policies.
- Keep role lookup server/database-validated. Any security-definer role helper uses a fixed search path and minimal execution grants.
- Payment processing locks the student-fee row, validates positive amount and available balance, inserts the payment, updates derived status, and raises on failure so PostgreSQL rolls back the transaction.
- Authentication signup keeps email confirmation enabled; never fabricate demo credentials or claim role-authenticated flows passed without an actual authenticated test.
