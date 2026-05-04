"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/actions";
import Link from "next/link";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await submitFeedback(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="bg-primary p-4 md:p-8 flex justify-between items-center border-b border-white/10">
        <Link href="/" className="text-white font-headline text-xl md:text-2xl tracking-widest uppercase">
          DJACE
        </Link>
        <Link href="/" className="text-white/70 text-[10px] md:text-sm uppercase tracking-widest hover:text-accent-gold transition-colors font-body">
          Back to Home
        </Link>
      </nav>

      <div className="container py-8 md:py-16 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl text-text-main font-headline tracking-widest uppercase mb-4">Your Feedback Matters</h1>
          <p className="text-text-muted text-lg">
            We strive to provide the ultimate luxury experience. Let us know how we did or how we can improve.
          </p>
        </div>

        {success ? (
          <div className="card p-12 text-center">
            <h2 className="text-3xl text-accent-gold font-headline mb-4">Thank You!</h2>
            <p className="text-text-muted mb-8">
              Your feedback has been received and is greatly appreciated.
            </p>
            <Link href="/" className="btn btn-outline">Return to Home</Link>
          </div>
        ) : (
          <div className="card p-8 md:p-12">
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 mb-6 text-sm text-center rounded border border-red-900/50">
                {error}
              </div>
            )}
            
            <form action={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Name</label>
                <input type="text" name="name" className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" name="email" className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Rating (1-5)</label>
                <input type="number" name="rating" className="input-field" min="1" max="5" placeholder="5" />
              </div>
              <div className="input-group">
                <label className="input-label">Your Message</label>
                <textarea name="message" className="input-field bg-background/50" rows={5} required></textarea>
              </div>
              
              <button type="submit" className="btn btn-gold w-full mt-4" disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
