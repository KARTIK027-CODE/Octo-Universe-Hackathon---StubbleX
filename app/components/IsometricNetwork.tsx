"use client";
import React from "react";
import { motion } from "framer-motion";

// Helper components for 3D shapes
const IsometricBlock = ({
    className = "",
    color = "bg-earth-600",
    topColor = "bg-earth-500",
    sideColor = "bg-earth-700",
    width = "w-16",
    height = "h-16",
    depth = 20,
    delay = 0,
    icon: Icon
}: any) => {
    return (
        <motion.div
            className={`relative ${width} ${height} transform-style-3d group ${className}`}
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Top Face */}
            <div className={`absolute inset-0 ${topColor} flex items-center justify-center border border-white/10 shadow-inner`}
                style={{ transform: `translateZ(${depth}px)` }}>
                {Icon && <Icon className="text-white/90 transform -rotate-45" size={24} />}
            </div>

            {/* Front Face */}
            <div className={`absolute inset-x-0 top-full h-[${depth}px] ${sideColor} origin-top transform -rotate-x-90 border-x border-b border-white/5 bg-gradient-to-b from-black/20`}
                style={{ height: depth, transform: "rotateX(-90deg) translateZ(0)" }}></div>

            {/* Side Face */}
            <div className={`absolute inset-y-0 right-0 w-[${depth}px] ${color} origin-right transform rotate-y-90 border-r border-b border-white/5 bg-gradient-to-l from-black/20`}
                style={{ width: depth, transform: "rotateY(90deg) translateZ(0)" }}></div>

            {/* Glow Effect */}
            <div className={`absolute inset-0 ${topColor} blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                style={{ transform: `translateZ(${depth - 10}px)` }}></div>
        </motion.div>
    );
};

// Data Packet Animation
const DataStream = ({ path, delay = 0, color = "#22c55e" }: { path: string, delay?: number, color?: string }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {/* Base Path */}
            <path d={path} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />

            {/* Moving Packet */}
            <circle r="4" fill={color} filter={`drop-shadow(0 0 8px ${color})`}>
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={path}
                    begin={`${delay}s`}
                />
            </circle>
        </svg>
    );
};

export const IsometricNetwork = () => {
    return (
        <div className="w-full h-[600px] flex items-center justify-center relative overflow-visible scale-75 md:scale-100">
            {/* Isometric Container */}
            <div className="relative w-[600px] h-[600px] transform-style-3d rotate-x-60 rotate-z-45 perspective-1000">

                {/* Central Hub (Processor) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-style-3d z-20">
                    <motion.div
                        className="w-32 h-32 bg-earth-900 absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-earth-700/50 shadow-2xl shadow-green-900/50"
                        style={{ transform: "translateZ(-20px)" }}
                    >
                        {/* Grid glow */}
                        <div className="absolute inset-0 bg-grid-white/[0.1] mix-blend-overlay"></div>
                    </motion.div>

                    {/* Stacked AI Chip */}
                    <IsometricBlock
                        width="w-24" height="h-24" depth={40}
                        color="bg-green-600" topColor="bg-green-500" sideColor="bg-green-700"
                        className="z-30"
                    />
                </div>

                {/* Node 1: Farm Data (Top Left) */}
                <div className="absolute top-20 left-20 transform-style-3d">
                    <IsometricBlock width="w-20" height="h-20" color="bg-orange-600" topColor="bg-orange-500" sideColor="bg-orange-700" delay={0.5} />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap bg-black/60 px-3 py-1 rounded text-orange-200 text-xs font-mono font-bold tracking-wider -rotate-45 transform skew-x-12 border border-orange-500/30 backdrop-blur-md">
                        RAW_DATA_SOURCE
                    </div>
                </div>

                {/* Node 2: Processing (Top Right) */}
                <div className="absolute top-20 right-20 transform-style-3d">
                    <IsometricBlock width="w-20" height="h-20" color="bg-blue-600" topColor="bg-blue-500" sideColor="bg-blue-700" delay={1} />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap bg-black/60 px-3 py-1 rounded text-blue-200 text-xs font-mono font-bold tracking-wider -rotate-45 transform skew-x-12 border border-blue-500/30 backdrop-blur-md">
                        ANALYSIS_L.L.M
                    </div>
                </div>

                {/* Node 3: Industry (Bottom Left) */}
                <div className="absolute bottom-20 left-20 transform-style-3d">
                    <IsometricBlock width="w-20" height="h-20" color="bg-yellow-600" topColor="bg-yellow-500" sideColor="bg-yellow-700" delay={1.5} />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap bg-black/60 px-3 py-1 rounded text-yellow-200 text-xs font-mono font-bold tracking-wider -rotate-45 transform skew-x-12 border border-yellow-500/30 backdrop-blur-md">
                        MARKET_READY
                    </div>
                </div>

                {/* Node 4: Storage (Bottom Right) */}
                <div className="absolute bottom-20 right-20 transform-style-3d">
                    <IsometricBlock width="w-20" height="h-20" color="bg-purple-600" topColor="bg-purple-500" sideColor="bg-purple-700" delay={2} />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap bg-black/60 px-3 py-1 rounded text-purple-200 text-xs font-mono font-bold tracking-wider -rotate-45 transform skew-x-12 border border-purple-500/30 backdrop-blur-md">
                        ARCHIVES_DB
                    </div>
                </div>

                {/* Connecting Pipes (SVG) - These need to be drawn in the 2D plane of the grid */}
                <div className="absolute inset-0 pointer-events-none transform -translate-z-10">
                    {/* Path 1: Farm to Hub */}
                    <DataStream path="M 100 100 L 300 300" color="#fb923c" />

                    {/* Path 2: Hub to Industry */}
                    <DataStream path="M 300 300 L 100 500" delay={1.5} color="#fbbf24" />

                    {/* Path 3: Hub to Process */}
                    <DataStream path="M 300 300 L 500 100" delay={1} color="#60a5fa" />

                    {/* Path 4: Hub to Storage */}
                    <DataStream path="M 300 300 L 500 500" delay={2} color="#c084fc" />

                    {/* Path 5: Interconnect */}
                    <DataStream path="M 100 100 Q 100 500 500 500" delay={3} color="#ffffff" />
                </div>
            </div>

            {/* Ambient Floor Glow */}
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10 animate-pulse"></div>
        </div>
    );
};
