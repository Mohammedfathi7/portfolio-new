"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ROLES = ["Web Designer", "Full Stack Developer", "Software Engineer"];

type HeroSectionProps = {
  fullName: string;
  heroIntro: string;
  resumeUrl?: string | null;
  github?: string | null;
  linkedin?: string | null;
  email?: string | null;
};

function TypingRoles() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      const speed = isDeleting ? 45 : 90;
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentRole.slice(0, displayText.length - 1)
            : currentRole.slice(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <p className="flex min-h-[2.5rem] items-center text-xl text-muted-foreground md:min-h-[3rem] md:text-2xl">
      <span className="text-gradient font-semibold">{displayText}</span>
      <motion.span
        aria-hidden
        className="ml-1 inline-block h-6 w-[3px] rounded-full bg-primary md:h-7"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </p>
  );
}

function ProfileImage({ alt }: { alt: string }) {
  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center [perspective:1200px]">
      <motion.div
        className="relative aspect-square w-[280px] sm:w-[360px] md:w-[400px] cursor-pointer group"
        initial={false}
        animate={{
          rotateX: 8,
          rotateY: -10,
          rotateZ: -2,
          y: 8,
        }}
        whileHover={{
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          y: 0,
          scale: 1.03,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/40 via-purple-600/30 to-pink-500/40 opacity-70 blur-2xl group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        
        {/* Animated Glow Border */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 p-[3px] shadow-2xl shadow-primary/20 transition-transform duration-500 group-hover:rotate-180">
          <div className="h-full w-full rounded-full bg-background" />
        </div>

        {/* Circular Image Wrapper */}
        <div className="absolute inset-[3px] overflow-hidden rounded-full border-[6px] border-background bg-card shadow-inner">
          <Image
            src="/photos/my.jpg"
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 400px"
            className="object-cover scale-[1.18] transition-transform duration-700 ease-out group-hover:scale-[1.28]"
            style={{ objectPosition: "center 15%" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ScrollArrow() {
  return (
    <motion.a
      href="#featured"
      aria-label="Scroll to featured projects"
      className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
      <ChevronDown className="h-6 w-6" />
    </motion.a>
  );
}

export function HeroSection({
  fullName,
  heroIntro,
  resumeUrl,
  github,
  linkedin,
  email,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pb-16 md:pb-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="rounded-full px-4 py-1">
              Available for opportunities
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Hi, I&apos;m <span className="text-gradient">{fullName}</span>
            </h1>
            <TypingRoles />
            <p className="max-w-xl text-lg text-muted-foreground">{heroIntro}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/projects">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {resumeUrl && (
                <Button variant="outline" size="lg" asChild>
                  <a href={resumeUrl} download>
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              )}
            </div>
            <div className="flex gap-4 pt-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {email && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <ProfileImage alt={fullName} />
          </motion.div>
        </div>
      </div>
      <ScrollArrow />
    </section>
  );
}
