"use client";

import confetti from "canvas-confetti";

import { Button } from "./button";

export function ConfettiFireworks({ children }: { children: React.ReactNode }) {
    const handleClick = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    return (
        <div className="relative">
            <Button onClick={handleClick} className="bg-white text-neutral-950 hover:bg-white shadow-none text-sm sm:text-base md:text-lg lg:text-xl font-semibold cursor-pointer px-3 sm:px-4 md:px-6 py-2 sm:py-3">{children}</Button>
        </div>
    );
}
