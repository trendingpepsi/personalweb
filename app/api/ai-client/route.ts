export const runtime = "edge";

const HF_MODEL = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";
const HF_TOKEN = process.env.HF_TOKEN;

function toPrompt(history: Array<{ role: string; content: string }>) {
  const system =
    "You are a supportive, educational AI for a university counseling research site. " +
    "Do NOT provide medical/clinical advice. If asked, suggest contacting local services or 988 (U.S.). " +
    "Be concise and respectful.";

  const lines = [`SYSTEM: ${system}`];
  for (const m of history) {
    const role = m.role?.toUpperCase() === "USER" ? "USER" : "ASSISTANT";
    lines.push(`${role}: ${m.content}`);
  }
  lines.push("ASSISTANT:");
  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    if (!HF_TOKEN) {
      return new Response("Server is not configured (missing HF_TOKEN).", { status: 500 });
    }

    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const prompt = toPrompt(messages || []);

    const r = await fetch(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(HF_MODEL)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 600,
            temperature: 0.6,
            return_full_text: false
          },
        }),
      }
    );

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
