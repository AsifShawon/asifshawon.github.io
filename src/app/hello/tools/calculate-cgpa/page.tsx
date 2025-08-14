// @ts-nocheck
"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
/* eslint-disable */

// Type augmentations for PDF.js and jsPDF
declare global {
  interface Window { 
    pdfjsLib?: any;
    jsPDF?: any;
  }
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FileUp, LoaderCircle, Plus, Trash2, X, ArrowLeft, Download, GraduationCap, BookOpen, Calculator } from 'lucide-react';

// Motion element shorthands
const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionTr = motion.tr;

// ShadCN UI Component Imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Define the structure for a course
interface Course {
    id: string;
    courseCode: string;
    courseName: string;
    credits: string;
    grade: string;
}

// Define the structure for the grade scale
interface GradeScale {
    [key: string]: number;
}

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
    // Load the PDF.js and jsPDF libraries from CDN
    useScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js');
    useScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    
    // Set PDF.js worker source once the library is loaded
    useEffect(() => {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
        }
    }, []);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileInfo, setFileInfo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [cgpa, setCgpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);
    const [totalGradePoints, setTotalGradePoints] = useState<number>(0);

    const [gradeScale, setGradeScale] = useState<GradeScale>({
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0,
    });

    useEffect(() => {
        recalculateCgpa();
    }, [courses, gradeScale]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file size (limit to 5MB to prevent timeouts)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError('File size too large. Please upload a file smaller than 5MB to ensure fast processing.');
                setUploadedFile(null);
                setFileInfo('');
                return;
            }
            
            setUploadedFile(file);
            setFileInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            setError(null); // Clear any previous errors
        }
    };

    const handleExtractCourses = async () => {
        if (!uploadedFile) {
            setError('Please select a file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCourses([]);

        try {
            let base64Images: string[] = [];
            let mimeType: string;

            if (uploadedFile.type.startsWith('image/')) {
                base64Images.push(await toBase64(uploadedFile));
                mimeType = uploadedFile.type;
            } else if (uploadedFile.type === 'application/pdf') {
                if (!window.pdfjsLib) {
                    throw new Error("PDF library is not loaded yet. Please wait a moment and try again.");
                }
                base64Images = await handlePdfToImages(uploadedFile);
                mimeType = 'image/png';
                
                // Limit PDF pages to prevent timeout
                if (base64Images.length > 5) {
                    base64Images = base64Images.slice(0, 5);
                    setError(`PDF has more than 5 pages. Processing first 5 pages only to prevent timeout.`);
                }
            } else {
                throw new Error('Unsupported file type. Please upload an image or a PDF.');
            }

            // Create AbortController for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const extractedData = await fetch('/api/cgpa-extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: base64Images, mimeType }),
                signal: controller.signal
            }).then(async r => {
                clearTimeout(timeoutId);
                if (!r.ok) {
                    const err = await r.json().catch(() => ({}));
                    if (r.status === 504) {
                        throw new Error('Request timed out. Please try with a smaller file or fewer pages.');
                    }
                    throw new Error(err.error || `Server error (${r.status})`);
                }
                return r.json();
            }).catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out. Please try with a smaller file or fewer pages.');
                }
                throw error;
            });

            const coursesWithIds = (extractedData.courses || []).map((course: any) => ({
                ...course,
                id: Math.random().toString(36).substring(2, 9)
            }));
            
            if (coursesWithIds.length === 0) {
                setError('No courses found in the uploaded file. Please ensure the image shows a clear grade sheet with course information.');
                return;
            }
            
            setCourses(coursesWithIds);

        } catch (err: any) {
            console.error('Extraction error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handlePdfToImages = (file: File): Promise<string[]> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const typedarray = new Uint8Array(reader.result as ArrayBuffer);
            try {
                const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                const pageImages: string[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const context = canvas.getContext('2d');
                    await page.render({ canvasContext: context!, viewport }).promise;
                    pageImages.push(canvas.toDataURL('image/png').split(',')[1]);
                }
                resolve(pageImages);
            } catch (error) {
                reject(new Error('Failed to render PDF. It might be corrupted.'));
            }
        };
        reader.readAsArrayBuffer(file);
    });
    
    const recalculateCgpa = () => {
        let credits = 0;
        let gradePoints = 0;
        courses.forEach(course => {
            const creditValue = parseFloat(course.credits);
            const grade = course.grade.trim().toUpperCase();
            const gradePoint = gradeScale[grade];
            if (!isNaN(creditValue) && creditValue > 0 && gradePoint !== undefined) {
                credits += creditValue;
                gradePoints += creditValue * gradePoint;
            }
        });
        setTotalCredits(credits);
        setTotalGradePoints(gradePoints);
        setCgpa(credits > 0 ? gradePoints / credits : 0);
    };
    
    const handleCourseChange = (id: string, field: keyof Course, value: string) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const addCourseRow = () => {
        setCourses([...courses, { id: Math.random().toString(36).substring(2, 9), courseCode: '', courseName: '', credits: '', grade: '' }]);
    };

    const removeCourseRow = (id: string) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const getGradeColor = (grade: string) => {
        const gradeUpper = grade.toUpperCase();
        if (['A+', 'A'].includes(gradeUpper)) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        if (['A-', 'B+'].includes(gradeUpper)) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        if (['B', 'B-'].includes(gradeUpper)) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        if (['C+', 'C', 'C-'].includes(gradeUpper)) return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
        if (['D+', 'D'].includes(gradeUpper)) return 'bg-red-500/20 text-red-300 border-red-500/40';
        if (gradeUpper === 'F') return 'bg-red-600/30 text-red-200 border-red-600/50';
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    };

    const getCgpaColor = (cgpa: number) => {
        if (cgpa >= 3.7) return 'from-emerald-400 via-green-400 to-cyan-400';
        if (cgpa >= 3.3) return 'from-blue-400 via-cyan-400 to-teal-400';
        if (cgpa >= 3.0) return 'from-yellow-400 via-orange-400 to-amber-400';
        if (cgpa >= 2.0) return 'from-orange-400 via-red-400 to-pink-400';
        return 'from-red-500 via-red-600 to-red-700';
    };

    // Export to PDF
