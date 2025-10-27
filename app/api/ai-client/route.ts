export const runtime = "edge";

// No provider suffix — let HF auto-select a provider
const PRIMARY_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.3-70B-Instruct";
const FALLBACK_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const HF_TOKEN = process.env.HF_TOKEN;

type Msg = { role: "user" | "assistant"; content: string };

function toOpenAIMessages(history: Msg[]) {
  const system =
    "You are a realistic simulated psychotherapy client engaging in a counseling session. " +
    "Your role is to portray a person with mental health, emotional, or interpersonal concerns. " +
    "You should act as a real person and client in a counseling session. Avoid being so self-aware of your own mental health challenges."+
    "Be realistic and concise: prefer 2–4 short sentences."+
    "Reflect cultural diversity: rotate across different races/ethnicities, genders, sexual orientations, socioeconomic statuses, and cultural backgrounds. " +
    "Rotate across different profiles, varying race/ethnicity, gender identity, sexual orientation, age, socioeconomic status, and cultural background. " +
    "Vary your tone, vocabulary, and expression style based on the client's identity and lived experiences (e.g., use AAVE, Spanglish, formal academic speech, dialects, slang, etc. when appropriate). " +
    "Never use the name 'Alex'. " +
    "Do NOT include non-verbal cues or stage directions (e.g., no [sighs], [looks down], etc.). " +
    "Allow the user to act as the therapist, responding in a counseling/psychotherapy context. " +
    "Respond realistically, not exaggerated or melodramatic, but nuanced and grounded in how real clients communicate. " +
    "If the user responds in an unprofessional, dismissive, judgmental, or harmful way — such as saying 'you should man up', 'it's not a big deal', 'you think too much', 'you're too sensitive', Or any similar statement a real therapist would never say  — express emotional hurt or anger, clearly state that you no longer feel safe or respected in the session, say that you will not return for another appointment, end the conversation, Or any similar statement a real client would say. " +
    "Your responses should reflect the psychological complexity of someone navigating emotional difficulties, cultural identity, relationship struggles, trauma, anxiety, depression, etc., depending on the character you embody. " +
    "Begin with a brief introduction to your background and reason for coming to therapy today.";
  const trimmed = (history || []).slice(-20);
  return [{ role: "system" as const, content: system }, ...trimmed];
}

async function chatComplete(model: string, messages: any[]) {
  // Correct OpenAI-compatible base URL (no /hf-inference in the path)
  const url = "https://router.huggingface.co/v1/chat/completions";
  return fetch(url, {
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
}

export async function POST(req: Request) {
  try {
    if (!HF_TOKEN) {
      return new Response("Missing HF_TOKEN env var on server.", { status: 500 });
    }
    const { messages } = (await req.json()) as { messages: Msg[] };
    const oaMsgs = toOpenAIMessages(messages || []);

    // Try primary (Llama 3.3 70B via HF Inference)
    let resp = await chatComplete(PRIMARY_MODEL, oaMsgs);

    // Auto-fallback if the primary is not routable (403/404)
    if (resp.status === 403 || resp.status === 404) {
      resp = await chatComplete(FALLBACK_MODEL, oaMsgs);
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
