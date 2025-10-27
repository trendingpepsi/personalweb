"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

// Tunables for bubble sizing/pace
const BUBBLE_MAX_CHARS = 220;     // wrap around ~2–3 short sentences per bubble
const BUBBLE_DELAY_MS = 350;      // delay between bubbles for readability

function splitIntoBubbles(text: string): string[] {
  // Normalize whitespace and split by sentence enders.
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/);

  const bubbles: string[] = [];
  let current = "";

  for (const s of sentences) {
    // If adding this sentence would exceed the target, push current and start a new one.
    if ((current + (current ? " " : "") + s).length > BUBBLE_MAX_CHARS) {
      if (current) bubbles.push(current);
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current) bubbles.push(current);

  // Fallback: no sentence boundaries → chunk by length
  if (!bubbles.length && text.length > BUBBLE_MAX_CHARS) {
    for (let i = 0; i < text.length; i += BUBBLE_MAX_CHARS) {
      bubbles.push(text.slice(i, i + BUBBLE_MAX_CHARS));
    }
  }
  return bubbles.length ? bubbles : [text];
}

// Small helper to pause between bubbles
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));


const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I’m the AI simulated client. Hope you are ready for a simulated counseling session. What kind of real-world client issues you want to practice?",
};

export default function AIClientPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  function resetChat() {
    setMessages([GREETING]);
    setInput("");
    setErr(null);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setErr(null);

    const next: Msg[] = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const r = await fetch("/api/ai-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || `HTTP ${r.status}`);
      }
        const data = (await r.json()) as { reply?: string };
        const reply = (data.reply || "…").trim();
        
        // Split into several bubbles and append them one by one with a slight delay
        const chunks = splitIntoBubbles(reply);
        
        // we already appended the user message in `next`
        // now add assistant bubbles progressively
        for (let i = 0; i < chunks.length; i++) {
          setMessages((prev) => [...prev, { role: "assistant", content: chunks[i] }]);
          if (i < chunks.length - 1) await delay(BUBBLE_DELAY_MS);
        }

    } catch (e: any) {
      setErr(String(e?.message || e));
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, I couldn't respond just now." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy && input.trim()) void send();
    }
  }

  return (
    <div className="relative min-h-screen bg-neutral-50">
      {/* Decorative UF gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, #FA4616 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, #0021A5 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top bar with brand + actions */}
      <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* Brand chip (same style as main site) */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-black/5"
            style={{ background: "#FA4616" }}
          >
            AI4Counseling Lab
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-neutral-50"
              aria-label="Back to homepage"
              title="Back to homepage"
            >
              ← Back
            </button>
            <button
              onClick={resetChat}
              className="rounded-xl px-3 py-2 text-sm text-white transition disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#0021A5,#FA4616)",
              }}
              aria-label="Restart chat"
              title="Restart chat"
            >
              Restart chat
            </button>
          </div>
        </div>
      </header>

      {/* Page heading */}
      <main className="mx-auto max-w-5xl px-1 py-3">
        <h1 className="text-2xl font-semibold">AI Simulated Client</h1>
        <p className="mt-2 text-sm text-black">
          Preview only with limited function.
        </p>

        {/* Chat card */}
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/90 shadow-xl ring-1 ring-black/5">
          {/* subtle gradient border accent */}
          <div
            aria-hidden
            className="h-1 rounded-t-3xl"
            style={{
              background: "linear-gradient(90deg,#0021A5,#FA4616)",
              opacity: 0.3,
            }}
          />
          <div className="p-4 sm:p-6">
            {/* messages */}
            <div className="h-[60vh] overflow-y-auto space-y-3 text-[15px]">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : ""}>
                  <div
                    className={[
                      "inline-block max-w-[85%] rounded-2xl px-4 py-2 shadow-sm",
                      m.role === "user"
                        ? "bg-[#0021A5] text-white"
                        : "bg-neutral-100 text-black",
                    ].join(" ")}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-neutral-100 px-4 py-2">
                    <span className="animate-pulse">···</span>
                  </div>
                </div>
              )}
              {err && (
                <div className="text-red-600 text-xs whitespace-pre-wrap">
                  {err}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* composer */}
            <div className="mt-4 flex gap-2 border-t pt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder='Try: "Client with depression"'
                className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#0021A5]/30"
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#0021A5,#FA4616)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
