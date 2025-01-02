const tailwind = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/views/**/*.ejs",
        "./resources/ts/**/*.tsx",
        "./resources/ts/**/*.ts",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                background: {
                    dark: "#0F0F0F",
                    light: "var(--light)",
                },
                paper: {
                    dark: "#272727",
                    light: "var(--paper)",
                },
                terciary: tailwind.gray["400"],
                success: tailwind.green["600"],
                danger: tailwind.red["600"],
                admin: {
                    paper: {
                        dark: "#1F2937",
                    },
                    background: {
                        dark: "#111827",
                    },
                    terciary: "#374151",
                },
            },
            textColor: {
                primary: "var(--primary)",
                secondary: {
                    light: "#fff",
                    dark: "#000",
                },
                terciary: tailwind.gray["400"],
                quarty: "#0F172B",
            },
        },
        fontFamily: {
            thin: ["Font-Thin", "sans"],
            light: ["Font-Light", "sans"],
            normal: ["Font-Regular", "sans"],
            bold: ["Font-Bold", "sans"],
            black: ["Font-Black", "sans"],
        },
        screens: {
            xs: "450px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [],
    darkMode: ["class"],
};
