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
        <div className="rounded-xl border border-[var(--site-border)] bg-[var(--ml-indigo)]/5 overflow-hidden">
            {/* Collapsible Header */}
            <button
                onClick={() => onToggleInput(!showApiKeyInput)}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--site-surface-soft)] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${userApiKey ? 'bg-[var(--ml-green)]/15' : 'bg-[var(--ml-indigo)]/15'}`}>
                        {userApiKey ? (
                            <Zap className="w-4 h-4 text-[var(--ml-green)]" />
                        ) : (
                            <Key className="w-4 h-4 text-[var(--ml-indigo)]" />
                        )}
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--ml-ink)]">Gemini API Key</span>
                            {userApiKey ? (
                                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-[var(--ml-green)]/15 text-[var(--ml-green)] rounded-full border border-[var(--ml-green)]/30">
                                    Active
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-[var(--site-highlight)]/40 text-[var(--site-text-on-surface)] rounded-full border border-[var(--site-border-strong)]">
                                    Optional
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[var(--site-text-muted)]">
                            {userApiKey
                                ? 'Using your API key for better extraction'
                                : 'Add your key for faster & more accurate results'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {userApiKey && !showApiKeyInput && (
                        <span className="text-xs text-[var(--site-text-muted)] font-mono hidden sm:block">{maskedKey}</span>
                    )}
                    {showApiKeyInput ? (
                        <ChevronUp className="w-4 h-4 text-[var(--site-text-muted)]" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--site-text-muted)]" />
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            {showApiKeyInput && (
                <div className="px-4 pb-4 pt-2 border-t border-[var(--site-border)] space-y-4">
                    {userApiKey && !isEditing ? (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--site-surface-soft)] border border-[var(--site-border)]">
                                <Key className="w-4 h-4 text-[var(--ml-green)]" />
                                <span className="text-sm text-[var(--site-text)] font-mono flex-1 truncate">
                                    {showKey ? userApiKey : maskedKey}
                                </span>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-1.5 hover:bg-[var(--site-surface-hover)] rounded-lg transition-colors"
                                >
                                    {showKey ? (
                                        <EyeOff className="w-4 h-4 text-[var(--site-text-muted)]" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-[var(--site-text-muted)]" />
                                    )}
                                </button>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="border-[var(--site-border)] bg-[var(--site-surface-soft)] hover:bg-[var(--site-surface-hover)] text-[var(--ml-ink)]"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                                className="border-[var(--site-danger)]/30 bg-[var(--site-danger)]/10 hover:bg-[var(--site-danger)]/20 text-[var(--site-danger)]"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--site-text-muted)]" />
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="AIzaSy..."
                                        className="pl-10 pr-10 h-11 bg-[var(--site-surface-soft)] border-[var(--site-border)] focus:border-[var(--ml-indigo)]/50 font-mono text-sm text-[var(--ml-ink)]"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--site-surface-hover)] rounded transition-colors"
                                    >
                                        {showKey ? (
                                            <EyeOff className="w-4 h-4 text-[var(--site-text-muted)]" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-[var(--site-text-muted)]" />
                                        )}
                                    </button>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    disabled={!inputValue.trim()}
                                    className="h-11 px-5 bg-[var(--ml-indigo)] hover:bg-[var(--ml-indigo)]/85 disabled:opacity-50 text-[var(--site-on-primary)]"
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
                            className="inline-flex items-center gap-1.5 text-xs text-[var(--ml-indigo)] hover:opacity-80 transition-colors"
                        >
                            <Sparkles className="w-3 h-3" />
                            Get free API key from Google AI Studio
                            <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-[11px] text-[var(--site-text-muted)] flex items-center gap-1">
                            <span>🔒</span>
                            Stored locally, never sent to our servers
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
