"use client";
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    resultsCount: number;
}

export function SearchBar({ searchQuery, onSearchChange, resultsCount }: SearchBarProps) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--site-text-muted)]" />
                <Input
                    type="text"
                    placeholder="Search courses by code, name, grade..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 border-[var(--site-border)] bg-[var(--site-surface-raised)] focus:border-[var(--ml-green)]/50 text-[var(--ml-ink)] placeholder:text-[var(--ml-sage)]"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-[var(--site-surface-hover)]"
                    >
                        <X className="h-3 w-3 text-[var(--site-text-muted)]" />
                    </Button>
                )}
            </div>
            {searchQuery && (
                <p className="text-xs text-[var(--site-text-muted)] mt-2">
                    Found {resultsCount} course{resultsCount !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
                </p>
            )}
        </div>
    );
}
