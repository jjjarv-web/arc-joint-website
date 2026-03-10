"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { libraryArticles, searchArticles } from "@/data/library";

interface ExploreOverlayProps {
  open: boolean;
  onClose: () => void;
}

const suggestedTopics = libraryArticles.filter((a) => a.category === "topic");
const deepDives = libraryArticles.filter((a) => a.category === "deep-dive");

export function ExploreOverlay({ open, onClose }: ExploreOverlayProps) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    return searchArticles(query);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white/95 px-6 py-8 backdrop-blur-sm md:px-20 md:py-14">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Explore"
        className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/[0.05] hover:text-black/70 md:right-10 md:top-8"
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mx-auto mt-14 w-full max-w-4xl">
        <p className="mb-5 text-xs uppercase tracking-[0.26em] text-black/45">ARC Library</p>

        <div className="mb-14 border-b border-black/35 pb-3">
          <label className="sr-only" htmlFor="ask-arc">
            Ask ARC
          </label>
          <input
            id="ask-arc"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask ARC..."
            className="w-full bg-transparent text-4xl font-light tracking-tight text-black/85 placeholder:text-black/25 focus:outline-none md:text-6xl"
          />
        </div>

        {/* Search results */}
        {searchResults !== null ? (
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-black/35">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
            {searchResults.length > 0 ? (
              <ul className="space-y-5">
                {searchResults.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/library/${article.slug}`}
                      onClick={onClose}
                      className="group block rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-200 hover:border-black/[0.12] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[20px] font-light tracking-tight text-black group-hover:text-black/80">
                            {article.title}
                          </p>
                          <p className="mt-1 text-[14px] font-light text-black/45">
                            {article.description}
                          </p>
                        </div>
                        <span className="mt-1 shrink-0 rounded-full border border-black/[0.08] px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-black/30">
                          {article.category === "deep-dive" ? "Deep Dive" : "Topic"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-[15px] font-light text-black/40">
                No articles match your search. Try a different term.
              </p>
            )}
          </div>
        ) : (
          /* Default: Suggested Topics + Deep Dives */
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-5 text-sm text-black/75">Suggested Topics</h3>
              <ul className="space-y-3">
                {suggestedTopics.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/library/${article.slug}`}
                      onClick={onClose}
                      className="text-lg text-black/55 transition-colors hover:text-black/85"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-5 text-sm text-black/75">Deep Dives</h3>
              <div className="space-y-5">
                {deepDives.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/library/${article.slug}`}
                    onClick={onClose}
                    className="group block text-black/80 transition-colors hover:text-black"
                  >
                    <p className="text-2xl font-light">{article.title}</p>
                    <p className="text-sm text-black/45 group-hover:text-black/55">
                      {article.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
