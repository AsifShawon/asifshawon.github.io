'use client';

import React, { useRef, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FormField from './FormField';

const INQUIRY_TYPES = [
  'Ecommerce',
  'Development',
  'AI Integration',
  'Freelance',
  'Collaboration',
  'Other',
] as const;

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };

type Status = 'idle' | 'sending' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  message: string;
  /** Honeypot — visually hidden and hidden from assistive tech. */
  company: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  subject: '',
  inquiryType: '',
  message: '',
  company: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Client-side mirror of the server rules — the server still re-checks. */
function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!values.name.trim()) errors.name = 'Please tell me your name.';
  else if (values.name.trim().length > LIMITS.name)
    errors.name = `Please keep this under ${LIMITS.name} characters.`;

  if (!values.email.trim()) errors.email = 'Please add an email address so I can reply.';
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "That email address doesn't look right.";

  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  else if (values.subject.trim().length > LIMITS.subject)
    errors.subject = `Please keep this under ${LIMITS.subject} characters.`;

  if (!values.message.trim()) errors.message = 'Please write a message.';
  else if (values.message.trim().length > LIMITS.message)
    errors.message = `Please keep this under ${LIMITS.message} characters.`;

  return errors;
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Remounting the widget issues a fresh token after each attempt.
  const [turnstileKey, setTurnstileKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear a field's error as soon as the visitor starts fixing it.
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

  const focusFirstError = (fieldErrors: Partial<Record<keyof FormState, string>>) => {
    const first = (Object.keys(fieldErrors) as (keyof FormState)[]).find(
      (key) => fieldErrors[key]
    );
    if (!first) return;
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"]`)
      ?.focus({ preventScroll: false });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, token }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus('error');
        setFormError(data?.error ?? 'Something went wrong. Please try again.');
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors);
          focusFirstError(data.fieldErrors);
        }
        // A used/failed token can't be replayed.
        setToken(null);
        setTurnstileKey((k) => k + 1);
        return;
      }

      // Only now is it safe to discard what the visitor typed.
      setStatus('success');
      setValues(EMPTY);
      setErrors({});
      setToken(null);
      setTurnstileKey((k) => k + 1);
    } catch {
      setStatus('error');
      setFormError(
        'Could not reach the server. Check your connection and try again.'
      );
      setToken(null);
      setTurnstileKey((k) => k + 1);
    }
  }

  const sending = status === 'sending';

  if (status === 'success') {
    return (
      <div
        className="rounded-[1rem] border border-[rgba(154,210,210,0.28)] bg-[rgba(118,171,174,0.08)] p-7 sm:p-9"
        role="status"
      >
        <CheckCircle2
          size={30}
          strokeWidth={1.7}
          className="text-[#A8DDDA]"
          aria-hidden="true"
        />
        <h2 className="type-h3 mt-4 text-[#EEEEEE]">
          Thanks! Your message has been sent successfully.
        </h2>
        <p className="type-small measure-narrow mt-2 text-[#93B1A6]">
          It lands straight in my inbox and I usually reply within a day or two.
        </p>
        <Button
          type="button"
          variant="surface"
          size="ctaSm"
          className="mt-6"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      // p-4 on mobile leaves the 300px-wide Turnstile widget enough room to
      // render at its native size from 375px up.
      className="rounded-[1rem] border border-[rgba(147,177,166,0.16)] bg-[rgba(118,171,174,0.035)] p-4 sm:p-7"
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Name" name="name" error={errors.name}>
            {(field) => (
              <input
                {...field}
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name}
                placeholder="Jane Doe"
                value={values.name}
                onChange={update('name')}
                disabled={sending}
                required
              />
            )}
          </FormField>

          <FormField label="Email" name="email" error={errors.email}>
            {(field) => (
              <input
                {...field}
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={LIMITS.email}
                placeholder="jane@company.com"
                value={values.email}
                onChange={update('email')}
                disabled={sending}
                required
              />
            )}
          </FormField>
        </div>

        <FormField label="Subject" name="subject" error={errors.subject}>
          {(field) => (
            <input
              {...field}
              type="text"
              maxLength={LIMITS.subject}
              placeholder="Ecommerce store build, AI feature, collaboration…"
              value={values.subject}
              onChange={update('subject')}
              disabled={sending}
              required
            />
          )}
        </FormField>

        <FormField label="What is this about?" name="inquiryType" optional>
          {(field) => (
            <select
              {...field}
              value={values.inquiryType}
              onChange={update('inquiryType')}
              disabled={sending}
            >
              <option value="">Choose a topic</option>
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label="Message"
          name="message"
          error={errors.message}
          hint={`${values.message.length} / ${LIMITS.message}`}
        >
          {(field) => (
            <textarea
              {...field}
              rows={6}
              maxLength={LIMITS.message}
              placeholder="A little context on what you're building and what you need."
              value={values.message}
              onChange={update('message')}
              disabled={sending}
              required
            />
          )}
        </FormField>

        {/* Honeypot. Hidden off-screen rather than display:none so bots that
            skip invisible inputs still take the bait. */}
        <div className="field-honeypot" aria-hidden="true">
          <label htmlFor="contact-company">Company (leave this empty)</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={update('company')}
          />
        </div>

        {turnstileSiteKey && (
          <div className="turnstile-holder">
            <Turnstile
              key={turnstileKey}
              siteKey={turnstileSiteKey}
              onSuccess={setToken}
              onExpire={() => setToken(null)}
              options={{ theme: 'dark' }}
            />
          </div>
        )}

        {formError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-[0.7rem] border border-[rgba(224,138,138,0.3)] bg-[rgba(127,29,29,0.16)] px-3.5 py-3 text-[0.875rem] text-[#F0A9A9]"
          >
            <AlertCircle size={16} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="brand" size="cta" disabled={sending}>
            {sending ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} strokeWidth={1.9} aria-hidden="true" />
            )}
            {sending ? 'Sending…' : 'Send Message'}
          </Button>

          {/* Announces progress without stealing focus. */}
          <span className="sr-only" role="status" aria-live="polite">
            {sending ? 'Sending your message' : ''}
          </span>
        </div>
      </div>
    </form>
  );
}
