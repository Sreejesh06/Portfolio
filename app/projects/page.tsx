"use client";

import Container from "@/components/containers";
import Projects from "@/components/projects";

export default function Home() {
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
        <span className="link--elara">Projects</span>
      </h1>

      <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mt-4">
        Hi there! I love building stuff for people and am passionate about contributing to open source. Here are my projects and open source contributions—feel free to take a look.
      </p>

      <div className="hidden md:block absolute right-6 w-212 h-px bg-(--pattern-fg) my-3 opacity-90 dark:opacity-15"></div>

      <Projects showAll={true}></Projects>

    </Container>
  )
}