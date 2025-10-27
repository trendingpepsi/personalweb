export const runtime = "edge";

const PRIMARY_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.3-70B-Instruct";
const FALLBACK_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const HF_TOKEN = process.env.HF_TOKEN;

type Msg = { role: "user" | "assistant"; content: string };

function toOpenAIMessages(history: Msg[]) {
  const system =
    "You are a supportive, educational AI for a university counseling research site. Do NOT provide medical/clinical advice. If asked, suggest contacting local services or 988 (U.S.). Be concise and respectful.";
  const trimmed = (history || []).slice(-20);
  return [{ role: "system" as const, content: system }, ...trimmed];
}

async function callHFChat(model: string, messages: any[]) {
  const url = 'https://router.huggingface.co/hf-inference/models/${encodeURIComponent(model)}';
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 800,
      temperature: 0.6,
      stream: false,
    }),
  });
  return r;
}

export async function POST(req: Request) {
  try {
    if (!HF_TOKEN) {
      return new Response("Missing HF_TOKEN env var on server.", { status: 500 });
    }
    const { messages } = (await req.json()) as { messages: Msg[] };
    const oaMsgs = toOpenAIMessages(messages || []);

    let resp = await callHFChat(PRIMARY_MODEL, oaMsgs);
    if (resp.status === 403 || resp.status === 404) {
      resp = await callHFChat(FALLBACK_MODEL, oaMsgs);
    }
    if (!resp.ok) {
      const body = await resp.text();
      return new Response(`HF error ${resp.status}: ${body}`, { status: 500 });
    }
    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";
    return Response.json({ reply });
  } catch (e: any) {
    return new Response(`Server exception: ${e?.message || String(e)}`, { status: 500 });
  }
}
