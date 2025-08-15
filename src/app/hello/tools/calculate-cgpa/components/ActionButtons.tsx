"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, LoaderCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

interface ActionButtonsProps {
    isLoading: boolean;
    hasFiles: boolean;
    onExtractCourses: () => void;
    onAddCourse: () => void;
}

export function ActionButtons({ 
    isLoading, 
    hasFiles, 
    onExtractCourses, 
    onAddCourse 
}: ActionButtonsProps) {
    return (
        <div className="text-center space-y-3 sm:space-y-4">
            <Button 
                onClick={onExtractCourses} 
                disabled={isLoading || !hasFiles} 
                size="lg" 
                className="w-full sm:w-auto gap-2 sm:gap-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg shadow-emerald-500/25 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {isLoading ? (
                    <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="hidden sm:inline">
                    {isLoading ? 'Processing... This may take up to 45 seconds for multiple files' : 'Extract Courses with AI'}
                </span>
                <span className="sm:hidden">
                    {isLoading ? 'Processing...' : 'Extract with AI'}
                </span>
            </Button>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <p className="text-xs sm:text-sm text-gray-400">or</p>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            <Button 
                onClick={onAddCourse} 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto gap-2 sm:gap-3 border-white/20 bg-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/10 backdrop-blur-sm px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Add Courses Manually</span>
                <span className="sm:hidden">Add Manually</span>
            </Button>
            
            {isLoading && (
                <MotionDiv 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 px-4"
                >
                    <p>⏳ AI is analyzing your grade sheet...</p>
                    <p className="text-xs mt-1 hidden sm:block">Large PDFs may take longer to process</p>
                </MotionDiv>
            )}
        </div>
    );
}
