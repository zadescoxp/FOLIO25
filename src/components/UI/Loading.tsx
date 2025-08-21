"use client";

import { motion } from 'framer-motion'
import { TextAnimate } from '../magicui/text-animate';

export default function Loading() {
    return (
        <motion.div className="flex flex-col items-center justify-center h-screen fixed inset-0 bg-neutral-950 z-50"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", scale: 1 }}
            animate={{
                clipPath: "polygon(0 0, 100% 0%, 100% 0, 0% 0)",
                // scale: 0.5,
                transition: { duration: 1, delay: 2.5 }
            }}
        >
            <TextAnimate by="character" duration={1} className='font-climate-crisis text-[6rem]  sm:text-[8rem] md:text-[11rem] lg:text-[15rem] xl:text-[20rem] 2xl:text-[25rem] text-white whitespace-nowrap'>ZADE</TextAnimate>
            <TextAnimate by='character' duration={1} className='text-white font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl'>@FOLIO 25</TextAnimate>
        </motion.div>
    )
}