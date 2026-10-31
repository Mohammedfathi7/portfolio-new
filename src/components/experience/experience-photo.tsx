"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ExperiencePhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-xl group"
    >
      {/* Background radial glow */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-primary/10 via-purple-500/10 to-transparent blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl" />

      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src="/photos/Experience.jpg"
          alt="Professional Journey"
          fill
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-60" />
      </div>

      <div className="relative p-6 bg-card border-t border-border/50">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Milestones</h4>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Building and shipping production systems. Emphasizing clean structure, automated tests, and performance optimization.
        </p>
      </div>
    </motion.div>
  );
}
