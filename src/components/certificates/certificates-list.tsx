"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, Clock, Download, ExternalLink, ShieldCheck, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CertificateData {
  id: string;
  title: string;
  type: string;
  organization: string;
  student: string;
  duration: string;
  completionDate: string;
  verificationCode: string;
  description: string;
  skills: string[];
  featured: boolean;
  imageUrl: string;
  pdfUrl?: string | null;
  hasPdf: boolean;
  techCategory: string; // for filtering
}

interface CertificatesListProps {
  initialCertificates: CertificateData[];
}

const CATEGORIES = ["All", "JavaScript", "Backend", "Database"];

export function CertificatesList({ initialCertificates }: CertificatesListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const filteredCertificates = initialCertificates.filter((cert) => {
    if (activeCategory === "All") return true;
    return cert.techCategory.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-12">
      {/* Interactive Filtering Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border/40 pb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Responsive Certificates Grid */}
      <motion.div
        layout
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredCertificates.map((cert) => (
            <motion.div
              layout
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedCert(cert)}
              className="cursor-pointer"
            >
              <Card
                className={`relative h-full overflow-hidden transition-all duration-300 border-border/60 hover:shadow-2xl hover:-translate-y-1 group bg-card/50 backdrop-blur-sm ${
                  cert.featured
                    ? "ring-2 ring-primary/40 dark:ring-primary/20 bg-gradient-to-b from-primary/5 via-card to-card"
                    : ""
                }`}
              >
                {/* Featured Badge */}
                {cert.featured && (
                  <div className="absolute right-0 top-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                    <div className="absolute top-4 -right-8 w-36 bg-gradient-to-r from-amber-500 to-primary py-1 text-center text-[10px] font-bold uppercase tracking-wider text-primary-foreground rotate-45 shadow-sm">
                      Featured
                    </div>
                  </div>
                )}

                {/* Aspect Ratio Certificate Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/40">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2 pointer-events-none">
                      <Award className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {/* ITI stylized logo */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-500 to-red-600 text-white font-black text-xs shadow-md select-none">
                      ITI
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {cert.title}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground font-medium">
                        {cert.organization}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary/75" />
                      {cert.completionDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary/75" />
                      {cert.duration}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2 leading-relaxed text-muted-foreground">
                    {cert.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <Badge variant="secondary" className="font-mono text-[10px] tracking-wider py-0.5 px-2 bg-muted/60">
                      Code: {cert.verificationCode}
                    </Badge>
                    
                    {cert.hasPdf && (
                      <span className="text-xs text-primary flex items-center gap-1 font-semibold">
                        PDF Available
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Certificate Details Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
            >
              {/* Left Side: Large Certificate Image */}
              <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto bg-muted md:min-h-[500px]">
                <Image
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  fill
                  className="object-contain p-2 md:p-6"
                />
              </div>

              {/* Right Side: Detailed Info */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh] flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
                <div className="space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {selectedCert.type}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground leading-tight">
                        {selectedCert.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close details"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3.5 border-y border-border/40 py-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">Issuer:</span>
                      <span className="col-span-2 font-semibold">{selectedCert.organization}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">Student:</span>
                      <span className="col-span-2 font-semibold">{selectedCert.student}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">Date:</span>
                      <span className="col-span-2 font-semibold flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary/75" />
                        {selectedCert.completionDate}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">Duration:</span>
                      <span className="col-span-2 font-semibold flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary/75" />
                        {selectedCert.duration}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">Code:</span>
                      <span className="col-span-2 font-mono font-bold text-xs select-all text-primary flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        {selectedCert.verificationCode}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Course Description</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {selectedCert.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Skills Acquired</h4>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {selectedCert.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs py-0.5 px-2 bg-muted/65 hover:bg-muted transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                  {selectedCert.pdfUrl && selectedCert.hasPdf && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-border/20">
                      <Button className="w-full gap-2" asChild>
                        <a href={selectedCert.pdfUrl} download>
                          <Download className="h-4 w-4" />
                          Download Certificate
                        </a>
                      </Button>
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
