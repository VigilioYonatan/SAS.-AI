import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration
import "../css/index.css";
import "@vigilio/sweet/sweet.min.css";
import { lazy } from "preact/compat";
import render from "./libs/preact";
import enviroments from "./config";
render(
    "App",
    lazy(() => import("./App"))
);

// auth
render(
    "LoginPage",
    lazy(() => import("@/web/views/auth/LoginPage"))
);
// ************** NO BORRAR ***************
// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(
    "%cVIGILIO SERVICES",
    "font-family:monospace;font-size:34px;color:#fff;text-shadow:2px 2px 4px #000000;font-weight:2rem",
    enviroments.VITE_VIGILIO_WEB
);
