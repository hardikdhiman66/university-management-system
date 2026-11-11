# UniSphere implementation roadmap

- [ ] Phase 1: email/password auth, profile and separated role setup, normalized schema, strict RLS/grants, safe admin assignment, transactional database functions.
- [ ] Phase 1: seed fictional domain data in dependency order; add an actual data-backed dashboard foundation.
- [ ] Phase 2: ERP shell and functional CRUD for academic structure, students, faculty, enrollment.
- [ ] Phase 3: attendance, exams, published-mark grading, credits-based CGPA, and reports.
- [ ] Phase 4: concurrency-safe fee payments and library circulation with row locks.
- [ ] Phase 5: audit, exports, standalone synchronized SQL demos (including separate BEGIN/COMMIT/ROLLBACK, EXPLAIN ANALYZE, cursor), and requested documentation.
- [ ] Phase 6: run targeted tests, check preview build/runtime logs, inspect central workflows, and accurately note remaining gaps.
