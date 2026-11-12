# 🎓 UniSphere — University Management System (UMS ERP)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Bun](https://img.shields.io/badge/Runtime-Bun-FBF0DF?style=flat-square&logo=bun&logoColor=black)

A centralized, relational **University Enterprise Resource Planning (ERP)** web application designed to streamline academic, administrative, and financial operations—built with **React, TypeScript, Tailwind CSS**, and **PostgreSQL (Supabase)**.

## ✨ Key Modules & Features
- **🔐 Institutional Access Control:** Regex-enforced institutional email authentication (`25bcsXXXXX@cuchd.in`).
- **📊 Executive Dashboard:** Real-time KPI metrics, monthly activity charts, global search, and live notifications.
- **🏛️ Academic Structure:** Full CRUD workflows for **Departments**, **Programs**, **Courses**, **Students**, and **Faculty**.
- **📅 Attendance & Examinations:** Daily course-wise attendance tracking and exam scheduling with database-level `CHECK` constraints.
- **💳 Fees & Digital Library:** Automated student fee invoicing, partial/full payment ledger, and ISBN-based book catalog.

## 🏗️ Tech Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS | Modular, type-safe responsive dashboard |
| **Database & API** | PostgreSQL (Supabase) | Relational schema, ACID transactions, REST APIs |
| **Runtime** | Bun, Vite | High-speed local development & bundling |

## 🚀 Local Setup
```bash
git clone https://github.com/hardikdhiman66/university-management-system.git
cd university-management-system
bun install
cp .env.example .env
bun run dev
```
