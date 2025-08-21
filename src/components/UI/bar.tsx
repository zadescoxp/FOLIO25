"use client"

import { CircleChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import TextAnimation from "./TextAnimation";

export default function Bar() {
    const [show, setShow] = useState(false)
    return (
        <motion.div className="bg-neutral-700 text-white fixed bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg z-20 hover:bg-neutral-900 transition-all duration-300 flex flex-col ">
            <button onClick={() => setShow(!show)} className="text-xs sm:text-sm self-center flex items-center justify-between gap-3 cursor-pointer">
                {show ? "Close" : "About Me"}
                <CircleChevronUp className={`h-3 sm:h-4 ${show && 'rotate-180'} transition-all duration-300`} /></button>

            <AnimatePresence>
                {show && (
                    <motion.div className="mt-2 transition-all duration-300 fixed bottom-12 sm:bottom-14 left-1/2 w-[20rem] sm:w-[30rem] md:w-[35rem] lg:w-[40rem] origin-bottom -translate-x-1/2 p-4 sm:p-6 bg-neutral-950 rounded-xl"
                        initial={{ bottom: 0, scale: 0 }}
                        animate={{ bottom: "3.5rem", scale: 1, transition: { duration: 0.25 } }}
                        exit={{ bottom: 0, scale: 0, transition: { duration: 0.25 } }}>
                        <TextAnimation className="text-sm sm:text-base md:text-lg" text="I’m Zade, a full-stack developer and designer passionate about building products that are as functional as they are beautiful. I thrive at the intersection of design, engineering, and business turning ideas into seamless digital experiences. From crafting intuitive interfaces to implementing data-driven and AI-powered features, my focus is always on solving real problems with creativity and precision." />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}