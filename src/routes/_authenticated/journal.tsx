import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookText, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/journal")({
  head: () => ({ meta: [{ title: "Journal — Aurora" }, { name: "robots", content: "noindex" }] }),
  component: JournalPage,
});

type Entry = { id: string; title: string | null; content: string; created_at: string };

function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
      const { data: rows } = await supabase.from("journal_entries")
        .select("id,title,content,created_at").order("created_at", { ascending: false });
      setEntries(rows ?? []);
    })();
  }, []);

  async function save() {
    if (!userId || !content.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("journal_entries")
      .insert({ user_id: userId, title: title || null, content, kind: "daily" }).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setEntries((e) => [data as Entry, ...e]);
    setTitle(""); setContent("");
    toast.success("Saved");
  }

  async function remove(id: string) {
    await supabase.from("journal_entries").delete().eq("id", id);
    setEntries((e) => e.filter((x) => x.id !== id));
  }

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <BookText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Journal</h1>
            <p className="text-sm text-muted-foreground">Write it out. No one else will see this.</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass-strong rounded-3xl p-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give today a title (optional)"
            className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's alive in you today?"
            rows={12}
            className="mt-3 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={save} disabled={saving || !content.trim()} className="btn-brand ring-brand rounded-full">
              <Save className="mr-2 h-4 w-4" /> Save entry
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {entries.length === 0 && (
            <div className="glass rounded-3xl p-6 text-center text-sm text-muted-foreground">No entries yet.</div>
          )}
          {entries.map((e) => (
            <div key={e.id} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                  <div className="font-semibold">{e.title || "Untitled"}</div>
                </div>
                <button onClick={() => remove(e.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm">{e.content}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
