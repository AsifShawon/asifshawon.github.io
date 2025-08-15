"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const MotionP = motion.p;

interface PerformanceSummaryProps {
    cgpa: number;
    totalCredits: number;
    totalGradePoints: number;
    countedCourses: number;
    totalCourses: number;
    getCgpaColor: (cgpa: number) => string;
}

export function PerformanceSummary({
    cgpa,
    totalCredits,
    totalGradePoints,
    countedCourses,
    totalCourses,
    getCgpaColor
}: PerformanceSummaryProps) {
    return (
        <Card className="border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Performance Summary
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-1 sm:space-y-2 col-span-2 md:col-span-1">
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">CGPA</p>
                        <MotionP
                            key={cgpa}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r ${getCgpaColor(cgpa)} bg-clip-text text-transparent drop-shadow-sm`}
                        >
                            {cgpa.toFixed(3)}
                        </MotionP>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Total Credits</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-300">{totalCredits.toFixed(1)}</p>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Grade Points</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-300">{totalGradePoints.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Counted Courses</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300">{countedCourses}</p>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Total Courses</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-300">{totalCourses}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
