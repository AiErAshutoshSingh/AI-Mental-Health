import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, HeartPulse, BookText, Wind, Sparkles, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CrisisBanner } from "@/components/crisis-banner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Aurora" }, { name: "robots", content: "noindex" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [name, setName] = useState("friend");
  const [mood, setMood] = useState<number>(6);
  const [saving, setSaving] = useState(false);
  const [recentMoods, setRecentMoods] = useState<{ mood: number; created_at: string }[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const u = userData.user;
      if (!u) return;
      const displayName = (u.user_metadata?.full_name as string) || u.email?.split("@")[0] || "friend";
      setName(displayName);
      const [m, c, j] = await Promise.all([
        supabase.from("mood_logs").select("mood,created_at").order("created_at", { ascending: false }).limit(14),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
        supabase.from("journal_entries").select("id", { count: "exact", head: true }),
      ]);
      setRecentMoods((m.data ?? []).reverse());
      setChatCount(c.count ?? 0);
      setJournalCount(j.count ?? 0);
    })();
  }, []);

  async function logMood() {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const u = userData.user;
    if (!u) return;
    const { error } = await supabase.from("mood_logs").insert({ user_id: u.id, mood });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Mood saved ✨");
    const { data } = await supabase.from("mood_logs").select("mood,created_at").order("created_at", { ascending: false }).limit(14);
    setRecentMoods((data ?? []).reverse());
  }

  const avg = recentMoods.length ? (recentMoods.reduce((a, b) => a + b.mood, 0) / recentMoods.length).toFixed(1) : "—";
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <CrisisBanner />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold sm:text-4xl">{greet}, <span className="text-gradient">{name}</span></h1>
        <p className="mt-1 text-muted-foreground">How are you feeling right now? Take a slow breath — we&apos;ll go at your pace.</p>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Mood card */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent">Log your mood</div>
              <div className="mt-1 text-2xl font-semibold">I&apos;m feeling <span className="text-gradient">{mood}/10</span></div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              14-day avg
              <div className="text-gradient text-2xl font-semibold">{avg}</div>
            </div>
          </div>
          <Slider className="mt-6" min={1} max={10} step={1} value={[mood]} onValueChange={(v) => setMood(v[0])} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>😞 Rough</span><span>😌 Okay</span><span>🌟 Great</span>
          </div>
          <div className="mt-6 flex items-end gap-1">
            {Array.from({ length: 14 }).map((_, i) => {
              const entry = recentMoods[i];
              const v = entry?.mood ?? 0;
              return (
                <div key={i} className="flex-1 rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(6, v * 8)}px`,
                    background: v ? "var(--gradient-brand)" : "rgba(255,255,255,0.05)",
                    opacity: v ? 0.35 + v / 15 : 1,
                  }}
                  title={entry ? `${v}/10` : "no entry"}
                />
              );
            })}
          </div>
          <Button onClick={logMood} disabled={saving} className="btn-brand ring-brand mt-6 rounded-full">
            {saving ? "Saving…" : "Save mood"}
          </Button>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Link to="/chat" className="glass group flex items-center justify-between rounded-3xl p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Start a conversation</div>
                <div className="text-xs text-muted-foreground">{chatCount} past chats</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </Link>
          <Link to="/journal" className="glass group flex items-center justify-between rounded-3xl p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <BookText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold">Write in your journal</div>
                <div className="text-xs text-muted-foreground">{journalCount} entries</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </Link>
          <Link to="/breathe" className="glass group flex items-center justify-between rounded-3xl p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                <Wind className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold">Breathe with me</div>
                <div className="text-xs text-muted-foreground">2-minute grounding</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          </Link>
        </div>
      </div>

      {/* Suggestion */}
      <div className="glass-strong mt-6 flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-accent" />
          <div>
            <div className="font-semibold">A gentle nudge</div>
            <div className="text-sm text-muted-foreground">Even 5 minutes of talking can lift a heavy day. Want to try?</div>
          </div>
        </div>
        <Link to="/chat" className="btn-brand ring-brand inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium">
          <HeartPulse className="h-4 w-4" /> Talk to Aurora
        </Link>
      </div>
    </AppShell>
  );
}
