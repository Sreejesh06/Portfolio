"use client";

// Refined ProjectCard with Ambient Backgrounds by Narsi
import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Github, Star, Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss3,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
} from "react-icons/si";
type TechIcon = ComponentType<{ className?: string }>;

type TechKey =
  | "next"
  | "ts"
  | "react"
  | "three"
  | "prisma"
  | "cloud"
  | "langchain"
  | "langgraph"
  | "rag"
  | "node"
  | "motion"
  | "tailwind"
  | "bun"
  | "eslint"
  | "radixui"
  | "charts"
  | "github"
  | "fastapi"
  | "redis"
  | "celery"
  | "tldraw"
  | "css3"
  | "python"
  | "anthropic"
  | "claude"
  | "gemini"
  | "llama";

type TechItem =
  | TechKey
  | {
      label: string;
      tooltip?: string;
    };

interface Project {
  title: string;
  src: string;
  lightModeSrc?: string;
  previewImage?: string;
  description: string;
  tech: TechItem[];
  github?: string;
  live?: string;
  status?: "live" | "coming-soon";
  starsText?: string;
  backgroundImage?: string;
}

const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs,
  ts: SiTypescript,
  react: SiReact,
  three: SiThreedotjs,
  prisma: SiPrisma,
  cloud: SiCloudflare,
  langchain: SiLangchain,
  langgraph: Network,
  rag: Search,
  node: SiNodedotjs,
  motion: SiFramer,
  tailwind: SiTailwindcss,
  bun: SiBun,
  eslint: SiEslint,
  radixui: SiRadixui,
  charts: SiChartdotjs,
  github: SiGithub,
  fastapi: SiFastapi,
  redis: SiRedis,
  celery: SiCelery,
  tldraw: SiTldraw,
  css3: SiCss3,
  python: SiPython,
  anthropic: SiAnthropic,
  claude: SiClaude,
  gemini: SiGooglegemini,
  llama: SiMeta,
};

const techNames: Record<TechKey, string> = {
  next: "Next.js",
  ts: "TypeScript",
  react: "React",
  three: "Three.js",
  prisma: "Prisma",
  cloud: "Cloudflare",
  langchain: "LangChain",
  langgraph: "LangGraph",
  rag: "RAG (Retrieval-Augmented Generation)",
  node: "Node.js",
  motion: "Framer Motion",
  tailwind: "Tailwind CSS",
  bun: "Bun",
  eslint: "ESLint",
  radixui: "Radix UI (shadcn/ui)",
  charts: "Charts (Recharts)",
  github: "GitHub API (Octokit)",
  fastapi: "FastAPI",
  redis: "Redis",
  celery: "Celery",
  tldraw: "tldraw",
  css3: "CSS3",
  python: "Python",
  anthropic: "Anthropic",
  claude: "Claude",
  gemini: "Gemini",
  llama: "LLaMA",
};



