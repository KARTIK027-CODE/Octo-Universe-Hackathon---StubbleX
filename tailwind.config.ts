import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                earth: {
                    50: '#f0fdfa', // teal-50
                    100: '#ccfbf1', // teal-100
                    200: '#99f6e4', // teal-200
                    300: '#5eead4', // teal-300
                    400: '#2dd4bf', // teal-400
                    500: '#14b8a6', // teal-500
                    600: '#0d9488', // teal-600 (Primary)
                    700: '#0f766e', // teal-700
                    800: '#115e59', // teal-800
                    900: '#134e4a', // teal-900
                    950: '#042f2e', // teal-950
                },
                sand: {
                    50: '#fafafa', // stone-50
                    100: '#f5f5f4', // stone-100
                    200: '#e7e5e4', // stone-200
                    300: '#d6d3d1', // stone-300
                    400: '#a8a29e', // stone-400
                    500: '#78716c', // stone-500
                    600: '#57534e', // stone-600 (Text)
                    700: '#44403c', // stone-700
                    800: '#292524', // stone-800
                    900: '#1c1917', // stone-900
                    950: '#0c0a09', // stone-950
                }
            }
        },
    },
    plugins: [],
};
export default config;
