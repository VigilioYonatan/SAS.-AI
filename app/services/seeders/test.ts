import type { EmpresasStoreDto } from "@/empresas/dtos/empresas.store.dto";

export const test: Pick<
    EmpresasStoreDto,
    | "setting"
    | "gridBanners"
    | "files"
    | "backgrounds"
    | "categories"
    | "brands"
    | "pages"
> = {
    setting: {
        logo_width: 120,
        bg_color: "#c80000",
        bg_color_header: "#000000",
        bg_color_aside: "#000000",
        bg_color_background: "#ffffff",
        bg_color_footer: "#000000",
        bg_color_secondary: "#dc2626",
        type_animation: "fade-up",
        text_color: "transparent",
        background_auth: [
            {
                file: "images/settings/cb14aa25-020d-4ef5-90fd-49f7a3c78432msibkx100.webp",
                dimension: 100,
            },
            {
                file: "images/settings/58b155a0-2853-47ca-98fe-e375cfa9ac8fmsibox1600.webp",
                dimension: 1600,
            },
        ],
        font_face: "Exo",
        bg_color_paper: "#ffffff",
        bg_color_button: "#c80000",
        isCoverImage: true,
        isScrolling: false,
        type_loader: "null",
        is_hidde_total_cart: true,
        isDark: false,
        isLogoImage: false,
        is_block_aside: false,
        is_subcategory: false,
        is_service_page: false,
        position_header: true,
        bg_color_responsive: "#000000",
        border_title_type: "normal",
        type_star: "star",
        background_position: "start",
        header_type: "transparent",
        background_type: "first",
        type_icons: "normal",
        type_border: "circle",
        type_cart: "fas fa-shopping-bag",
        type_arrow: "third",
        type_map: "satelite",
        web_script:
            '/*\r\n\r\n    NO MODIFICAR ESTO, SI NO ERES DESARROLLADOR\r\n\r\n*/\r\n\r\nconst style = document.createElement("style")\r\nconst h1 = document.querySelector(\r\n    ".background-home-container \u003E div \u003E div \u003E div \u003E h1"\r\n);\r\nif (h1) {\r\n    const text = h1.textContent.trim(); // Elimina espacios al inicio o final\r\n    const words = text.split(" "); // Divide el texto en palabras\r\n    const lastWord = words.pop(); // Extrae la última palabra\r\n    const newText = words.join(" ") + ` \u003Cspan style="color: red;"\u003E${lastWord}\u003C/span\u003E`; // Reconstruye el texto con la última palabra en un span\r\n    h1.innerHTML = newText; // Actualiza el contenido del h1\r\n}\r\nstyle.innerHTML = `\r\n.background-home .slick-slide \u003E div{\r\n    padding: 0px 0px !important;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div {\r\n    gap: 2.5rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E h1{\r\n    font-size: 4.5rem;\r\n    line-height: 4.5rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E p{\r\n    color: white;\r\n    font-size: 1rem;\r\n    line-height: 1.5rem;\r\n    width:90%;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E a{\r\n    border-radius: 0.3rem;\r\n    padding: 0.8rem 2rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E a:hover{\r\n    transform: scale(1.1);\r\n    background-color: white;\r\n    color: var(--primary) !important;\r\n}\r\n\r\n.grid-banner-0 {\r\n    padding: 0rem 1.2rem;\r\n    transform: translateY(-10rem);\r\n}\r\n@media screen and (max-width:700px){\r\n    \r\n    .background-home-container \u003E div \u003E div \u003E div {\r\n        gap: 1.5rem;\r\n    }\r\n    .background-home-container \u003E div \u003E div \u003E div \u003E h1{\r\n        font-size: 3.5rem;\r\n        line-height: 3.5rem;\r\n    }\r\n    .background-home-container \u003E div \u003E div \u003E div \u003E p{\r\n        color: white;\r\n        font-size: 1rem;\r\n        line-height: 1.5rem;\r\n        width:90%;\r\n    }\r\n    .background-home-container \u003E div \u003E div \u003E div \u003E a{\r\n        border-radius: 0.3rem;\r\n        padding: 0.8rem 2rem;\r\n    }\r\n    .grid-banner-0 {\r\n        padding: 0rem 1.2rem;\r\n        transform: translateY(-5rem);\r\n    }\r\n    .grid-banner-0 \u003E div \u003E .grid-banner-0-1 {\r\n       grid-area: span 2 / span 1 / span 2 / span 1 !important;\r\n    }\r\n    .grid-banner-0 \u003E div \u003E .grid-banner-0-3 {\r\n       grid-area: span 3 / span 1 / span 3 / span 1 !important;\r\n    }\r\n    .grid-banner-0 \u003E div \u003E div {\r\n        grid-area: span 1 / span 1 / span 1 / span 1 !important;\r\n    }\r\n}\r\n\r\n.grid-banner-0 .banners-0 \u003E div {\r\n    border-radius: 0.5rem;\r\n\r\n}\r\n.grid-banner-0 .banners-0 \u003E .grid-banner-0-1 \u003E div, .grid-banner-0 .banners-0 \u003E .grid-banner-0-3 \u003E div {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items:center;\r\n}\r\n.grid-banner-0 .banners-0 \u003E .grid-banner-0-1 \u003E div \u003E div, .grid-banner-0 .banners-0 \u003E .grid-banner-0-3 \u003E div \u003E div{\r\n    align-self: auto;\r\n}\r\n.grid-banner-0 .banners-0 \u003E div \u003E div \u003E div \u003E a {\r\n    border-radius: 0.5rem;\r\n}\r\n\r\n\r\n .product-card {\r\n    border: 1px solid #e2e2e2;\r\n}\r\n.product-card header{\r\n    padding: 0.5rem;\r\n    border-radius: 0.5rem !important;\r\n    overflow: hidden !important;\r\n}\r\n.product-card header img{\r\n    border-radius: 0.5rem !important;\r\n    overflow: hidden !important;\r\n}\r\n\r\n.product-card a{\r\n   font-family: Font-Bold, serif;\r\n   height: auto !important;\r\n}\r\n.product-card header img{\r\n    width: 100%;\r\n}\r\n.product-card .md-rating-star--full img{\r\n    width: 15px;\r\n    height: 15px;\r\n}\r\n\r\n.product-users-section .product-card {\r\n    border: 0px solid #e2e2e2;\r\n}\r\n\r\n.title-section h3{\r\n    text-transform: capitalize !important;\r\n    font-family: Helvetica !important;\r\n    font-size: 2rem !important;\r\n    font-weight: bold;\r\n}\r\n\r\n.categories-section-slide .slick-slide \u003E div \u003E a{\r\n border: 1px solid #e2e2e2;\r\n}\r\n\r\n.product-users-section \u003E div{\r\n    border: 1px solid #e2e2e2;\r\n}\r\n\r\n.post-section .slick-slide \u003E div \u003E div{\r\n    border: 1px solid #e2e2e2;\r\n}\r\n\r\nhome-page .offer-section{\r\n    position: relative;\r\n    top: -5rem;\r\n}\r\n@media screen and (min-width: 700px){\r\n    home-page .offer-section{\r\n        top: -10rem;\r\n    }\r\n}\r\nhome-page .categories-section{\r\n  position: relative;\r\n    top: -4rem;\r\n}\r\n\r\n.auth-page .image-logo{\r\n    filter: drop-shadow(1px 1px black);\r\n}\r\n\r\n.grid-banner-2{\r\n    max-width: none !important;\r\n}\r\n.post-section{\r\n    color: white;\r\n}\r\n.post-section::after{\r\n    content:"";\r\n    position: absolute;\r\n    width:100%;\r\n    left:0;\r\n    right:0;\r\n    height:300px;\r\n    background-color: black;\r\n    z-index:-1;\r\n}\r\n\r\n.users-section .card-user {\r\n    width: 100%;\r\n    border: 1px solid #e2e2e2;\r\n}\r\n.users-section .card-user img{\r\n    width: 100%;\r\n    border-radius: 0px;\r\n}\r\n\r\n.product-users-section \u003E div \u003E div \u003E div \u003E  h3 {\r\n    width: 100%;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.email-promotion{\r\n    padding: 2rem 0.5rem 4rem 0.5rem;\r\n}\r\n.email-promotion \u003E div{\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 1.6rem;\r\n}\r\n.email-promotion .news{\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap:0.5rem;\r\n    align-items:center;\r\n    justify-content: center;\r\n}\r\n.email-promotion .news h3{\r\n    color: var(--primary);\r\n    font-size: 1.8rem;\r\n    font-family: \'Font-Bold\';\r\n    text-align:center;\r\n}\r\n.email-promotion .news p{\r\n    color: black;\r\n    font-size: 1rem;\r\n    font-family: \'Font-Regular\';\r\n    text-align:center;\r\n}\r\n\r\n.email-promotion form {\r\n    gap: 0rem;\r\n    align-items: normal;\r\n}\r\n.email-promotion form \u003E div{\r\n    margin: 0;\r\n}\r\n.email-promotion form \u003E div \u003E div \u003E div{\r\n    border-radius: 0.5rem 0 0 0.5rem;\r\n    margin: 0;\r\n    height: 3rem;\r\n    background-color:white;\r\n    border-color: var(--border);\r\n}\r\n.email-promotion form \u003E div \u003E div{\r\n    border-radius: 0.5rem 0 0 0.5rem;\r\n}\r\n.email-promotion form \u003E button{\r\n    margin-top: 0;\r\n    border-radius: 0rem 0.5rem 0.5rem 0rem;\r\n    letter-spacing: 0.055em;\r\n}\r\n.email-promotion form  label{\r\n    display: none;\r\n}\r\n\r\nhome-page .find-section{\r\n    display: none;\r\n}\r\n`\r\n\r\n\r\n// quitar efecto de hover productcard\r\nconst productCardheaderImg  = document.querySelectorAll(".product-card header img")\r\nArray.from(productCardheaderImg).map((card)=\u003E{\r\n    card.classList.remove("group-hover:scale-105")\r\n})\r\n\r\n// agregar efecto\r\nconst backgroundHomeContainer = document.querySelectorAll(".banners-0 div a")\r\nArray.from(backgroundHomeContainer).map((card)=\u003E{\r\n    card.classList.add("animation-brightness")\r\n    card.style.cssText = `--brightness-delay: 6s;`;\r\n})\r\n\r\n\r\nconst emailPromotion = document.querySelector(".email-promotion")\r\nif(emailPromotion){\r\n   const containerEmailPromotion =  emailPromotion.children[0];\r\n   const div = h("div");\r\n    div.innerHTML = `\u003Cdiv class="news"\u003E\r\n    \u003Cdiv class="flex gap-2 items-center"\u003E\r\n        \u003Ci class="fas fa-envelope-open text-primary text-3xl"\u003E\u003C/i\u003E\r\n        \u003Ch3\u003ESuscríbete al boletín\u003C/h3\u003E\r\n    \u003C/div\u003E\r\n    \u003Cp\u003EPuede darse de baja en cualquier momento. Para ello, encuentre nuestra información de contacto en el aviso legal.\u003C/p\u003E\r\n   \u003C/div\u003E\r\n   `;\r\n   containerEmailPromotion.prepend(div.firstElementChild);\r\n}\r\ndocument.head.appendChild(style)',
        header_position: {
            logo: 1,
            navbar: 2,
            icons: 3,
        },
        header: {
            home: true,
            shop: true,
            profile: true,
            about: true,
            pedidos: true,
            condiciones: false,
            categories: true,
            subcategories: true,
            services: true,
        },
        type_card: "normal",
        type_product_buttons: "second",
        type_icons_bars: "light",
        is_hover_product: true,
        isProductWallpaper: false,
        hamburger: "fas fa-bars",
        products_limit: 4,
        products_limit_offer: 4,
        shows: {
            map: false,
            about: true,
            cards: false,
            brands: true,
            android: true,
            offers_section: false,
            offers_user: true,
            categories_slider: true,
            users: true,
        },
        isEccomerce: true,
        isLogin: true,
        isCuota: true,
        multi_lenguaje: {
            default: "es",
            languages: ["es", "en"],
            type: "emergente",
        },
    },
    gridBanners: [
        {
            id: 15,
            title: null,
            enabled: true,
            html: '\u003Cdiv x-data="{ \n    empresa:JSON.parse(localStorage.getItem(\'empresa\')),\n }" class="banner-1-custom  gap-4" \u003E\n\n \u003Cdiv class="h-full w-full relative  rounded-md overflow-hidden flex justify-center items-center group" \u003E\n  \u003Cimg data-image="1" class="h-full object-cover absolute inset-0 w-full hover:scale-110 delay-custom-1"  width="500" height="500" alt="image-banner-1" title="image-banner-1" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-1.webp`"/\u003E\n  \u003Cdiv\u003E\n    \u003Ca href="" class="uppercase bg-primary px-4 py-2 rounded-md hover:bg-white text-xs hover:text-primary font-bold border border-primary" style="z-index: 10" data-label="1"\u003EOrder Now\u003C/a\u003E\n  \u003C/div\u003E\n \u003C/div\u003E\n \u003Cdiv class="flex  w-full gap-4 h-full"\u003E\n    \u003Cdiv class="relative h-full rounded-md overflow-hidden w-full flex justify-start items-center"\u003E\n        \u003Cimg data-image="2" class="h-full object-cover absolute inset-0 w-full hover:scale-110 delay-custom-1" width="500" height="500" alt="image-banner-2" title="image-banner-2" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-2.webp`"/\u003E\n        \u003Cdiv style="z-index: 10; width: 80%; margin: 1rem" class="flex flex-col gap-4 items-start"\u003E\n            \u003Cdiv\u003E\n                \u003Cspan class="font-bold text-primary text-3xl"\u003ESpecial \u003C/h3\u003E\n                \u003Cspan class="font-bold text-white text-3xl"\u003ECombo\u003C/span\u003E\n            \u003C/div\u003E\n            \u003Cp class="font-bold text-white" style="width: 50%"\u003EThis combo for online order on today\u003C/p\u003E\n            \u003Ca href="" class="uppercase bg-primary px-4 py-2 rounded-md hover:bg-white text-xs hover:text-primary font-bold border border-primary"  data-label="1"\u003EOrder Now\u003C/a\u003E\n        \u003C/div\u003E\n    \u003C/div\u003E\n    \u003Cdiv class="relative h-full rounded-md overflow-hidden w-full flex justify-start items-center"\u003E\n        \u003Cimg  data-image="3" class="h-full object-cover absolute inset-0 w-full hover:scale-110 delay-custom-1" width="500" height="500" alt="image-banner-3" title="image-banner-3" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-3.webp`"/\u003E\n        \u003Cdiv style="z-index: 10; width: 80%; margin: 1rem" class="flex flex-col gap-4 items-start"\u003E\n            \u003Cdiv\u003E\n                \u003Cspan class="font-bold text-white text-3xl"\u003ENew \u003C/h3\u003E\n                \u003Cspan class="font-bold text-primary text-3xl"\u003ERecipe\u003C/span\u003E\n            \u003C/div\u003E\n            \u003Cp class="font-bold text-white" style="width: 50%"\u003EExtra-virgin olive oil, garlic, mozzarella cheese.\u003C/p\u003E\n            \u003Ca href="" class="uppercase bg-primary px-4 py-2 rounded-md hover:bg-white text-xs hover:text-primary font-bold border border-primary"  data-label="1"\u003EOrder Now\u003C/a\u003E\n        \u003C/div\u003E\n    \u003C/div\u003E\n \u003C/div\u003E\n \u003Cdiv class="h-full relative rounded-md overflow-hidden flex" style="min-width: 260px"\u003E\n  \u003Cimg  data-image="4" class="h-full absolute inset-0 w-full hover:scale-110 delay-custom-1"  width="500" height="500" alt="image-banner-4" title="image-banner-4" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-5.webp`"/\u003E\n   \u003Cdiv style="z-index: 10;  position: relative; margin-bottom:5rem; width: 100%;" class="flex flex-col gap-4 items-center justify-center"\u003E\n        \u003Cp class="font-bold text-white text-center" \u003EExtra-virgin olive oil, garlic, mozzarella cheese.\u003C/p\u003E\n        \u003Ca href="" class="uppercase bg-primary px-4 py-2 rounded-md hover:bg-white text-xs hover:text-primary font-bold border border-primary"  data-label="1"\u003EOrder Now\u003C/a\u003E\n    \u003C/div\u003E\n \u003C/div\u003E\n\u003C/div\u003E\n\u003Cstyle\u003E\n    .banner-1-custom {\n        display: flex;\n        flex-direction:column;\n        height: 1500px;  \n    }\n    .banner-1-custom \u003E div:nth-child(2) {\n        flex-direction:column;\n    }\n    .banner-1-custom a:hover{\n        color: var(--primary) !important;\n    }\n    @media screen and (min-width:700px){\n        .banner-1-custom {\n            flex-direction:row;\n            height: 500px;\n        }\n       \n    }\n\n\u003C/style\u003E',
            empresa_id: 4,
        },
        {
            id: 16,
            title: null,
            enabled: true,
            html: '\u003C!-- NO MODIFICAR ESTO, SI NO ERES DESARROLLADOR --\u003E\r\n\u003Cdiv x-data="{slug: JSON.parse(localStorage.getItem(\'empresa\')).slug}" class="grid banner-1-container px-2"\u003E\r\n    \u003Cdiv style="padding: 2rem 2rem;" class="flex flex-col gap-2 justify-center items-center"\u003E\r\n        \u003Cimg  data-image="1"\r\n            width="63"\r\n            height="63"\r\n            title="ico-1"\r\n            alt="ico-1"\r\n            :src="`/empresas/${slug}/images/files/icon-1.webp`"\r\n        /\u003E\r\n        \u003Cspan class="text-black font-semibold text-center dark:text-white" data-label="1"\u003EEnvío Rápido\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="2"\u003E\r\n            On all orders over $49.00\r\n        \u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv style="padding: 2rem 2rem;" class="flex flex-col gap-2 justify-center items-center"\u003E\r\n        \u003Cimg  data-image="2"\r\n            width="63"\r\n            height="63"\r\n            title="ico-1"\r\n            alt="ico-1"\r\n            :src="`/empresas/${slug}/images/files/ico-2.webp`"\r\n        /\u003E\r\n        \u003Cspan class="text-black font-semibold text-center dark:text-white" data-label="3"\u003EEnvio gratuito\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="4"\u003E\r\n            ¡Aprovecha el envío gratuito en tu pedido!\r\n        \u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv style="padding: 2rem 2rem;" class="flex flex-col gap-2 justify-center items-center"\u003E\r\n        \u003Cimg  data-image="3"\r\n            width="63"\r\n            height="63"\r\n            title="ico-3"\r\n            alt="ico-3"\r\n            :src="`/empresas/${slug}/images/files/ico-3.webp`"\r\n        /\u003E\r\n        \u003Cspan class="text-black font-semibold text-center dark:text-white" data-label="5"\u003ECompra segura\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="6"\u003E\r\n            100% protegido\r\n        \u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv style="padding: 2rem 2rem;" class="flex flex-col gap-2 justify-center items-center"\u003E\r\n        \u003Cimg  data-image="4"\r\n            width="63"\r\n            height="63"\r\n            title="ico-4"\r\n            alt="ico-4"\r\n            :src="`/empresas/${slug}/images/files/ico-4.webp`"\r\n        /\u003E\r\n        \u003Cspan class="text-black font-semibold text-center dark:text-white" data-label="7"\u003EGarantía 100%\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="8"\u003E\r\n            Garantía de devolución de dinero\r\n        \u003C/p\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\r\n\u003Cstyle\u003E\r\n    .form-html-editor .grid-banner-1, app .grid-banner-1 {\r\n        position: relative;\r\n        top: 0rem !important;\r\n    }\r\n    home-page .grid-banner-1 {\r\n        padding: 0rem 1.5rem;\r\n        position: relative;\r\n        top: -5rem;\r\n    }\r\n\r\n    .banner-1-container {\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n        gap: 0rem;\r\n    }\r\n    @media screen and (min-width: 800px) {\r\n        .banner-1-container {\r\n            padding: 2rem 0rem;\r\n            grid-template-columns: repeat(4, minmax(0, 1fr));\r\n        }\r\n    }\r\n\u003C/style\u003E\r\n',
            empresa_id: 4,
        },
        {
            id: 17,
            title: null,
            enabled: true,
            html: '\u003Cdiv \r\n    x-data="{slug: JSON.parse(localStorage.getItem(\'empresa\')).slug}" \r\n    class="" \r\n    :style="`background-image: url(\'/empresas/${slug}/images/files/wallpaper-1.webp\'); height: 600px; background-size: cover; background-repeat: no-repeat; width: 100%`"\r\n\u003E\r\n    \u003Cdiv class="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto h-full"\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cdiv class="relative"\u003E\r\n                \u003Cimg \r\n                    class="mb-2" \r\n                    width="300" \r\n                    height="300" \r\n                    alt="offer" \r\n                    title="offer" \r\n                    :src="`/empresas/${slug}/images/files/offer.webp`"\r\n                /\u003E\r\n                \u003Cspan \r\n                    class="font-bold text-primary absolute top" \r\n                    style="transform: rotate(30deg); top: 45px; left: 120px; font-size: 2.5rem;" \r\n                    data-label="0"\r\n                \u003E\r\n                    50%\r\n                \u003C/span\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex flex-col gap-4 justify-center items-center w-6/12"\u003E\r\n            \u003Cspan class="text-primary font-semibold text-3xl" data-label="1"\u003E\r\n                Delicious Taste\r\n            \u003C/span\u003E\r\n            \u003Ch3 class="text-white text-6xl font-bold text-center" data-label="2"\u003E\r\n                Fast Food\r\n            \u003C/h3\u003E\r\n            \u003Cp class="text-white font-semibold text-center" data-label="3"\u003E\r\n                You are feeling hungry! Let order your favorite food.\r\n            \u003C/p\u003E\r\n            \u003Ca \r\n                href="/shop" \r\n                style="--brightness-delay: 8s;" \r\n                class="bg-primary animation-brightness rounded-md text-sm md:text-base background-home-button-1 text-white hover:text-primary border delay-custom-1 border-primary px-4 py-2 font-semibold tracking-wider" \r\n                data-label="4"\r\n            \u003E\r\n                Order Now\r\n            \u003C/a\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n',
            empresa_id: 4,
        },
        {
            id: 18,
            title: null,
            enabled: true,
            html: '\u003Cdiv x-data="{  \n    empresa:JSON.parse(localStorage.getItem(\'empresa\')),\n    tnsInstance: null,\n    initSlider() {\n        const formSlider = document.querySelector(\'.form-html-editor .slider-custom\')\n        if(!formSlider){\n            this.tnsInstance = tns({\n                container: this.$refs.slider,\n                items: 1, \n                slideBy: \'page\', \n                autoplay: true,\n                autoplayButtonOutput: false,  \n                infinite: true,  \n                nav: false,  \n                controls: false, \n                mouseDrag: true,\n                swipeAngle: false, \n                speed: 300,  \n                lazyload: true,  \n            });\n        }\n    }\n}" x-init="initSlider()" class="relative slider-custom overflow-hidden" style="height:500px; width: 100%; "\u003E\n    \u003Cimg width="1000" height="1000" class="absolute inset-0 w-full h-full object-cover" :src="`/empresas/${empresa.slug}/images/files/banner-3-image-1.webp`"\u003E\n    \u003Cdiv class="my-slider" style="max-width: 75rem; margin: 0 auto;position:relative"\u003E\n        \u003Cdiv x-ref="slider" class="my-slider-container flex justify-center items-center relative" data-array="1"\u003E\n            \u003Cdiv class="flex flex-col gap-4   justify-center items-center " style="display: flex; "\u003E\n                \u003Cimg data-image="evqcjih7p8" width="100" height="100" alt="profile" title="profile" :src="`/empresas/${empresa.slug}/images/files/banner-3-profile-1.webp`" class="slider-image"\u003E\n                \u003Cdiv x-data="{ rating:  Math.floor(Math.random() * 2) + 4 }" class="star-rating"\u003E\n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 1, \'text-gray-400\': rating \u003C 1 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 2, \'text-gray-400\': rating \u003C 2 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 3, \'text-gray-400\': rating \u003C 3 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 4, \'text-gray-400\': rating \u003C 4 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 5, \'text-gray-400\': rating \u003C 5 }" class="star"\u003E★\u003C/span\u003E\n                \u003C/div\u003E\n                \u003Cp class="text-white font-semibold text-center" data-label="vturvtinq8"\u003EPicas has everything you need - appetizers, salad sandwiches, you can name it. They were extremely enthusiastic and attentive. We ended up with an extremely attractive menu. Thanks Picas!!!\u003C/p\u003E\n                \u003Cdiv class="text-white flex flex-col items-center justify-center"\u003E\n                    \u003Cspan class="font-bold text-center" data-label="ki92skel88"\u003EJohn Doe\u003C/span\u003E\n                    \u003Cspan class="font-semibold text-center" data-label="c2bpstn88g"\u003ECustomer\u003C/span\u003E\n                \u003C/div\u003E\n            \u003C/div\u003E\n            \n        \u003Cdiv class="flex flex-col gap-4   justify-center items-center " style="display: flex; "\u003E\n                \u003Cimg data-image="t5717fjqj" width="100" height="100" alt="profile" title="profile" :src="`/empresas/${empresa.slug}/images/files/banner-3-profile-2.webp`" class="slider-image"\u003E\n                \u003Cdiv x-data="{ rating:  Math.floor(Math.random() * 2) + 4 }" class="star-rating"\u003E\n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 1, \'text-gray-400\': rating \u003C 1 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 2, \'text-gray-400\': rating \u003C 2 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 3, \'text-gray-400\': rating \u003C 3 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 4, \'text-gray-400\': rating \u003C 4 }" class="star"\u003E★\u003C/span\u003E\n                    \n                    \u003Cspan x-bind:class="{ \'text-yellow-500\': rating \u003E= 5, \'text-gray-400\': rating \u003C 5 }" class="star"\u003E★\u003C/span\u003E\n                \u003C/div\u003E\n                \u003Cp class="text-white font-semibold text-center" data-label="22n5jaa33g"\u003EPicas has everything you need - appetizers, salad sandwiches, you can name it. They were extremely enthusiastic and attentive. We ended up with an extremely attractive menu. Thanks Picas!!!\u003C/p\u003E\n                \u003Cdiv class="text-white flex flex-col items-center justify-center"\u003E\n                    \u003Cspan class="font-bold text-center" data-label="qdg6uhls5g"\u003EJohn Doe\u003C/span\u003E\n                    \u003Cspan class="font-semibold text-center" data-label="864om14fmg"\u003ECustomer\u003C/span\u003E\n                \u003C/div\u003E\n            \u003C/div\u003E\u003C/div\u003E\n    \u003C/div\u003E\n\u003C/div\u003E\n\u003Cstyle\u003E\n    .grid-banner-3  {\n        max-width: none !important;\n    }\n    .grid-banner-3 .my-slider-container {\n        width: 100%;\n        height: 500px;\n        overflow: hidden;\n    }\n    \n    .my-slider-container p {\n        width: 90%;\n    }\n    @media screen and (min-width:700px){\n         .my-slider-container p {\n            width: 60%;\n        }\n    }\n    \n    .slider-image {\n        width: 100px;\n        border-radius: 100%;\n        height: auto;\n    }\n    .star-rating {\n        display: inline-block;\n        font-size: 2rem;\n    }\n\n    .star {\n        transition: color 0.2s;\n    }\n    .form-html-editor .tns-slider {\n        transform: none !important;\n    }\n    .form-html-editor .my-slider{\n        height: auto !important;\n    }\n    .form-html-editor .my-slider-container {\n        overflow: auto !important;\n    }\n\u003C/style\u003E',
            empresa_id: 4,
        },
        {
            id: 19,
            title: null,
            enabled: false,
            html: null,
            empresa_id: 4,
        },
    ],
    files: [
        {
            id: 6,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/wallpaper-1.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 7,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/offer.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 2,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/icon-1.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 3,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/ico-2.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 4,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/ico-3.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 5,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/ico-4.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 60,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-1-image-1.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 61,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-1-image-2.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 62,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-1-image-3.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 63,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-1-image-5.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 64,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-3-image-1.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 65,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-3-profile-1.webp",
                },
            ],
            empresa_id: 4,
        },
        {
            id: 66,
            file: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/files/banner-3-profile-2.webp",
                },
            ],
            empresa_id: 4,
        },
    ],
    pages: [],
    backgrounds: [
        {
            id: 6,
            html: null,
            image: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/background/1b4c2697-f85a-4ec4-9d74-12bd39f92dde0ctlfx100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/background/766a031a-bf0f-46a8-a976-df95a5302e380ctljx1600.webp",
                    dimension: 1600,
                },
            ],
            empresa_id: 4,
        },
    ],
    categories: [
        {
            id: 11,
            category_code: "CAT-000002",
            name: "Pizza",
            isService: false,
            image: [
                {
                    dimension: 100,
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/categories/pizzaglfrsx100.webp",
                },
                {
                    dimension: 800,
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/categories/pizzaglfrvx800.webp",
                },
            ],
            wallpaper: null,
            icon: '\u003Ci class="fa fa-pizza-slice"\u003E\u003C/i\u003E',
            slug: "pizza",
            empresa_id: 4,
            subcategories: [],
            productsNormals: [],
            productsRestaurants: [
                {
                    price: 33,
                    discount: 0,
                    id: 8,
                    product_code: "PROD-000008",
                    name: "Pizza Hawaiana",
                    url: null,
                    description: null,
                    characteristics: [],
                    stock: 5,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pizza-hawaianabi6enx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pizza-hawaianabi6erx500.webp",
                        },
                    ],
                    slug: "pizza-hawaiana",
                    category_id: 11,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 23,
                    discount: 5,
                    id: 9,
                    product_code: "PROD-000009",
                    name: "Pizza Americana",
                    url: null,
                    description:
                        "Pizza Americana: Disfruta de una auténtica pizza al estilo americano, con una base gruesa y esponjosa, cubierta con una abundante capa de salsa de tomate, irresistible queso mozzarella fundido y tus ingredientes favoritos. Perfecta para compartir con amigos y familiares, cada porción está repleta de sabor y textura. Ideal para cualquier ocasión, ya sea una cena informal o una fiesta. Personaliza tu pizza con una variedad de ingredientes, desde pepperoni y champiñones hasta pimientos y aceitunas. ¡Atrévete a saborear la tradición de la pizza americana en cada bocado!",
                    characteristics: [
                        {
                            name: "Estilo",
                            value: "Pizza de tipo americano",
                        },
                        {
                            name: "Masa",
                            value: "Crujiente o gruesa",
                        },
                        {
                            name: "Salsa",
                            value: "Salsa de tomate abundante",
                        },
                        {
                            name: "Queso",
                            value: "Mozzarella, a menudo mezclada con otros quesos",
                        },
                        {
                            name: "Coberturas",
                            value: "Variadas, incluyen pepperoni, jamón, champiñones, pimientos",
                        },
                        {
                            name: "Tamaño",
                            value: "Generalmente más grande que otras variedades",
                        },
                        {
                            name: "Corte",
                            value: "A menudo cortada en triángulos grandes",
                        },
                        {
                            name: "Origen",
                            value: "Desarrollada en Estados Unidos en el siglo 20",
                        },
                        {
                            name: "Cocción",
                            value: "Horneada a altas temperaturas",
                        },
                        {
                            name: "Variedades",
                            value: "Pizza de Chicago, Pizza de Nueva York, entre otras",
                        },
                        {
                            name: "Consumo",
                            value: "Popular en reuniones y eventos sociales",
                        },
                        {
                            name: "Textura",
                            value: "Exterior crujiente, interior suave",
                        },
                        {
                            name: "Presentación",
                            value: "Frecuentemente servida en cajas de cartón",
                        },
                        {
                            name: "Accesorios",
                            value: "A menudo acompañada de salsa de ajo o picante",
                        },
                        {
                            name: "Popularidad",
                            value: "Una de las comidas más consumidas en EE.UU.",
                        },
                        {
                            name: "Nutrición",
                            value: "Puede ser rica en grasas y carbohidratos",
                        },
                        {
                            name: "Adaptaciones",
                            value: "Existen versiones vegetarianas y veganas",
                        },
                        {
                            name: "Experiencia",
                            value: "Frecuentemente disfrutada en pizzerías o delivery",
                        },
                        {
                            name: "Innovación",
                            value: "Nuevas recetas con ingredientes locales",
                        },
                    ],
                    stock: 34,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pizza-americanabkeh6x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pizza-americanabkehex500.webp",
                        },
                    ],
                    slug: "pizza-americana",
                    category_id: 11,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 69,
                    discount: 10,
                    id: 12,
                    product_code: "PROD-000012",
                    name: "Pepperoni Pizza",
                    url: null,
                    description:
                        "Disfruta de nuestra deliciosa Pizza de Pepperoni, elaborada con una masa crujiente y suave, cubierta con una rica salsa de tomate y generosas porciones de queso mozzarella fundido. Cada rebanada está adornada con sabrosas y picantes rodajas de pepperoni, que aportan un toque irresistible. Perfecta para compartir en cualquier ocasión, nuestra pizza es ideal para una cena en familia, una noche de películas o una reunión con amigos. ¡Satisfacción garantizada con cada bocado!",
                    characteristics: [
                        {
                            name: "Tipo de comida",
                            value: "Pizza",
                        },
                        {
                            name: "Base",
                            value: "Masa de pizza",
                        },
                        {
                            name: "Salsa",
                            value: "Salsa de tomate",
                        },
                        {
                            name: "Queso",
                            value: "Queso mozzarella",
                        },
                        {
                            name: "Topping principal",
                            value: "Rodajas de pepperoni",
                        },
                        {
                            name: "Textura",
                            value: "Crujiente por fuera, suave por dentro",
                        },
                        {
                            name: "Sabor",
                            value: "Salado y especiado",
                        },
                        {
                            name: "Tamaño promedio",
                            value: "Individual o familiar",
                        },
                        {
                            name: "Método de cocción",
                            value: "Horneada",
                        },
                        {
                            name: "Origen",
                            value: "Estados Unidos",
                        },
                        {
                            name: "Popularidad",
                            value: "Alta en restaurantes y pizzerías",
                        },
                        {
                            name: "Variedades",
                            value: "Pizza estilo Chicago, Napolitana, entre otras",
                        },
                        {
                            name: "Opciones veganas",
                            value: "Disponibles en algunas pizzerías",
                        },
                        {
                            name: "Acompañamientos",
                            value: "Salsas, ensaladas",
                        },
                        {
                            name: "Consumo",
                            value: "Fácil de compartir",
                        },
                        {
                            name: "Alergias",
                            value: "Contiene lactosa y gluten",
                        },
                        {
                            name: "Valor nutricional",
                            value: "Alto en grasas y carbohidratos",
                        },
                    ],
                    stock: 3,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pepperoni-pizzanokrlx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/pepperoni-pizzanokrox500.webp",
                        },
                    ],
                    slug: "pepperoni-pizza",
                    category_id: 11,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 78,
                    discount: 0,
                    id: 13,
                    product_code: "PROD-000013",
                    name: "Margherita",
                    url: null,
                    description:
                        "Deléitate con nuestra clásica Pizza Margherita, elaborada con una base de masa artesanal, crujiente y esponjosa. Cada pizza está cubierta con una suave salsa de tomate 100% natural, mozzarella de alta calidad y hojas frescas de albahaca, creando una combinación de sabores auténticos y frescos. Ideal para los amantes de la pizza que buscan disfrutar de un plato tradicional italiano en su máxima expresión. Perfecta para compartir o saborear en cualquier momento del día. ¡Un verdadero festín para los sentidos!",
                    characteristics: [
                        {
                            name: "Nombre",
                            value: "Pizza Margherita",
                        },
                        {
                            name: "Origen",
                            value: "Italia",
                        },
                        {
                            name: "Ingredientes principales",
                            value: "Tomate, mozzarella, albahaca",
                        },
                        {
                            name: "Sabor",
                            value: "Equilibrado entre dulce y salado",
                        },
                        {
                            name: "Textura de la masa",
                            value: "Crujiente por fuera, suave por dentro",
                        },
                        {
                            name: "Método de cocción",
                            value: "Horno de leña tradicional",
                        },
                        {
                            name: "Variantes",
                            value: "Algunas versiones incluyen aceite de oliva",
                        },
                        {
                            name: "Tamaño típico",
                            value: "Entre 30 y 50 cm de diámetro",
                        },
                        {
                            name: "Presentación",
                            value: "Cortada en porciones triangulares",
                        },
                        {
                            name: "Colores representativos",
                            value: "Rojo, blanco y verde",
                        },
                        {
                            name: "Popularidad",
                            value: "Una de las pizzas más famosas del mundo",
                        },
                        {
                            name: "Acompañamientos recomendados",
                            value: "Vino tinto o agua con gas",
                        },
                        {
                            name: "Nutrición",
                            value: "Una opción relativamente ligera",
                        },
                        {
                            name: "Cultura",
                            value: "Símbolo de la gastronomía italiana",
                        },
                        {
                            name: "Historia",
                            value: "Creada en 1889 en honor a la reina Margherita de Saboya",
                        },
                        {
                            name: "Simbolismo",
                            value: "Colores de la bandera italiana",
                        },
                        {
                            name: "Ideal para",
                            value: "Reuniones familiares y eventos sociales",
                        },
                        {
                            name: "Popularidad internacional",
                            value: "Ampliamente reconocida y servida en restaurantes de todo el mundo",
                        },
                        {
                            name: "Dificultad de preparación",
                            value: "Moderada",
                        },
                        {
                            name: "Tiempo de cocción",
                            value: "Poco tiempo, alrededor de 90 segundos a alta temperatura",
                        },
                        {
                            name: "Estilo de servicio",
                            value: "Normalmente se sirve caliente",
                        },
                        {
                            name: "Tendencias actuales",
                            value: "Cada vez más opciones veganas y sin gluten",
                        },
                        {
                            name: "Inspiración local",
                            value: "Variantes regionales en Italia con ingredientes locales",
                        },
                        {
                            name: "Recomendación de chefs",
                            value: "Usar ingredientes frescos y de alta calidad",
                        },
                    ],
                    stock: 4,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/margheritansb36x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/margheritansb3cx500.webp",
                        },
                    ],
                    slug: "margherita",
                    category_id: 11,
                    subcategory_id: null,
                    empresa_id: 4,
                },
            ],
            productsServicios: [],
        },
        {
            id: 10,
            category_code: "CAT-000001",
            name: "Burguer",
            isService: false,
            image: [
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/categories/burguergr2r4x100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.vigilioservices.com/empresas/demo-4/images/categories/burguergr2r7x800.webp",
                    dimension: 800,
                },
            ],
            wallpaper: null,
            icon: "\u003Ci class='fa fa-burger'\u003E\u003C/i\u003E",
            slug: "burguer",
            empresa_id: 4,
            subcategories: [],
            productsNormals: [],
            productsRestaurants: [
                {
                    price: 67,
                    discount: 2,
                    id: 2,
                    product_code: "PROD-000002",
                    name: "Burguer Clásica de Res",
                    url: null,
                    description:
                        "Descubre la deliciosa Buffalo Ranch Burger, una jugosa hamburguesa de carne 100% de res, sazonada a la perfección y cubierta con una cremosa salsa ranch que le aporta un sabor único. Cada bocado está complementado con queso derretido, lechuga fresca y rodajas de tomate, todo servido en un suave pan de hamburguesa. Ideal para los amantes de los sabores intensos y la cocina americana, esta hamburguesa se convierte en una experiencia gustativa inolvidable. Perfecta para disfrutar con papas fritas crujientes y tu bebida favorita. ¡No te la puedes perder!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Buffalo Ranch Burger",
                        },
                        {
                            name: "tipo_de_burger",
                            value: "Hamburguesa de res",
                        },
                        {
                            name: "sabor_principal",
                            value: "Buffalo",
                        },
                        {
                            name: "ingredientes",
                            value: "Carne de res, salsa buffalo, lechuga, tomate, cebolla, queso azul",
                        },
                        {
                            name: "estilo_de_queso",
                            value: "Queso azul desmenuzado",
                        },
                        {
                            name: "salsa",
                            value: "Salsa buffalo picante",
                        },
                        {
                            name: "acompañamientos",
                            value: "Papas fritas, aros de cebolla",
                        },
                        {
                            name: "tamaño",
                            value: "Doble carne disponible",
                        },
                        {
                            name: "nivel_de_picante",
                            value: "Alto",
                        },
                        {
                            name: "presentacion",
                            value: "Servida en pan de hamburguesa",
                        },
                        {
                            name: "sustitutos",
                            value: "Opción de pollo o pavo",
                        },
                        {
                            name: "toppings_adicionales",
                            value: "Jalapeños, aguacate",
                        },
                        {
                            name: "opcion_vegetariana",
                            value: "No disponible",
                        },
                        {
                            name: "origen_del_plato",
                            value: "Cocina estadounidense",
                        },
                        {
                            name: "ideal_para",
                            value: "Amantes de la comida picante",
                        },
                        {
                            name: "sensacion_boca",
                            value: "Cremosidad del queso y crujiente",
                        },
                        {
                            name: "tiempo_de_preparacion",
                            value: "15 minutos",
                        },
                        {
                            name: "tamaño_de_porcion",
                            value: "Generosa",
                        },
                        {
                            name: "maridaje_recomendado",
                            value: "Cerveza artesanal",
                        },
                        {
                            name: "dieta_especial",
                            value: "No apta para celíacos",
                        },
                    ],
                    stock: 0,
                    ilimit: true,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/burguer-clsica-de-reseg9rfx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/burguer-clsica-de-reseg9rix500.webp",
                        },
                    ],
                    slug: "burguer-clsica-de-res",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 34,
                    discount: 0,
                    id: 4,
                    product_code: "PROD-000004",
                    name: "Ultimate Bacon",
                    url: null,
                    description: null,
                    characteristics: [],
                    stock: 0,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/ultimate-baconeie6ix100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/ultimate-baconeie6kx500.webp",
                        },
                    ],
                    slug: "ultimate-bacon",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 34,
                    discount: 0,
                    id: 5,
                    product_code: "PROD-000005",
                    name: "Ultimate Bacon Dark",
                    url: null,
                    description: null,
                    characteristics: [],
                    stock: 3,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/ultimate-bacon-darkej8n3x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/ultimate-bacon-darkej8n5x500.webp",
                        },
                    ],
                    slug: "ultimate-bacon-dark",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 45,
                    discount: 0,
                    id: 3,
                    product_code: "PROD-000003",
                    name: "Hambuger Sicilian",
                    url: null,
                    description:
                        "Hamburguesa Sicilian: Disfruta de una deliciosa fusión de sabores en cada bocado. Esta hamburguesa gourmet presenta una jugosa carne de res sazonada con especias italianas, acompañada de una mezcla de quesos fundidos, rodajas de tomate fresco y hojas de albahaca. Todo ello se sirve en un suave pan ciabatta tostado, añadiendo un toque crujiente y delicioso. Perfecta para los amantes de la cocina mediterránea, la Hamburguesa Sicilian es una experiencia culinaria que no te puedes perder. Ideal para compartir o disfrutar en una comida especial.",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Hamburguesa Siciliana",
                        },
                        {
                            name: "tipo_de_carne",
                            value: "Carne de res",
                        },
                        {
                            name: "pan",
                            value: "Pan ciabatta",
                        },
                        {
                            name: "dimension",
                            value: "150 gramos",
                        },
                        {
                            name: "ingredientes_principales",
                            value: "Albahaca, tomate, mozzarella",
                        },
                        {
                            name: "salsa",
                            value: "Salsa pesto",
                        },
                        {
                            name: "acompañamiento",
                            value: "Ensalada de rúcula",
                        },
                        {
                            name: "estilo_culinario",
                            value: "Mediterráneo",
                        },
                        {
                            name: "opciones_veganas",
                            value: "Alternativa de hamburguesa vegetal",
                        },
                        {
                            name: "elaboración",
                            value: "A la parrilla",
                        },
                        {
                            name: "origen",
                            value: "Sicilia, Italia",
                        },
                        {
                            name: "sabor",
                            value: "Fresco y aromático",
                        },
                        {
                            name: "textura",
                            value: "Jugosa y crujiente",
                        },
                        {
                            name: "tipo_de_servicio",
                            value: "Rápido y casual",
                        },
                        {
                            name: "presentación",
                            value: "Servida en plato con guarnición",
                        },
                        {
                            name: "popularidad",
                            value: "Popular en restaurantes italianos",
                        },
                        {
                            name: "recomendación",
                            value: "Ideal para amantes de la cocina italiana",
                        },
                    ],
                    stock: 0,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hambuger-sicilianehffcx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hambuger-sicilianehffgx500.webp",
                        },
                    ],
                    slug: "hambuger-sicilian",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 290,
                    discount: 2,
                    id: 1,
                    product_code: "PROD-000001",
                    name: "Buffalo Ranch burguer",
                    url: null,
                    description:
                        "Descubre la deliciosa Buffalo Ranch Burger, una jugosa hamburguesa de carne 100% de res, sazonada a la perfección y cubierta con una irresistible salsa buffalo picante. Añadimos queso crema suave y crujientes trocitos de tocino para una explosión de sabor en cada bocado. Servida en un pan artesanal recién horneado y acompañada de lechuga fresca, tomate maduro y cebolla morada, esta hamburguesa es la opción perfecta para los amantes de los sabores intensos. Ideal para disfrutar en cualquier ocasión, te hará vivir una experiencia gourmet única. ¡No te la puedes perder!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Buffalo Ranch Burger",
                        },
                        {
                            name: "tipo",
                            value: "Hamburguesa",
                        },
                        {
                            name: "ingredientes_principales",
                            value: "Carne de res, salsa buffalo, queso cheddar",
                        },
                        {
                            name: "pan",
                            value: "Pan brioche",
                        },
                        {
                            name: "tamaño",
                            value: "180g",
                        },
                        {
                            name: "sabor",
                            value: "Picante y ahumado",
                        },
                        {
                            name: "acompañamientos",
                            value: "Pico de gallo, lechuga, cebolla roja",
                        },
                        {
                            name: "salsa",
                            value: "Salsa ranch",
                        },
                        {
                            name: "opciones_vegetarianas",
                            value: "Disponibles (hamburguesa de garbanzos)",
                        },
                        {
                            name: "nutrición",
                            value: "Alto en proteínas",
                        },
                        {
                            name: "alergénicos",
                            value: "Contiene lactosa y gluten",
                        },
                        {
                            name: "popularidad",
                            value: "Alta",
                        },
                        {
                            name: "estilo_culinario",
                            value: "Americano",
                        },
                        {
                            name: "preparación",
                            value: "A la parrilla",
                        },
                        {
                            name: "servicio",
                            value: "Listo para llevar o comer en el local",
                        },
                        {
                            name: "opciones_de_personalización",
                            value: "Se pueden añadir más ingredientes",
                        },
                        {
                            name: "maridaje",
                            value: "Cervezas artesanales o refrescos",
                        },
                        {
                            name: "recomendación",
                            value: "Ideal para los amantes del picante",
                        },
                        {
                            name: "tiempo_de_preparación",
                            value: "15 minutos",
                        },
                        {
                            name: "presentación",
                            value: "Servida con papas fritas",
                        },
                        {
                            name: "disponibilidad",
                            value: "Todo el año",
                        },
                    ],
                    stock: 19,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/buffalo-ranch-burguere6pq7x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/buffalo-ranch-burguere6pqex500.webp",
                        },
                    ],
                    slug: "buffalo-ranch-burguer",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 66,
                    discount: 0,
                    id: 7,
                    product_code: "PROD-000007",
                    name: "Hambuerger Delicius",
                    url: null,
                    description:
                        "Descubre la Hamburguesa Delicius, una explosión de sabor en cada bocado. Elaborada con carne 100% de res de alta calidad, esta hamburguesa se cocina a la perfección para lograr un exterior jugoso y un interior tierno. Acompañada de pan artesanal suave y fresco, la Hamburguesa Delicius incluye una mezcla de vegetales frescos, queso fundido y nuestra salsa especial que realza todos sus sabores. Ideal para cualquier ocasión, perfecta para compartir o disfrutar en solitario. Atrévete a saborear la diferencia con cada mordida. ¡Tu antojo lo agradecerá!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Hamburguesa Delicius",
                        },
                        {
                            name: "tamaño",
                            value: "Doble",
                        },
                        {
                            name: "carne",
                            value: "100% carne de res angus",
                        },
                        {
                            name: "pan",
                            value: "Pan brioche suave",
                        },
                        {
                            name: "queso",
                            value: "Queso cheddar derretido",
                        },
                        {
                            name: "ingredientes adicionales",
                            value: "Tocino, lechuga, tomate, cebolla caramelizada",
                        },
                        {
                            name: "salsas",
                            value: "Mayonesa especial y salsa BBQ",
                        },
                        {
                            name: "acompañamientos",
                            value: "Papas fritas crujientes",
                        },
                        {
                            name: "opciones vegetarianas",
                            value: "Alternativa de hamburguesa de garbanzos",
                        },
                        {
                            name: "porción",
                            value: "200g de carne",
                        },
                        {
                            name: "presentación",
                            value: "Servida en plato con guarnición",
                        },
                        {
                            name: "calorías",
                            value: "Aproximadamente 800 kcal",
                        },
                        {
                            name: "ideal para",
                            value: "Almuerzos y cenas",
                        },
                        {
                            name: "localización",
                            value: "Disponible en restaurantes seleccionados",
                        },
                        {
                            name: "nivel de picante",
                            value: "Suave",
                        },
                        {
                            name: "opciones de bebidas",
                            value: "Cervezas artesanales y refrescos",
                        },
                        {
                            name: "nivel de satisfacción",
                            value: "Alta",
                        },
                        {
                            name: "recomendaciones",
                            value: "Recomendado por críticos gastronómicos",
                        },
                        {
                            name: "presentación visual",
                            value: "Atractiva y colorida",
                        },
                        {
                            name: "tipo de cliente",
                            value: "Amantes de las hamburguesas gourmet",
                        },
                        {
                            name: "promociones",
                            value: "Combo con bebida y papas",
                        },
                    ],
                    stock: 6,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hambuerger-deliciusbc055x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hambuerger-deliciusbc057x500.webp",
                        },
                    ],
                    slug: "hambuerger-delicius",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 23,
                    discount: 0,
                    id: 10,
                    product_code: "PROD-000010",
                    name: "Hamburgueza de Pollo",
                    url: null,
                    description:
                        "Descubre nuestra deliciosa Hamburguesa de Pollo, elaborada con pechuga de pollo 100% fresca y sazonada con una mezcla especial de especias. Presentada en un suave pan brioche y acompañada de lechuga crujiente, tomate jugoso y mayonesa casera, cada bocado es una explosión de sabor. Ideal para quienes buscan una opción ligera pero contundente, esta hamburguesa es perfecta para cualquier ocasión. Disfruta de una experiencia gastronómica única con nuestra Hamburguesa de Pollo y déjate seducir por su frescura y calidad. ¡Haz tu pedido ahora!",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "Hamburguesa",
                        },
                        {
                            name: "ingrediente principal",
                            value: "Pollo",
                        },
                        {
                            name: "tipo de carne",
                            value: "Pechuga de pollo",
                        },
                        {
                            name: "sabor",
                            value: "Suave y jugoso",
                        },
                        {
                            name: "tamaño",
                            value: "Regular a grande",
                        },
                        {
                            name: "pan",
                            value: "Bollo de hamburguesa",
                        },
                        {
                            name: "acompañamientos",
                            value: "Lechuga, tomate, cebolla",
                        },
                        {
                            name: "salsas",
                            value: "Mayonesa, mostaza, ketchup",
                        },
                        {
                            name: "opciones de cocción",
                            value: "A la parrilla, a la plancha",
                        },
                        {
                            name: "opciones de complementos",
                            value: "Queso, aguacate, bacon",
                        },
                        {
                            name: "valor nutricional",
                            value: "Alta en proteínas",
                        },
                        {
                            name: "tendencia",
                            value: "Saludable",
                        },
                        {
                            name: "vegetariana",
                            value: "No",
                        },
                        {
                            name: "alternativa",
                            value: "Hamburguesa de pavo",
                        },
                        {
                            name: "popularidad",
                            value: "Alta en restaurantes de comida rápida",
                        },
                        {
                            name: "servir con",
                            value: "Papas fritas o ensalada",
                        },
                        {
                            name: "origen",
                            value: "Estadounidense",
                        },
                        {
                            name: "variantes",
                            value: "Pollo empanizado, pollo BBQ",
                        },
                        {
                            name: "cualidades adicionales",
                            value: "Bajo en grasas si es a la parrilla",
                        },
                        {
                            name: "presentación",
                            value: "Servida en plato o envoltura",
                        },
                    ],
                    stock: 3,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hamburgueza-de-pollonjuppx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hamburgueza-de-pollonjuq3x500.webp",
                        },
                    ],
                    slug: "hamburgueza-de-pollo",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
                {
                    price: 76,
                    discount: 5,
                    id: 11,
                    product_code: "PROD-000011",
                    name: "Hamburgueza de Carnet",
                    url: null,
                    description:
                        "Descubre la Hamburguesa de Carnet, una deliciosa experiencia culinaria que combina jugosas capas de carne de res premium con ingredientes frescos y de alta calidad. Su pan artesanal, tostado a la perfección, envuelve un generoso medallón de carne, complementado con lechuga crujiente, tomate fresco y nuestra especial salsa secreta que realza cada bocado. Ideal para los amantes de las hamburguesas que buscan un sabor único y abundante. Perfecta para cualquier ocasión, disfrútala con una guarnición de papas fritas doradas o una ensalada fresca. ¡Haz de tu momento hamburguesa una experiencia inolvidable!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Hamburguesa de Carnet",
                        },
                        {
                            name: "tipo_de_carne",
                            value: "Carne de res jugosa",
                        },
                        {
                            name: "tamaño",
                            value: "250 gramos",
                        },
                        {
                            name: "pan",
                            value: "Pan artesanal tostado",
                        },
                        {
                            name: "ingredientes_principales",
                            value: "Lechuga, tomate, cebolla",
                        },
                        {
                            name: "queso",
                            value: "Queso cheddar derretido",
                        },
                        {
                            name: "salsas",
                            value: "Mayonesa, salsa BBQ",
                        },
                        {
                            name: "acompañamiento",
                            value: "Papas fritas o ensalada",
                        },
                        {
                            name: "opciones_veg",
                            value: "Opción con carne vegetal",
                        },
                        {
                            name: "procedencia",
                            value: "Carne de ganado local",
                        },
                        {
                            name: "preparación",
                            value: "A la parrilla",
                        },
                        {
                            name: "nivel_de_picante",
                            value: "Opción picante disponible",
                        },
                        {
                            name: "alergenos",
                            value: "Puede contener gluten y lácteos",
                        },
                        {
                            name: "calorías_aproximadas",
                            value: "700 kcal",
                        },
                        {
                            name: "presentación",
                            value: "Servida en plato con decoración",
                        },
                        {
                            name: "estilo_culinario",
                            value: "Americano clásico",
                        },
                        {
                            name: "variaciones",
                            value: "Bacon, champiñones, aguacate",
                        },
                        {
                            name: "opciones_de_bebida",
                            value: "Refrescos y cervezas",
                        },
                        {
                            name: "disponibilidad",
                            value: "Solo en fin de semana",
                        },
                        {
                            name: "sustentos_nutricionales",
                            value: "Rica en proteínas",
                        },
                        {
                            name: "recomendación_de_consumo",
                            value: "Ideal para compartir",
                        },
                        {
                            name: "experiencia_de_sabor",
                            value: "Sabor intenso y equilibrado",
                        },
                        {
                            name: "popularidad",
                            value: "Favorita entre los clientes",
                        },
                        {
                            name: "notas",
                            value: "Sirve caliente para mejor sabor",
                        },
                    ],
                    stock: 0,
                    ilimit: false,
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hamburgueza-de-carnetnls98x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vigilioservices.com/empresas/demo-4/images/products/hamburgueza-de-carnetnls9cx500.webp",
                        },
                    ],
                    slug: "hamburgueza-de-carnet",
                    category_id: 10,
                    subcategory_id: null,
                    empresa_id: 4,
                },
            ],
            productsServicios: [],
        },
    ],
    brands: [],
};
