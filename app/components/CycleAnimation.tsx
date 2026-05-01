"use client";
import React from "react";
import { motion } from "framer-motion";
import { Leaf, Coins, Factory, ArrowRight, CheckCircle2, Zap } from "lucide-react";

// A classic, elegant circular ecosystem animation
// Theme: "The Cycle of Value" - Consistent Earth/Green tones, Glassmorphism, Premium feel.

const OrbitingNode = ({
    angle,
    radius,
    delay = 0,
    icon: Icon,
    label,
    subLabel
}: {
    angle: number,
    radius: number,
    delay?: number,
    icon: any,
    label: string,
    subLabel: string
}) => {
    return (
        <motion.div
            className="absolute flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                rotate: 360 // Counter-rotate to keep upright if parent rotates
            }}
            transition={{ duration: 0.8, delay, ease: "backOut" }}
            style={{
                top: "50%",
                left: "50%",
                width: "max-content",
                // Position on circle using basic trig
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
            }}
        >
            <div className="relative group cursor-default">
                {/* Ping Effect */}
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-20 duration-1000"></div>

                {/* Glass Card */}
                <div className="relative flex items-center gap-3 p-3 pr-6 bg-white/80 backdrop-blur-md border border-white/40 shadow-xl shadow-green-900/5 rounded-full hover:scale-105 transition-transform duration-300">
                    <div className={`p-2.5 rounded-full ${angle === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        <Icon size={20} className="stroke-[2.5px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-earth-800 uppercase tracking-tight">{label}</span>
                        <span className="text-[10px] text-earth-500 font-medium">{subLabel}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ConnectionLine = ({ rotation }: { rotation: number }) => (
    <div
        className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-green-800/10 to-transparent -translate-x-1/2 -translate-y-1/2 -z-10"
        style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
    />
);

export const CycleAnimation = () => {
    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center scale-90 sm:scale-100">

            {/* Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100/30 to-yellow-100/30 rounded-full blur-3xl animate-pulse-slow"></div>

            {/* Main Orbit Ring */}
            <motion.div
                className="relative w-[360px] h-[360px] rounded-full border border-dashed border-earth-200/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                {/* Orbiting Particle Icon */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50 z-10"
                />
            </motion.div>

            {/* Inner Static Ring */}
            <div className="absolute w-[240px] h-[240px] rounded-full border border-earth-100 bg-white/30 backdrop-blur-[2px]"></div>

            {/* Central Hub */}
            <motion.div
                className="absolute z-20 flex flex-col items-center justify-center text-center p-8 bg-white shadow-2xl shadow-earth-900/10 rounded-full border-4 border-white/50 w-40 h-40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <div className="bg-gradient-to-br from-green-500 to-earth-600 w-14 h-14 rounded-2xl rotate-3 flex items-center justify-center text-white shadow-lg mb-2">
                    <Zap size={28} fill="currentColor" className="text-white" />
                </div>
                <div className="leading-none">
                    <span className="block text-2xl font-black text-earth-900 tracking-tight">AI</span>
                    <span className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">Engine</span>
                </div>
            </motion.div>

            {/* Nodes - Positioned absolute relative to container (not rotating with the ring) */}

            {/* 1. Harvest (Top Left) */}
            <div className="absolute top-[15%] left-[15%]">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 p-3 bg-white shadow-lg rounded-2xl border border-earth-50"
                >
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                        <Leaf size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-earth-800 text-sm">Harvest</div>
                        <div className="text-[10px] text-earth-500">Stubble Collected</div>
                    </div>
                </motion.div>
            </div>

            {/* 2. Valuation (Top Right) */}
            <div className="absolute top-[15%] right-[15%]">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-3 p-3 bg-white shadow-lg rounded-2xl border border-earth-50"
                >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-earth-800 text-sm">Verify</div>
                        <div className="text-[10px] text-earth-500">AI Quality Check</div>
                    </div>
                </motion.div>
            </div>

            {/* 3. Trade (Bottom Right) */}
            <div className="absolute bottom-[20%] right-[10%]">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-center gap-3 p-3 bg-white shadow-lg rounded-2xl border border-earth-50"
                >
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                        <Coins size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-earth-800 text-sm">Trade</div>
                        <div className="text-[10px] text-earth-500">Instant Payment</div>
                    </div>
                </motion.div>
            </div>

            {/* 4. Industry (Bottom Left) */}
            <div className="absolute bottom-[20%] left-[10%]">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="flex items-center gap-3 p-3 bg-white shadow-lg rounded-2xl border border-earth-50"
                >
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                        <Factory size={20} />
                    </div>
                    <div>
                        <div className="font-bold text-earth-800 text-sm">Reuse</div>
                        <div className="text-[10px] text-earth-500">Bio-Fuel / Paper</div>
                    </div>
                </motion.div>
            </div>

            {/* Connecting Flows (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none pb-2 pl-2">
                {/* Curved Lines connecting nodes to center */}
                <motion.path
                    d="M 150 150 Q 250 150 250 250"
                    transform="translate(10,10)"
                    stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 4"
                />
                <motion.path
                    d="M 350 150 Q 250 150 250 250"
                    transform="translate(-10,10)"
                    stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 4"
                />
                <motion.path
                    d="M 350 350 Q 250 350 250 250"
                    transform="translate(-10,-10)"
                    stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 4"
                />
                <motion.path
                    d="M 150 350 Q 250 350 250 250"
                    transform="translate(10,-10)"
                    stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 4"
                />

                {/* Animating Packets */}
                <circle r="3" fill="#22c55e">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 150 150 Q 250 150 250 250" />
                </circle>
                <circle r="3" fill="#3b82f6" opacity="0.6">
                    <animateMotion dur="4s" begin="1s" repeatCount="indefinite" path="M 250 250 Q 250 150 350 150" />
                </circle>
                <circle r="3" fill="#eab308">
                    <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M 350 150 Q 360 250 350 350" />
                </circle>
            </svg>
        </div>
    );
};
