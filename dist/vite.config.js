"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_plugin_live_reload_1 = __importDefault(require("vite-plugin-live-reload"));
const preset_vite_1 = __importDefault(require("@preact/preset-vite"));
const compiler_1 = __importDefault(require("million/compiler"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
const vite_plugin_pwa_1 = require("vite-plugin-pwa");
dotenv_1.default.config({ path: ".env" });
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, vite_plugin_live_reload_1.default)([node_path_1.default.resolve(__dirname, "./resources/views/**/*.ejs")]),
        (0, vite_1.splitVendorChunkPlugin)(),
        compiler_1.default.vite({ mode: "preact" }),
        (0, preset_vite_1.default)(),
        (0, vite_plugin_pwa_1.VitePWA)({
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
        alias: {
            "@": node_path_1.default.resolve(__dirname, "resources", "ts", "services"),
            "~": node_path_1.default.resolve(__dirname, "resources", "ts"),
        },
    },
    build: {
        outDir: node_path_1.default.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: node_path_1.default.resolve(__dirname, "resources", "ts", "main.ts"),
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
        watch: {
            usePolling: true,
        },
    },
});
