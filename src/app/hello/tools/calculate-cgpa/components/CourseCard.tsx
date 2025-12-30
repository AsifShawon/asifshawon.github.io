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
    if (upperGrade === "A+" || upperGrade === "A") return "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40";
    if (upperGrade === "A-") return "from-teal-500/20 to-teal-600/10 border-teal-500/40";
    if (upperGrade === "B+") return "from-blue-500/20 to-blue-600/10 border-blue-500/40";
    if (upperGrade === "B") return "from-cyan-500/20 to-cyan-600/10 border-cyan-500/40";
    if (upperGrade === "B-") return "from-sky-500/20 to-sky-600/10 border-sky-500/40";
    if (upperGrade === "C+" || upperGrade === "C") return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/40";
    if (upperGrade === "C-") return "from-amber-500/20 to-amber-600/10 border-amber-500/40";
    if (upperGrade === "D+" || upperGrade === "D") return "from-orange-500/20 to-orange-600/10 border-orange-500/40";
    if (upperGrade === "F") return "from-red-500/20 to-red-600/10 border-red-500/40";
    return "from-gray-500/20 to-gray-600/10 border-gray-500/40";
  };

  const getGradeTextColor = (grade: string): string => {
    const upperGrade = grade?.toUpperCase() || "";
    if (upperGrade === "A+" || upperGrade === "A") return "text-emerald-400";
    if (upperGrade === "A-") return "text-teal-400";
    if (upperGrade === "B+") return "text-blue-400";
    if (upperGrade === "B") return "text-cyan-400";
    if (upperGrade === "B-") return "text-sky-400";
    if (upperGrade === "C+" || upperGrade === "C") return "text-yellow-400";
    if (upperGrade === "C-") return "text-amber-400";
    if (upperGrade === "D+" || upperGrade === "D") return "text-orange-400";
    if (upperGrade === "F") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02] ${
        isCountedInCgpa
          ? `${getGradeBgColor(course.grade)} shadow-md`
          : "from-white/5 to-white/[0.02] border-white/10"
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          isCountedInCgpa
            ? course.grade?.toUpperCase().startsWith("A")
              ? "from-emerald-500 to-teal-500"
              : course.grade?.toUpperCase().startsWith("B")
              ? "from-blue-500 to-cyan-500"
              : course.grade?.toUpperCase().startsWith("C")
              ? "from-yellow-500 to-amber-500"
              : "from-orange-500 to-red-500"
            : "from-gray-600 to-gray-700"
        }`}
      />

      <div className="p-4">
        {/* Header: Course Code & Grade Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10">
              <BookOpen className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              value={course.courseCode}
              onChange={(e) => onCourseChange(course.id, "courseCode", e.target.value)}
              placeholder="CSE101"
              className="w-28 h-8 text-sm font-semibold tracking-wide uppercase border-0 bg-transparent focus:bg-white/10 rounded-md px-2 placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Grade Badge */}
            <div
              className={`px-3 py-1.5 rounded-lg font-bold text-sm ${getGradeTextColor(
                course.grade
              )} bg-white/10 border border-white/10`}
            >
              <Input
                value={course.grade}
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
              className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove course ${course.courseCode}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Course Name */}
        <div className="mb-4">
          <Input
            value={course.courseName}
            onChange={(e) => onCourseChange(course.id, "courseName", e.target.value)}
            placeholder="Course Name"
            className="w-full h-9 text-sm text-gray-200 border-0 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-lg px-3 placeholder:text-gray-600"
          />
        </div>

        {/* Footer: Credits & Points */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <div className="flex items-baseline gap-1">
                <Input
                  type="number"
                  value={course.credits}
                  onChange={(e) => onCourseChange(course.id, "credits", e.target.value)}
                  placeholder="3"
                  className="w-12 h-7 text-center text-sm font-medium border-0 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded px-1"
                />
                <span className="text-xs text-gray-500">cr</span>
              </div>
            </div>

            {/* Grade Point */}
            <div className="flex items-baseline gap-1 text-gray-400">
              <span className="text-xs">GP:</span>
              <span className="text-sm font-medium">{gradePointValue.toFixed(1)}</span>
            </div>
          </div>

          {/* Total Points */}
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Points</div>
            <div className={`text-xl font-bold tabular-nums ${getGradeTextColor(course.grade)}`}>
              {totalPoints.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Retake indicator */}
        {!isCountedInCgpa && (
          <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
            Retake
          </div>
        )}
      </div>
    </div>
  );
}
