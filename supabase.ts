export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          ends_on: string
          id: string
          is_current: boolean
          label: string
          starts_on: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_on: string
          id?: string
          is_current?: boolean
          label: string
          starts_on: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_on?: string
          id?: string
          is_current?: boolean
          label?: string
          starts_on?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          attendance_date: string
          course_id: string
          course_offering_id: string
          created_at: string
          enrollment_id: string
          id: string
          recorded_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Insert: {
          attendance_date: string
          course_id: string
          course_offering_id: string
          created_at?: string
          enrollment_id: string
          id?: string
          recorded_by?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
        }
        Update: {
          attendance_date?: string
          course_id?: string
          course_offering_id?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_attendance_summary"
            referencedColumns: ["course_offering_id"]
          },
          {
            foreignKeyName: "attendance_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_academic_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          actor_id: string | null
          id: number
          new_values: Json | null
          occurred_at: string
          old_values: Json | null
          operation: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          actor_id?: string | null
          id?: never
          new_values?: Json | null
          occurred_at?: string
          old_values?: Json | null
          operation: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          actor_id?: string | null
          id?: never
          new_values?: Json | null
          occurred_at?: string
          old_values?: Json | null
          operation?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      book_issues: {
        Row: {
          book_id: string
          created_at: string
          due_on: string
          id: string
          issued_at: string
          processed_by: string | null
          returned_at: string | null
          student_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          due_on: string
          id?: string
          issued_at?: string
          processed_by?: string | null
          returned_at?: string | null
          student_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          due_on?: string
          id?: string
          issued_at?: string
          processed_by?: string | null
          returned_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_issues_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_issues_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_academic_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "book_issues_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          available_copies: number
          created_at: string
          id: string
          isbn: string
          published_year: number | null
          publisher: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author: string
          available_copies: number
          created_at?: string
          id?: string
          isbn: string
          published_year?: number | null
          publisher?: string | null
          title: string
          total_copies: number
          updated_at?: string
        }
        Update: {
          author?: string
          available_copies?: number
          created_at?: string
          id?: string
          isbn?: string
          published_year?: number | null
          publisher?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          course_offering_id: string
          enrolled_at: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          course_offering_id: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id: string
        }
        Update: {
          course_offering_id?: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_attendance_summary"
            referencedColumns: ["course_offering_id"]
          },
          {
            foreignKeyName: "course_enrollments_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_academic_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_offerings: {
        Row: {
          capacity: number
          course_id: string
          created_at: string
          faculty_id: string | null
          id: string
          section: string
          semester_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          course_id: string
          created_at?: string
          faculty_id?: string | null
          id?: string
          section?: string
          semester_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          course_id?: string
          created_at?: string
          faculty_id?: string | null
          id?: string
          section?: string
          semester_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_offerings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_course_summary"
            referencedColumns: ["faculty_id"]
          },
          {
            foreignKeyName: "course_offerings_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          credits: number
          department_id: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          credits: number
          department_id: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number
          department_id?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department_student_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      examinations: {
        Row: {
          course_offering_id: string
          created_at: string
          exam_type: string
          held_on: string | null
          id: string
          is_published: boolean
          maximum_marks: number
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_offering_id: string
          created_at?: string
          exam_type: string
          held_on?: string | null
          id?: string
          is_published?: boolean
          maximum_marks: number
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_offering_id?: string
          created_at?: string
          exam_type?: string
          held_on?: string | null
          id?: string
          is_published?: boolean
          maximum_marks?: number
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "examinations_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_attendance_summary"
            referencedColumns: ["course_offering_id"]
          },
          {
            foreignKeyName: "examinations_course_offering_id_fkey"
            columns: ["course_offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          created_at: string
          department_id: string
          designation: string
          employee_no: string
          hired_on: string | null
          id: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          designation: string
          employee_no: string
          hired_on?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          designation?: string
          employee_no?: string
          hired_on?: string | null
          id?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department_student_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "faculty_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string
          payment_method: string
          received_by: string | null
          reference_no: string | null
          student_fee_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_at?: string
          payment_method: string
          received_by?: string | null
          reference_no?: string | null
          student_fee_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string
          payment_method?: string
          received_by?: string | null
          reference_no?: string | null
          student_fee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_fee_id_fkey"
            columns: ["student_fee_id"]
            isOneToOne: false
            referencedRelation: "student_fee_summary"
            referencedColumns: ["student_fee_id"]
          },
          {
            foreignKeyName: "fee_payments_student_fee_id_fkey"
            columns: ["student_fee_id"]
            isOneToOne: false
            referencedRelation: "student_fees"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year_id: string
          amount: number
          created_at: string
          due_on: string
          id: string
          name: string
          program_id: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          amount: number
          created_at?: string
          due_on: string
          id?: string
          name: string
          program_id: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          amount?: number
          created_at?: string
          due_on?: string
          id?: string
          name?: string
          program_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_scale: {
        Row: {
          created_at: string
          grade: string
          grade_points: number
          id: string
          maximum_percentage: number
          minimum_percentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade: string
          grade_points: number
          id?: string
          maximum_percentage: number
          minimum_percentage: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade?: string
          grade_points?: number
          id?: string
          maximum_percentage?: number
          minimum_percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      marks: {
        Row: {
          created_at: string
          enrollment_id: string
          entered_by: string | null
          examination_id: string
          id: string
          marks_obtained: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          entered_by?: string | null
          examination_id: string
          id?: string
          marks_obtained: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          entered_by?: string | null
          examination_id?: string
          id?: string
          marks_obtained?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_examination_id_fkey"
            columns: ["examination_id"]
            isOneToOne: false
            referencedRelation: "examinations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          code: string
          created_at: string
          department_id: string
          duration_years: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          department_id: string
          duration_years: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          department_id?: string
          duration_years?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department_student_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          academic_year_id: string
          created_at: string
          ends_on: string
          id: string
          name: string
          sequence_no: number
          starts_on: string
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          created_at?: string
          ends_on: string
          id?: string
          name: string
          sequence_no: number
          starts_on: string
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          created_at?: string
          ends_on?: string
          id?: string
          name?: string
          sequence_no?: number
          starts_on?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "semesters_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      student_fees: {
        Row: {
          amount_paid: number
          billed_amount: number
          created_at: string
          due_on: string
          fee_structure_id: string
          id: string
          status: Database["public"]["Enums"]["fee_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          billed_amount: number
          created_at?: string
          due_on: string
          fee_structure_id: string
          id?: string
          status?: Database["public"]["Enums"]["fee_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          billed_amount?: number
          created_at?: string
          due_on?: string
          fee_structure_id?: string
          id?: string
          status?: Database["public"]["Enums"]["fee_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_fees_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_academic_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          current_semester_id: string | null
          email: string | null
          enrolled_on: string
          first_name: string
          id: string
          last_name: string
          profile_id: string | null
          program_id: string
          registration_no: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_semester_id?: string | null
          email?: string | null
          enrolled_on?: string
          first_name: string
          id?: string
          last_name: string
          profile_id?: string | null
          program_id: string
          registration_no: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_semester_id?: string | null
          email?: string | null
          enrolled_on?: string
          first_name?: string
          id?: string
          last_name?: string
          profile_id?: string | null
          program_id?: string
          registration_no?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_current_semester_id_fkey"
            columns: ["current_semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      course_attendance_summary: {
        Row: {
          attendance_entries: number | null
          attendance_percentage: number | null
          course_code: string | null
          course_offering_id: string | null
          course_title: string | null
          semester_name: string | null
        }
        Relationships: []
      }
      department_student_statistics: {
        Row: {
          code: string | null
          department_id: string | null
          name: string | null
          student_count: number | null
        }
        Relationships: []
      }
      faculty_course_summary: {
        Row: {
          course_offerings: number | null
          designation: string | null
          display_name: string | null
          employee_no: string | null
          faculty_id: string | null
        }
        Relationships: []
      }
      student_academic_summary: {
        Row: {
          average_attendance: number | null
          cgpa: number | null
          enrollment_count: number | null
          first_name: string | null
          last_name: string | null
          program_name: string | null
          registration_no: string | null
          student_id: string | null
        }
        Relationships: []
      }
      student_fee_summary: {
        Row: {
          amount_paid: number | null
          billed_amount: number | null
          due_on: string | null
          fee_structure_id: string | null
          outstanding_amount: number | null
          registration_no: string | null
          status: Database["public"]["Enums"]["fee_status"] | null
          student_fee_id: string | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_fees_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_academic_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      assign_initial_admin: { Args: { _user_id: string }; Returns: undefined }
      attendance_percentage: {
        Args: { _enrollment_id: string }
        Returns: number
      }
      calculate_cgpa: { Args: { _student_id: string }; Returns: number }
      enroll_student: {
        Args: { _course_offering_id: string; _student_id: string }
        Returns: string
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      issue_book: {
        Args: { _book_id: string; _due_on: string; _student_id: string }
        Returns: string
      }
      outstanding_fee: { Args: { _student_fee_id: string }; Returns: number }
      process_fee_payment: {
        Args: {
          _amount: number
          _payment_method: string
          _reference_no?: string
          _student_fee_id: string
        }
        Returns: string
      }
      return_book: { Args: { _issue_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "faculty" | "student" | "accountant" | "librarian"
      attendance_status: "present" | "absent" | "late" | "excused"
      fee_status: "pending" | "partial" | "paid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "faculty", "student", "accountant", "librarian"],
      attendance_status: ["present", "absent", "late", "excused"],
      fee_status: ["pending", "partial", "paid"],
    },
  },
} as const
