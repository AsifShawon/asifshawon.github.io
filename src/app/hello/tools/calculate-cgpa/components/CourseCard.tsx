"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  const gradePoint = (gradeScale[course.grade?.toUpperCase() || ""] || 0) * (parseFloat(course.credits || "0") || 0);

  return (
    <Card className={`border ${isCountedInCgpa ? "border-emerald-500/30" : "border-white/10"} bg-gradient-to-br from-white/3 to-white/6`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Course Code</label>
                <Input
                  value={course.courseCode}
                  onChange={(e) => onCourseChange(course.id, "courseCode", e.target.value)}
                  className="mt-1 text-sm border-white/20 bg-white/5"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Credits</label>
                <Input
                  type="number"
                  value={course.credits}
                  onChange={(e) => onCourseChange(course.id, "credits", e.target.value)}
                  className="mt-1 text-sm border-white/20 bg-white/5"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="text-xs text-gray-400">Course Name</label>
              <Input
                value={course.courseName}
                onChange={(e) => onCourseChange(course.id, "courseName", e.target.value)}
                className="mt-1 text-sm border-white/20 bg-white/5"
              />
            </div>

            <div className="mt-2">
              <label className="text-xs text-gray-400">Grade</label>
              <Input
                value={course.grade}
                onChange={(e) => onCourseChange(course.id, "grade", e.target.value)}
                className="mt-1 text-sm border-white/20 bg-white/5"
              />
            </div>
          </div>

          <div className="w-28 flex flex-col items-end justify-between">
            <div className="text-right">
              <div className="text-xs text-gray-400">Points</div>
              <div className="font-mono font-semibold text-lg" style={{ color: getGradeColor(course.grade) }}>
                {gradePoint.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCourse(course.id)}
                className="text-red-400 hover:bg-red-600/10"
                aria-label={`Remove course ${course.courseCode}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
