export const runtime = "edge";

const PRIMARY_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.3-70B-Instruct";
const FALLBACK_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const HF_TOKEN = process.env.HF_TOKEN;

function toPrompt(history: Array<{ role: string; content: string }>) {
  const system =
    "You are a supportive, educational AI for a university counseling research site. " +
    "Do NOT provide medical/clinical advice. If asked, suggest contacting local services or 988 (U.S.). " +
    "Be concise and respectful.";

  const trimmed = (history || []).slice(-20);
  const lines = [`SYSTEM: ${system}`];
  for (const m of trimmed) {
    const role = m.role?.toUpperCase() === "USER" ? "USER" : "ASSISTANT";
    lines.push(`${role}: ${m.content}`);
  }
  lines.push("ASSISTANT:");
  return lines.join("\n");
}

async function callHF(model: string, prompt: string) {
  return fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.6,
        return_full_text: false,
      },
    }),
  });
}

export async function POST(req: Request) {
  try {
    if (!HF_TOKEN) {
      return new Response("Server is not configured (missing HF_TOKEN).", { status: 500 });
    }

    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const prompt = toPrompt(messages);

    let r = await callHF(PRIMARY_MODEL, prompt);
    if (r.status === 403 || r.status === 404) {
      r = await callHF(FALLBACK_MODEL, prompt);
    }

    if (!r.ok) {
      const msg = await r.text();
      return new Response(`HF error (${r.status}): ${msg}`, { status: 500 });
    }

    const data = await r.json();
    const reply =
      (Array.isArray(data) && data[0]?.generated_text) ||
      data?.generated_text ||
      data?.[0]?.generated_text ||
      "";

    return Response.json({ reply });
  } catch (e: any) {
    return new Response(`Server error: ${e?.message || String(e)}`, { status: 500 });
  }
}
