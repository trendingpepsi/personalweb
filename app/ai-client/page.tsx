"use client";

import { useRef, useState, useEffect } from "react";
type Msg = { role: "user" | "assistant"; content: string };

export default function AIClientPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I’m the AI simulated client prototype. I can’t give clinical advice." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement|null>(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setErr(null);

    const next = [...messages, { role: "user", content: text }];
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
      const data = await r.json();
      const reply = data.reply || "…";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setErr("Server not configured or unavailable.");
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't respond just now." }]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy && input.trim()) send();
    }
  }

  return (
    <main className="min-h-[80vh] mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">AI Simulated Client</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Educational prototype only. If you need help now, contact local services or (U.S.) call/text <b>988</b>.
      </p>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="p-4 h-[50vh] overflow-y-auto space-y-3 text-sm">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={
                  "inline-block max-w-[85%] rounded-xl px-3 py-2 " +
                  (m.role === "user"
                    ? "bg-[#0021A5] text-white"
                    : "bg-neutral-100 text-neutral-900")
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="text-left">
              <div className="inline-block rounded-xl px-3 py-2 bg-neutral-100">…</div>
            </div>
          )}
          {err && <div className="text-red-600 text-xs">{err}</div>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Try: "Summarize a recent publication."'
            className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0021A5]/30"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="rounded-xl px-3 py-2 text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#0021A5,#FA4616)" }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
