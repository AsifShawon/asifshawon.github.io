"use client";
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit3, Check, X, RotateCcw } from 'lucide-react';

interface GradingPolicyProps {
    gradeScale: { [key: string]: number };
    onGradeScaleUpdate: (grade: string, point: number) => void;
}

export function GradingPolicy({ gradeScale, onGradeScaleUpdate }: GradingPolicyProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedGrades, setEditedGrades] = useState<{ [key: string]: string }>({});
    
    // Default grade scale for reset functionality
    const defaultGradeScale = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0,
    };

    const gradeItems = [
        { grade: 'A+', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        { grade: 'A', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        { grade: 'A-', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
        { grade: 'B+', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
        { grade: 'B', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
        { grade: 'B-', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
        { grade: 'C+', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
        { grade: 'C', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
        { grade: 'C-', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
        { grade: 'D+', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
        { grade: 'D', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
        { grade: 'F', color: 'bg-red-600/30 text-red-200 border-red-600/50' },
    ];

    const handleEditStart = () => {
        setIsEditing(true);
        // Initialize edited grades with current values
        const initialEditedGrades: { [key: string]: string } = {};
        gradeItems.forEach(item => {
            initialEditedGrades[item.grade] = (gradeScale[item.grade] || 0).toFixed(2);
        });
        setEditedGrades(initialEditedGrades);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedGrades({});
    };

    const handleEditSave = () => {
        // Apply all changes
        Object.entries(editedGrades).forEach(([grade, pointStr]) => {
            const point = parseFloat(pointStr);
            if (!isNaN(point) && point >= 0 && point <= 5) {
                onGradeScaleUpdate(grade, point);
            }
        });
        setIsEditing(false);
        setEditedGrades({});
    };

    const handleGradePointChange = (grade: string, value: string) => {
        setEditedGrades(prev => ({
            ...prev,
            [grade]: value
        }));
    };

    const handleReset = () => {
        // Reset to default grade scale
        Object.entries(defaultGradeScale).forEach(([grade, point]) => {
            onGradeScaleUpdate(grade, point);
        });
        setIsEditing(false);
        setEditedGrades({});
    };

    return (
        <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Grading Policy
                </h3>
                
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <>
                            <Button
                                onClick={handleEditStart}
                                size="sm"
                                variant="outline"
                                className="border-white/20 bg-white/10 hover:border-blue-400/50 hover:bg-blue-500/10 text-white"
                            >
                                <Edit3 className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                                onClick={handleReset}
                                size="sm"
                                variant="outline"
                                className="border-white/20 bg-white/10 hover:border-yellow-400/50 hover:bg-yellow-500/10 text-white"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Reset</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={handleEditSave}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button
                                onClick={handleEditCancel}
                                size="sm"
                                variant="outline"
                                className="border-red-400/50 bg-red-500/10 hover:border-red-400/70 hover:bg-red-500/20 text-red-300"
                            >
                                <X className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Cancel</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {gradeItems.map((item) => (
                    <div
                        key={item.grade}
                        className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                        <Badge className={`${item.color} border text-sm font-bold px-2 py-1 mb-2`}>
                            {item.grade}
                        </Badge>
                        
                        {isEditing ? (
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="5"
                                value={editedGrades[item.grade] || '0.00'}
                                onChange={(e) => handleGradePointChange(item.grade, e.target.value)}
                                className="w-16 h-8 text-center text-xs border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white"
                            />
                        ) : (
                            <span className="text-white font-mono text-sm">
                                {(gradeScale[item.grade] || 0).toFixed(2)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-400">
                    {isEditing ? (
                        <>✏️ Edit grade points according to your institution&apos;s policy. Values should be between 0.00 and 5.00.</>
                    ) : (
                        <>💡 Grades are based on a customizable scale. For retaken courses, only the highest grade counts towards CGPA calculation.</>
                    )}
                </p>
            </div>
        </div>
    );
}
