"use client";

import React, { useState } from "react";
import Image from "next/image";
import Container from "@/components/containers";
import { motion } from "framer-motion";

const achievements = [
  {
    id: 1,
    title: "Adya AI Hackathon '25",
    subtitle: "National Winner (Google Recognized)",
    description: "Secured 1st place among 300+ teams nationwide. Won 1 Lakh Prize (Cash + AWS Credits) along with an Internship & PPO offer.",
    image: "/adya.jpg",
    tags: ["Hackathon", "Winner", "Adya AI", "Google"],
  },
  {
    id: 2,
    title: "Hack Beyond Limits",
    subtitle: "Best UI/UX Award",
    description: "Awarded Best UI/UX with vouchers worth Rs. 30,000. Crafted an aesthetically breathtaking and deeply functional interface under 24 hours.",
    image: "/hackathon.jpg",
    tags: ["UI/UX", "Hackathon"],
  },
  {
    id: 3,
    title: "Createathon 2024",
    subtitle: "First Place - Web Hackathon",
    description: "Won First Place. Rapidly prototyped and delivered a robust, top-tier web solution.",
    image: "/createathon.jpg",
    tags: ["First Place", "Web Dev"],
  },
  {
    id: 4,
    title: "FOSSEE Intern @ IIT Bombay",
    subtitle: "Winter Internship Selection",
    description: "Selected from an elite pool for a 6-month winter internship at IIT Bombay for Web-Based App & OSDAG Projects.",
    image: "/fossee.jpg",
    tags: ["Internship", "IIT Bombay"],
  },
  {
    id: 5,
    title: "Ideathon 2025",
    subtitle: "Ignite Ideas Awardee",
    description: "Recognized as a top innovator. Pitched a market-ready, forward-thinking solution that captivated the judges.",
    image: "/ideathon.jpg",
    tags: ["Ideathon", "Innovation"],
  }
];

export default function AchievementsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Container className="min-h-[200vh] px-8 pt-24 md:p-20 md:pb-10 mx-auto">
      {/* RIGHT BORDER */}
      <div
        className="absolute right-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
          bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
          bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
      ></div>

      {/* LEFT BORDER */}
      <div
        className="absolute left-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
          bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
          bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
      ></div>

      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-semibold text-3xl tracking-tight ">
        <span className="link--elara">Achievements</span>
      </h1>

      <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mt-4">
        A curated showcase of hackathon victories, prestigious internships, and awards that demonstrate a relentless drive for innovation, undeniable skill, and proven excellence.
      </p>

      <div className="hidden md:block absolute right-6 w-212 h-px bg-(--pattern-fg) my-3 opacity-90 dark:opacity-15"></div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="flex flex-col border border-neutral-200 dark:border-neutral-800 p-2 sm:p-2 bg-white dark:bg-[#0a0a0a] rounded-lg mt-4 sm:mt-0 transition-colors"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="rounded-[12px] border border-neutral-200 dark:border-neutral-800 p-[4px] bg-neutral-50 dark:bg-neutral-900/50">
              <div className="relative h-[220px] w-full overflow-hidden rounded-[8px] border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#0a0a0a]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={item.id <= 2}
                />
              </div>
            </div>

            <div className="mt-2 flex flex-col px-1 pb-1 flex-1">
              <div className="flex flex-col pt-3">
                <span className="font-custom font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
                  {item.title}
                </span>
                <span className="font-custom2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {item.subtitle}
                </span>
              </div>
              
              <div className="mt-2">
                <p className="font-custom2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 text-xs font-custom2 font-semibold text-neutral-900 dark:text-neutral-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
