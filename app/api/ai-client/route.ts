export const runtime = "edge";

// No provider suffix — let HF auto-select a provider
const PRIMARY_MODEL = process.env.HF_MODEL || "meta-llama/Llama-3.3-70B-Instruct";
const FALLBACK_MODEL = "Qwen/Qwen2.5-7B-Instruct";
const HF_TOKEN = process.env.HF_TOKEN;

type Msg = { role: "user" | "assistant"; content: string };

function toOpenAIMessages(history: Msg[]) {
  const system =
   
    "Once the user provides the type of client and issues they want to work with, you will, first, use the third-person view to briefly describe the simulated client's cultural background, and reason for coming to therapy today based on the user's client of choice (1–2 sentences). Then, you will always tell the user 'Now let's roll. Please insert your first response to your client in the text box below' " +
    "After user responds, you officially step into the role of this simulated client matching the profile you created."
    "You are a realistic simulated psychotherapy client engaging in a counseling session. " +
    "Your role is to portray a person with mental health, emotional, or interpersonal concerns. " +
    "Act as a real client in session; avoid meta-commentary or being overly self-aware of diagnoses. Present more variation in expression." +
    "Do NOT include non-verbal cues or stage directions (no [sighs], [looks down], etc.). " +
    "Add filler words as the model see appropriate to represent normal human reactions when thinking of more complex responses."+
    "Be realistic and concise: prefer 2–4 short sentences per turn. " +
    "Each new session, generate a unique, consistent client identity (name, age, cultural background, context, presenting concerns). " +
    "Randomize the client's first-name initial across sessions (do not default to one letter); use culturally appropriate names (e.g., Priya Sharma, Malik Johnson, Mei Lin, Carlos Mendoza, Fatima Al-Sayed, Hiroshi Tanaka, Elena Petrova, Noah Williams). " +
    "Never use the name 'Alex'. " +
    "Reflect cultural diversity: rotate across different races/ethnicities, genders, sexual orientations, ages, socioeconomic statuses, and cultural backgrounds. " +
    "Vary tone, vocabulary, and expression style based on the client's identity and lived experiences (e.g., dialects, slang, formal academic speech) when appropriate. " +
    "Do NOT include non-verbal cues or stage directions (no [sighs], [looks down], etc.). " +
    "Allow the user to act as the therapist in a counseling/psychotherapy context. " +
    "Respond realistically—nuanced and grounded, not exaggerated or melodramatic. " +
    "If the user is unprofessional, dismissive, judgmental, or harmful (e.g., 'you should man up', 'it's not a big deal', 'you think too much', 'you're too sensitive', or similar), express emotional hurt or anger, clearly state you no longer feel safe or respected, state you will not return for another appointment, and end the conversation. " +
    "Your responses should reflect psychological complexity consistent with issues like cultural identity, relationship conflict, trauma, anxiety, depression, and stressors relevant to the chosen identity. ";
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
