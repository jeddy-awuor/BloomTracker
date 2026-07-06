"use client";

import { useState } from "react";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import {
  MOTIVATION_QUOTES,
  getDailyQuoteIndex,
  getRandomQuoteIndex,
} from "@/lib/quotes";

interface MotivationQuoteProps {
  compact?: boolean;
  className?: string;
}

export default function MotivationQuote({
  compact = false,
  className = "",
}: MotivationQuoteProps) {
  const [index, setIndex] = useState(getDailyQuoteIndex);
  const quote = MOTIVATION_QUOTES[index];

  const shuffle = () => {
    setIndex((current) => getRandomQuoteIndex(current));
  };

  if (compact) {
    return (
      <blockquote className={`text-center ${className}`}>
        <p className="mb-1 line-clamp-4 text-xs italic leading-relaxed text-pink-400/80">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="text-[10px] font-medium text-pink-500/60">
          — {quote.author}
        </footer>
      </blockquote>
    );
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-pink-500/25 bg-gradient-to-br from-pink-950/70 via-pink-900/30 to-pink-950/70 p-6 shadow-pink">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blush-500/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/20">
              <QuoteIcon className="h-4 w-4 text-pink-300" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-pink-400">
              Daily motivation
            </span>
          </div>
          <button
            onClick={shuffle}
            aria-label="Show another quote"
            className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 px-3 py-1.5 text-xs text-pink-400 transition-all hover:border-pink-400/50 hover:bg-pink-500/10 hover:text-pink-200"
          >
            <RefreshCw className="h-3 w-3" />
            New quote
          </button>
        </div>

        <blockquote>
          <p className="text-base font-medium italic leading-relaxed text-pink-100 sm:text-lg">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="mt-3 text-sm font-semibold text-pink-400">
            — {quote.author}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
