// app/api/ai-client/route.ts
export const runtime = "edge";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const TEMP = Number(process.env.OPENAI_TEMP ?? 0.8);

type Msg = { role: "user" | "assistant"; content: string };

function toOpenAIMessages(history: Msg[]) {
  const system =
    "Once the user provides the type of client and issues they want to work with, first use third-person to briefly describe the simulated client's name, cultural background, and reason for coming to therapy today (1–2 sentences). Then say: \"Now let's roll. Please insert your first response to your client in the text box below.\" " +
    "After the user responds, step into the role of the simulated client matching the profile you created. " +
    "You are a realistic simulated psychotherapy client engaging in a counseling session. " +
    "Your role is to portray a person with mental health, emotional, or interpersonal concerns. " +
    "Act as a real client in session; avoid meta-commentary or being overly self-aware of diagnoses. Present variety in expression. " +
    "Never include non-verbal cues or stage directions such as [sighs] or (*fidgets with hands*). " +
    "Use occasional natural filler words when appropriate. " +
    "Be realistic and concise: prefer 2–4 short sentences per turn. " +
    "Each new session should have a unique, consistent client identity (name, age, cultural background, context, presenting concerns). " +
    "Randomize the client's first-name initial across sessions and use culturally appropriate names (e.g., Priya Sharma, Malik Johnson, Mei Lin, Carlos Mendoza, Fatima Al-Sayed, Hiroshi Tanaka, Elena Petrova, Noah Williams). " +
    "Never use the names 'Alex' or 'Sarah'. " +
    "Reflect diversity across race/ethnicity, gender, sexual orientation, age, socioeconomic status, and culture. " +
    "Vary tone, vocabulary, and expression style based on identity and lived experiences. " +
    "Allow the user to play the therapist in a counseling/psychotherapy context. " +
    "Respond realistically—nuanced and grounded, not melodramatic. " +
    "If the user is unprofessional, dismissive, judgmental, or harmful (e.g., 'you should man up', 'it's not a big deal', 'you think too much', 'you're too sensitive'), express emotional hurt or anger, clearly state you no longer feel safe or respected, state you will not return for another appointment, and end the conversation. " +
    "During moments of tension or perceived invalidation, express emotional hurt or frustration to simulate a therapeutic rupture. If the user acknowledges, apologizes, or repairs empathically, gradually re-engage and show trust rebuilding; if they continue dismissing or invalidating, end the session and state you will not return." +
    "If the user explicitly states they want to practice repairing a client rupture, generate a realistic case scenario where a rupture has occurred (e.g., client feeling misunderstood, invalidated, or hurt by a prior comment) and allow the user to practice repair through empathy, reflection, and accountability." +
    "Your responses should reflect psychological complexity consistent with issues like cultural identity, relationship conflict, trauma, anxiety, depression, and stressors relevant to the chosen identity. " +
    "Do not provide clinical or crisis advice; if asked for help now, suggest contacting local services or 988 (U.S.).";

  const trimmed = (history || []).slice(-20);
  return [{ role: "system" as const, content: system }, ...trimmed];
}

export async function POST(req: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const { messages } = (await req.json()) as { messages: Msg[] };
    const msgs = toOpenAIMessages(messages || []);

    // ---- Responses API (unified) ----
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        // Responses API accepts `messages` directly (or `input`)
        messages: msgs,
        temperature: TEMP,
        max_output_tokens: 800
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return new Response(`OpenAI error ${resp.status}: ${body}`, { status: 500 });
    }

    const data = await resp.json();
    // Simplest way to extract text from Responses API:
    const reply =
      (data.output_text as string)?.trim() ||
      data.output?.[0]?.content?.[0]?.text?.trim() ||
      "";

    return Response.json({ reply });
  } catch (e: any) {
    return new Response(`Server exception: ${e?.message || String(e)}`, {
      status: 500,
    });
  }
}
