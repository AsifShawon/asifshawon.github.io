"use client";
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { GradeScale } from '../types';

interface AddCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    newCourse: {
        courseCode: string;
        courseName: string;
        credits: string;
        grade: string;
    };
    onInputChange: (field: string, value: string) => void;
    onAddCourse: () => void;
    gradeScale: GradeScale;
}

export function AddCourseModal({
    isOpen,
    onClose,
    newCourse,
    onInputChange,
    onAddCourse,
    gradeScale
}: AddCourseModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-white/20 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        Add New Course
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Enter the course details below to add it to your CGPA calculation.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    {/* Course Code */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                            Course Code
                        </label>
                        <Input 
                            value={newCourse.courseCode} 
                            onChange={(e) => onInputChange('courseCode', e.target.value)} 
                            placeholder="e.g., CS101, MATH201" 
                            className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Course Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                            Course Name
                        </label>
                        <Input 
                            value={newCourse.courseName} 
                            onChange={(e) => onInputChange('courseName', e.target.value)} 
                            placeholder="e.g., Introduction to Programming" 
                            className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Credits and Grade Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                                Credits
                            </label>
                            <Input 
                                type="number" 
                                value={newCourse.credits} 
                                onChange={(e) => onInputChange('credits', e.target.value)} 
                                placeholder="3" 
                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                                Grade
                            </label>
                            <Input 
                                value={newCourse.grade} 
                                onChange={(e) => onInputChange('grade', e.target.value)} 
                                placeholder="A+" 
                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Grade Points Preview */}
                    {newCourse.credits && newCourse.grade && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-emerald-300">Grade Points:</span>
                                <span className="font-mono text-lg font-bold text-emerald-300">
                                    {((parseFloat(newCourse.credits) || 0) * (gradeScale[newCourse.grade.toUpperCase()] || 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="border-white/20 bg-white/10 hover:border-gray-400/50 hover:bg-white/20 text-white"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onAddCourse}
                        disabled={!newCourse.courseCode || !newCourse.credits || !newCourse.grade}
                        className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
