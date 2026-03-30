import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
} from "react-icons/si";
import { IconType } from "react-icons";

type TechKey =
  | "next"
  | "ts"
  | "react"
  | "three"
  | "prisma"
  | "cloud"
  | "langchain"
  | "node";

const iconMap: Record<TechKey, IconType> = {
  next: SiNextdotjs,
  ts: SiTypescript,
  react: SiReact,
  three: SiThreedotjs,
  prisma: SiPrisma,
  cloud: SiCloudflare,
  langchain: SiLangchain,
  node: SiNodedotjs,
};

const techNames: Record<TechKey, string> = {
  next: "Next.js",
  ts: "TypeScript",
  react: "React",
  three: "Three.js",
  prisma: "Prisma",
  cloud: "Cloudflare",
  langchain: "LangChain",
  node: "Node.js",
};

type Data = {
  title: string;
  href?: string;
  content: {
    title: string;
    description: string;
    src: string;
    href: string;
    tech?: TechKey[];
    type?: string;
    dates?: string;
    location?: string;
    imageFit?: "contain" | "cover";
    imageZoom?: number;
  }[];
};

export const Timeline = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  // Track which experience is open (by index)
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const data: Data[] = [
    {
      title: "FOSSEE Winter Intern",
      href: "https://summerofcode.withgoogle.com/",
      content: [
        {
          title: "Indian Institute of Technology, Bombay",
          description: `
            Working on the web component of Osdag software
            Developing and improving the web interface and backend integrations
            Focused on making Osdag smoother, faster, and more accessible online
          `,
          src: "/Experience-image/iit-bombay.png",
          href: "https://fossee.in/",
          tech: ["next", "ts", "react", "node"],
          type: "Internship",
          dates: "Dec 2025 - Present",
          location: "Mumbai, Maharashtra, India · Remote",
          imageFit: "contain",
          imageZoom: 0.9,
        },
      ],
    },
    {
      title: "Technical Lead @ CFI",
      href: "https://www.linkedin.com/school/sri-eshwar-college-of-engineering/",
      content: [
        {
          title: "Sri Eshwar College of Engineering",
          description: `
            Leading technical initiatives under CFI
            Managing event and project execution with student teams
            Supporting planning, coordination, and hands-on implementation
          `,
          src: "/Experience-image/sece.png",
          href: "https://www.linkedin.com/school/sri-eshwar-college-of-engineering/",
          tech: ["react", "node", "ts"],
          dates: "Apr 2025 - Present",
          location: "Coimbatore, India",
          imageFit: "contain",
          imageZoom: 1.1,
        },
      ],
    },
    {
      title: "Co-Founder",
      href: "https://www.linkedin.com/company/collabia/",
      content: [
        {
          title: "Collabia · Self-employed",
          description: `
            Built a student-driven tech community focused on collaboration and peer growth
            Organized projects, hackathons, open-source activities, and domain sessions
            Created hands-on learning paths for practical experience and knowledge sharing
          `,
          src: "/Experience-image/collabia.png",
          href: "https://www.linkedin.com/company/collabia/",
          tech: ["react", "node", "ts"],
          dates: "Mar 2025 - Present",
          location: "Remote",
          imageFit: "contain",
          imageZoom: 1.2,
        },
      ],
    },
    {
      title: "Open Source Contributor",
      href: "https://github.com/Sreejesh06",
      content: [
        {
          title: "Social (Formerly Script Foundation)",
          description: `
            Contributed to open-source initiatives during SSOC
            Worked with the community through collaborative development cycles
            Delivered contributions and earned SSOC participation recognition
          `,
          src: "/Experience-image/social-formerly-script-foundation.png",
          href: "https://github.com/Sreejesh06",
          tech: ["react", "ts"],
          dates: "Jun 2025 - Aug 2025",
          location: "Remote",
          imageFit: "contain",
          imageZoom: 0.9,
        },
      ],
    },
    {
      title: "Web Development Intern",
      href: "https://www.gaotek.com/",
      content: [
        {
          title: "GAOTek Inc. · Internship",
          description: `
            Designed and developed WordPress websites with Elementor, Gutenberg, and WPBakery
            Customized themes, templates, and child themes to match brand requirements
            Built responsive layouts and improved site speed and SEO performance
            Troubleshot WordPress issues remotely and stayed aligned with latest web trends
          `,
          src: "/Experience-image/gaotek-inc.png",
          href: "https://www.gaotek.com/",
          tech: ["react", "node"],
          type: "Internship",
          dates: "Jul 2024 - Oct 2024",
          location: "United States · Remote",
          imageFit: "contain",
          imageZoom: 1.1,
        },
      ],
    }
  ];

  return (
    <div>

      <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-950 dark:text-neutral-50 pb-2 mt-2">
        <span className="link--elara">Experiences</span>
      </h1>
      <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-4 -mx-2 md:-mx-14"></div>
      <div className="flex flex-col gap-4">
        {data.map((year, idx) => (
          <div key={year.title} className="relative pb-2 -mx-2 md:-mx-14 px-2 md:px-14">
            {year.content.map((item, cidx) => {
              const isOpen = openIdx === idx * 100 + cidx;
              return (
                <React.Fragment key={item.title}>
                  <div
                    className="flex items-center gap-4 group py-3 cursor-pointer"
                    onClick={() => setOpenIdx(isOpen ? null : idx * 100 + cidx)}
                  >
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-lg border border-neutral-200/80 dark:border-neutral-700 p-[2px] bg-neutral-50 dark:bg-neutral-900 shrink-0">
                      <div
                        className={`w-full h-full rounded-md border border-neutral-200/60 dark:border-neutral-700/70 overflow-hidden ${item.imageFit === 'contain' ? 'bg-neutral-50 dark:bg-neutral-50' : 'bg-neutral-50 dark:bg-neutral-900'}`}
                      >
                        <Image
                          src={item.src}
                          alt={item.title}
                          width={48}
                          height={48}
                          style={item.imageZoom ? { transform: `scale(${item.imageZoom})` } : undefined}
                          className={`${item.imageFit === 'contain' ? 'object-contain' : 'object-cover'} w-full h-full`}
                        />
                      </div>
                    </div>
                    {/* Main summary info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base md:text-lg text-neutral-950 dark:text-neutral-50 truncate">
                          {item.title}
                        </span>
                        {/* Optional: Full Time/Intern/Other badge */}
                        {item.type && (
                          <span className="ml-2 px-2 py-0.5 rounded bg-neutral-700 text-xs text-neutral-100 font-medium border border-neutral-600">
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Dates and location */}
                    <div className="text-right min-w-[120px]">
                      <div className="text-xs md:text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                        {item.dates || item.title}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.location || "Remote"}
                      </div>
                    </div>
                    {/* See/Arrow button */}
                    <div
                      className="ml-2 flex items-center justify-center w-7 h-7 p-0 bg-transparent border-none shadow-none focus:outline-none group"
                    >
                      <FiChevronDown
                        className={`w-5 h-5 transition-transform duration-300 stroke-[2.2] ${isOpen ? 'rotate-180 text-neutral-950 dark:text-neutral-50' : 'text-neutral-500 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-neutral-50'}`}
                        aria-hidden="true"
                      />
                      <span className="sr-only">{isOpen ? 'Hide details' : 'Show details'}</span>
                    </div>
                  </div>
                  {/* Details section with smooth accordion animation */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      {/* Inner container for padding control */}
                      <div className={`${isOpen ? 'py-4 opacity-100 translate-y-0' : 'py-0 opacity-0 -translate-y-2'} transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]`}>
                        <ul className="mb-4 list-disc list-inside pl-0 text-neutral-800 dark:text-neutral-200 text-sm space-y-2">
                          {item.description
                            .toString()
                            .split("\n")
                            .filter((line) => line.trim() !== "")
                            .map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                        </ul>
                        {/* Tech icons */}
                        {item.tech && (
                          <div className="flex flex-wrap gap-2">
                            {item.tech.map((key) => {
                              const name = techNames[key];
                              return (
                                <div
                                  key={key}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-950 dark:text-neutral-200 shadow-sm"
                                >
                                  {name}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {idx !== data.length - 1 && (
              <div
                className="absolute bottom-0 left-0 w-full h-[1px] opacity-100 dark:opacity-15"
                style={{
                  backgroundImage: "linear-gradient(to right, var(--pattern-fg) 50%, transparent 50%)",
                  backgroundSize: "15px 1px",
                  backgroundRepeat: "repeat-x"
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
