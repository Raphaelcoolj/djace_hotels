"use client";

import { useState } from "react";
import { login } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    <main className="min-h-screen bg-background flex flex-col">
      <nav className="p-4 md:p-8 bg-primary border-b border-white/10">
        <Link href="/" className="text-white font-headline text-xl md:text-2xl tracking-widest uppercase">
          DJACE
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="card w-full max-w-md p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl text-text-main font-headline tracking-widest uppercase mb-2">Welcome Back</h1>
            <p className="text-text-muted text-sm">Sign in to manage your reservations</p>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 mb-6 text-sm text-center rounded border border-red-900/50">
              {error}
            </div>
          )}

          <form action={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input-field" required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" className="input-field" required />
            </div>
            
            <button type="submit" className="btn btn-gold w-full mt-4" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Don't have an account? <Link href="/register" className="text-accent-gold hover:text-white transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
