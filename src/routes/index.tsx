import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, MessageCircleHeart, Brain, Moon, Wind, ShieldCheck,
  HeartPulse, LineChart, Lock, ArrowRight, Star,
} from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";
import { FloatingScene } from "@/components/floating-scene";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurora — Your private AI mental health companion" },
      { name: "description", content: "Chat with a warm AI counselor, track mood, journal, and breathe. Private, judgment-free, always available." },
      { property: "og:title", content: "Aurora — Your private AI mental health companion" },
      { property: "og:description", content: "Chat with a warm AI counselor, track mood, journal, and breathe." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessageCircleHeart, title: "Empathetic AI chat", desc: "A calm, non-judgmental space to talk anything through — anytime." },
  { icon: Brain, title: "CBT-informed", desc: "Gentle reframing, thought records, and coping tools rooted in evidence." },
  { icon: HeartPulse, title: "Mood & journal", desc: "Track how you feel, notice patterns, and celebrate small wins." },
  { icon: Wind, title: "Breathing & meditation", desc: "Guided box-breathing, 4-7-8, and short meditations when you need them." },
  { icon: LineChart, title: "Wellness insights", desc: "Weekly summaries so you can see progress instead of guessing." },
  { icon: Lock, title: "Private by design", desc: "Your conversations are yours. Encrypted in transit, scoped to your account." },
];

const testimonials = [
  { name: "Priya", role: "Design lead", quote: "It's the first thing that actually helped me unpack a hard week without judgment." },
  { name: "Marcus", role: "Grad student", quote: "The breathing timer + a quick reframe got me through finals week." },
  { name: "Elena", role: "New parent", quote: "Feels like a friend who knows CBT. I use it at 3am when I can't sleep." },
];

const faqs = [
  { q: "Is Aurora a replacement for therapy?", a: "No. Aurora is a supportive companion — not a licensed therapist and not a substitute for professional care or crisis services. If you're in crisis, use the Get help now button." },
  { q: "Is my data private?", a: "Yes. Conversations are stored in your account, protected by row-level security, and never shared. You can delete them at any time." },
  { q: "What AI powers this?", a: "Llama 3.3 70B via Groq — one of the fastest inference stacks available — with a mental-health system prompt tuned for warmth and safety." },
  { q: "How much does it cost?", a: "Free while in beta. Premium features (voice, exports, deeper reports) will come later." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Aurora</span>
          </Link>
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#preview" className="hover:text-foreground">Preview</a>
            <a href="#testimonials" className="hover:text-foreground">Stories</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link to="/auth" className="btn-brand ring-brand rounded-full px-4 py-2 text-sm font-medium">Get started</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <AuroraBackground />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pt-20 pb-28 md:grid-cols-2 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col justify-center"
          >
            <div className="glass mb-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_#06B6D4]" />
              Powered by Llama 3.3 70B · Groq
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              A gentler mind, <br />
              <span className="text-gradient">one conversation</span> at a time.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Aurora is your private AI mental health companion — for the anxious mornings, the heavy evenings, and everything in between.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="btn-brand ring-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="glass ring-brand inline-flex items-center rounded-full px-6 py-3 text-sm">
                Explore features
              </a>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["#6366F1","#8B5CF6","#06B6D4"].map((c) => (
                  <div key={c} className="h-7 w-7 rounded-full border-2 border-background" style={{ background: c }} />
                ))}
              </div>
              <div>Loved by thousands · <span className="text-foreground">4.9 ★</span></div>
            </div>
          </motion.div>

          <div className="relative h-[420px] md:h-[520px]">
            <FloatingScene />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-strong absolute right-2 bottom-8 w-72 rounded-2xl p-4 sm:right-8"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-success" /> Aurora
              </div>
              <p className="mt-2 text-sm">
                That sounds exhausting. Let&apos;s slow down for a moment — can you tell me one thing that felt heavy today?
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass absolute top-6 left-2 w-56 rounded-2xl p-4 sm:left-6"
            >
              <div className="text-xs text-muted-foreground">Mood today</div>
              <div className="text-gradient mt-1 text-3xl font-semibold">7.4<span className="text-base text-muted-foreground"> / 10</span></div>
              <div className="mt-2 flex gap-1">
                {[3,5,4,6,7,8,7].map((v,i) => (
                  <div key={i} className="flex-1 rounded-full" style={{ background: "var(--gradient-brand)", height: v * 4, opacity: 0.4 + v/20 }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to feel <span className="text-gradient">a little lighter</span></h2>
          <p className="mt-4 text-muted-foreground">A calm toolkit for daily mental wellness — built with care, grounded in evidence.</p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-white/20"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="glass-strong overflow-hidden rounded-3xl p-1">
          <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] p-6 sm:p-10" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10), rgba(6,182,212,0.08))" }}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-accent">Preview</div>
                <h3 className="mt-2 text-3xl font-bold">Talk it through, at your pace.</h3>
                <p className="mt-3 text-muted-foreground">Streaming responses feel like a real conversation. Aurora listens, reflects, and gently guides — never lectures.</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {["Streaming replies in <200ms","Markdown & code blocks","Voice input (coming)","Export conversations to PDF (coming)"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-4">
                <ChatBubble who="You" text="I have a big presentation tomorrow and I can't sleep." />
                <ChatBubble who="Aurora" text="That's a lot to hold at once. Before we prep, let's take one slow breath — in for 4, out for 6. What part of tomorrow feels heaviest?" you={false} />
                <ChatBubble who="You" text="That people will notice I'm nervous." />
                <ChatBubble who="Aurora" text="A really common fear. What's one small thing you already know about presenting well?" you={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">People feel <span className="text-gradient">seen</span></h2>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-3xl p-6">
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Questions, answered</h2>
        <Accordion type="single" collapsible className="glass mt-10 rounded-3xl px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center">
          <AuroraBackground />
          <div className="relative">
            <Moon className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Give tonight a softer landing.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Create your free account. Start a conversation. Come back whenever you need.</p>
            <Link to="/auth" className="btn-brand ring-brand mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            © {new Date().getFullYear()} Aurora. Made with care.
          </div>
          <div>Not a substitute for medical care. In crisis? Call 988 (US) or your local hotline.</div>
        </div>
      </footer>
    </div>
  );
}

function ChatBubble({ who, text, you = true }: { who: string; text: string; you?: boolean }) {
  return (
    <div className={`mb-3 flex ${you ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${you ? "text-white" : "glass"} `} style={you ? { background: "var(--gradient-brand)" } : undefined}>
        <div className={`mb-0.5 text-[10px] uppercase tracking-wider ${you ? "text-white/70" : "text-muted-foreground"}`}>{who}</div>
        {text}
      </div>
    </div>
  );
}
