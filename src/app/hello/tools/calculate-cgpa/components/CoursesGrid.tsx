"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Course, GradeScale } from '../types';

const MotionDiv = motion.div;

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
    getGradeColor
}: CoursesGridProps) {
    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    <span className="hidden sm:inline">Course Details</span>
                    <span className="sm:hidden">Courses</span>
                </h3>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            gradeScale={gradeScale}
                            isCountedInCgpa={isCourseCountedInCgpa(course)}
                            courses={courses}
                            onCourseChange={onCourseChange}
                            onRemoveCourse={onRemoveCourse}
                            getGradeColor={getGradeColor}
                        />
                    ))}
                    
                    {/* No results message */}
                    {filteredCourses.length === 0 && searchQuery && (
                        <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
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
                        <MotionDiv
                            layout
                            className="min-h-[140px] flex items-center justify-center"
                        >
                            <Card className="w-full h-full border-dashed border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-300 hover:bg-emerald-500/5 cursor-pointer group">
                                <CardContent 
                                    className="h-full flex flex-col items-center justify-center p-4 text-center"
                                    onClick={onAddCourse}
                                >
                                    <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <Plus className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-200 mb-1 text-sm">Add Course</h4>
                                    <p className="text-xs text-gray-400">Click to add</p>
                                </CardContent>
                            </Card>
                        </MotionDiv>
                    )}
                </div>
            </div>
        </div>
    );
}
