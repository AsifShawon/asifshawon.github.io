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
            <DialogContent className="border-[var(--site-border)] bg-[var(--site-surface-raised)] backdrop-blur-xl text-[var(--ml-ink)] max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold gradient-text">
                        Add New Course
                    </DialogTitle>
                    <DialogDescription className="text-[var(--site-text-muted)]">
                        Enter the course details below to add it to your CGPA calculation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Course Code */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--site-text)] uppercase tracking-wide">
                            Course Code
                        </label>
                        <Input
                            value={newCourse.courseCode}
                            onChange={(e) => onInputChange('courseCode', e.target.value)}
                            placeholder="e.g., CS101, MATH201"
                            className="border-[var(--site-border)] bg-[var(--site-surface-soft)] focus:border-[var(--ml-green)]/50 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
                        />
                    </div>

                    {/* Course Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--site-text)] uppercase tracking-wide">
                            Course Name
                        </label>
                        <Input
                            value={newCourse.courseName}
                            onChange={(e) => onInputChange('courseName', e.target.value)}
                            placeholder="e.g., Introduction to Programming"
                            className="border-[var(--site-border)] bg-[var(--site-surface-soft)] focus:border-[var(--ml-green)]/50 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
                        />
                    </div>

                    {/* Credits and Grade Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--site-text)] uppercase tracking-wide">
                                Credits
                            </label>
                            <Input
                                type="number"
                                value={newCourse.credits}
                                onChange={(e) => onInputChange('credits', e.target.value)}
                                placeholder="3"
                                className="border-[var(--site-border)] bg-[var(--site-surface-soft)] focus:border-[var(--ml-green)]/50 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--site-text)] uppercase tracking-wide">
                                Grade
                            </label>
                            <Input
                                value={newCourse.grade}
                                onChange={(e) => onInputChange('grade', e.target.value)}
                                placeholder="A+"
                                className="border-[var(--site-border)] bg-[var(--site-surface-soft)] focus:border-[var(--ml-green)]/50 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
                            />
                        </div>
                    </div>

                    {/* Grade Points Preview */}
                    {newCourse.credits && newCourse.grade && (
                        <div className="p-3 rounded-lg bg-[var(--ml-green)]/10 border border-[var(--ml-green)]/25">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--ml-green)]">Grade Points:</span>
                                <span className="font-mono text-lg font-bold text-[var(--ml-green)]">
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
                        className="border-[var(--site-border)] bg-[var(--site-surface-soft)] hover:bg-[var(--site-surface-hover)] text-[var(--ml-ink)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onAddCourse}
                        disabled={!newCourse.courseCode || !newCourse.credits || !newCourse.grade}
                        className="bg-[var(--ml-green)] hover:bg-[var(--site-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--site-on-primary)]"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
