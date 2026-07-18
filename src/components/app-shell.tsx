import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, MessageCircle, BookText, HeartPulse, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { AuroraBackground } from "@/components/aurora-background";
import { CrisisDialog } from "@/components/crisis-banner";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat" as const, label: "Chat", icon: MessageCircle },
  { to: "/journal" as const, label: "Journal", icon: BookText },
  { to: "/mood" as const, label: "Mood", icon: HeartPulse },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      setName((user.user_metadata?.full_name as string) || user.email || "");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
    })();
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground className="fixed" />
      <div className="relative mx-auto flex min-h-screen max-w-[1400px] gap-4 p-4">
        {/* Sidebar */}
        <aside className="glass sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-3xl p-4 md:flex">
          <Link to="/dashboard" className="mb-6 flex items-center gap-2 px-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Aurora</span>
          </Link>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    active ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  style={active ? { background: "var(--gradient-brand)" } : undefined}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  pathname.startsWith("/admin") ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={pathname.startsWith("/admin") ? { background: "var(--gradient-brand)" } : undefined}
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
          </nav>
          <div className="mt-auto space-y-2">
            <CrisisDialog />
            <div className="glass flex items-center gap-3 rounded-xl p-3">
              <div className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
                {(name?.[0] || "A").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <div className="truncate">{name}</div>
                <button onClick={signOut} className="mt-0.5 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-3 w-3" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between md:hidden">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold">Aurora</span>
            </Link>
            <button onClick={signOut} className="glass rounded-full p-2 text-muted-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
          <div className="md:hidden">
            <nav className="glass mb-3 flex gap-1 overflow-x-auto rounded-full p-1 text-xs">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 whitespace-nowrap ${active ? "text-white" : "text-muted-foreground"}`}
                    style={active ? { background: "var(--gradient-brand)" } : undefined}
                  >
                    <item.icon className="h-3.5 w-3.5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