const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CGPA Report", 14, 15);

  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${date}`, 14, 22);

  const tableData = courses.map((course) => {
    const credits = parseFloat(course.credits) || 0;
    const gradePoint = gradeScale[course.grade.toUpperCase()] || 0;
    const courseGradePoints = credits * gradePoint;
    
    return [
      course.courseCode,
      course.grade,
      courseGradePoints.toFixed(2),
      credits.toFixed(1),
    ];
  });

  autoTable(doc, {
    startY: 28,
    head: [["Course", "Grade", "Grade Point", "Credit"]],
    body: tableData,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [100, 149, 237] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Credits: ${totalCredits.toFixed(1)}`, 14, finalY);

  doc.setTextColor(0, 0, 0);
  doc.text(`CGPA: ${cgpa.toFixed(2)}`, 14, finalY + 8);

  doc.save("cgpa_report.pdf");
};

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 p-4 sm:p-6 md:p-8">
            {/* Enhanced decorative background */}
            <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute top-20 right-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-[35rem] w-[35rem] rounded-full bg-fuchsia-600/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="pointer-events-none absolute bottom-20 left-20 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            <div className="relative max-w-6xl mx-auto">
                <MotionDiv 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                >
                    <Card className="w-full border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10">
                        <CardHeader className="text-center relative pb-8">
                            <div className="absolute left-0 top-0 -mt-2">
                                <Button asChild variant="ghost" className="gap-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                                    <Link href="/hello/tools" className="flex items-center">
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20">
                                    <GraduationCap className="h-8 w-8 text-emerald-400" />
                                </div>
                            </div>
                            
                            <CardTitle className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                                AI-Powered CGPA Calculator
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-300 max-w-2xl mx-auto mt-4">
                                Upload your grade sheet and let advanced AI extract your courses automatically. Get detailed insights with grade point calculations.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-10">
                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-emerald-400" />
                                    <label htmlFor="grade-sheet-upload" className="font-semibold text-gray-200 text-lg">Upload Grade Sheet</label>
                                </div>
                                
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="grade-sheet-upload" className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-emerald-400/50 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-blue-500/10 transition-all duration-300">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <div className="p-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <FileUp className="w-8 h-8 text-emerald-400" />
                                            </div>
                                            <p className="mb-2 text-base text-gray-200">
                                                <span className="font-semibold text-white">Click to upload</span> or drag & drop
                                            </p>
                                            <p className="text-sm text-gray-400">PDF, PNG, JPG, JPEG (MAX. 10MB)</p>
                                        </div>
                                        <Input id="grade-sheet-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-emerald-400/5 via-blue-400/5 to-fuchsia-500/5 rounded-2xl" />
                                    </label>
                                </div>
                                {fileInfo && (
                                    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{fileInfo}</p>
                                    </MotionDiv>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="text-center space-y-4">
                                <Button 
                                    onClick={handleExtractCourses} 
                                    disabled={isLoading || !uploadedFile} 
                                    size="lg" 
                                    className="gap-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg shadow-emerald-500/25 px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Calculator className="h-5 w-5" />
                                    )}
                                    {isLoading ? 'Processing... This may take up to 30 seconds' : 'Extract Courses with AI'}
                                </Button>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <p className="text-sm text-gray-400">or</p>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </div>
                                
                                <Button 
                                    onClick={addCourseRow} 
                                    variant="outline" 
                                    size="lg"
                                    className="gap-3 border-white/20 bg-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/10 backdrop-blur-sm px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                                >
                                    <Plus className="h-5 w-5" />
                                    Add Courses Manually
                                </Button>
                                
                                {isLoading && (
                                    <MotionDiv 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-sm text-gray-400"
                                    >
                                        <p>⏳ AI is analyzing your grade sheet...</p>
                                        <p className="text-xs mt-1">Large PDFs may take longer to process</p>
                                    </MotionDiv>
                                )}
                            </div>

                            {/* Error and Results Section */}
                            <AnimatePresence>
                                {error && (
                                    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                                            <X className="h-4 w-4" />
                                            <AlertTitle>
                                                {error.includes('timeout') || error.includes('timed out') ? 'Timeout Error' : 'Error'}
                                            </AlertTitle>
                                            <AlertDescription className="space-y-2">
                                                <p>{error}</p>
                                                {(error.includes('timeout') || error.includes('timed out')) && (
                                                    <div className="text-sm text-red-200/80 space-y-1">
                                                        <p><strong>Tips to avoid timeouts:</strong></p>
                                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                                            <li>Use smaller image files (under 2MB)</li>
                                                            <li>Limit PDFs to 3-5 pages maximum</li>
                                                            <li>Ensure images are clear and not too large</li>
                                                            <li>Try again - sometimes the server is just busy</li>
                                                            <li>Or <strong>manually add courses</strong> using the "Add Course" button below</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </AlertDescription>
                                        </Alert>
                                    </MotionDiv>
                                )}
                                
                                {courses.length > 0 && (
                                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                        {/* Enhanced CGPA Display */}
                                        <Card className="border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                                            <CardContent className="p-8 text-center">
                                                <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                    Academic Performance Summary
                                                </h2>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-400 uppercase tracking-wide">CGPA</p>
                                                        <MotionP
                                                            key={cgpa}
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                                                            className={`text-4xl font-extrabold bg-gradient-to-r ${getCgpaColor(cgpa)} bg-clip-text text-transparent drop-shadow-sm`}
                                                        >
                                                            {cgpa.toFixed(3)}
                                                        </MotionP>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-400 uppercase tracking-wide">Total Credits</p>
                                                        <p className="text-3xl font-bold text-blue-300">{totalCredits}</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-400 uppercase tracking-wide">Grade Points</p>
                                                        <p className="text-3xl font-bold text-emerald-300">{totalGradePoints.toFixed(2)}</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-400 uppercase tracking-wide">Total Courses</p>
                                                        <p className="text-3xl font-bold text-purple-300">{courses.length}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Enhanced Editable Courses Table */}
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                    Course Details (Editable)
                                                </h3>
                                                <Button 
                                                    onClick={exportToPDF}
                                                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Export PDF
                                                </Button>
                                            </div>
                                            
                                            <Card className="border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="border-white/20 hover:bg-white/5">
                                                                <TableHead className="text-gray-200 font-semibold">Course Code</TableHead>
                                                                <TableHead className="text-gray-200 font-semibold">Course Name</TableHead>
                                                                <TableHead className="text-gray-200 font-semibold w-24">Credits</TableHead>
                                                                <TableHead className="text-gray-200 font-semibold w-32">Grade</TableHead>
                                                                <TableHead className="text-gray-200 font-semibold w-32">Grade Points</TableHead>
                                                                <TableHead className="text-gray-200 font-semibold text-right">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {courses.map((course) => {
                                                                const credits = parseFloat(course.credits) || 0;
                                                                const gradePoint = gradeScale[course.grade.toUpperCase()] || 0;
                                                                const courseGradePoints = credits * gradePoint;
                                                                
                                                                return (
                                                                    <MotionTr key={course.id} layout className="border-white/10 hover:bg-white/5 transition-colors">
                                                                        <TableCell>
                                                                            <Input 
                                                                                value={course.courseCode} 
                                                                                onChange={(e) => handleCourseChange(course.id, 'courseCode', e.target.value)} 
                                                                                placeholder="CS101" 
                                                                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input 
                                                                                value={course.courseName} 
                                                                                onChange={(e) => handleCourseChange(course.id, 'courseName', e.target.value)} 
                                                                                placeholder="Introduction to Computer Science" 
                                                                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Input 
                                                                                type="number" 
                                                                                value={course.credits} 
                                                                                onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)} 
                                                                                placeholder="3" 
                                                                                className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20"
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex items-center gap-2">
                                                                                <Input 
                                                                                    value={course.grade} 
                                                                                    onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)} 
                                                                                    placeholder="A+" 
                                                                                    className="border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 flex-1"
                                                                                />
                                                                                {course.grade && (
                                                                                    <Badge className={`${getGradeColor(course.grade)} border text-xs`}>
                                                                                        {gradePoint.toFixed(1)}
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="font-mono text-lg font-semibold text-emerald-300">
                                                                                {courseGradePoints.toFixed(2)}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                onClick={() => removeCourseRow(course.id)}
                                                                                className="hover:bg-red-500/20 hover:text-red-300"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </MotionTr>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </Card>
                                            
                                            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <Button 
                                                    onClick={addCourseRow} 
                                                    variant="outline" 
                                                    className="gap-2 border-white/20 bg-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/10 backdrop-blur-sm"
                                                >
                                                    <Plus className="h-4 w-4" /> Add Course
                                                </Button>
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-sm text-gray-400">
                                                        💡 Adjust any field and watch your CGPA update in real-time
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">A+/A: 4.0</Badge>
                                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">A-: 3.7</Badge>
                                                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">B+: 3.3</Badge>
                                                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40">B: 3.0</Badge>
                                                        <Badge className="bg-red-500/20 text-red-300 border-red-500/40">F: 0.0</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </MotionDiv>
            </div>
        </div>
    );
}