import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HeartPulse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/mood")({
  head: () => ({ meta: [{ title: "Mood — Aurora" }, { name: "robots", content: "noindex" }] }),
  component: MoodPage,
});

type M = { id: string; mood: number; note: string | null; created_at: string };

function MoodPage() {
  const [logs, setLogs] = useState<M[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("mood_logs")
        .select("id,mood,note,created_at").order("created_at", { ascending: false }).limit(60);
      setLogs(data ?? []);
    })();
  }, []);
  const avg = logs.length ? (logs.reduce((a, b) => a + b.mood, 0) / logs.length).toFixed(1) : "—";

  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mood history</h1>
          <p className="text-sm text-muted-foreground">Your patterns over time · avg <span className="text-gradient font-semibold">{avg}</span></p>
        </div>
      </div>

      <div className="glass-strong mt-6 rounded-3xl p-6">
        <div className="flex items-end gap-1">
          {logs.slice().reverse().map((l) => (
            <div key={l.id} className="flex-1 rounded-t-md" title={`${l.mood}/10 · ${new Date(l.created_at).toLocaleDateString()}`}
              style={{ height: `${l.mood * 12}px`, background: "var(--gradient-brand)", opacity: 0.35 + l.mood / 15 }} />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {logs.length === 0 && <div className="glass rounded-2xl p-4 text-sm text-muted-foreground">Log a mood from the dashboard to get started.</div>}
        {logs.map((l) => (
          <div key={l.id} className="glass flex items-center justify-between rounded-2xl p-3 text-sm">
            <div className="text-muted-foreground">{new Date(l.created_at).toLocaleString()}</div>
            <div className="text-gradient font-semibold">{l.mood}/10</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
