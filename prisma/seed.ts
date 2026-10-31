import { PrismaClient, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "mofathi2648@gmail.com" },
    update: {},
    create: {
      email: "mofathi2648@gmail.com",
      name: "Mohamed Fathi",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const settings = {
    siteTitle: "Mohamed Fathi | Full Stack Developer",
    metaDescription:
      "Portfolio of Mohamed Fathi, a Full Stack Developer specializing in Node.js, APIs, databases, and cloud infrastructure.",
    keywords:
      "Mohamed Fathi, Full Stack Developer, Node.js, PostgreSQL, API Development, Software Engineer, TypeScript",
    ogImage: "/og-image.png",
    email: "mofathi2648@gmail.com",
    linkedin: "https://www.linkedin.com/in/mohamed-fathi-102311315/",
    github: "https://github.com/Mohammedfathi7",
    facebook: "",
    resumeUrl: "/resumes.pdf",
    fullName: "Mohamed Fathi",
    title: "Full Stack Developer",
    location: "Egypt",
    phone: "",
    aboutSummary:
      "Passionate Full Stack Developer with expertise in building scalable applications, microservices, and robust database architectures. I focus on clean code, performance optimization, and delivering reliable solutions that scale.",
    education:
      "Bachelor's Degree in Computer Science — focused on software engineering, algorithms, and distributed systems.",
    careerGoals:
      "To architect and build high-performance backend systems that solve real-world problems, while continuously learning and contributing to the developer community.",
    technologiesUsed:
      "Node.js, TypeScript, Python, PostgreSQL, MongoDB, Redis, Docker, AWS, Git, REST APIs, GraphQL",
    heroIntro:
      "I build scalable backend systems and APIs that power modern applications. Passionate about clean architecture, performance, and developer experience.",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  const projects = [
    {
      title: "Conf1",
      slug: "conf1",
      description:
        "Official Arabic website for the 2027 Counseling and Guidance Conference, covering early psychological prevention with program details, speakers, partners, and direct WhatsApp contact.",
      longDescription:
        "A conference platform for the 2027 Counseling and Guidance Conference, presenting the event agenda, speakers, partners, mission, and visitor contact channels.",
      technologies: ["WordPress", "PHP", "CSS3"],
      githubUrl: null,
      liveUrl: "https://conf1.co/",
      featured: true,
      thumbnail: "/websites data/conf1.co.png",
      order: 1,
    },
    {
      title: "Rosos",
      slug: "rosos",
      description:
        "Bilingual corporate site for Rawabi Souss Trading Co., presenting procurement and fit-out services for major projects, supply sectors, quote requests, and WhatsApp-based sales contact.",
      longDescription:
        "A company website for Rawabi Souss Trading Co. that highlights supply sectors, quote requests, privacy policy, and bilingual navigation for procurement and project fit-out services.",
      technologies: ["Vite", "JavaScript"],
      githubUrl: null,
      liveUrl: "https://www.rosos.org/",
      featured: true,
      thumbnail: "/websites data/rosos.org.png",
      order: 2,
    },
    {
      title: "Temoxa",
      slug: "temoxa",
      description:
        "Free-to-shop e-commerce platform for electronics, digital games, and gaming accessories, with product browsing, cart, accounts, and a gaming hub for recharge and rewards.",
      longDescription:
        "Temoxa is a storefront for free products across digital games, smartphones, tablets, laptops, and gaming accessories, including cart, favorites, authentication, and a gaming hub.",
      technologies: ["Next.js", "React"],
      githubUrl: null,
      liveUrl: "https://temoxa.com/",
      featured: true,
      thumbnail: "/websites data/temoxa.com.png",
      order: 3,
    },
    {
      title: "My Portfolio",
      slug: "my-portfolio",
      description:
        "Arabic professional profile for a business development leader, with biography, management experience, qualifications, methodology, contact, and a downloadable PDF resume.",
      longDescription:
        "A polished Arabic profile site covering professional biography, management experience, qualifications, working methodology, contact, and a downloadable CV.",
      technologies: ["Next.js", "React"],
      githubUrl: null,
      liveUrl: "https://my-porfolio-95wr.vercel.app/",
      featured: true,
      thumbnail: "/websites data/my-portfolio.png",
      order: 4,
    },
    {
      title: "E-Commerce API Platform",
      slug: "ecommerce-api-platform",
      description:
        "A scalable RESTful API platform for e-commerce with authentication, payments, and inventory management.",
      longDescription:
        "Built a comprehensive e-commerce backend supporting multi-vendor operations, real-time inventory tracking, and secure payment processing with Stripe integration.",
      technologies: ["Node.js", "Express", "PostgreSQL", "Redis", "Stripe"],
      githubUrl: null,
      liveUrl: "https://api-demo.example.com",
      featured: false,
      challenges:
        "Handling high concurrent orders during peak sales while maintaining data consistency across inventory and payment systems.",
      solutions:
        "Implemented Redis-based distributed locking, database transactions with optimistic concurrency control, and a message queue for async order processing.",
      architecture:
        "Microservices architecture with API Gateway, separate services for Auth, Orders, Inventory, and Payments. PostgreSQL for primary data, Redis for caching and sessions.",
      thumbnail: "/uploads/project-ecommerce.jpg",
      order: 1,
    },
    {
      title: "Real-Time Chat Backend",
      slug: "realtime-chat-backend",
      description:
        "WebSocket-based real-time messaging system with rooms, presence, and message persistence.",
      longDescription:
        "A production-ready chat backend supporting private and group messaging, online presence indicators, typing indicators, and message history with pagination.",
      technologies: ["Node.js", "Socket.io", "MongoDB", "Redis", "JWT"],
      githubUrl: null,
      liveUrl: null,
      featured: false,
      challenges:
        "Scaling WebSocket connections across multiple server instances while maintaining message ordering and delivery guarantees.",
      solutions:
        "Used Redis Pub/Sub for cross-instance communication, MongoDB for message persistence with indexed queries, and sticky sessions with load balancer.",
      architecture:
        "Event-driven architecture with Socket.io adapter on Redis. Horizontal scaling with PM2 cluster mode and Nginx load balancing.",
      thumbnail: "/uploads/project-chat.jpg",
      order: 2,
    },
    {
      title: "Task Management API",
      slug: "task-management-api",
      description:
        "RESTful task management API with team collaboration, role-based access control, and activity logging.",
      longDescription:
        "Full-featured project management backend with workspaces, projects, tasks, comments, and comprehensive RBAC system.",
      technologies: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Docker"],
      githubUrl: "https://github.com/es1amnagm/task-api",
      liveUrl: "https://tasks-demo.example.com",
      featured: false,
      challenges:
        "Designing a flexible RBAC system that supports workspace-level and project-level permissions without performance overhead.",
      solutions:
        "Implemented permission caching with Redis, database-level row security policies, and middleware-based authorization checks.",
      architecture:
        "Modular monolith using NestJS with domain-driven design. PostgreSQL with Prisma ORM, Docker containerization for deployment.",
      thumbnail: "/uploads/project-tasks.jpg",
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  const skills: { name: string; category: SkillCategory; proficiency: number; order: number }[] = [
    { name: "Node.js", category: "BACKEND", proficiency: 95, order: 1 },
    { name: "TypeScript", category: "BACKEND", proficiency: 90, order: 2 },
    { name: "NestJS", category: "BACKEND", proficiency: 85, order: 3 },
    { name: "Express.js", category: "BACKEND", proficiency: 92, order: 4 },
    { name: "Python", category: "BACKEND", proficiency: 80, order: 5 },
    { name: "REST APIs", category: "BACKEND", proficiency: 95, order: 6 },
    { name: "GraphQL", category: "BACKEND", proficiency: 75, order: 7 },
    { name: "PostgreSQL", category: "DATABASE", proficiency: 90, order: 1 },
    { name: "MongoDB", category: "DATABASE", proficiency: 85, order: 2 },
    { name: "Redis", category: "DATABASE", proficiency: 88, order: 3 },
    { name: "Prisma ORM", category: "DATABASE", proficiency: 90, order: 4 },
    { name: "AWS", category: "CLOUD", proficiency: 80, order: 1 },
    { name: "Docker", category: "CLOUD", proficiency: 85, order: 2 },
    { name: "CI/CD", category: "CLOUD", proficiency: 78, order: 3 },
    { name: "Git", category: "TOOLS", proficiency: 92, order: 1 },
    { name: "Postman", category: "TOOLS", proficiency: 90, order: 2 },
    { name: "Linux", category: "TOOLS", proficiency: 85, order: 3 },
    { name: "Problem Solving", category: "SOFT_SKILLS", proficiency: 95, order: 1 },
    { name: "Team Collaboration", category: "SOFT_SKILLS", proficiency: 90, order: 2 },
    { name: "Communication", category: "SOFT_SKILLS", proficiency: 88, order: 3 },
  ];

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills });

  const certificates = [
    {
      title: "AWS Certified Developer – Associate",
      organization: "Amazon Web Services",
      issueDate: new Date("2024-06-15"),
      verificationCode: "AWS-DEV-2024-EN-12345",
      verificationUrl: "https://aws.amazon.com/verification",
      description: "Demonstrates expertise in developing and maintaining applications on AWS.",
      order: 1,
    },
    {
      title: "Node.js Application Developer",
      organization: "OpenJS Foundation",
      issueDate: new Date("2023-11-20"),
      verificationCode: "NODE-JS-2023-78901",
      description: "Validates skills in Node.js application development and best practices.",
      order: 2,
    },
    {
      title: "PostgreSQL Database Administrator",
      organization: "EnterpriseDB",
      issueDate: new Date("2023-08-10"),
      verificationCode: "PG-DBA-2023-45678",
      description: "Advanced PostgreSQL administration and optimization certification.",
      order: 3,
    },
  ];

  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({ data: certificates });

  const experiences = [
    {
      company: "Tech Solutions Inc.",
      position: "Senior Backend Developer",
      location: "Remote",
      startDate: new Date("2022-03-01"),
      endDate: null,
      current: true,
      description:
        "Lead backend development for enterprise SaaS products. Architected microservices handling 1M+ daily API requests. Mentored junior developers and established coding standards.",
      technologies: ["Node.js", "PostgreSQL", "Redis", "AWS", "Docker"],
      order: 1,
    },
    {
      company: "Digital Agency Co.",
      position: "Backend Developer",
      location: "Cairo, Egypt",
      startDate: new Date("2020-01-15"),
      endDate: new Date("2022-02-28"),
      current: false,
      description:
        "Developed RESTful APIs and integrated third-party services for client projects. Optimized database queries reducing response times by 40%. Implemented CI/CD pipelines.",
      technologies: ["Express.js", "MongoDB", "MySQL", "Git"],
      order: 2,
    },
    {
      company: "Startup Hub",
      position: "Junior Backend Developer",
      location: "Cairo, Egypt",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2019-12-31"),
      current: false,
      description:
        "Built backend features for MVP products. Worked with agile teams to deliver features on tight deadlines. Gained experience in API design and database modeling.",
      technologies: ["Node.js", "PostgreSQL", "Firebase"],
      order: 3,
    },
  ];

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({ data: experiences });

  console.log("✅ Database seeded successfully!");
  console.log("📧 Admin login: mofathi2648@gmail.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
