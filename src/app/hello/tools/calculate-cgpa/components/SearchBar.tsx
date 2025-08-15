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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search courses by code, name, grade..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 border-white/20 bg-white/10 focus:border-emerald-400/50 focus:bg-white/20 text-white placeholder-gray-400"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-white/10"
                    >
                        <X className="h-3 w-3 text-gray-400" />
                    </Button>
                )}
            </div>
            {searchQuery && (
                <p className="text-xs text-gray-400 mt-2">
                    Found {resultsCount} course{resultsCount !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
                </p>
            )}
        </div>
    );
}
