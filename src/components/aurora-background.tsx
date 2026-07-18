import { motion } from "framer-motion";

export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="aurora-blob"
        style={{ background: "#6366F1", width: 520, height: 520, top: -120, left: -120 }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora-blob"
        style={{ background: "#8B5CF6", width: 460, height: 460, top: 120, right: -140 }}
        animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora-blob"
        style={{ background: "#06B6D4", width: 420, height: 420, bottom: -160, left: "30%" }}
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
