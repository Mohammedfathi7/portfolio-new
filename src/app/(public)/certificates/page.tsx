import fs from "fs";
import path from "path";
import { PageHeader } from "@/components/layout/page-header";
import { CertificatesList, type CertificateData } from "@/components/certificates/certificates-list";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Professional certifications and credentials of Mohamed Fathi.",
};

const PRELOADED_CERTIFICATES = [
  {
    id: "js-cert",
    title: "Java Certificate",
    type: "Certificate of Completion",
    organization: "Information Technology Institute (ITI) – Mahara-Tech Platform",
    student: "Mohamed Fathi",
    duration: "7 Hours",
    completionDate: "08/04/2026",
    verificationCode: "NyswpG96Qj",
    description: "Successfully completed the Javascript course provided by the Information Technology Institute (ITI) through the Mahara-Tech platform. The course covered JavaScript fundamentals, language features, programming concepts, and practical application development.",
    skills: ["JavaScript Fundamentals", "Variables and Data Types", "Functions", "Objects and Arrays", "ES6 Features", "DOM Manipulation", "Problem Solving", "Programming Logic"],
    featured: true,
    fileName: "java.png",
    techCategory: "JavaScript"
  },
  {
    id: "mongo-cert",
    title: "SQL Certificate",
    type: "Certificate of Completion",
    organization: "Information Technology Institute (ITI) – Mahara-Tech Platform",
    student: "Mohamed Fathi",
    duration: "1 Hour, 8 Minutes",
    completionDate: "22/04/2025",
    verificationCode: "fxlQf61IPD",
    description: "Successfully completed the Introduction to MongoDB course provided by the Information Technology Institute (ITI) through the Mahara-Tech platform. The course introduced NoSQL databases, MongoDB concepts, collections, documents, and basic database operations.",
    skills: ["MongoDB Fundamentals", "NoSQL Databases", "Collections and Documents", "CRUD Operations", "Database Concepts", "Data Modeling"],
    featured: false,
    fileName: "sql.png",
    techCategory: "Database"
  },
  {
    id: "node-cert",
    title: "Node Certificate",
    type: "Certificate of Completion",
    organization: "Information Technology Institute (ITI) – Mahara-Tech Platform",
    student: "Mohamed Fathi",
    duration: "8 Hours, 5 Minutes",
    completionDate: "19/04/2026",
    verificationCode: "ZSuZGSB54H",
    description: "Successfully completed an intensive Node.js course focused on building RESTful APIs using Node.js, Express.js, and MongoDB. The course covered backend development principles, API design, database integration, and modern server-side application development.",
    skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Backend Development", "Routing", "Middleware", "API Design", "Database Integration", "Server-side JavaScript"],
    featured: true,
    fileName: "node.png",
    techCategory: "Backend"
  },
  {
    id: "sql-cert",
    title: "API Certificate",
    type: "Certificate of Completion",
    organization: "Information Technology Institute (ITI) – Mahara-Tech Platform",
    student: "Mohamed Fathi",
    duration: "8 Hours, 2 Minutes",
    completionDate: "17/04/2025",
    verificationCode: "o1IL1qp3P6",
    description: "Successfully completed the Transact SQL Queries Using SQL Server course provided by the Information Technology Institute (ITI). The course focused on writing SQL queries, joins, aggregations, database operations, and data retrieval techniques using Microsoft SQL Server.",
    skills: ["SQL", "T-SQL", "SQL Server", "Database Design", "Joins", "Aggregations", "Data Retrieval", "Query Optimization"],
    featured: true,
    fileName: "api.png",
    techCategory: "Database"
  }
];

