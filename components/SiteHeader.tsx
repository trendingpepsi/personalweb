"use client";

import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Close on Escape / route change hash clicks
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <a href="#top" className="font-semibold tracking-tight inline-block">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm ring-1 ring-black/5 text-white"
            style={{ background: "#FA4616" }} // UF Orange
          >
            AI4Counseling Lab
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#about" className="hover:opacity-70">About</a>
          <a href="#research" className="hover:opacity-70">Research</a>
          <a href="#ai-client" className="hover:opacity-70">AI Simulated Client</a>
          <a href="#publications" className="hover:opacity-70">Publications</a>
          <a
            href="/ai-client"
            className="hover:opacity-80 transition-opacity inline-flex items-center gap-2"
            aria-label="Try the AI simulated client"
            title="Try the AI simulated client"
          >
            {/* simple star-ish icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
              <path d="M12 2l1.8 3.8L18 8l-4.2 2.2L12 14l-1.8-3.8L6 8l4.2-2.2L12 2zm6 10l1.2 2.4L22 16l-2.8 1.6L18 20l-1.2-2.4L14 16l2.8-1.6L18 12zm-12 0l1.2 2.4L10 16l-2.8 1.6L6 20l-1.2-2.4L2 16l2.8-1.6L6 12z"/>
            </svg>
            <span>Try the AI simulated client</span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 ring-1 ring-black/5 hover:bg-neutral-100"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className={`h-5 w-5 ${open ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg
            className={`h-5 w-5 ${open ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6l-12 12"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="mx-auto max-w-6xl px-4 pb-3 pt-1">
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="#about"
                className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#research"
                className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                Research
              </a>
            </li>
            <li>
              <a
                href="#ai-client"
                className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                AI Simulated Client
              </a>
            </li>
            <li>
              <a
                href="#publications"
                className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                Publications
              </a>
            </li>
            <li className="pt-1">
              <a
                href="/ai-client"
                className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                Try the AI simulated client
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
