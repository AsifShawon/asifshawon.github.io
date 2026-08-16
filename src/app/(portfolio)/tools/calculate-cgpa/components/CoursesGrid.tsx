"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search, Trash2 } from 'lucide-react';
import { Course, GradeScale } from '../types';

interface CoursesGridProps {
    courses: Course[];
    filteredCourses: Course[];
    searchQuery: string;
    gradeScale: GradeScale;
    isCourseCountedInCgpa: (course: Course) => boolean;
    onCourseChange: (id: string, field: keyof Course, value: string) => void;
    onRemoveCourse: (id: string) => void;
    onAddCourse: () => void;
    onExportPDF: () => void;
    onSearchChange: (query: string) => void;
    getGradeColor: (grade: string) => string;
    onClearAll?: () => void;
}

export function CoursesGrid({
    courses,
    filteredCourses,
    searchQuery,
    gradeScale,
    isCourseCountedInCgpa,
    onCourseChange,
    onRemoveCourse,
    onAddCourse,
    onExportPDF,
    onSearchChange,
    getGradeColor,
    onClearAll
}: CoursesGridProps) {
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[var(--ml-ink)]">
                    <span className="hidden sm:inline">Course Details</span>
                    <span className="sm:hidden">Courses</span>
                    {courses.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-[var(--site-text-muted)]">
                            ({courses.length} courses)
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-2">
                    {courses.length > 0 && onClearAll && (
                        <Button
                            onClick={onClearAll}
                            variant="outline"
                            className="gap-1 sm:gap-2 border-[var(--site-danger)]/30 bg-[var(--site-danger)]/10 hover:bg-[var(--site-danger)]/20 text-[var(--site-danger)] text-sm px-3 py-2"
                            size="sm"
                        >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Clear All</span>
                        </Button>
                    )}
                    <Button
                        onClick={onExportPDF}
                        className="gap-1 sm:gap-2 bg-[var(--ml-indigo)] hover:opacity-90 shadow-[var(--ml-shadow-sm)] text-sm sm:text-base px-3 sm:px-4 py-2 text-[var(--site-on-primary)]"
                        size="sm"
                    >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Export PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            {courses.length > 0 && (
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    resultsCount={filteredCourses.length}
                />
            )}

            {/* Course Cards Grid */}
            <div className="p-2 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {filteredCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <CourseCard
                                course={course}
                                gradeScale={gradeScale}
                                isCountedInCgpa={isCourseCountedInCgpa(course)}
                                courses={courses}
                                onCourseChange={onCourseChange}
                                onRemoveCourse={onRemoveCourse}
                                getGradeColor={getGradeColor}
                            />
                        </motion.div>
                    ))}

                    {/* No results message */}
                    {filteredCourses.length === 0 && searchQuery && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-[var(--site-text-muted)] mb-4" />
                            <h4 className="text-lg font-semibold text-[var(--ml-ink)] mb-2">No courses found</h4>
                            <p className="text-sm text-[var(--site-text-muted)] mb-4">
                                No courses match your search for &quot;{searchQuery}&quot;
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => onSearchChange('')}
                                className="border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:border-[var(--ml-green)]/50 hover:bg-[var(--ml-green)]/10 text-[var(--ml-ink)]"
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}

                    {/* Add New Course Card */}
                    {(!searchQuery || filteredCourses.length > 0) && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: filteredCourses.length * 0.05 }}
                        >
                            <div
                                onClick={onAddCourse}
                                className="h-full min-h-[180px] flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-[var(--site-border)] bg-[var(--site-surface-soft)]/40 backdrop-blur-sm hover:border-[var(--ml-green)]/50 hover:bg-[var(--ml-green)]/5 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="p-3 rounded-xl bg-[var(--ml-green)]/15 mb-3 group-hover:scale-110 group-hover:shadow-[var(--ml-shadow-sm)] transition-all duration-300">
                                    <Plus className="h-6 w-6 text-[var(--ml-green)]" />
                                </div>
                                <h4 className="font-semibold text-[var(--site-text)] mb-1">Add New Course</h4>
                                <p className="text-xs text-[var(--site-text-muted)]">Click to add a course manually</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
