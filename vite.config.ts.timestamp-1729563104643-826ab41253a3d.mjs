// vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/vite/dist/node/index.js";
import liveReload from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/vite-plugin-live-reload/dist/index.js";
import preact from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import million from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/million/dist/packages/compiler.mjs";
import path from "node:path";
import dotenv from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/dotenv/lib/main.js";
import { VitePWA } from "file:///C:/Users/Vigilio/Desktop/ts/sas/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Vigilio\\Desktop\\ts\\sas";
dotenv.config({ path: ".env" });
var vite_config_default = defineConfig({
  plugins: [
    liveReload([path.resolve(__vite_injected_original_dirname, "./resources/views/**/*.ejs")]),
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
            type: "image/webp"
          },
          {
            src: "/images/settings/others/logo.webp",
            sizes: "512x512",
            type: "image/webp"
          }
        ],
        display: "standalone",
        start_url: "/"
      }
    })
  ],
  root: "resources",
  base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  resolve: {
    // RESOURCES ALIAS
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "resources", "ts", "services"),
      "~": path.resolve(__vite_injected_original_dirname, "resources", "ts")
    }
  },
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "public", "dist"),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__vite_injected_original_dirname, "resources", "ts", "main.ts")
    }
  },
  server: {
    strictPort: true,
    port: Number(process.env.VITE_PORT),
    host: true,
    watch: {
      usePolling: true
      // docker
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxWaWdpbGlvXFxcXERlc2t0b3BcXFxcdHNcXFxcc2FzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxWaWdpbGlvXFxcXERlc2t0b3BcXFxcdHNcXFxcc2FzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9WaWdpbGlvL0Rlc2t0b3AvdHMvc2FzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGxpdmVSZWxvYWQgZnJvbSBcInZpdGUtcGx1Z2luLWxpdmUtcmVsb2FkXCI7XHJcbmltcG9ydCBwcmVhY3QgZnJvbSBcIkBwcmVhY3QvcHJlc2V0LXZpdGVcIjtcclxuaW1wb3J0IG1pbGxpb24gZnJvbSBcIm1pbGxpb24vY29tcGlsZXJcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuXHJcbmRvdGVudi5jb25maWcoeyBwYXRoOiBcIi5lbnZcIiB9KTtcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBsaXZlUmVsb2FkKFtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vcmVzb3VyY2VzL3ZpZXdzLyoqLyouZWpzXCIpXSksXHJcbiAgICAgICAgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpLFxyXG4gICAgICAgIG1pbGxpb24udml0ZSh7IG1vZGU6IFwicHJlYWN0XCIgfSksXHJcbiAgICAgICAgcHJlYWN0KCksXHJcbiAgICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICAgICAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwcm9jZXNzLmVudi5QV0FfTkFNRSxcclxuICAgICAgICAgICAgICAgIHNob3J0X25hbWU6IHByb2Nlc3MuZW52LlBXQV9OQU1FLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHByb2Nlc3MuZW52LlBXQV9ERVNDUklQVElPTixcclxuICAgICAgICAgICAgICAgIHRoZW1lX2NvbG9yOiBcIiMwMDBcIixcclxuICAgICAgICAgICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IFwiL2ltYWdlcy9zZXR0aW5ncy9vdGhlcnMvbG9nby53ZWJwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS93ZWJwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogXCIvaW1hZ2VzL3NldHRpbmdzL290aGVycy9sb2dvLndlYnBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3dlYnBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRfdXJsOiBcIi9cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcbiAgICByb290OiBcInJlc291cmNlc1wiLFxyXG4gICAgYmFzZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gXCIvZGlzdC9cIiA6IFwiL1wiLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIC8vIFJFU09VUkNFUyBBTElBU1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInJlc291cmNlc1wiLCBcInRzXCIsIFwic2VydmljZXNcIiksXHJcbiAgICAgICAgICAgIFwiflwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInJlc291cmNlc1wiLCBcInRzXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwicHVibGljXCIsIFwiZGlzdFwiKSxcclxuICAgICAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgICAgICBtYW5pZmVzdDogdHJ1ZSxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGlucHV0OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInJlc291cmNlc1wiLCBcInRzXCIsIFwibWFpbi50c1wiKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICAgICAgcG9ydDogTnVtYmVyKHByb2Nlc3MuZW52LlZJVEVfUE9SVCksXHJcbiAgICAgICAgaG9zdDogdHJ1ZSxcclxuICAgICAgICB3YXRjaDoge1xyXG4gICAgICAgICAgICB1c2VQb2xsaW5nOiB0cnVlLCAvLyBkb2NrZXJcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxjQUFjLDhCQUE4QjtBQUNoVixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlO0FBTnhCLElBQU0sbUNBQW1DO0FBUXpDLE9BQU8sT0FBTyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQzlCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLFdBQVcsQ0FBQyxLQUFLLFFBQVEsa0NBQVcsNEJBQTRCLENBQUMsQ0FBQztBQUFBLElBQ2xFLHVCQUF1QjtBQUFBLElBQ3ZCLFFBQVEsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDL0IsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ0osY0FBYztBQUFBLE1BQ2QsVUFBVTtBQUFBLFFBQ04sTUFBTSxRQUFRLElBQUk7QUFBQSxRQUNsQixZQUFZLFFBQVEsSUFBSTtBQUFBLFFBQ3hCLGFBQWEsUUFBUSxJQUFJO0FBQUEsUUFDekIsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0g7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1Y7QUFBQSxRQUNKO0FBQUEsUUFDQSxTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUEsTUFDZjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLE1BQU0sUUFBUSxJQUFJLGFBQWEsZUFBZSxXQUFXO0FBQUEsRUFDekQsU0FBUztBQUFBO0FBQUEsSUFFTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxhQUFhLE1BQU0sVUFBVTtBQUFBLE1BQzFELEtBQUssS0FBSyxRQUFRLGtDQUFXLGFBQWEsSUFBSTtBQUFBLElBQ2xEO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUSxLQUFLLFFBQVEsa0NBQVcsVUFBVSxNQUFNO0FBQUEsSUFDaEQsYUFBYTtBQUFBLElBQ2IsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBLE1BQ1gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsYUFBYSxNQUFNLFNBQVM7QUFBQSxJQUMvRDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLFlBQVk7QUFBQSxJQUNaLE1BQU0sT0FBTyxRQUFRLElBQUksU0FBUztBQUFBLElBQ2xDLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNILFlBQVk7QUFBQTtBQUFBLElBQ2hCO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
