// Destination: src/app/(auth)/signup/page.tsx
// This replaces the earlier version — password field now uses
// PasswordInput (show/hide eye toggle).
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 flex items-center gap-2 font-mono text-lg font-bold">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        DOSSIER
      </div>
      <h1 className="mb-1 text-2xl font-bold">Open your case file</h1>
      <p className="mb-8 text-text-soft">
        Start tracking your job hunt properly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-mono text-xs text-text-soft">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-border bg-surface px-3 py-2.5 text-sm text-text"
          />
        </div>
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
          <PasswordInput
            value={password}
            onChange={setPassword}
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-text-soft">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-stamp-rejected">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded border border-text bg-text px-4 py-2.5 font-mono text-[13px] text-bg disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}