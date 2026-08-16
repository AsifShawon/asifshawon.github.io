"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Component imports
import { FileUpload } from './components/FileUpload';
import { PerformanceSummary } from './components/PerformanceSummary';
import { ActionButtons } from './components/ActionButtons';
import { CoursesGrid } from './components/CoursesGrid';
import { AddCourseModal } from './components/AddCourseModal';
import { GradingPolicy } from './components/GradingPolicy';
import { ApiKeyInput } from './components/ApiKeyInput';

// Hook and type imports
import { useCgpaCalculation } from './hooks/useCgpaCalculation';

// Helper to load external scripts
const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default function CgpaCalculatorPage() {
    // Load the PDF.js library from CDN (for PDF reading)
    useScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js');

    // Set PDF.js worker source once the library is loaded
    useEffect(() => {
        if ((window as any).pdfjsLib) {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
        }
    }, []);

    // Use the CGPA calculation hook
    const {
        uploadedFiles,
        fileInfo,
        courses,
        cgpa,
        totalCredits,
        totalGradePoints,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        filteredCourses,
        gradeScale,
        isAddCourseModalOpen,
        setIsAddCourseModalOpen,
        newCourse,
        handleFileChange,
        handleExtractCourses,
        addCourseRow,
        removeCourseRow,
        handleCourseChange,
        handleModalInputChange,
        handleAddCourse,
        closeModal,
        removeFile,
        exportToPDF,
        isCourseCountedInCgpa,
        getCgpaColor,
        getGradeColor,
        updateGradeScale,
        // API Key management
        userApiKey,
        saveApiKey,
        clearApiKey,
        showApiKeyInput,
        setShowApiKeyInput,
        clearSavedCourses
    } = useCgpaCalculation();

    return (
        <div className="relative min-h-screen overflow-hidden bg-[var(--site-bg)] p-2 sm:p-4 md:p-6 lg:p-8">
            {/* Decorative background — two soft, low-opacity blobs (green + digital
                accent) rather than the dark theme's four-hue glow party. */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[var(--ml-green)]/10 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute bottom-20 left-20 h-48 w-48 rounded-full bg-[var(--ml-indigo)]/10 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

            <div className="relative max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full border-[var(--site-border)] bg-[var(--site-surface-raised)] backdrop-blur-2xl shadow-[var(--ml-shadow-lg)] rounded-lg"
                >
                    {/* Header */}
                    <div className="text-center relative pb-6 sm:pb-8 px-4 sm:px-6 pt-4">
                        <div className="absolute left-2 sm:left-4 top-2 sm:top-4">
                            <Link href="/hello/tools" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[var(--site-text-muted)] hover:text-[var(--ml-ink)] hover:bg-[var(--site-surface-hover)] transition-all p-2 sm:p-3 rounded">
                                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 mt-8 sm:mt-4">
                            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--ml-green)]/15 to-[var(--ml-indigo)]/15 backdrop-blur-sm border border-[var(--site-border)]">
                                <span className="text-2xl">🎓</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text px-2">
                            AI-Powered CGPA Calculator
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[var(--site-text-muted)] max-w-2xl mx-auto mt-3 sm:mt-4 px-4">
                            Upload your grade sheets (multiple files supported) and let advanced AI extract your courses automatically. Get detailed insights with grade point calculations.
                        </p>
                    </div>

                    <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 pb-6 sm:pb-8">
                        {/* API Key Input */}
                        <ApiKeyInput
                            userApiKey={userApiKey}
                            onSaveApiKey={saveApiKey}
                            onClearApiKey={clearApiKey}
                            showApiKeyInput={showApiKeyInput}
                            onToggleInput={setShowApiKeyInput}
                        />

                        {/* File Upload Component */}
                        <FileUpload
                            uploadedFiles={uploadedFiles}
                            fileInfo={fileInfo}
                            onFileChange={handleFileChange}
                            onRemoveFile={removeFile}
                        />

                        {/* Action Buttons Component */}
                        <ActionButtons
                            onExtractCourses={handleExtractCourses}
                            onAddCourse={addCourseRow}
                            isLoading={isLoading}
                            hasFiles={uploadedFiles.length > 0}
                        />

                        {/* Error Display */}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                <div className="border-[var(--site-danger)]/40 bg-[var(--site-danger)]/10 border rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span>⚠️</span>
                                        <h3 className="font-bold text-[var(--site-danger)]">
                                            {error.includes('timeout') || error.includes('timed out') ? 'Timeout Error' : 'Error'}
                                        </h3>
                                    </div>
                                    <p className="text-[var(--site-danger)]">{error}</p>
                                    {(error.includes('timeout') || error.includes('timed out')) && (
                                        <div className="text-sm text-[var(--site-danger)]/85 space-y-1 mt-2">
                                            <p><strong>Tips to avoid timeouts:</strong></p>
                                            <ul className="list-disc list-inside space-y-1 text-xs">
                                                <li>Use smaller image files (under 2MB)</li>
                                                <li>Limit PDFs to 3-5 pages maximum</li>
                                                <li>Ensure images are clear and not too large</li>
                                                <li>Try again - sometimes the server is just busy</li>
                                                <li>Or <strong>manually add courses</strong> using the &ldquo;Add Course&rdquo; button below</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Performance Summary Component */}
                        {courses.length > 0 && (
                            <PerformanceSummary
                                cgpa={cgpa}
                                totalCredits={totalCredits}
                                totalGradePoints={totalGradePoints}
                                countedCourses={courses.filter(c => isCourseCountedInCgpa(c)).length}
                                totalCourses={courses.length}
                                getCgpaColor={getCgpaColor}
                            />
                        )}

                        {/* Courses Grid Component */}
                        {courses.length > 0 && (
                            <CoursesGrid
                                courses={courses}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                onCourseChange={handleCourseChange}
                                onRemoveCourse={removeCourseRow}
                                onAddCourse={addCourseRow}
                                onExportPDF={exportToPDF}
                                gradeScale={gradeScale}
                                isCourseCountedInCgpa={isCourseCountedInCgpa}
                                getGradeColor={getGradeColor}
                                filteredCourses={filteredCourses}
                                onClearAll={clearSavedCourses}
                            />
                        )}

                        {/* Grading Policy Component */}
                        <GradingPolicy
                            gradeScale={gradeScale}
                            onGradeScaleUpdate={updateGradeScale}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Add Course Modal Component */}
            <AddCourseModal
                isOpen={isAddCourseModalOpen}
                onClose={closeModal}
                newCourse={newCourse}
                onInputChange={handleModalInputChange}
                onAddCourse={handleAddCourse}
                gradeScale={gradeScale}
            />
        </div>
    );
}
