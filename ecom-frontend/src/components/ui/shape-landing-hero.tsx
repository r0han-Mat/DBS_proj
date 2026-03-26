"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1] as any,
            },
        }),
    };

    return (
        <div className="relative min-h-[60vh] w-full flex flex-col items-center justify-center bg-transparent pt-12">
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-6">
                <div className="max-w-3xl w-full flex flex-col items-center justify-center text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="text-sm text-white/50 tracking-widest uppercase font-medium">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-semibold mb-6 md:mb-8 tracking-tight flex flex-col items-center justify-center w-full">
                            <span className="text-white text-center w-full block">
                                {title1}
                            </span>
                            <span className="text-white/60 text-center w-full block mt-2">
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                            Crafting exceptional digital experiences through
                            innovative design and cutting-edge technology.
                        </p>
                    </motion.div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-base,#0d0f14)] to-transparent pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
