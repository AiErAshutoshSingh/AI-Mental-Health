import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ShieldCheck, Users, MessageCircle, HeartPulse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Aurora" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    if (!data?.some((r) => r.role === "admin")) throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

function AdminPage() {
  const [stats, setStats] = useState({ profiles: 0, conversations: 0, messages: 0, moods: 0 });
  useEffect(() => {
    (async () => {
      const [p, c, m, mo] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("mood_logs").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        profiles: p.count ?? 0, conversations: c.count ?? 0,
        messages: m.count ?? 0, moods: mo.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Users", value: stats.profiles, icon: Users },
    { label: "Conversations", value: stats.conversations, icon: MessageCircle },
    { label: "Messages", value: stats.messages, icon: MessageCircle },
    { label: "Mood logs", value: stats.moods, icon: HeartPulse },
  ];

  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin overview</h1>
          <p className="text-sm text-muted-foreground">Platform stats at a glance</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-3xl p-5">
            <c.icon className="h-5 w-5 text-accent" />
            <div className="mt-3 text-xs text-muted-foreground">{c.label}</div>
            <div className="text-gradient text-3xl font-bold">{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
