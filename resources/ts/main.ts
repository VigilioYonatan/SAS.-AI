import "vite/modulepreload-polyfill"; //https://vitejs.dev/guide/backend-integration
import "../css/index.css";
import "@vigilio/sweet/sweet.min.css";
import { lazy } from "preact/compat";
import render from "./libs/preact";
import enviroments from "./config";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

AOS.init({
    duration: 1200, // Duración de la animación
    once: true, // Si quieres que la animación ocurra solo una vez
});
render(
    "Initial",
    lazy(() => import("@/Initial"))
);
render(
    "App",
    lazy(() => import("./App"))
);
render(
    "CategoriesPage",
    lazy(() => import("@/web/views/shop/CategoriesPage"))
);
render(
    "SubcategoriesPage",
    lazy(() => import("@/web/views/shop/SubcategoriesPage"))
);
render(
    "ShopPage",
    lazy(() => import("@/web/views/shop/ShopPage"))
);
render(
    "BrandPage",
    lazy(() => import("@/web/views/shop/BrandPage"))
);
render(
    "PedidosPage",
    lazy(() => import("@/web/views/pedidos/PedidosPage"))
);
render(
    "HomePage",
    lazy(() => import("@/web/views/home/HomePage"))
);
render(
    "AboutPage",
    lazy(() => import("@/web/views/home/AboutPage"))
);

// auth
render(
    "LoginPage",
    lazy(() => import("@/web/views/auth/LoginPage"))
);

render(
    "RegisterPage",
    lazy(() => import("@/web/views/auth/RegisterPage"))
);
render(
    "ProfilePage",
    lazy(() => import("@/web/views/auth/ProfilePage"))
);

// 404
render(
    "AuthForgotPassword",
    lazy(() => import("@/web/views/auth/AuthForgotPassword"))
);
render(
    "AuthConfirmPage",
    lazy(() => import("@/web/views/auth/AuthConfirmPage"))
);
render(
    "ProductPage",
    lazy(() => import("@/web/views/product/ProductPage"))
);
render(
    "ServicioPage",
    lazy(() => import("@/web/views/servicio/ServicioPage"))
);
// cart
render(
    "CartPage",
    lazy(() => import("@/web/views/cart/CartPage"))
);
render(
    "CartServicioPage",
    lazy(() => import("@/web/views/cart/CartServicioPage"))
);
render(
    "PageError",
    lazy(() => import("@/web/views/PageError"))
); // politica
render(
    "PrivacidadPage",
    lazy(() => import("@/web/views/politica/PrivacidadPage"))
);
render(
    "ReclamacionesPage",
    lazy(() => import("@/web/views/politica/ReclamacionesPage"))
);
render(
    "TerminosPage",
    lazy(() => import("@/web/views/politica/TerminosPage"))
);
// ************** NO BORRAR ***************
// biome-ignore lint/suspicious/noConsoleLog: <explanation>
console.log(
    "%cVIGILIO SERVICES",
    "font-family:monospace;font-size:34px;color:#fff;text-shadow:2px 2px 4px #000000;font-weight:2rem",
    enviroments.VITE_VIGILIO_WEB
);
