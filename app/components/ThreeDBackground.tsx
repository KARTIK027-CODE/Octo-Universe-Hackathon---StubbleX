"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const ThreeDBackground = () => {
    const [mounted, setMounted] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Transform mouse position to rotation/movement
    const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);
    const moveX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
    const moveY = useTransform(springY, [-0.5, 0.5], [-50, 50]);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            // Normalize coordinates to -0.5 to 0.5
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth - 0.5);
            mouseY.set(e.clientY / innerHeight - 0.5);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Prevent hydration mismatch by only rendering after mount
    if (!mounted) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient Background Gradient - Cooler */}
            <div className="absolute inset-0 bg-sand-50 opacity-90"></div>

            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    x: moveX,
                    y: moveY,
                    perspective: 1000
                }}
                className="absolute inset-0 flex items-center justify-center transform-style-preserve-3d"
            >
                {/* Ring 1 - Vertical Ellipse - Teal Tech */}
                <motion.div
                    className="absolute w-[600px] h-[800px] border-[1px] border-earth-300/30 rounded-[100%]"
                    style={{ rotateY: 60 }}
                    animate={{ rotateX: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />

                {/* Ring 2 - Horizontal Wide - Cleaner */}
                <motion.div
                    className="absolute w-[900px] h-[500px] border-[1px] border-earth-500/20 rounded-[100%]"
                    style={{ rotateX: 60 }}
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                />

                {/* Core Network Nodes - Abstract Tech */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-earth-600 shadow-lg shadow-earth-400"
                        initial={{
                            x: Math.random() * 800 - 400,
                            y: Math.random() * 600 - 300,
                            z: Math.random() * 600 - 300,
                            opacity: 0
                        }}
                        animate={{
                            x: Math.random() * 800 - 400,
                            y: Math.random() * 600 - 300,
                            z: Math.random() * 600 - 300,
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Connection Lines simulation */}
                        <div className="absolute top-1/2 left-1/2 w-[200px] h-[1px] bg-gradient-to-r from-earth-400/20 to-transparent -translate-y-1/2 origin-left rotate-[Math.random()*360]"></div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Glass Frosted Overlay */}
            <div className="absolute inset-0 bg-sand-50/30 backdrop-blur-[1px]"></div>
        </div>
    );
};
