"use client";

import { useActionState } from "react";
import { submitFeedback, type FormState } from "@/app/actions/submit";
import { Field, Label, Input, Textarea, Select, SubmitButton, ErrorBanner, SuccessBanner } from "./form-field";

const CATEGORIES = ["General feedback", "Suggestion", "Complaint", "Accessibility issue", "Broken link / technical issue", "Other"];

interface Props { locale?: string }

export function FeedbackForm({ locale = "en" }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitFeedback, null);

  if (state?.success) {
    return <SuccessBanner message="Thank you! We'll acknowledge within 3 working days." />;
  }

  return (
    <form action={action} noValidate>
      <input type="hidden" name="locale" value={locale} />
      {state && !state.success && <ErrorBanner message={state.error} />}

      <Field>
        <Label htmlFor="category" required>Category</Label>
        <Select id="category" required defaultValue="">
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </Field>

      <Field>
        <Label htmlFor="message" required>Your feedback</Label>
        <Textarea id="message" required rows={5} placeholder="Tell us what you think, what's broken, or how we can improve." />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <Field className="mb-0">
          <Label htmlFor="name">Name (optional)</Label>
          <Input id="name" type="text" placeholder="Anonymous is fine" />
        </Field>
        <Field className="mb-0">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" placeholder="For a reply" />
        </Field>
      </div>

      <Field>
        <Label htmlFor="rating">Overall rating (optional)</Label>
        <Select id="rating" defaultValue="">
          <option value="">Not rated</option>
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Good</option>
          <option value="3">3 — Average</option>
          <option value="2">2 — Poor</option>
          <option value="1">1 — Very poor</option>
        </Select>
      </Field>

      <SubmitButton label="Submit feedback" pending={pending} />
    </form>
  );
}
