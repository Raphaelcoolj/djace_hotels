"use client";

import { useState } from "react";
import { register } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await register(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }

  return (
    <>
      <p className="overline">Join us</p>
      <h1 className="mt-4 font-heading text-4xl font-light leading-tight text-charcoal md:text-5xl">
        Create your account
      </h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-warmgrey">
        Reserve rooms, track booking status and complete payments — all in one
        place.
      </p>

      {error && (
        <div className="mt-7 border border-danger/30 bg-danger/10 px-4 py-3 font-body text-sm text-danger">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="mt-7">
        <div className="input-group">
          <label className="input-label" htmlFor="register-name">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            name="name"
            className="input-field"
            required
            autoComplete="name"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            name="email"
            className="input-field"
            required
            autoComplete="email"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            name="password"
            className="input-field"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <p className="mt-1.5 font-body text-[11px] text-warmgrey">
            At least 6 characters.
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-gold btn-block mt-4"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 border-t border-line pt-6 font-body text-sm text-warmgrey">
        Already have an account?{" "}
        <Link
          href="/login"
          className="link-underline text-charcoal hover:text-gold"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
