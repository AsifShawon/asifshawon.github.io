"use client";
import { useEffect, useState, useCallback } from 'react';
import { Course, GradeScale } from '../types';

export function useCgpaCalculation() {
    // File upload state
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileInfo, setFileInfo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Course management state
    const [courses, setCourses] = useState<Course[]>([]);
    const [cgpa, setCgpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);
    const [totalGradePoints, setTotalGradePoints] = useState<number>(0);
    
    // Modal state for adding courses
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState<boolean>(false);
    const [newCourse, setNewCourse] = useState<{
        courseCode: string;
        courseName: string;
        credits: string;
        grade: string;
    }>({
        courseCode: '',
        courseName: '',
        credits: '',
        grade: ''
    });
    
    // Search functionality
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Grade scale (editable)
    const [gradeScale, setGradeScale] = useState<GradeScale>({
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0,
    });

    // Function to update grade scale
    const updateGradeScale = (grade: string, point: number) => {
        setGradeScale(prev => ({
            ...prev,
            [grade.toUpperCase()]: point
        }));
    };

    // Helper function to check if a course is counted in CGPA
    const isCourseCountedInCgpa = (course: Course): boolean => {
        const courseCode = course.courseCode.trim().toUpperCase();
        if (!courseCode) return false;
        
        // Find all courses with the same course code
        const sameCourses = courses.filter(c => c.courseCode.trim().toUpperCase() === courseCode);
        
        if (sameCourses.length === 1) return true; // No retakes, so it's counted
        
        // Find the best grade among same courses
        let bestGradePoint = -1;
        let bestCourseId = '';
        
        sameCourses.forEach(c => {
            const creditValue = parseFloat(c.credits);
            const grade = c.grade.trim().toUpperCase();
            const gradePoint = gradeScale[grade];
            
            if (!isNaN(creditValue) && creditValue > 0 && gradePoint !== undefined) {
                if (gradePoint > bestGradePoint) {
                    bestGradePoint = gradePoint;
                    bestCourseId = c.id;
                }
            }
        });
        
        return course.id === bestCourseId;
    };

    // CGPA calculation
    const recalculateCgpa = useCallback(() => {
        let credits = 0;
        let gradePoints = 0;
        
        // Group courses by course code to handle retakes
        const courseGroups: { [courseCode: string]: Course[] } = {};
        
        courses.forEach(course => {
            const courseCode = course.courseCode.trim().toUpperCase();
            if (!courseCode) return; // Skip courses without course code
            
            if (!courseGroups[courseCode]) {
                courseGroups[courseCode] = [];
            }
            courseGroups[courseCode].push(course);
        });
        
        // For each course group, find the best grade and use it for CGPA calculation
        Object.values(courseGroups).forEach(courseGroup => {
            let bestCourse: Course | null = null;
            let bestGradePoint = -1;
            
            courseGroup.forEach(course => {
                const creditValue = parseFloat(course.credits);
                const grade = course.grade.trim().toUpperCase();
                const gradePoint = gradeScale[grade];
                
                if (!isNaN(creditValue) && creditValue > 0 && gradePoint !== undefined) {
                    if (gradePoint > bestGradePoint) {
                        bestGradePoint = gradePoint;
                        bestCourse = course;
                    }
                }
            });
            
            // Add the best course to CGPA calculation
            if (bestCourse !== null) {
                const bestCourseTyped = bestCourse as Course;
                const creditValue = parseFloat(bestCourseTyped.credits);
                const gradePoint = gradeScale[bestCourseTyped.grade.trim().toUpperCase()];
                credits += creditValue;
                gradePoints += creditValue * gradePoint;
            }
        });
        
        setTotalCredits(credits);
        setTotalGradePoints(gradePoints);
        setCgpa(credits > 0 ? gradePoints / credits : 0);
    }, [courses, gradeScale]);

    useEffect(() => {
        recalculateCgpa();
    }, [recalculateCgpa]);

    // File handling functions
    const removeFile = (indexToRemove: number) => {
        const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
        setUploadedFiles(newFiles);
        
        if (newFiles.length === 0) {
            setFileInfo('');
        } else if (newFiles.length === 1) {
            setFileInfo(`Selected: ${newFiles[0].name} (${(newFiles[0].size / 1024 / 1024).toFixed(2)} MB)`);
        } else {
            const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
            setFileInfo(`Selected: ${newFiles.length} files (${(totalSize / 1024 / 1024).toFixed(2)} MB total)`);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            // Check file size for each file (limit to 5MB to prevent timeouts)
            const maxSize = 5 * 1024 * 1024; // 5MB
            const oversizedFiles = files.filter(file => file.size > maxSize);
            
            if (oversizedFiles.length > 0) {
                setError(`Some files are too large. Please upload files smaller than 5MB each: ${oversizedFiles.map(f => f.name).join(', ')}`);
                setUploadedFiles([]);
                setFileInfo('');
                return;
            }

            // Limit to 10 files maximum
            if (files.length > 10) {
                setError('Too many files selected. Please select maximum 10 files to ensure fast processing.');
                setUploadedFiles([]);
                setFileInfo('');
                return;
            }
            
            setUploadedFiles(files);
            
            if (files.length === 1) {
                setFileInfo(`Selected: ${files[0].name} (${(files[0].size / 1024 / 1024).toFixed(2)} MB)`);
            } else {
                const totalSize = files.reduce((sum, file) => sum + file.size, 0);
                setFileInfo(`Selected: ${files.length} files (${(totalSize / 1024 / 1024).toFixed(2)} MB total)`);
            }
            setError(null); // Clear any previous errors
        }
    };

    // Utility functions
    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]); // Remove data:image/... prefix
            };
            reader.onerror = error => reject(error);
        });
    };

    const handlePdfToImages = async (file: File): Promise<string[]> => {
        const arrayBuffer = await file.arrayBuffer();
        const typedarray = new Uint8Array(arrayBuffer);
        
        try {
            const pdf = await (window as any).pdfjsLib.getDocument(typedarray).promise;
            const images: string[] = [];
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                const imageDataUrl = canvas.toDataURL('image/png');
                images.push(imageDataUrl.split(',')[1]); // Remove data:image/... prefix
            }
            
            return images;
        } catch (error) {
            console.error('Error converting PDF to images:', error);
            throw new Error('Failed to process PDF. Please try with an image file instead.');
        }
    };

    // Course extraction
    const handleExtractCourses = async () => {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            setError('Please select at least one file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCourses([]);

        try {
            let base64Images: string[] = [];
            let mimeType: string = 'image/png'; // Default mime type

            // Process all files
            for (const file of uploadedFiles) {
                if (file.type.startsWith('image/')) {
                    base64Images.push(await toBase64(file));
                    mimeType = file.type; // Use the actual image mime type
                } else if (file.type === 'application/pdf') {
                    if (!(window as any).pdfjsLib) {
                        throw new Error("PDF library is not loaded yet. Please wait a moment and try again.");
                    }
                    const pdfImages = await handlePdfToImages(file);
                    base64Images.push(...pdfImages);
                    mimeType = 'image/png'; // PDFs are converted to PNG
                } else {
                    throw new Error(`Unsupported file type: ${file.name}. Please upload images or PDFs only.`);
                }
            }
                
            // Limit total images to prevent timeout
            if (base64Images.length > 15) {
                base64Images = base64Images.slice(0, 15);
                setError(`Processing first 15 images only to prevent timeout. Total images found: ${base64Images.length}`);
            }

            if (base64Images.length === 0) {
                throw new Error('No valid images found in the uploaded files.');
            }

            // Create AbortController for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for multiple images

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
                        throw new Error('Request timed out. Please try with fewer files or smaller files.');
                    }
                    throw new Error(err.error || `Server error (${r.status})`);
                }
                return r.json();
            }).catch(error => {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out. Please try with fewer files or smaller files.');
                }
                throw error;
            });

            const coursesWithIds = (extractedData.courses || []).map((course: any) => ({
                ...course,
                id: Math.random().toString(36).substring(2, 9)
            }));

            setCourses(coursesWithIds);
            
            if (coursesWithIds.length === 0) {
                setError('No courses found in the uploaded images. Please try with a clearer image of your grade sheet or add courses manually.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Course management functions
    const addCourseRow = () => {
        setIsAddCourseModalOpen(true);
    };

    const removeCourseRow = (courseId: string) => {
        setCourses(courses.filter(course => course.id !== courseId));
    };

    const handleCourseChange = (courseId: string, field: keyof Course, value: string) => {
        setCourses(courses.map(course => 
            course.id === courseId ? { ...course, [field]: value } : course
        ));
    };

    // Modal functions
    const handleModalInputChange = (field: string, value: string) => {
        setNewCourse(prev => ({ ...prev, [field]: value }));
    };

    const handleAddCourse = () => {
        if (!newCourse.courseCode || !newCourse.credits || !newCourse.grade) return;
        
        const courseWithId: Course = {
            ...newCourse,
            id: Math.random().toString(36).substring(2, 9)
        };
        
        setCourses([...courses, courseWithId]);
        closeModal();
    };

    const closeModal = () => {
        setIsAddCourseModalOpen(false);
        setNewCourse({
            courseCode: '',
            courseName: '',
            credits: '',
            grade: ''
        });
    };

    // Export function
    const exportToPDF = () => {
        // Import jsPDF and autoTable dynamically
        const jsPDF = (window as any).jsPDF;
        const autoTable = (window as any).autoTable;
        
        if (!jsPDF || !autoTable) {
            setError('PDF export library not loaded. Please refresh the page and try again.');
            return;
        }

        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("CGPA Report", 14, 22);
        
        // Summary information
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
        doc.text(`CGPA: ${cgpa.toFixed(3)}`, 14, 45);
        doc.text(`Total Credits: ${totalCredits.toFixed(1)}`, 14, 55);
        doc.text(`Total Grade Points: ${totalGradePoints.toFixed(2)}`, 14, 65);
        
        // Course table
        const tableData = courses.map(course => {
            const credits = parseFloat(course.credits) || 0;
            const gradePoint = gradeScale[course.grade.toUpperCase()] || 0;
            const courseGradePoints = credits * gradePoint;
            const isCountedInCgpa = isCourseCountedInCgpa(course);
            
            return [
                course.courseCode,
                course.courseName,
                course.credits,
                course.grade,
                gradePoint.toFixed(1),
                courseGradePoints.toFixed(2),
                isCountedInCgpa ? 'Yes' : 'No'
            ];
        });

        autoTable(doc, {
            head: [['Course Code', 'Course Name', 'Credits', 'Grade', 'Grade Point', 'Course GP', 'Counted']],
            body: tableData,
            startY: 75,
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [70, 130, 180],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        doc.save("cgpa_report.pdf");
    };

    // Style helper functions
    const getCgpaColor = (cgpa: number): string => {
        if (cgpa >= 3.7) return "from-emerald-500 to-green-400";
        if (cgpa >= 3.3) return "from-blue-500 to-cyan-400";
        if (cgpa >= 3.0) return "from-yellow-500 to-orange-400";
        if (cgpa >= 2.7) return "from-orange-500 to-red-400";
        return "from-red-500 to-pink-400";
    };

    const getGradeColor = (grade: string): string => {
        const upperGrade = grade.toUpperCase();
        if (upperGrade === 'A+' || upperGrade === 'A') return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
        if (upperGrade === 'A-') return "bg-blue-500/20 text-blue-300 border-blue-500/40";
        if (upperGrade === 'B+') return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
        if (upperGrade === 'B') return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
        if (upperGrade === 'B-') return "bg-orange-500/20 text-orange-300 border-orange-500/40";
        if (upperGrade === 'C+' || upperGrade === 'C' || upperGrade === 'C-') return "bg-amber-500/20 text-amber-300 border-amber-500/40";
        if (upperGrade === 'D+' || upperGrade === 'D') return "bg-red-500/20 text-red-300 border-red-500/40";
        if (upperGrade === 'F') return "bg-red-600/20 text-red-400 border-red-600/40";
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    };

    // Filtered courses for search
    const filteredCourses = courses.filter(course =>
        course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
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
        updateGradeScale
    };
}
