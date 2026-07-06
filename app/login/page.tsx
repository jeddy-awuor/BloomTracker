"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cloud, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, isConfigured, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <Cloud className="h-10 w-10 text-pink-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-pink-50">
          Cloud sync not configured
        </h1>
        <p className="mb-6 text-sm text-pink-400">
          Add your Supabase keys to <code className="text-pink-300">.env.local</code>{" "}
          to enable sign-in and sync across devices.
        </p>
        <Link
          href="/"
          className="text-sm text-pink-400 hover:text-pink-300"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    const authError =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    setSubmitting(false);

    if (authError) {
      setError(authError);
      return;
    }

    if (mode === "signup") {
      setMessage("Account created! Check your email if confirmation is required.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20">
            <Cloud className="h-6 w-6 text-pink-300" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-pink-50">Sync with Supabase</h1>
        <p className="mt-2 text-sm text-pink-400">
          Sign in to keep your projects and tasks across all your devices.
        </p>
      </div>

      <div className="mb-6 flex rounded-xl border border-pink-500/25 bg-pink-950/40 p-1">
        {(["signin", "signup"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setMode(tab);
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              mode === tab
                ? "bg-pink-500/30 text-pink-100"
                : "text-pink-400 hover:text-pink-200"
            }`}
          >
            {tab === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-pink-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-pink-500/30 bg-pink-950/60 px-4 py-2.5 text-pink-50 placeholder:text-pink-600 focus:border-pink-400/50 focus:outline-none focus:ring-1 focus:ring-pink-400/30"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm text-pink-400"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-pink-500/30 bg-pink-950/60 px-4 py-2.5 text-pink-50 placeholder:text-pink-600 focus:border-pink-400/50 focus:outline-none focus:ring-1 focus:ring-pink-400/30"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg bg-pink-900/50 px-3 py-2 text-sm text-pink-200">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-blush-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-pink-500">
        Your existing browser data will be migrated automatically on first sign-in.
      </p>
    </div>
  );
}
