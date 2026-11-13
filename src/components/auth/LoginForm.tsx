"use client";

import { useState } from "react";
import { login } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <p className="overline">Guest portal</p>
      <h1 className="mt-4 font-heading text-4xl font-light leading-tight text-charcoal md:text-5xl">
        Welcome back
      </h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-warmgrey">
        Sign in to view your reservations, complete payments and manage your
        stay.
      </p>

      {error && (
        <div className="mt-7 border border-danger/30 bg-danger/10 px-4 py-3 font-body text-sm text-danger">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="mt-7">
        <div className="input-group">
          <label className="input-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            name="email"
            className="input-field"
            required
            autoComplete="email"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            className="input-field"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-gold btn-block mt-4"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 border-t border-line pt-6 font-body text-sm text-warmgrey">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="link-underline text-charcoal hover:text-gold"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
