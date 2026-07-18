import { AlertTriangle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CrisisBanner() {
  return (
    <div className="glass mb-4 flex flex-col gap-2 rounded-2xl px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2 text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
        <p>
          <span className="text-foreground font-medium">Not a substitute for professional care.</span>{" "}
          If you&apos;re in crisis, please reach out to a trained human right now.
        </p>
      </div>
      <CrisisDialog />
    </div>
  );
}

export function CrisisDialog({ variant = "outline" as const }: { variant?: "outline" | "default" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className="gap-2 rounded-full">
          <Phone className="h-4 w-4" /> Get help now
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong border-white/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-gradient text-xl">You are not alone</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            If you&apos;re thinking about self-harm or suicide, please contact a crisis service. They&apos;re free, confidential, and staffed 24/7.
          </p>
          <ul className="space-y-2">
            <li className="glass rounded-xl p-3">
              <div className="font-semibold">🇺🇸 988 Suicide & Crisis Lifeline</div>
              <div className="text-muted-foreground">Call or text <span className="text-foreground font-medium">988</span></div>
            </li>
            <li className="glass rounded-xl p-3">
              <div className="font-semibold">🇬🇧 Samaritans</div>
              <div className="text-muted-foreground">Call <span className="text-foreground font-medium">116 123</span></div>
            </li>
            <li className="glass rounded-xl p-3">
              <div className="font-semibold">🇮🇳 iCall</div>
              <div className="text-muted-foreground">Call <span className="text-foreground font-medium">+91 9152987821</span></div>
            </li>
            <li className="glass rounded-xl p-3">
              <div className="font-semibold">🌍 International</div>
              <div className="text-muted-foreground">
                Visit <a className="text-accent underline" href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>
              </div>
            </li>
            <li className="glass rounded-xl p-3">
              <div className="font-semibold">🚨 Emergency services</div>
              <div className="text-muted-foreground">If you&apos;re in immediate danger, call your local emergency number (911, 112, 999).</div>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
