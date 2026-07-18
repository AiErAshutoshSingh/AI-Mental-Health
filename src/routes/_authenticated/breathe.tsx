import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wind, Play, Pause } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/breathe")({
  head: () => ({ meta: [{ title: "Breathe — Aurora" }, { name: "robots", content: "noindex" }] }),
  component: BreathePage,
});

const PHASES = [
  { label: "Breathe in", secs: 4 },
  { label: "Hold", secs: 4 },
  { label: "Breathe out", secs: 4 },
  { label: "Hold", secs: 4 },
];

function BreathePage() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(PHASES[0].secs);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        setPhase((p) => (p + 1) % PHASES.length);
        return PHASES[(phase + 1) % PHASES.length].secs;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase]);

  const current = PHASES[phase];
  const scale = current.label === "Breathe in" ? 1.35 : current.label === "Breathe out" ? 0.85 : 1.1;

  return (
    <AppShell>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
          <Wind className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Box breathing</h1>
          <p className="text-sm text-muted-foreground">4-4-4-4 · a calm reset in a couple of minutes</p>
        </div>
      </div>

      <div className="glass-strong mt-6 grid place-items-center rounded-3xl p-10">
        <div className="relative grid h-80 w-80 place-items-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--gradient-brand)", filter: "blur(20px)", opacity: 0.5 }}
            animate={{ scale: running ? scale : 1 }}
            transition={{ duration: current.secs, ease: "easeInOut" }}
          />
          <motion.div
            className="relative grid h-56 w-56 place-items-center rounded-full text-center"
            style={{ background: "var(--gradient-brand)" }}
            animate={{ scale: running ? scale : 1 }}
            transition={{ duration: current.secs, ease: "easeInOut" }}
          >
            <div>
              <div className="text-sm font-medium text-white/80">{current.label}</div>
              <div className="text-5xl font-bold text-white">{count}</div>
            </div>
          </motion.div>
        </div>
        <Button onClick={() => setRunning((r) => !r)} className="btn-brand ring-brand mt-8 rounded-full">
          {running ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Start</>}
        </Button>
      </div>
    </AppShell>
  );
}
