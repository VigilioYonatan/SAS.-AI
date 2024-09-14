import { defineConfig, splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
import preact from "@preact/preset-vite";
import million from "million/compiler";
import path from "node:path";
import dotenv from "dotenv";
import { VitePWA } from "vite-plugin-pwa";

dotenv.config({ path: ".env" });
export default defineConfig({
    plugins: [
        liveReload([path.resolve(__dirname, "./resources/views/**/*.ejs")]),
        splitVendorChunkPlugin(),
        million.vite({ mode: "preact" }),
        preact(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: process.env.PWA_NAME,
                short_name: process.env.PWA_NAME,
                description: process.env.PWA_DESCRIPTION,
                theme_color: "#000",
                icons: [
                    {
                        src: "/images/settings/others/logo.webp",
                        sizes: "192x192",
                        type: "image/webp",
                    },
                    {
                        src: "/images/settings/others/logo.webp",
                        sizes: "512x512",
                        type: "image/webp",
                    },
                ],
                display: "standalone",
                start_url: "/",
            },
        }),
    ],
    root: "resources",
    base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
    resolve: {
        // RESOURCES ALIAS
        alias: {
            "@": path.resolve(__dirname, "resources", "ts", "services"),
            "~": path.resolve(__dirname, "resources", "ts"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "resources", "ts", "main.ts"),
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
        watch: {
            usePolling: true, // docker
        },
    },
});
