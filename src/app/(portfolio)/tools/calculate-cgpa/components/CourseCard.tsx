"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen, GraduationCap } from "lucide-react";
import { Course, GradeScale } from "../types";

interface CourseCardProps {
  course: Course;
  gradeScale: GradeScale;
  isCountedInCgpa: boolean;
  courses: Course[];
  onCourseChange: (id: string, field: keyof Course, value: string) => void;
  onRemoveCourse: (id: string) => void;
  getGradeColor: (grade: string) => string;
}

export function CourseCard({
  course,
  gradeScale,
  isCountedInCgpa,
  courses,
  onCourseChange,
  onRemoveCourse,
  getGradeColor,
}: CourseCardProps) {
  const credits = parseFloat(course.credits || "0") || 0;
  const gradePointValue = gradeScale[course.grade?.toUpperCase() || ""] || 0;
  const totalPoints = gradePointValue * credits;

  const getGradeBgColor = (grade: string): string => {
    const upperGrade = grade?.toUpperCase() || "";
    if (upperGrade === "A+" || upperGrade === "A") return "from-[var(--ml-green)]/20 to-[var(--ml-green)]/5 border-[var(--ml-green)]/40";
    if (upperGrade === "A-") return "from-teal-500/20 to-teal-600/5 border-teal-500/40";
    if (upperGrade === "B+") return "from-blue-500/20 to-blue-600/5 border-blue-500/40";
    if (upperGrade === "B") return "from-cyan-500/20 to-cyan-600/5 border-cyan-500/40";
    if (upperGrade === "B-") return "from-sky-500/20 to-sky-600/5 border-sky-500/40";
    if (upperGrade === "C+" || upperGrade === "C") return "from-yellow-500/20 to-yellow-600/5 border-yellow-500/40";
    if (upperGrade === "C-") return "from-amber-500/20 to-amber-600/5 border-amber-500/40";
    if (upperGrade === "D+" || upperGrade === "D") return "from-orange-500/20 to-orange-600/5 border-orange-500/40";
    if (upperGrade === "F") return "from-[var(--site-danger)]/20 to-[var(--site-danger)]/5 border-[var(--site-danger)]/40";
    return "from-[var(--site-surface-soft)] to-[var(--site-surface-soft)] border-[var(--site-border)]";
  };

  const getGradeTextColor = (grade: string): string => {
    const upperGrade = grade?.toUpperCase() || "";
    if (upperGrade === "A+" || upperGrade === "A") return "text-[var(--ml-green)]";
    if (upperGrade === "A-") return "text-teal-700";
    if (upperGrade === "B+") return "text-blue-700";
    if (upperGrade === "B") return "text-cyan-700";
    if (upperGrade === "B-") return "text-sky-700";
    if (upperGrade === "C+" || upperGrade === "C") return "text-yellow-700";
    if (upperGrade === "C-") return "text-amber-700";
    if (upperGrade === "D+" || upperGrade === "D") return "text-orange-700";
    if (upperGrade === "F") return "text-[var(--site-danger)]";
    return "text-[var(--site-text-muted)]";
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-[var(--ml-shadow-md)] hover:scale-[1.02] ${
        isCountedInCgpa
          ? `${getGradeBgColor(course.grade)} shadow-md`
          : "from-[var(--site-surface-soft)] to-[var(--site-surface-soft)]/40 border-[var(--site-border)]"
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          isCountedInCgpa
            ? course.grade?.toUpperCase().startsWith("A")
              ? "from-[var(--ml-green)] to-teal-500"
              : course.grade?.toUpperCase().startsWith("B")
              ? "from-blue-500 to-cyan-500"
              : course.grade?.toUpperCase().startsWith("C")
              ? "from-yellow-500 to-amber-500"
              : "from-orange-500 to-[var(--site-danger)]"
            : "from-[var(--site-border)] to-[var(--site-border-strong)]"
        }`}
      />

      <div className="p-4">
        {/* Header: Course Code & Grade Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--site-surface-soft)]">
              <BookOpen className="w-4 h-4 text-[var(--site-text-muted)]" />
            </div>
            <Input
              value={course.courseCode || ''}
              onChange={(e) => onCourseChange(course.id, "courseCode", e.target.value)}
              placeholder="CSE101"
              className="w-28 h-8 text-sm font-semibold tracking-wide uppercase border-0 bg-transparent focus:bg-[var(--site-surface-hover)] rounded-md px-2 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Grade Badge */}
            <div
              className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getGradeTextColor(
                course.grade
              )} bg-[var(--site-surface-raised)] border border-[var(--site-border)]`}
            >
              <Input
                value={course.grade || ''}
                onChange={(e) => onCourseChange(course.id, "grade", e.target.value.toUpperCase())}
                placeholder="A"
                className={`w-10 h-6 text-center text-sm font-bold uppercase border-0 bg-transparent p-0 ${getGradeTextColor(
                  course.grade
                )}`}
              />
            </div>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveCourse(course.id)}
              className="h-8 w-8 text-[var(--site-text-muted)] hover:text-[var(--site-danger)] hover:bg-[var(--site-danger)]/10 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove course ${course.courseCode}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Course Name */}
        <div className="mb-4">
          <Input
            value={course.courseName || ''}
            onChange={(e) => onCourseChange(course.id, "courseName", e.target.value)}
            placeholder="Course Name"
            className="w-full h-9 text-sm text-[var(--site-text)] border-0 bg-[var(--site-surface-soft)] hover:bg-[var(--site-surface-hover)] focus:bg-[var(--site-surface-hover)] rounded-lg px-3 placeholder:text-[var(--ml-sage)]"
          />
        </div>

        {/* Footer: Credits & Points */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--site-border)]">
          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[var(--site-text-muted)]" />
              <div className="flex items-baseline gap-1">
                <Input
                  type="number"
                  value={course.credits || ''}
                  onChange={(e) => onCourseChange(course.id, "credits", e.target.value)}
                  placeholder="3"
                  className="w-12 h-7 text-center text-sm font-medium border-0 bg-[var(--site-surface-soft)] hover:bg-[var(--site-surface-hover)] focus:bg-[var(--site-surface-hover)] rounded px-1 text-[var(--ml-ink)]"
                />
                <span className="text-xs text-[var(--site-text-muted)]">cr</span>
              </div>
            </div>

            {/* Grade Point */}
            <div className="flex items-baseline gap-1 text-[var(--site-text-muted)]">
              <span className="text-xs">GP:</span>
              <span className="text-sm font-medium">{gradePointValue.toFixed(1)}</span>
            </div>
          </div>

          {/* Total Points */}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-[var(--site-text-muted)] mb-0.5">Points</div>
            <div className={`text-xl font-bold tabular-nums ${getGradeTextColor(course.grade)}`}>
              {totalPoints.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Retake indicator */}
        {!isCountedInCgpa && (
          <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-[var(--site-highlight)]/40 text-[var(--site-text-on-surface)] rounded-full border border-[var(--site-border-strong)]">
            Retake
          </div>
        )}
      </div>
    </div>
  );
}
