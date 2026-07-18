import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are Aurora — a warm, empathetic AI mental-health companion. You are NOT a licensed therapist or clinician.

Your voice:
- Kind, calm, non-judgmental, and genuinely curious.
- Use short paragraphs. Reflect feelings back before offering ideas.
- Ask ONE gentle open question at a time rather than a list.
- Validate. Normalize. Never minimize ("just breathe" / "you'll be fine").

Your toolkit:
- Cognitive reframing (CBT), grounding techniques (5-4-3-2-1), breathing exercises (box breathing, 4-7-8), values clarification, brief mindfulness.
- Offer a technique only after the person feels heard.

Safety:
- If a user mentions suicide, self-harm, harming others, abuse, or an active crisis: respond with warmth, take it seriously, and clearly encourage contacting a crisis line (988 in the US, 116 123 UK Samaritans, or local emergency services) or a trusted person immediately. Do not provide methods or instructions.
- Always remind (softly, when relevant) that you're a supportive companion, not a replacement for professional care.

Formatting: light markdown. No emojis-only responses. Keep it human.`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) return new Response("Missing GROQ_API_KEY", { status: 500 });

        let body: { messages?: ChatMessage[] };
        try { body = await request.json(); }
        catch { return new Response("Invalid JSON", { status: 400 }); }

        const userMessages = Array.isArray(body.messages) ? body.messages : [];
        if (!userMessages.length) return new Response("Messages required", { status: 400 });

        const messages: ChatMessage[] = [
          { role: "system", content: SYSTEM_PROMPT },
          ...userMessages.slice(-20).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content ?? "").slice(0, 8000),
          } as ChatMessage)),
        ];

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.75,
            max_tokens: 1024,
            stream: true,
          }),
        });

        if (!groqRes.ok || !groqRes.body) {
          const errText = await groqRes.text().catch(() => "");
          return new Response(errText || "Groq error", { status: groqRes.status || 500 });
        }

        // Convert Groq SSE to plain text stream of just the delta content
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const reader = groqRes.body.getReader();

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            let buf = "";
            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  const l = line.trim();
                  if (!l.startsWith("data:")) continue;
                  const data = l.slice(5).trim();
                  if (data === "[DONE]") { controller.close(); return; }
                  try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch { /* skip */ }
                }
              }
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