export default async function CertificatesPage() {
  const certDir = path.join(process.cwd(), "public", "certificates");
  let files: string[] = [];

  try {
    if (fs.existsSync(certDir)) {
      files = fs.readdirSync(certDir);
    }
  } catch (err) {
    console.error("Failed to read certificates folder", err);
  }

  // Parse files and map to certificates
  const certificates: CertificateData[] = [];
  const mappedFiles = new Set<string>();

  // 1. Process preloaded certificates and check if their files exist
  PRELOADED_CERTIFICATES.forEach((pre) => {
    // We assume the file exists since we copied them, but fallback to direct serving if not
    const hasImage = files.some(f => f.toLowerCase() === pre.fileName.toLowerCase());
    const matchedImageName = hasImage 
      ? files.find(f => f.toLowerCase() === pre.fileName.toLowerCase())! 
      : pre.fileName;
    
    if (hasImage) {
      mappedFiles.add(matchedImageName);
    }

    // Check if a PDF version exists for download (e.g. "js certificate.pdf")
    const baseName = pre.fileName.substring(0, pre.fileName.lastIndexOf("."));
    const pdfName = `${baseName}.pdf`;
    const hasPdf = files.some(f => f.toLowerCase() === pdfName.toLowerCase());
    const matchedPdfName = hasPdf 
      ? files.find(f => f.toLowerCase() === pdfName.toLowerCase())! 
      : null;

    certificates.push({
      id: pre.id,
      title: pre.title,
      type: pre.type,
      organization: pre.organization,
      student: pre.student,
      duration: pre.duration,
      completionDate: pre.completionDate,
      verificationCode: pre.verificationCode,
      description: pre.description,
      skills: pre.skills,
      featured: pre.featured,
      imageUrl: `/certificates/${matchedImageName}`,
      pdfUrl: hasPdf ? `/certificates/${matchedPdfName}` : null,
      hasPdf,
      techCategory: pre.techCategory
    });
  });

  // 2. Process any other certificate files dynamically (if they were not already mapped)
  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext) && !mappedFiles.has(file)) {
      const baseName = path.basename(file, ext);
      
      // Check if a matching PDF exists
      const pdfName = `${baseName}.pdf`;
      const hasPdf = files.some(f => f.toLowerCase() === pdfName.toLowerCase());
      const matchedPdfName = hasPdf ? files.find(f => f.toLowerCase() === pdfName.toLowerCase())! : null;

      // Extract technology category from name
      let techCategory = "Backend";
      if (baseName.toLowerCase().includes("js") || baseName.toLowerCase().includes("javascript")) {
        techCategory = "JavaScript";
      } else if (baseName.toLowerCase().includes("sql") || baseName.toLowerCase().includes("mongo") || baseName.toLowerCase().includes("db")) {
        techCategory = "Database";
      }

      // Title formatting
      const title = baseName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      certificates.push({
        id: `dynamic-${baseName}`,
        title,
        type: "Certificate of Completion",
        organization: "Information Technology Institute (ITI)",
        student: "Mohamed Fathi",
        duration: "N/A",
        completionDate: "N/A",
        verificationCode: "N/A",
        description: `Successfully completed the course for ${title}.`,
        skills: [techCategory],
        featured: false,
        imageUrl: `/certificates/${file}`,
        pdfUrl: hasPdf ? `/certificates/${matchedPdfName}` : null,
        hasPdf,
        techCategory
      });
    }
  });

  // 3. Fallback: query database certificates if connected and merge them
  try {
    const dbCerts = await prisma.certificate.findMany({
      orderBy: { order: "asc" }
    });
    
    dbCerts.forEach((dbCert) => {
      // Avoid duplicates by checking title
      if (!certificates.some(c => c.title.toLowerCase() === dbCert.title.toLowerCase())) {
        certificates.push({
          id: dbCert.id,
          title: dbCert.title,
          type: "Certification",
          organization: dbCert.organization,
          student: "Mohamed Fathi",
          duration: "N/A",
          completionDate: dbCert.issueDate ? new Date(dbCert.issueDate).toLocaleDateString() : "N/A",
          verificationCode: dbCert.verificationCode ?? "N/A",
          description: dbCert.description ?? "",
          skills: [],
          featured: false,
          imageUrl: dbCert.imageUrl ?? "/placeholder.png",
          pdfUrl: null,
          hasPdf: false,
          techCategory: "Backend"
        });
      }
    });
  } catch (error) {
    // Database connection failed, proceed with filesystem certificates
    console.log("Database fetch bypassed for certificates (using filesystem preloads).");
  }

  // Sort certificates: featured first, then by completion date or title
  certificates.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <PageHeader
        badge="Credentials"
        title="Certificates & Badges"
        description="A list of my verified learning credentials, certifications, and technical completions."
      />

      <div className="container mx-auto px-4 py-16">
        <CertificatesList initialCertificates={certificates} />
      </div>
    </>
  );
}
