"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const MotionDiv = motion.div;

interface FileUploadProps {
    uploadedFiles: File[];
    fileInfo: string;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
}

export function FileUpload({ uploadedFiles, fileInfo, onFileChange, onRemoveFile }: FileUploadProps) {
    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--ml-green)]" />
                <label htmlFor="grade-sheet-upload" className="font-semibold text-[var(--site-text)] text-base sm:text-lg">
                    Upload Grade Sheets (Multiple Files)
                </label>
            </div>

            <div className="flex items-center justify-center w-full">
                <label htmlFor="grade-sheet-upload" className="group relative flex flex-col items-center justify-center w-full h-32 sm:h-40 md:h-48 border-2 border-dashed rounded-xl sm:rounded-2xl cursor-pointer border-[var(--site-border)] bg-[var(--site-surface-raised)] hover:border-[var(--ml-green)]/50 hover:bg-[var(--ml-green)]/5 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-4 sm:pb-6 text-center px-4">
                        <div className="p-2 sm:p-4 rounded-full bg-gradient-to-br from-[var(--ml-green)]/15 to-[var(--ml-indigo)]/15 mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FileUp className="w-5 h-5 sm:w-8 sm:h-8 text-[var(--ml-green)]" />
                        </div>
                        <p className="mb-1 sm:mb-2 text-sm sm:text-base text-[var(--site-text)]">
                            <span className="font-semibold text-[var(--ml-ink)]">Click to upload multiple files</span>
                        </p>
                        <p className="text-xs sm:text-sm text-[var(--site-text-muted)]">
                            PDF, PNG, JPG, JPEG (MAX. 5MB each, 10 files max)
                        </p>
                    </div>
                    <Input
                        id="grade-sheet-upload"
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                        accept="image/*,application/pdf"
                        multiple
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--ml-green)]/5 rounded-xl sm:rounded-2xl" />
                </label>
            </div>

            {fileInfo && (
                <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-xs sm:text-sm text-[var(--ml-green)] bg-[var(--ml-green)]/10 border border-[var(--ml-green)]/25 rounded-lg p-2 sm:p-3 break-all">
                        {fileInfo}
                    </p>
                </MotionDiv>
            )}

            {/* Selected Files List */}
            {uploadedFiles && uploadedFiles.length > 1 && (
                <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <p className="text-sm text-[var(--site-text)] font-medium">Selected Files:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-[var(--site-surface-soft)] border border-[var(--site-border)] rounded-lg">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[var(--ml-ink)] truncate">{file.name}</p>
                                    <p className="text-xs text-[var(--site-text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveFile(index)}
                                    className="text-[var(--site-danger)] hover:opacity-80 hover:bg-[var(--site-danger)]/10 p-1 h-auto"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </MotionDiv>
            )}
        </div>
    );
}
