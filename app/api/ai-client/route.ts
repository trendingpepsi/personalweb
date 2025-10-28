// app/api/ai-client/route.ts
export const runtime = "edge";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

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
    "Your responses should reflect psychological complexity consistent with issues like cultural identity, relationship conflict, trauma, anxiety, depression, and stressors relevant to the chosen identity. " +
    "Do not provide clinical or crisis advice; if asked for help now, suggest contacting local services or 988 (U.S.).";

  const trimmed = (history || []).slice(-20);
  return [{ role: "system" as const, content: system }, ...trimmed];
}

async function chatCompleteOpenAI(messages: any[]) {
  if (!OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY env var on server.", {
      status: 500,
    });
  }

  const url = "https://api.openai.com/v1/chat/completions";
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      max_tokens: 800,
      temperature: Number(process.env.HF_TEMP ?? 0.8),
      stream: false,
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Msg[] };
    const oaMsgs = toOpenAIMessages(messages || []);

    const resp = await chatCompleteOpenAI(oaMsgs);
    if (!resp.ok) {
      const body = await resp.text();
      return new Response(`OpenAI error ${resp.status}: ${body}`, {
        status: 500,
      });
    }

    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      "";

    return Response.json({ reply });
  } catch (e: any) {
    return new Response(`Server exception: ${e?.message || String(e)}`, {
      status: 500,
    });
  }
}
