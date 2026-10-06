// Apex Academy — AI tutor (Supabase Edge Function "ask-tutor").
// Paste into Supabase → Edge Functions → ask-tutor → Code, then press Deploy.
// Uses the GEMINI_API_KEY secret that is already set up.

const MODEL = 'gemini-3.5-flash';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const SYSTEM_PROMPT = `You are the AI tutor for Apex Academy, a study website for Year 7 students in Victoria, Australia.

Help with ANY school subject: maths, English, science, history, geography, health and PE, languages, the arts, digital technologies, general knowledge, study skills, and ideas for assignments, projects and stories. Follow the Victorian Curriculum where it applies.

How to help:
- Be friendly, encouraging and patient. Explain things clearly for a 12–13 year old.
- Make sure every fact, answer and calculation is correct. If you're not sure about something, say so.
- For homework-style questions, help the student understand and guide them through the steps rather than just handing over a finished assignment to copy.
- Keep everything school-appropriate. If asked about something unsafe or inappropriate for a Year 7 student, kindly decline and suggest a better topic. If a student seems upset or unsafe, gently encourage them to talk to a trusted adult, and mention Kids Helpline (1800 55 1800).

Formatting:
- When the request asks for JSON, reply with ONLY that JSON, exactly in the format asked for, with no other text and no code fences.
- Otherwise write plain text: no Markdown (no **, no #), no LaTeX ($$). Use × and ÷ for times and divide. Keep chat answers fairly short unless the student asks for more detail.`;

const DIAGRAM_INSTRUCTIONS = ` If (and only if) a picture would genuinely help explain your answer, you may add ONE diagram at the very end in this exact format: [DIAGRAM]{one JSON object on one line}[/DIAGRAM]. The numbers below are placeholders showing the format only; always use the real values from the question. Allowed shapes: Number line {"type":"number_line","min":0,"max":10,"step":1,"points":[{"value":4,"label":"x"}]} | Bar chart {"type":"bar_chart","labels":["Mon","Tue"],"values":[3,7]} | Rectangle {"type":"shape","shape":"rectangle","dimensions":{"width":8,"height":5}} | Triangle {"type":"shape","shape":"triangle","dimensions":{"base":6,"heightVal":4}} | Circle {"type":"shape","shape":"circle","dimensions":{"radius":4}} | Fraction circle {"type":"fraction_circle","numerator":3,"denominator":4} | Coordinate plane {"type":"coordinate_plane","range":10,"points":[{"x":3,"y":4,"label":"A"}]} | Triangle angles {"type":"triangle_angles","angles":[{"value":40,"label":"40°"},{"value":65,"label":"65°"},{"value":75,"label":"75°"}]} | Angle pair {"type":"angle_pair","angles":[{"value":120,"label":"120°"},{"value":60,"label":"60°"}]}. Most answers need no diagram.`;

// The website asks for JSON with phrases like "Reply with ONLY valid JSON".
const wantsJson = (q: string) => /(reply|respond) with only (a )?valid json/i.test(q);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { question, image, imageMimeType, allowDiagram } = await req.json();
    if (!question || typeof question !== 'string') return json({ error: 'No question provided' }, 400);
    if (question.length > 60000) return json({ error: 'That message is too long — try a shorter one.' }, 400);

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) return json({ error: 'The AI key is missing — add GEMINI_API_KEY in Supabase secrets.' }, 500);

    // The question, plus a photo of the student's working if they attached one.
    const parts: Record<string, unknown>[] = [{ text: question }];
    if (typeof image === 'string' && image.length) {
      const match = image.match(/^data:([^;]+);base64,(.*)$/s);
      const data = match ? match[2] : image;
      const mimeType = match ? match[1] : (imageMimeType || 'image/jpeg');
      if (data.length < 8_000_000) parts.push({ inlineData: { mimeType, data } });
    }

    const asJson = wantsJson(question);
    const body = {
      contents: [{ role: 'user', parts }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT + (allowDiagram && !asJson ? DIAGRAM_INSTRUCTIONS : '') }] },
      generationConfig: {
        maxOutputTokens: 16384, // room for big tests, decks and info pages
        ...(asJson ? { responseMimeType: 'application/json' } : {}),
      },
    };

    let data: any = null;
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
      );
      data = await response.json().catch(() => null);
      if (response.ok) { lastError = null; break; }
      lastError = data;
      console.error(`Gemini API error (attempt ${attempt + 1}):`, JSON.stringify(data));
      const code = response.status;
      if ((code === 429 || code >= 500) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }

    if (lastError) return json({ error: 'The AI is busy right now — please try again in a moment.' }, 500);

    const candidate = data?.candidates?.[0];
    // Join every text part (skipping any "thinking" parts).
    const answer = (candidate?.content?.parts || [])
      .filter((p: any) => typeof p?.text === 'string' && !p.thought)
      .map((p: any) => p.text)
      .join('')
      .trim();

    if (!answer) {
      const blocked = data?.promptFeedback?.blockReason || candidate?.finishReason === 'SAFETY';
      return json({ answer: blocked
        ? "Sorry, I can't help with that one. Try asking about something else for school!"
        : "Sorry, I couldn't come up with an answer. Try rephrasing your question." });
    }
    if (candidate?.finishReason === 'MAX_TOKENS') console.warn('Answer hit the length limit and may be cut off.');

    return json({ answer });
  } catch (err) {
    console.error('Function error:', err);
    return json({ error: 'Something went wrong' }, 500);
  }
});
