"use client";

import { AnimatePresence, motion } from "motion/react";
import TextAnimation from "./UI/TextAnimation";
import { useState } from "react";
import Image from "next/image";

export default function Project() {
    const [expandedProject, setExpandedProject] = useState<number | null>(null);

    const toggleProject = (index: number) => {
        setExpandedProject(expandedProject === index ? null : index);
    };

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] leading-none font-semibold w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                <TextAnimation text="A glimpse into the products I’ve built and shipped." className="text-shadow-lg" />
            </div>
            <TextAnimation className="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base" text="Some clients prefer their projects to remain private, but you can visit their site to explore more about my contributions." />
            <div className="flex flex-col w-full mt-16 sm:mt-24 md:mt-32 lg:mt-48">
                {projects.map((project, index) => (
                    <div key={index} className="w-full">
                        <motion.div
                            className="w-full grid grid-cols-1 lg:grid-cols-3 items-center justify-between border-b-[1px] border-neutral-950 py-3 sm:py-2 relative group px-2 cursor-pointer"
                            onClick={() => toggleProject(index)}
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

                        <AnimatePresence>
                            {expandedProject === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden border-b-[1px] border-neutral-950"
                                >
                                    <div className="px-2 py-4 sm:py-6 bg-white">
                                        <p className="text-sm sm:text-base md:text-3xl w-2/3 font-semibold leading-tight text-neutral-700 mb-4">
                                            {project.description}
                                        </p>
                                        <span className="flex flex-col gap-2">
                                            {project.type.map((type, i) => (
                                                <p key={i} className="text-sm sm:text-sm md:text-lg lg:text-xl font-normal text-neutral-800 group-hover:text-neutral-200">- {type}</p>
                                            ))}
                                        </span>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block px-4 mt-4 py-2 rounded-full bg-neutral-950 text-white text-sm hover:bg-neutral-800 transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Visit Project →
                                            </a>
                                        )}
                                        {project.images && project.images.length > 0 && (
                                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {project.images.map((image, imgIndex) => (
                                                    <Image
                                                        key={imgIndex}
                                                        src={image}
                                                        alt={`${project.title} image ${imgIndex + 1}`}
                                                        className="w-full h-auto self-stretch"
                                                        priority
                                                        width={500}
                                                        height={300}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    )
}

const projects = [
    {
        title: "Made By Mac",
        description: "A personal portfolio site built for a client to showcase their past works and future project plans. Designed for easy navigation and scalability so they can update it seamlessly over time.",
        year: 2025,
        link: "https://madebymac.design",
        type: ['Design', 'Development'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/mac1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/mac2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/mac3.png"],
    },
    {
        title: "Div3dAsset",
        description: "A portfolio website for a 3D asset creator, crafted to highlight their digital models with a visually immersive interface and smooth performance to attract potential buyers and collaborators.",
        year: 2025,
        link: "https://div3dasset.com",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Iota Labs",
        description: "A landing page for an AI agents agency focused on automation solutions for finance institutions in the EU market. Designed with a professional, trust-focused aesthetic tailored to the fintech audience.",
        year: 2025,
        link: "https://iotalabs.ai",
        type: ['Development'],
        images: [],
    },
    {
        title: "Omorofia",
        description: "Luxury beauty brand UI design in Figma. Crafted a modern, high-end aesthetic emphasizing elegance and minimalism to reflect the brand’s premium positioning.",
        year: 2025,
        link: "",
        type: ['Design'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/omo1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/omo2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/omo3.png"],
    },
    {
        title: "Vouz",
        description: "A SaaS product for secure file-sharing. Reached 2,000+ users in just 48 hours of launch. Designed and built with speed, reliability, and trust at its core to handle global scale effortlessly.",
        year: 2025,
        link: "https://vouz.tech",
        type: ['Design', 'Development'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/vouz1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/vouz2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/vouz3.png"],
    },
    {
        title: "Couple Me",
        description: "An AI-powered character generator that creates virtual couples. I revamped the UI and enhanced overall site performance, resulting in smoother interactions and a more engaging user experience.",
        year: 2024,
        link: "https://couple.me",
        type: ['Optimization', 'Development'],
        images: [],
    },
    {
        title: "Inline Edits",
        description: "A video editing studio website design. Focused on delivering a creative yet professional look, highlighting their services and past projects to attract new clients.",
        year: 2024,
        link: "",
        type: ['Design'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/inline1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/inline2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/inline3.png"],
    },
    {
        title: "Clust",
        description: "Website for a web development agency, designed with a sleek and modern aesthetic to represent their technical expertise and innovative approach in the development space.",
        year: 2024,
        link: "https://clust.uk",
        type: ['Design', 'Development'],
        images: [],
    },
    {
        title: "Holz",
        description: "UI design for a German furniture brand. Built with a clean, functional layout that balances elegance and usability to showcase their handcrafted furniture collections.",
        year: 2024,
        link: "",
        type: ['Design'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/Holz1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/Holz2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/Holz3.png"],
    },
    {
        title: "La Mode",
        description: "Website for a fashion modeling agency. Designed and developed the entire site with a stylish, bold aesthetic that reflects the vibrance and energy of the fashion industry.",
        year: 2024,
        link: "https://lamode.vercel.app",
        type: ['Design', 'Development'],
        images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/lamode1.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/lamode2.png", "https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/lamode3.png"],
    }
]