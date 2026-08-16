// Define the structure for a course
export interface Course {
    id: string;
    courseCode: string;
    courseName: string;
    credits: string;
    grade: string;
}

// Define the structure for the grade scale
export interface GradeScale {
    [key: string]: number;
}
