'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  /**
   * Receives the wiring every control needs: the id the label points at, the
   * invalid flag, and the `aria-describedby` linking the error message.
   */
  children: (props: {
    id: string;
    name: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    className: string;
  }) => React.ReactNode;
}

/**
 * Label + control + error message, wired together once so no field can ship
 * with a missing `for`/`id` pair or an unannounced error.
 */
export default function FormField({
  label,
  name,
  error,
  optional = false,
  hint,
  children,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="field-optional">Optional</span>}
      </label>

      {children({
        id,
        name,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: 'field-control',
      })}

      {hint && !error && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error">
          <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
