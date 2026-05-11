"use client";

import { useState } from "react";
import { register } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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
    <main className="min-h-screen bg-background flex flex-col">
      <nav className="p-4 md:p-8 bg-primary border-b border-white/10">
        <Link href="/" className="text-white font-headline text-xl md:text-2xl tracking-widest uppercase">
          LUXURY
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 md:p-4">
        <div className="card w-full max-w-md p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl text-text-main font-headline tracking-widest uppercase mb-2">Create Account</h2>
            <p className="text-text-muted text-sm">Join Luxury Hotel & Lounge</p>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 mb-6 text-sm text-center rounded border border-red-900/50">
              {error}
            </div>
          )}

          <form action={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="name" className="input-field" required />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input-field" required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" className="input-field" required minLength={6} />
            </div>
            
            <button type="submit" className="btn btn-gold w-full mt-4" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Already have an account? <Link href="/login" className="text-accent-gold hover:text-white transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
