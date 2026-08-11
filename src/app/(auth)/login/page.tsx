// Destination: src/app/(auth)/login/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 flex items-center gap-2 font-mono text-lg font-bold">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        DOSSIER
      </div>
      <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
      <p className="mb-8 text-text-soft">Log in to your case file.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text"
          />
        </div>
        {error && <p className="text-sm text-stamp-rejected">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded border border-text bg-text px-4 py-2.5 font-mono text-[13px] text-bg disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-soft">
        No account?{" "}
        <Link href="/signup" className="text-accent">
          Sign up
        </Link>
      </p>
    </div>
  );
}