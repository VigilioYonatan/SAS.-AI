// vite.config.mjs
import { defineConfig, splitVendorChunkPlugin } from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/vite/dist/node/index.js";
import liveReload from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/vite-plugin-live-reload/dist/index.js";
import preact from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import million from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/million/dist/packages/compiler.mjs";
import path from "node:path";
import dotenv from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/dotenv/lib/main.js";
import { VitePWA } from "file:///C:/Users/vigilio/Desktop/aea/ts/saas/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\vigilio\\Desktop\\aea\\ts\\saas";
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
        start_url: "/",
        shortcuts: [
          { name: "Home", short_name: "Home", url: "/" },
          { name: "Login", short_name: "Login", url: "/auth/login" }
        ]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmlnaWxpb1xcXFxEZXNrdG9wXFxcXGFlYVxcXFx0c1xcXFxzYWFzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx2aWdpbGlvXFxcXERlc2t0b3BcXFxcYWVhXFxcXHRzXFxcXHNhYXNcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy92aWdpbGlvL0Rlc2t0b3AvYWVhL3RzL3NhYXMvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBzcGxpdFZlbmRvckNodW5rUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGxpdmVSZWxvYWQgZnJvbSBcInZpdGUtcGx1Z2luLWxpdmUtcmVsb2FkXCI7XHJcbmltcG9ydCBwcmVhY3QgZnJvbSBcIkBwcmVhY3QvcHJlc2V0LXZpdGVcIjtcclxuaW1wb3J0IG1pbGxpb24gZnJvbSBcIm1pbGxpb24vY29tcGlsZXJcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuXHJcbmRvdGVudi5jb25maWcoeyBwYXRoOiBcIi5lbnZcIiB9KTtcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBsaXZlUmVsb2FkKFtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vcmVzb3VyY2VzL3ZpZXdzLyoqLyouZWpzXCIpXSksXHJcbiAgICAgICAgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpLFxyXG4gICAgICAgIG1pbGxpb24udml0ZSh7IG1vZGU6IFwicHJlYWN0XCIgfSksXHJcbiAgICAgICAgcHJlYWN0KCksXHJcbiAgICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXHJcbiAgICAgICAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBwcm9jZXNzLmVudi5QV0FfTkFNRSxcclxuICAgICAgICAgICAgICAgIHNob3J0X25hbWU6IHByb2Nlc3MuZW52LlBXQV9OQU1FLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHByb2Nlc3MuZW52LlBXQV9ERVNDUklQVElPTixcclxuICAgICAgICAgICAgICAgIHRoZW1lX2NvbG9yOiBcIiMwMDBcIixcclxuICAgICAgICAgICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IFwiL2ltYWdlcy9zZXR0aW5ncy9vdGhlcnMvbG9nby53ZWJwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS93ZWJwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogXCIvaW1hZ2VzL3NldHRpbmdzL290aGVycy9sb2dvLndlYnBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3dlYnBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRfdXJsOiBcIi9cIixcclxuICAgICAgICAgICAgICAgIHNob3J0Y3V0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogXCJIb21lXCIsIHNob3J0X25hbWU6IFwiSG9tZVwiLCB1cmw6IFwiL1wiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBuYW1lOiBcIkxvZ2luXCIsIHNob3J0X25hbWU6IFwiTG9naW5cIiwgdXJsOiBcIi9hdXRoL2xvZ2luXCIgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICBdLFxyXG4gICAgcm9vdDogXCJyZXNvdXJjZXNcIixcclxuICAgIGJhc2U6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IFwiL2Rpc3QvXCIgOiBcIi9cIixcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICAvLyBSRVNPVVJDRVMgQUxJQVNcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJyZXNvdXJjZXNcIiwgXCJ0c1wiLCBcInNlcnZpY2VzXCIpLFxyXG4gICAgICAgICAgICBcIn5cIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJyZXNvdXJjZXNcIiwgXCJ0c1wiKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiLCBcImRpc3RcIiksXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgICAgbWFuaWZlc3Q6IHRydWUsXHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBpbnB1dDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJyZXNvdXJjZXNcIiwgXCJ0c1wiLCBcIm1haW4udHNcIiksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgICAgIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5WSVRFX1BPUlQpLFxyXG4gICAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICAgICAgd2F0Y2g6IHtcclxuICAgICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSwgLy8gZG9ja2VyXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThTLFNBQVMsY0FBYyw4QkFBOEI7QUFDblcsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sYUFBYTtBQUNwQixPQUFPLFVBQVU7QUFDakIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTtBQU54QixJQUFNLG1DQUFtQztBQVF6QyxPQUFPLE9BQU8sRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM5QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxXQUFXLENBQUMsS0FBSyxRQUFRLGtDQUFXLDRCQUE0QixDQUFDLENBQUM7QUFBQSxJQUNsRSx1QkFBdUI7QUFBQSxJQUN2QixRQUFRLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUFBLElBQy9CLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNKLGNBQWM7QUFBQSxNQUNkLFVBQVU7QUFBQSxRQUNOLE1BQU0sUUFBUSxJQUFJO0FBQUEsUUFDbEIsWUFBWSxRQUFRLElBQUk7QUFBQSxRQUN4QixhQUFhLFFBQVEsSUFBSTtBQUFBLFFBQ3pCLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNIO0FBQUEsWUFDSSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNWO0FBQUEsUUFDSjtBQUFBLFFBQ0EsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsV0FBVztBQUFBLFVBQ1AsRUFBRSxNQUFNLFFBQVEsWUFBWSxRQUFRLEtBQUssSUFBSTtBQUFBLFVBQzdDLEVBQUUsTUFBTSxTQUFTLFlBQVksU0FBUyxLQUFLLGNBQWM7QUFBQSxRQUM3RDtBQUFBLE1BQ0o7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsV0FBVztBQUFBLEVBQ3pELFNBQVM7QUFBQTtBQUFBLElBRUwsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsa0NBQVcsYUFBYSxNQUFNLFVBQVU7QUFBQSxNQUMxRCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxhQUFhLElBQUk7QUFBQSxJQUNsRDtBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFFBQVEsS0FBSyxRQUFRLGtDQUFXLFVBQVUsTUFBTTtBQUFBLElBQ2hELGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQSxJQUNWLGVBQWU7QUFBQSxNQUNYLE9BQU8sS0FBSyxRQUFRLGtDQUFXLGFBQWEsTUFBTSxTQUFTO0FBQUEsSUFDL0Q7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixZQUFZO0FBQUEsSUFDWixNQUFNLE9BQU8sUUFBUSxJQUFJLFNBQVM7QUFBQSxJQUNsQyxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDSCxZQUFZO0FBQUE7QUFBQSxJQUNoQjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
