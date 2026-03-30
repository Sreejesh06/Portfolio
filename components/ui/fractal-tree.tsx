"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function FractalTree() {
    const el = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        const canvas = el.current;
        if (!canvas || size.width === 0 || size.height === 0) return;

        const ctx = canvas.getContext("2d")!;

        // High DPI handling
        const dpr = window.devicePixelRatio || 1;
        // @ts-expect-error - vendor prefixes are not in the types
        const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        const dpi = dpr / bsr;

        canvas.style.width = `${size.width}px`;
        canvas.style.height = `${size.height}px`;
        canvas.width = dpi * size.width;
        canvas.height = dpi * size.height;
        ctx.scale(dpi, dpi);

        const r180 = Math.PI;
        const r90 = Math.PI / 2;
        const r15 = Math.PI / 12;
        const color = theme === 'dark' ? '#88888825' : '#33333325';

        const { random } = Math;
        const MIN_BRANCH = 30;
        const len = 6;

        let steps: (() => void)[] = [];
        let prevSteps: (() => void)[] = [];
        let animationId: number;

        const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
            const dx = r * Math.cos(theta);
            const dy = r * Math.sin(theta);
            return [x + dx, y + dy];
        };

        const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
            const length = random() * len;
            counter.value += 1;

            const [nx, ny] = polar2cart(x, y, length, rad);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.stroke();

            const rad1 = rad + random() * r15;
            const rad2 = rad - random() * r15;

            // out of bounds
            if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
                return;

            const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

            // left branch
            if (random() < rate)
                steps.push(() => step(nx, ny, rad1, counter));

            // right branch
            if (random() < rate)
                steps.push(() => step(nx, ny, rad2, counter));
        };

        let lastTime = performance.now();
        const interval = 1000 / 40; // 50fps

        const randomMiddle = () => random() * 0.6 + 0.2;

        const randomRoot = () => {
            const type = random() > 0.5 ? 'vertical' : 'horizontal';
            if (type === 'vertical') {
                const x = randomMiddle() * size.width;
                const y = random() > 0.5 ? -5 : size.height + 5;
                const angle = y === -5 ? r90 : -r90;
                steps.push(() => step(x, y, angle));
            } else {
                const x = random() > 0.5 ? -5 : size.width + 5;
                const y = randomMiddle() * size.height;
                const angle = x === -5 ? 0 : r180;
                steps.push(() => step(x, y, angle));
            }
        };

        const frame = () => {
            if (performance.now() - lastTime < interval) {
                animationId = requestAnimationFrame(frame);
                return;
            }

            prevSteps = steps;
            steps = [];
            lastTime = performance.now();

            if (!prevSteps.length) {
                // If no active branches, spawn a new root with some probability to keep it alive
                if (Math.random() < 0.05) {
                    randomRoot();
                }
            }

            prevSteps.forEach((i) => {
                if (random() < 0.5)
                    steps.push(i);
                else
                    i();
            });

            animationId = requestAnimationFrame(frame);
        };

        const start = () => {
            ctx.clearRect(0, 0, size.width, size.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            prevSteps = [];
            steps = [];

            // Initial roots
            if (size.width < 500) {
                steps.push(() => step(randomMiddle() * size.width, -5, r90));
                steps.push(() => step(randomMiddle() * size.width, size.height + 5, -r90));
            } else {
                steps.push(() => step(randomMiddle() * size.width, -5, r90));
                steps.push(() => step(randomMiddle() * size.width, size.height + 5, -r90));
                steps.push(() => step(-5, randomMiddle() * size.height, 0));
                steps.push(() => step(size.width + 5, randomMiddle() * size.height, r180));
            }

            cancelAnimationFrame(animationId);
            frame();
        };

        start();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [size, theme]);

    const mask = "radial-gradient(circle, transparent, black)";

    return (
        <div
            className="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden z-[-1]"
            style={{
                maskImage: mask,
                WebkitMaskImage: mask,
            }}
        >
            <canvas ref={el} />
        </div>
    );
}
