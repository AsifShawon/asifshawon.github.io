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
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    <span className="hidden sm:inline">Course Details</span>
                    <span className="sm:hidden">Courses</span>
                    {courses.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                            ({courses.length} courses)
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-2">
                    {courses.length > 0 && onClearAll && (
                        <Button 
                            onClick={onClearAll}
                            variant="outline"
                            className="gap-1 sm:gap-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm px-3 py-2"
                            size="sm"
                        >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Clear All</span>
                        </Button>
                    )}
                    <Button 
                        onClick={onExportPDF}
                        className="gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 text-sm sm:text-base px-3 sm:px-4 py-2"
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
                            <Search className="h-12 w-12 text-gray-500 mb-4" />
                            <h4 className="text-lg font-semibold text-gray-300 mb-2">No courses found</h4>
                            <p className="text-sm text-gray-400 mb-4">
                                No courses match your search for &quot;{searchQuery}&quot;
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => onSearchChange('')}
                                className="border-white/20 bg-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/10"
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
                                className="h-full min-h-[180px] flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-white/20 bg-gradient-to-br from-white/[0.03] to-white/[0.06] backdrop-blur-sm hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-3 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
                                    <Plus className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h4 className="font-semibold text-gray-200 mb-1">Add New Course</h4>
                                <p className="text-xs text-gray-500">Click to add a course manually</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
