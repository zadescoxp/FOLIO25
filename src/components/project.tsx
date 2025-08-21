"use client";

import { motion } from "motion/react";
import TextAnimation from "./UI/TextAnimation";

export default function Project() {
    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] leading-none font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                <TextAnimation text="A glimpse into the products I’ve built and shipped." className="text-shadow-lg" />
            </div>

            <div className="flex flex-col w-full mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                {projects.map((project, index) => (
                    <motion.div className="w-full grid grid-cols-1 lg:grid-cols-3 items-center justify-between border-b-[1px] border-neutral-950 py-3 sm:py-2 relative group px-2" key={index}
                        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", transition: { duration: 1.25 } }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute w-full inset-0 bg-neutral-950 h-0 origin-top -z-[1] group-hover:h-full transition-all duration-300"></div>
                        <h3 className="text-base sm:text-lg font-semibold group-hover:text-white mb-2 sm:mb-0">{project.title}</h3>
                        <span className="flex gap-2 items-center mb-2 sm:mb-0">
                            {project.type.map((type, i) => (
                                <p key={i} className="text-sm sm:text-base md:text-lg text-neutral-800 group-hover:text-neutral-200">{type}{i < project.type.length - 1 && ', '}</p>
                            ))}
                        </span>
                        <span className="text-left sm:text-right text-sm sm:text-base md:text-lg self-start sm:self-end text-neutral-800 group-hover:text-neutral-200">{project.year}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

const projects = [
    {
        title: "Made By Mac",
        description: "something",
        year: 2025,
        link: "https://madebymac.design",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Div3dAsset",
        description: "something",
        year: 2025,
        link: "https://div3dasset.com",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Iota Labs",
        description: "something",
        year: 2025,
        link: "https://iotalabs.ai",
        type: ['Development'],
        images: [],
    },
    {
        title: "Omorofia",
        description: "something",
        year: 2025,
        link: "",
        type: ['Design'],
        images: [],
    },
    {
        title: "Vouz",
        description: "something",
        year: 2025,
        link: "https://vouz.tech",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Couple Me",
        description: "something",
        year: 2024,
        link: "https://couple.me",
        type: ['Optimization', 'Development'],
        images: [],
    },
    {
        title: "Inline Edits",
        description: "something",
        year: 2024,
        link: "",
        type: ['Design'],
        images: [],
    },
    {
        title: "Clust",
        description: "something",
        year: 2024,
        link: "https://clust.uk",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Holz",
        description: "something",
        year: 2024,
        link: "",
        type: ['Design'],
        images: [],
    },
    {
        title: "La Mode",
        description: "something",
        year: 2024,
        link: "https://lamode.vercel.app",
        type: ['Design', 'Development'],
        images: [],
    }
]