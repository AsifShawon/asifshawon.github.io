"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course, GradeScale } from '../types';

const MotionDiv = motion.div;

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
    getGradeColor
}: CourseCardProps) {
    const credits = parseFloat(course.credits) || 0;
    const gradePoint = gradeScale[course.grade.toUpperCase()] || 0;

    return (
        <MotionDiv
            key={course.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
        >
            <Card className={`border-white/20 bg-gradient-to-br ${isCountedInCgpa ? 'from-white/5 to-white/10' : 'from-red-500/5 to-orange-500/5'} backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 ${!isCountedInCgpa ? 'opacity-75' : ''}`}>
                <CardContent className="p-3 space-y-2">
                    {/* Header with Grade Badge and Delete Button */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 flex-wrap">
                            {course.grade && (
                                <Badge className={`${getGradeColor(course.grade)} border text-xs font-medium px-1.5 py-0.5`}>
                                    {course.grade.toUpperCase()}
                                </Badge>
                            )}
                            {course.grade && (
                                <Badge variant="outline" className="text-xs text-gray-300 border-gray-500/30 px-1.5 py-0.5">
                                    {gradePoint.toFixed(1)}
                                </Badge>
                            )}
                            {!isCountedInCgpa && course.courseCode && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-xs font-medium px-1.5 py-0.5">
                                    Not Counted
                                </Badge>
                            )}
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemoveCourse(course.id)}
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-300"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Course Code */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            Course Code
                        </label>
                        <Input 
                            value={course.courseCode} 
                            onChange={(e) => onCourseChange(course.id, 'courseCode', e.target.value)} 
                            placeholder="e.g., CS101" 
                            className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-sm h-8"
                        />
                        {/* Retake Indicator */}
                        {course.courseCode && courses.filter(c => c.courseCode.trim().toUpperCase() === course.courseCode.trim().toUpperCase()).length > 1 && (
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                <span className="text-xs text-yellow-400">
                                    {isCountedInCgpa ? 'Best grade (counted)' : 'Retake (not counted)'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Credits and Grade Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Credits
                            </label>
                            <Input 
                                type="number" 
                                value={course.credits} 
                                onChange={(e) => onCourseChange(course.id, 'credits', e.target.value)} 
                                placeholder="3" 
                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-sm h-8"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Grade
                            </label>
                            <Input 
                                value={course.grade} 
                                onChange={(e) => onCourseChange(course.id, 'grade', e.target.value)} 
                                placeholder="A+" 
                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-sm h-8"
                            />
                        </div>
                    </div>

                    {/* Grade Points Display */}
                    <div className="pt-1 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Grade Points
                            </span>
                            <span className="text-sm font-bold text-emerald-300">
                                {(credits * gradePoint).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </MotionDiv>
    );
}
