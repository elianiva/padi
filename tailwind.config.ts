import { type Config } from "tailwindcss";
import daisyUi from "daisyui";

export default {
    content: [
        "{routes,islands,components}/**/*.{ts,tsx}",
    ],
    plugins: [
        /** @ts-expect-error - deno fails to detect the typing for daisyui */
        daisyUi
    ],
    theme: {
        fontFamily: {
            sans: ["Rubik", "sans-serif"],
        },
    },
    daisyui: {
        themes: ["corporate"],
        base: true, // applies background color and foreground color for root element by default
        styled: true, // include daisyUI colors and design decisions for all components
        utils: true, // adds responsive and modifier utility classes
        prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
        logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
        themeRoot: ":root", // The element that receives theme color CSS variables
    },
    safelist: [
        "bg-sky-500",
        "bg-rose-500",
        "bg-violet-500",
        "bg-amber-500",
        "bg-cyan-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-red-500",
    ],
} satisfies Config;