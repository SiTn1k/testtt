import { motion } from "motion/react";
import type { ReactNode, MouseEventHandler } from "react";

export function GlassCard({ children, className = "", onClick, hover = true }: { children: ReactNode; className?: string; onClick?: MouseEventHandler; hover?: boolean }) {
  return (
    <motion.div
      whileHover={onClick && hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
