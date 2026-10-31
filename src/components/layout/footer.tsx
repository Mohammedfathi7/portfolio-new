import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Mohamed Fathi</h3>
            <p className="text-sm text-muted-foreground">
              Full Stack Developer building scalable applications with a focus on performance and clean architecture.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="hover:text-foreground text-muted-foreground transition-colors">Projects</Link></li>
              <li><Link href="/about" className="hover:text-foreground text-muted-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground text-muted-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex gap-3">
              {settings.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mohamed Fathi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
