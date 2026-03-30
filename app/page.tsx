"use client";

import { useState } from "react";

import Container from "@/components/containers";

import Projects from "@/components/projects";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import Skills from "@/components/skills";
import GetInTouch from "@/components/get-in-touch";
import WaveformPlayer from "@/components/ui/waveform-player";

export default function Home() {

  const socials = [
    {
      name: "GitHub",
      icon: Github,
      action: () => window.open("https://github.com/Sreejesh06", "_blank"),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () => window.open("https://www.linkedin.com/in/sreejesh-/", "_blank"),
    },
    {
      name: "X",
      icon: Twitter,
      action: () => window.open("https://x.com/Sreejesh_2006", "_blank"),
    },
    {
      name: "Email",
      icon: Mail,
      action: () => (window.location.href = "mailto:its.sreejesh.dev@gmail.com"),
    },
  ];

  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <Container className="min-h-[200vh] px-8 pt-24 md:p-20 md:pb-10 mx-auto ">

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

        {/* ---------------------------------------- */}
        {/* HEADING + SOCIALS (FIXED SAME LINE) */}
        {/* ---------------------------------------- */}

        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
            <span className="link--elara">Sreejesh S</span>
          </h1>

          <div className="flex flex-wrap gap-4 sm:justify-end">
            {socials.map((social) => (
              <div
                key={social.name}
                className="relative cursor-alias group"
                onClick={social.action}
              >
                <social.icon
                  size={20}
                  className="text-neutral-900 dark:text-neutral-50 opacity-70 hover:opacity-100 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------- */}
        {/* SUBTEXT */}
        {/* ---------------------------------------- */}

        <div className="text-secondary font-custom2 text-s mt-1">
          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-semibold"></span>
            <span className="text-neutral-700 dark:text-neutral-300">Full Stack Developer and AI builder focused on shipping useful software.</span>
          </p>

          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-bold"></span>
            <span className="text-neutral-700 dark:text-neutral-300">I work on production-grade products across web, developer tools, and automation.</span>
          </p>

          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-semibold"></span>
            <span className="text-neutral-700 dark:text-neutral-300">
              Technical Lead at CFI, builder mindset, and strong open-source execution.
            </span>
          </p>
        </div>

        <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 my-6 -mx-2 md:-mx-14"></div>



        <Projects />

        <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 my-4 -mx-2 md:-mx-14"></div>


        <Timeline></Timeline>



        <GithubGraph></GithubGraph>

        <Skills />

        <GetInTouch />


      </Container>
    </div>
  );
}