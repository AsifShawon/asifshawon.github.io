"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff, Check, X, ExternalLink, Sparkles, ChevronDown, ChevronUp, Zap } from "lucide-react";

interface ApiKeyInputProps {
    userApiKey: string;
    onSaveApiKey: (key: string) => void;
    onClearApiKey: () => void;
    showApiKeyInput: boolean;
    onToggleInput: (show: boolean) => void;
}

export function ApiKeyInput({
    userApiKey,
    onSaveApiKey,
    onClearApiKey,
    showApiKeyInput,
    onToggleInput,
}: ApiKeyInputProps) {
    const [inputValue, setInputValue] = useState(userApiKey);
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(!userApiKey);

    const handleSave = () => {
        if (inputValue.trim()) {
            onSaveApiKey(inputValue.trim());
            setIsEditing(false);
        }
    };

    const handleClear = () => {
        onClearApiKey();
        setInputValue('');
        setIsEditing(true);
    };

    const maskedKey = userApiKey ? `${userApiKey.slice(0, 10)}...${userApiKey.slice(-4)}` : '';

    return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/5 via-white/5 to-pink-500/5 overflow-hidden">
            {/* Collapsible Header */}
            <button
                onClick={() => onToggleInput(!showApiKeyInput)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${userApiKey ? 'bg-emerald-500/20' : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'}`}>
                        {userApiKey ? (
                            <Zap className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <Key className="w-4 h-4 text-purple-400" />
                        )}
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">Gemini API Key</span>
                            {userApiKey ? (
                                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                    Active
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                                    Optional
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            {userApiKey 
                                ? 'Using your API key for better extraction' 
                                : 'Add your key for faster & more accurate results'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {userApiKey && !showApiKeyInput && (
                        <span className="text-xs text-gray-500 font-mono hidden sm:block">{maskedKey}</span>
                    )}
                    {showApiKeyInput ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            {showApiKeyInput && (
                <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-4">
                    {userApiKey && !isEditing ? (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                <Key className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-gray-300 font-mono flex-1 truncate">
                                    {showKey ? userApiKey : maskedKey}
                                </span>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {showKey ? (
                                        <EyeOff className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="border-white/20 bg-white/5 hover:bg-white/10"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                                className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="pl-10 pr-10 h-11 bg-white/5 border-white/20 focus:border-purple-500/50 font-mono text-sm"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                                    >
                                        {showKey ? (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    disabled={!inputValue.trim()}
                                    className="h-11 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 mr-1.5" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Info section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <Sparkles className="w-3 h-3" />
                            Get free API key from Google AI Studio
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                            <span className="text-amber-400">🔒</span>
                            Stored locally, never sent to our servers
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
