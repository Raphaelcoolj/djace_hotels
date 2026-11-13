"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/actions";
import Link from "next/link";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (rating !== null) {
      formData.set("rating", String(rating));
    }

    try {
      const res = await submitFeedback(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card p-10 text-center md:p-14">
        <p className="overline">Thank you</p>
        <h2 className="mt-4 font-heading text-4xl font-light text-charcoal">
          Message received
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-warmgrey">
          Your feedback has been received and is greatly appreciated. It helps
          us keep every stay exceptional.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
          <Link href="/rooms" className="btn btn-gold">
            Browse rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 md:p-10">
      {error && (
        <div className="mb-6 border border-danger/30 bg-danger/10 px-4 py-3 font-body text-sm text-danger">
          {error}
        </div>
      )}

      <form action={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <div className="input-group">
            <label className="input-label" htmlFor="feedback-name">
              Name
            </label>
            <input
              id="feedback-name"
              type="text"
              name="name"
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="feedback-email">
              Email
            </label>
            <input
              id="feedback-email"
              type="email"
              name="email"
              className="input-field"
              required
            />
          </div>
        </div>

        <fieldset className="mb-6">
          <legend className="input-label">Rating (optional)</legend>
          <div className="mt-1 flex items-center gap-2" role="radiogroup" aria-label="Rating">
            {RATING_OPTIONS.map((value) => {
              const active = (rating ?? 0) >= value;
              const selected = rating === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(selected ? null : value)}
                  aria-pressed={selected}
                  className={`flex h-10 w-10 items-center justify-center border text-lg transition-colors duration-300 cursor-pointer ${
                    active
                      ? "border-gold bg-gold/15 text-gold-deep"
                      : "border-line text-line hover:border-gold hover:text-gold"
                  }`}
                  title={`${value} star${value > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              );
            })}
            {rating !== null && (
              <span className="ml-2 font-body text-xs text-warmgrey">
                {rating} of 5
              </span>
            )}
          </div>
        </fieldset>

        <div className="input-group">
          <label className="input-label" htmlFor="feedback-message">
            Your message
          </label>
          <textarea
            id="feedback-message"
            name="message"
            className="input-field"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-gold btn-block mt-4"
          disabled={loading}
        >
          {loading ? "Submitting…" : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
