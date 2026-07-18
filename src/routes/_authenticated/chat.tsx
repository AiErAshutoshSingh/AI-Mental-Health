import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Send, Sparkles, Loader2, Plus, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CrisisDialog } from "@/components/crisis-banner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [{ title: "Chat — Aurora" }, { name: "robots", content: "noindex" }],
  }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string; created_at?: string };
type Conversation = { id: string; title: string; created_at: string };

function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      const { data: convs } = await supabase.from("conversations")
        .select("id,title,created_at").order("created_at", { ascending: false });
      setConversations(convs ?? []);
      if (convs && convs.length) selectConversation(convs[0].id);
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function selectConversation(id: string) {
    setActiveId(id);
    const { data } = await supabase.from("messages")
      .select("id,role,content,created_at").eq("conversation_id", id).order("created_at");
    setMessages((data ?? []).map((m) => ({ ...m, role: m.role as "user" | "assistant" })));
  }

  async function newConversation(): Promise<string | null> {
    if (!userId) return null;
    const { data, error } = await supabase.from("conversations")
      .insert({ user_id: userId, title: "New conversation" }).select().single();
    if (error) { toast.error(error.message); return null; }
    setConversations((c) => [data as Conversation, ...c]);
    setActiveId(data.id);
    setMessages([]);
    return data.id;
  }

  async function deleteConversation(id: string) {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((c) => c.filter((x) => x.id !== id));
    if (activeId === id) { setActiveId(null); setMessages([]); }
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming || !userId) return;

    let convId = activeId;
    if (!convId) {
      convId = await newConversation();
      if (!convId) return;
    }

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    // Persist user message
    await supabase.from("messages").insert({
      conversation_id: convId, user_id: userId, role: "user", content: text,
    });

    // If this was the first message, use it as the title
    if (nextMessages.length === 1) {
      const title = text.slice(0, 60);
      await supabase.from("conversations").update({ title }).eq("id", convId);
      setConversations((c) => c.map((x) => x.id === convId ? { ...x, title } : x));
    }

    // Placeholder assistant message
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "Something went wrong");
        throw new Error(err || `Error ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((x) => x.id === assistantId ? { ...x, content: acc } : x));
      }
      // Persist assistant
      await supabase.from("messages").insert({
        conversation_id: convId, user_id: userId, role: "assistant", content: acc,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setMessages((m) => m.filter((x) => x.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }

  const suggestions = useMemo(() => ([
    "I've been feeling anxious lately",
    "Help me reframe a stressful thought",
    "Guide me through a breathing exercise",
    "I'm struggling to sleep",
  ]), []);

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[280px,1fr]" style={{ height: "calc(100vh - 6rem)" }}>
        {/* Conversations */}
        <div className="glass hidden flex-col rounded-3xl p-3 lg:flex">
          <Button onClick={newConversation} className="btn-brand ring-brand w-full justify-start gap-2 rounded-xl">
            <Plus className="h-4 w-4" /> New chat
          </Button>
          <div className="mt-3 flex-1 space-y-1 overflow-y-auto scrollbar-thin pr-1">
            {conversations.length === 0 && (
              <div className="mt-8 text-center text-xs text-muted-foreground">Your conversations will appear here.</div>
            )}
            {conversations.map((c) => (
              <div key={c.id} className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                activeId === c.id ? "bg-white/10" : "hover:bg-white/5"
              }`}>
                <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <button onClick={() => selectConversation(c.id)} className="min-w-0 flex-1 truncate text-left">
                  {c.title || "Untitled"}
                </button>
                <button onClick={() => deleteConversation(c.id)} className="opacity-0 transition group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="glass-strong flex min-h-0 flex-col rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Aurora</div>
                <div className="text-xs text-muted-foreground">Llama 3.3 70B · Groq</div>
              </div>
            </div>
            <CrisisDialog />
          </div>

          <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg pt-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="mt-4 text-xl font-semibold">Hi, I&apos;m Aurora.</h2>
                <p className="mt-1 text-sm text-muted-foreground">Whatever&apos;s on your mind, we can talk it through. Take your time.</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => setInput(s)}
                      className="glass rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground">
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user" ? "text-white" : "glass"
                  }`} style={m.role === "user" ? { background: "var(--gradient-brand)" } : undefined}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-pre:my-2">
                        {m.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <form onSubmit={send} className="border-t border-white/5 p-4 sm:p-6">
            <div className="glass flex items-end gap-2 rounded-2xl p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                placeholder="Tell Aurora what's on your mind…"
                className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" disabled={streaming || !input.trim()} className="btn-brand ring-brand h-10 rounded-xl px-4">
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-2 text-center text-[11px] text-muted-foreground">
              Aurora is a supportive AI — not a substitute for professional care.
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
