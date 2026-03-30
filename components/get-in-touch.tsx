"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function GetInTouch() {
    return (
        <div className="w-full mt-8 mb-10 relative z-10">
            <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-2 -mx-2 md:-mx-14"></div>
            <div className="flex w-full justify-between items-center py-2">
                <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
                    <span className="link--elara">Get in touch</span>
                </h1>
            </div>
            <div className="w-auto border-t border-solid border-[var(--pattern-fg)] opacity-100 dark:opacity-15 mb-4 -mx-2 md:-mx-14"></div>

            <div className="flex flex-col items-start space-y-6">
                <p className="font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-2 py-[7px] text-sm inline-block bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border mb-6">
                    Hi there — I’m currently open to meaningful work.
                </p>

                <div className="w-full max-w-2xl flex gap-4">
                    <Link href="/Contact">
                        <button
                            className="group relative overflow-hidden rounded-lg 
                            bg-linear-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                            border border-neutral-200 dark:border-neutral-800 
                            text-neutral-800 dark:text-neutral-200 text-sm font-medium px-6 py-2.5 
                            transition-all duration-300 
                            hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-800
                            shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] 
                            dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Send Enquiry
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100" />
                            </span>
                        </button>
                    </Link>

                    <Link href="https://www.linkedin.com/in/sreejesh-/" target="_blank">
                        <AnimatedButton className="group relative overflow-hidden rounded-lg 
                            bg-linear-to-b from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 
                            border border-neutral-200 dark:border-neutral-800 
                            text-neutral-800 dark:text-neutral-200 text-sm font-medium px-6 py-2.5 
                            transition-all duration-300 
                            hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-800
                            shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] 
                            dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Book a call
                                <Phone className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100" />
                            </span>
                        </AnimatedButton>
                    </Link>
                </div>
            </div>

            {/* Decorative Grid Pattern */}
            <div
                className="absolute -bottom-12 -right-2 md:-bottom-20 md:-right-14 w-80 h-40 -z-10 pointer-events-none opacity-60 dark:opacity-40"
                style={{
                    maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] bg-right-bottom shadow-[inset_20px_20px_40px_rgba(255,255,255,0.8)] dark:shadow-[inset_20px_20px_40px_rgba(10,10,10,0.8)]"></div>
            </div>
        </div>
    );
}