const ProjectCard = ({
  project,
  idx,
}: {
  project: Project;
  idx: number;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageSrc = mounted && theme === 'light' && project.lightModeSrc
    ? project.lightModeSrc
    : project.src;

  const projectDestination =
    project.status !== "coming-soon" ? project.live || project.github : project.github;

  const handleOpenProject = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (projectDestination) {
      window.open(projectDestination, "_blank", "noopener,noreferrer");
    }
  };

  // Clean, consistent gradients

  return (
    <motion.div
      className="group relative z-10 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-black hover:shadow-2xl hover:shadow-neutral-500/5"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="flex w-full cursor-pointer flex-col gap-4">
        {/* Image container wrapper - Clean style */}
        <div className="rounded-[12px] border border-neutral-200 dark:border-neutral-800 p-[4px] bg-neutral-50 dark:bg-neutral-900/50">

          {/* Main Image container */}
          <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 select-none">

            {/* Ambient Background - Image Style */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${project.backgroundImage || '/image.png'}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              variants={{
                rest: { opacity: 0, scale: 1 },
                hover: { opacity: 1, scale: 1.05 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />


            {/* Title - Subtler slide */}
            <motion.h1
              className="absolute top-2 left-2 text-[11px] font-bold font-custom text-neutral-500 dark:text-neutral-400 z-30 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              variants={{
                rest: {
                  left: "0.75rem",
                  top: "0.75rem",
                  x: "0%",
                  color: "var(--neutral-500)",
                  opacity: 0
                },
                hover: {
                  left: "50%",
                  top: "22%",
                  x: "-50%",
                  color: "#000000",
                  opacity: 1
                },
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              View Project
            </motion.h1>

            {/* CTA Button - Keeps interaction lightweight by opening destination directly */}
            <motion.div
              onClick={handleOpenProject}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
              variants={{
                rest: { scale: 0.5, opacity: 0 },
                hover: { scale: 1, opacity: 1 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
            >
              <div className="h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 border border-white/50">
                <svg className="w-5 h-5 text-neutral-900 ml-0.5 fill-current" viewBox="0 0 24 24">
                  <path d="M5.25 5.653v12.694c0 .856.926 1.39 1.668.958l11.1-6.347a1.125 1.125 0 000-1.916L6.918 4.695c-.742-.432-1.668.102-1.668.958z" />
                </svg>
              </div>
            </motion.div>

            {/* Floating screenshot - The signature Narsi move */}
            <motion.div
              onClick={handleOpenProject}
              className="absolute bottom-0 left-1/2 w-[82%] rounded-t-[6px] bg-white dark:bg-neutral-950 p-[2px] pb-0 shadow-2xl z-20 border-x border-t border-neutral-200 dark:border-neutral-800"
              variants={{
                rest: { height: "76%", y: 0, x: "-50%" },
                hover: { height: "70%", y: 4, x: "-50%" }, // floats down/shrinks slightly
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="size-full overflow-hidden rounded-t-[4px]">
                <Image
                  src={imageSrc}
                  alt={`${project.title} preview`}
                  width={600}
                  height={400}
                  className="size-full object-cover cursor-pointer"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-lg font-bold font-custom tracking-wide text-neutral-900 dark:text-neutral-100 transition-colors duration-300 truncate">
                {project.title}
              </h3>
              {project.starsText && (
                <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 px-2 py-0.5 text-[10px] font-medium font-custom2 text-neutral-700 dark:text-neutral-200 backdrop-blur">
                  <Star
                    size={12}
                    fill="currentColor"
                    className="text-amber-500/90 dark:text-amber-400"
                  />
                  <span>{project.starsText}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {project.live && project.status !== "coming-soon" && (
                <Globe
                  size={16}
                  onClick={(e) => { e.stopPropagation(); window.open(project.live, "_blank"); }}
                  className="opacity-50 hover:opacity-100 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
                />
              )}
              {project.github && (
                <Github
                  size={16}
                  onClick={(e) => { e.stopPropagation(); window.open(project.github, "_blank"); }}
                  className="opacity-50 hover:opacity-100 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
                />
              )}
            </div>
          </div>

          <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400 font-custom2 h-10 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors duration-300">
            {project.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex gap-3 flex-wrap">
              {project.tech.map((item) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const tooltipText = isIconItem ? techNames[item] : (item.tooltip || item.label);
              const uniqueId = `${project.title}-${key}`;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIcon = iconMap[item];
                      return (
                        <TechIcon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors" />
                      );
                    })()
                  ) : (
                    <span className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-[9px] font-custom2 text-neutral-500 dark:text-neutral-400 leading-none">
                      {item.label}
                    </span>
                  )}
                  <AnimatePresence>
                    {hoveredTech === uniqueId && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap font-custom2">
                          {tooltipText}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
              })}
            </div>

            {(() => {
              const isComingSoon = project.status === "coming-soon";

              const dotColor = isComingSoon ? "bg-amber-500" : "bg-emerald-500";

              const label = isComingSoon ? "Coming Soon" : "Live";

              return (
                <span className="shrink-0 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-3 py-1 text-[10px] font-medium font-custom2 text-neutral-700 dark:text-neutral-200">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} animate-[statusDotPulse_2.6s_ease-in-out_infinite] motion-reduce:animate-none`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
                  </span>
                  {label}
                </span>
              );
            })()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ showAll = false }: { showAll?: boolean }) => {
  const projects: Project[] = [
    {
      title: "Aegis",
      src: "/Aegis.png",
      lightModeSrc: "/Aegis.png",
      previewImage: "/Aegis.png",
      description: "A focused security platform designed to reduce user anxiety through clear threat states and confident interactions.",
      tech: ["next", "react", "ts", "tailwind", "motion"],
      github: "https://github.com/Tarunvoff/Aegis",
      live: "https://aegis-alpha-ebon.vercel.app",
      status: "live",
      backgroundImage: "/image copy 5.png",
    },
    {
      title: "Vaermai",
      src: "/vaermai.png",
      lightModeSrc: "/vaermai.png",
      previewImage: "/vaermai.png",
      description: "An immersive virtual herbal garden that nurtures curiosity and mindful learning through rich botanical storytelling.",
      tech: ["react", "ts", "tailwind", "node"],
      github: "https://github.com/sriram687/HERBA_VERSE",
      live: "https://virtual-herbal-garden-69307.web.app/",
      status: "live",
      backgroundImage: "/image copy 2.png",
    },
    {
      title: "Green11",
      src: "/green11.png",
      lightModeSrc: "/green11.png",
      previewImage: "/green11.png",
      description: "A sustainability-first experience that uses clear visual hierarchy to make greener choices feel effortless.",
      tech: [
        "next",
        "react",
        "ts",
        "tailwind",
      ],
      github: "https://github.com/Sreejesh06/Green11",
      live: "https://green11.vercel.app",
      status: "live",
      backgroundImage: "/image copy.png",
    },
    {
      title: "Ecofind",
      src: "/ecofind.png",
      lightModeSrc: "/ecofind.png",
      previewImage: "/ecofind.png",
      description: "A discovery engine for eco-conscious products built to reduce decision fatigue and improve trust.",
      tech: ["next", "ts", "tailwind", "react", "node"],
      github: "https://github.com/Sreejesh06/EcoFInds",
      live: "https://ecofinds-ten.vercel.app",
      status: "live",
      backgroundImage: "/image copy 3.png",
    },
    {
      title: "Threat Intelligence",
      src: "/Inquiro.png",
      lightModeSrc: "/Inquiro.png",
      previewImage: "/Inquiro.png",
      description: "A next-phase intelligence workspace currently in development for proactive threat visibility and response strategy.",
      tech: [
        "next",
        "ts",
        "node",
        "github",
        "react",
      ],
      status: "coming-soon",
      backgroundImage: "/image copy 4.png",
    },
  ];

  return (
    <div className="mt-8">
      {/* Subtitle */}
      <p
        className="
          font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px]
           text-sm inline-block
          bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border
        "
      >
        I love designing and building thoughtful, production-grade applications.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 py-8">
        {(showAll ? projects : projects.slice(0, 2)).map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <ProjectCard
              project={project}
              idx={idx}
            />
          </motion.div>
        ))}
      </div>

      {!showAll && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-4"
        >
          <Link href="/projects">
            <AnimatedButton className="group relative overflow-hidden rounded-lg 
                      bg-linear-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                      border border-neutral-200 dark:border-neutral-800 
                      text-neutral-800 dark:text-neutral-200 text-sm font-medium px-6 py-2.5 
                      transition-all duration-300 
                      hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-800
                      shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] 
                      dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              View all projects
            </AnimatedButton>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Projects;
