"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutPhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="relative mx-auto aspect-[4/5] w-full max-w-sm md:max-w-md overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-xl group"
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-xl opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 rounded-2xl" />

      {/* Frame border highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-transparent to-border/40 p-[1px] transition-all duration-500 group-hover:from-primary/40 group-hover:to-purple-500/40" />

      {/* Image container */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <Image
          src="/photos/About.jpg"
          alt="Mohamed Fathi - About"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-20" />
      </div>
    </motion.div>
  );
}
