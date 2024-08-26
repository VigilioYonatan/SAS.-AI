import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration
import "../css/index.css";
import "@vigilio/sweet/sweet.min.css";
import { lazy } from "preact/compat";
import render from "./libs/preact";
render(
    "App",
    lazy(() => import("./App"))
);

render(
    "App",
    lazy(() => import("@/auth/views/Auth"))
);
