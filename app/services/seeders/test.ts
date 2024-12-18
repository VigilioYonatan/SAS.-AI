import type { EmpresasStoreDto } from "@/empresas/dtos/empresas.store.dto";

export const test: Pick<
    EmpresasStoreDto,
    | "setting"
    | "gridBanners"
    | "files"
    | "gridBannersService"
    | "gridBannersAbout"
    | "gridBannersShop"
    | "backgrounds"
    | "categories"
    | "brands"
> = {
    setting: {
        logo_width: 140,
        host: {
            enabled: false,
            host: null,
            nameserver_one: null,
            nameserver_two: null,
            time: null,
        },
        bg_color: "#dca050",
        bg_color_header: "#000000",
        bg_color_aside: "#000000",
        bg_color_background: "#ffffff",
        bg_color_footer: "#323232",
        bg_color_secondary: "#dca050",
        type_animation: "fade-up",
        background_auth: null,
        font_face: "Barlow",
        bg_color_paper: "#ffffff",
        bg_color_button: "#dca050",
        isCoverImage: true,
        isScrolling: true,
        is_hidde_total_cart: false,
        isDark: false,
        isLogoImage: false,
        is_block_aside: false,
        is_subcategory: false,
        is_service_page: true,
        position_header: true,
        bg_color_responsive: "#000000",
        border_title_type: "normal",
        type_star: "star",
        background_position: "center",
        header_type: "transparent",
        background_type: "first",
        type_icons: "normal",
        type_border: "circle",
        type_cart: "fas fa-shopping-cart",
        type_arrow: "first",
        type_map: "satelite",
        web_script:
            'const style = document.createElement("style");\nstyle.innerHTML = `\n.background-home-container > div {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.brand-section{\n    padding: 3rem 1rem;\n}\n.brand-section > div:nth-child(1){\n    display: none;\n}\n\n.product-users-section > div> div> div > h3 a{\n    display: none;\n}\n.product-users-section > div> div > div > h3  span{\n    font-size: 1.2rem;\n}\n.product-users-section > div> div > div > h3  i{\n    display: none;\n}\n.product-users-section > div > div:nth-child(2) > div:nth-child(even){\n    display: none;\n}\n.product-users-section > div > div:nth-child(2) > div{\n    margin-bottom: 0.5rem;\n}\n\n.users-section .users-section-slide .slick-track > div > div {\n    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n}\n.users-section .users-section-slide .slick-list {\n    height: 300px !important;\n}\n.users-section .users-section-slide .slick-track  img {\n    width: 150px;\n    height: 150px;\n    border: 4px solid var(--primary);\n}\n.post-section::after {\n    content: "";\n    position: absolute;\n    width: 100%;\n    left: 0;\n    right: 0;\n    height: 300px;\n    background-color: #150D14;\n    z-index: -1;\n}\n\n.product-users-section > div > div:nth-child(1) > div {\n    justify-content: center !important;\n}\n.product-users-section .title-container-2::before {\n    left: 26% !important;\n}\n.post-section > div > h2{\n    color: white;\n}\n\n`;\ndocument.head.appendChild(style);\n                    ',
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
            pedidos: false,
            condiciones: true,
            categories: false,
            subcategories: true,
            services: true,
        },
        type_card: "eccomerce",
        type_product_buttons: "second",
        type_icons_bars: "normal",
        is_hover_product: true,
        isProductWallpaper: false,
        hamburger: "fas fa-bars",
        shows: {
            map: false,
            about: false,
            cards: false,
            brands: true,
            android: true,
            offers_section: false,
            offers_user: true,
            categories_slider: false,
        },
    },
    gridBanners: [
        {
            id: 35,
            title: null,
            enabled: true,
            html: '<div class="about-us" x-data="{\r\n    empresa:JSON.parse(localStorage.getItem(\'empresa\'))\r\n}">\r\n    <div class="content">\r\n        <div class="text">\r\n            <h2 data-label="11">About Us</h2>\r\n            <p data-label="12">Welcome To Our Barber Shop</p>\r\n            <p data-label="13">Barber Shop is an authentic collection of 11 styles, entirely designed and made in Italy. Quality, Italian style and functionality are the hallmarks of Barber Shop. Every single piece is handcrafted in Bassano del Grappa (Vicenza) by skilled artisans.</p>\r\n            <p data-label="14">Barber Shop high-quality multifunctional bags and accessories are made using only selected Italian leathers and fabrics and offers top quality technical features.</p>\r\n            <button data-label="15">Our Teams</button>\r\n            <button data-label="16">Shop Now</button>\r\n        </div>\r\n        <div class="container-images relative">\r\n            <img :src="`/empresas/${empresa.slug}/images/files/banner-0-image-1.webp`" alt="Barber styling client">\r\n            <img  :src="`/empresas/${empresa.slug}/images/files/banner-0-image-2.webp`" alt="Barber styling client">\r\n            <img :src="`/empresas/${empresa.slug}/images/files/banner-0-image-3.webp`" alt="Barber styling client">\r\n        </div>\r\n    </div>\r\n</div>\r\n<!--  -->\r\n<div class="info-bar-container">\r\n    <div class="info-bar">\r\n    <div class="info-item">\r\n        <i class="fas fa-shipping-fast text-3xl"></i>\r\n        <div class="info-text">\r\n            <strong>Free Shipping</strong>\r\n            <p>Free shipping on all US order or order above $200</p>\r\n        </div>\r\n    </div>\r\n    <div class="info-item">\r\n        <i class="fas fa-headset text-3xl"></i>\r\n        <div class="info-text">\r\n            <strong>Support 24/7</strong>\r\n            <p>Contact us 24 hours a day, 7 days a week</p>\r\n        </div>\r\n    </div>\r\n    <div class="info-item">\r\n        <i class="fas fa-undo-alt text-3xl"></i>\r\n        <div class="info-text">\r\n            <strong>30 Days Return</strong>\r\n            <p>Simply return it within 30 days for an exchange</p>\r\n        </div>\r\n    </div>\r\n    <div class="info-item">\r\n        <i class="fas fa-lock text-3xl"></i>\r\n        <div class="info-text">\r\n            <strong>100% Payment Secure</strong>\r\n            <p>We ensure secure payment with PEV</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n</div>\r\n\r\n<style>\r\n    .grid-banner-0{\r\n        max-width: none;\r\n    }\r\n    .grid-banner-0 .about-us {\r\n        max-width: 75rem;\r\n        margin: auto;\r\n        padding: 20px;\r\n        font-family: \'Arial\', sans-serif;\r\n    }\r\n\r\n    .grid-banner-0 .about-us h2 {\r\n        font-size: 24px;\r\n        color: #333;\r\n    }\r\n\r\n    .grid-banner-0 .about-us p {\r\n        color: #666;\r\n    }\r\n\r\n    .grid-banner-0 .about-us .content {\r\n        display: flex;\r\n        flex-direction: column;\r\n        justify-content: space-between;\r\n        margin-top: 20px;\r\n        gap: 2rem;\r\n    }\r\n    @media screen and (min-width: 700px){\r\n        .grid-banner-0 .about-us .content{\r\n            flex-direction: row;\r\n        }\r\n    }\r\n\r\n    .grid-banner-0 .about-us .text {\r\n        width: 100%;\r\n    }\r\n\r\n    .grid-banner-0 .about-us .text p {\r\n        line-height: 1.6;\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    .grid-banner-0 .about-us button {\r\n        background-color: #444;\r\n        color: white;\r\n        border: none;\r\n        padding: 10px 20px;\r\n        margin-right: 10px;\r\n        cursor: pointer;\r\n    }\r\n\r\n    .grid-banner-0 .about-us button:hover {\r\n        background-color: #555;\r\n    }\r\n    .grid-banner-0 .container-images {\r\n        position: relative;\r\n        margin: 20px auto; \r\n        width: 100%; \r\n        height: 399px;\r\n    }\r\n    .grid-banner-0 .container-images img {\r\n        width: 100%;\r\n        min-width: 100px;\r\n        border: 10px solid white;\r\n        height: 250px;\r\n        object-fit: cover;\r\n        z-index: 10;\r\n        position: absolute;\r\n    }\r\n    .grid-banner-0 .container-images img:nth-child(2) {\r\n        width: 150px;\r\n        height: 150px;\r\n        bottom: 2rem;\r\n        right: 2rem;\r\n       \r\n    }\r\n    .grid-banner-0 .container-images img:nth-child(3) {\r\n        width: 150px;\r\n        height: 150px;\r\n        bottom: 2rem;\r\n        left: 2rem;\r\n    }\r\n    @media screen and(min-width: 700px){\r\n        .grid-banner-0 .container-images {\r\n            width: 578px; \r\n            height: 599px; \r\n        }\r\n        .grid-banner-0 .container-images img {\r\n            width: 400px;\r\n            min-width: 100px;\r\n            height:450px;\r\n        }\r\n        .grid-banner-0 .container-images img:nth-child(2) {\r\n            width: 300px;\r\n            height:300px;\r\n            top: 4rem; \r\n            right: 0;\r\n        }\r\n        .grid-banner-0 .container-images img:nth-child(3) {\r\n            width: 300px;\r\n            height:200px;\r\n            bottom: 6rem;  \r\n            right: 2rem;\r\n        }\r\n        .grid-banner-0 .about-us .text {\r\n            width:50%;\r\n        }\r\n\r\n    }\r\n\r\n   \r\n    \r\n    .grid-banner-0 .info-bar-container .info-bar{\r\n        background-color: #f1f1f1; \r\n        padding: 2rem 1rem;\r\n        width: 100%; \r\n        display:grid;\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n    }\r\n    @media screen and (min-width:700px){\r\n        .grid-banner-0 .info-bar-container .info-bar{\r\n            grid-template-columns: repeat(4, minmax(0, 1fr));\r\n            padding: 4rem 2rem;\r\n        }\r\n\r\n    }\r\n    .grid-banner-0 .info-bar {\r\n        display: flex;\r\n        justify-content: space-around; \r\n        align-items: center;\r\n        \r\n        max-width: 75rem;\r\n        margin: 0 auto;\r\n    }\r\n\r\n    .grid-banner-0 .info-item {\r\n        display: flex;\r\n        align-items: center;\r\n        flex-direction: column; \r\n        flex-grow: 1;\r\n        text-align: center; \r\n    }\r\n\r\n    .grid-banner-0 .info-item i {\r\n        font-size: 24px;\r\n        color: #333; \r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    .grid-banner-0 .info-text strong {\r\n        font-size: 16px; \r\n        color: #000; \r\n        margin-bottom: 5px; \r\n    }\r\n\r\n    .grid-banner-0 .info-text p {\r\n        font-size: 14px; \r\n        color: #666; \r\n        margin: 0; \r\n    }\r\n    .form-html-editor .content > div {\r\n        display:flex;\r\n         flex-direction: column;\r\n    }\r\n    .form-html-editor img {\r\n         width: 200px !important; \r\n         height: 200px !important; \r\n    }\r\n</style>',
            empresa_id: 8,
        },
        {
            id: 36,
            title: null,
            enabled: true,
            html: '<div class="flex flex-col md:flex-row gap-4 banner-1-custom" x-data="{\r\n    empresa: JSON.parse(localStorage.getItem(\'empresa\'))\r\n}">\r\n    <div class="relative h-full w-full flex justify-content items-center">\r\n        <img class="absolute inset-0 w-full h-full object-cover" :src="`/empresas/${empresa.slug}/images/files/grid-banner-image-1.webp`"/>\r\n        <div class="relative z-10 " style="margin: 2rem;">\r\n            <h3 class="uppercase font-bold text-3xl text-white">Barber Kits</h3>\r\n            <p class="font-semibold tracking-widest text-lg text-white">Save Up to 70% Off</p>\r\n            <a class="text-primary underline font-bold" style="margin-top: 1rem; display:block;">SHOP NOW</a>\r\n        </div>\r\n    </div>\r\n    <div class="relative h-full w-full flex justify-content items-center">\r\n         <img class="absolute inset-0 w-full h-full object-cover" :src="`/empresas/${empresa.slug}/images/files/grid-banner-image-2.webp`"/>\r\n          <div class="relative z-10 " style="margin: 2rem;">\r\n            <h3 class="uppercase font-bold text-3xl text-white">Professional</h3>\r\n            <p class="font-semibold tracking-widest text-lg text-white">Hair Cuttings Shears</p>\r\n            <a class="text-primary underline font-bold" style="margin-top: 1rem; display:block;">SHOP NOW</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n<style>\r\n    .banner-1-custom{\r\n        height: 450px;\r\n    } \r\n    @media screen and (min-width: 700px){\r\n       .banner-1-custom{\r\n            height: 250px;\r\n        } \r\n    }\r\n</style>',
            empresa_id: 8,
        },
        {
            id: 37,
            title: null,
            enabled: false,
            html: "",
            empresa_id: 8,
        },
        {
            id: 38,
            title: null,
            enabled: false,
            html: "",
            empresa_id: 8,
        },
        {
            id: 39,
            title: null,
            enabled: false,
            html: "",
            empresa_id: 8,
        },
    ],
    files: [
        {
            id: 68,
            file: [
                {
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/files/grid-banner-image-2.webp",
                },
            ],
            empresa_id: 8,
        },
        {
            id: 69,
            file: [
                {
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/files/grid-banner-image-1.webp",
                },
            ],
            empresa_id: 8,
        },
        {
            id: 70,
            file: [
                {
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/files/banner-0-image-1.webp",
                },
            ],
            empresa_id: 8,
        },
        {
            id: 71,
            file: [
                {
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/files/banner-0-image-2.webp",
                },
            ],
            empresa_id: 8,
        },
        {
            id: 72,
            file: [
                {
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/files/banner-0-image-3.webp",
                },
            ],
            empresa_id: 8,
        },
    ],
    gridBannersService: [
        {
            id: 31,
            title: null,
            html: "",
            enabled: false,
            empresa_id: 8,

            grid_banner_id: null,
        },
        {
            id: 32,
            title: null,
            html: "",
            enabled: false,
            empresa_id: 8,

            grid_banner_id: null,
        },
        {
            id: 33,
            title: null,
            html: "",
            enabled: false,
            empresa_id: 8,

            grid_banner_id: null,
        },
        {
            id: 34,
            title: null,
            html: "",
            enabled: true,
            empresa_id: 8,
            grid_banner_id: null,
        },
        {
            id: 35,
            title: null,
            html: "",
            enabled: true,
            empresa_id: 8,

            grid_banner_id: null,
        },
    ],
    gridBannersShop: [],
    gridBannersAbout: [],
    backgrounds: [
        {
            id: 13,
            title: " ",
            description: null,
            url: "https://www.demo-8.vigilio-services.com/",
            html: '<div class="flex flex-col gap-6 items-center justify-center">\r\n    <img\r\n        width="300"\r\n        height="300"\r\n        style="width: 110px; height: 110px"\r\n        alt="scissors"\r\n        title="scissors"\r\n        src="https://demo-48.woovinapro.com/wp-content/plugins/woovina-barber-package/assets/images/demo-48/before-1.png"/>\r\n    <div>\r\n        <div class="flex justify-center items-center flex-col ">\r\n            <h3 class="text-3xl text-white text-center font-bold tracking-wide">Barber Shop</h3>\r\n            <div class="flex items-center gap-2">\r\n                <span class="text-3xl text-white text-center font-bold"> Greate </span> <span class="text-3xl text-primary text-center font-bold tracking-wide">Your Style</span>\r\n            </div>\r\n        </div>\r\n        <p class="text-white text-center tracking-widest  text-xl">We Make Your Hair Look Great Perfect!</p>\r\n    </div>\r\n    <a href="/shop" class="bg-primary px-6 py-2 font-bold uppercase " style="color: white !important; margin-top: 1rem">+ Shop Now</a>\r\n</div>',
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/background/7886aef4-8ed5-4401-b873-66c1e3f924b4n4ercx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/background/dbd44fe0-594e-494e-a7ea-80f1af0944dbn4erhx1600.webp",
                },
            ],
            empresa_id: 8,
        },
        {
            id: 12,
            title: " ",
            description: null,
            url: "https://www.demo-8.vigilio-services.com/shop",
            html: '<div class="flex flex-col gap-6 items-center justify-center">\r\n    <img\r\n        width="300"\r\n        height="300"\r\n        style="width: 110px; height: 110px"\r\n        alt="scissors"\r\n        title="scissors"\r\n        src="https://demo-48.woovinapro.com/wp-content/plugins/woovina-barber-package/assets/images/demo-48/before-1.png"/>\r\n    <div>\r\n        <div class="flex justify-center items-center flex-col ">\r\n            <h3 class="text-3xl text-white text-center font-bold tracking-wide">Collection</h3>\r\n            <div class="flex items-center gap-2">\r\n                <span class="text-3xl text-white text-center font-bold tracking-wide"> Greate </span> <span class="text-3xl text-primary text-center font-bold tracking-wide"> & Bread</span>\r\n            </div>\r\n        </div>\r\n        <p class="text-white text-center tracking-widest  text-xl">A Stylish and Happening a Grooming</p>\r\n    </div>\r\n    <a href="/shop" class="bg-primary px-6 py-2 font-bold uppercase " style="color: white !important; margin-top: 1rem">+ Shop Now</a>\r\n</div>',
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/background/074d9588-34bb-421d-bbde-c71cc9908194n31m7x100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/background/61cab4f9-17cb-4f1e-80bb-878f52c782e4n31mvx1600.webp",
                },
            ],
            empresa_id: 8,
        },
    ],
    categories: [
        {
            id: 20,
            category_code: "CAT-000001",
            name: "Comb",
            isService: false,
            image: null,
            wallpaper: null,
            icon: "<i class='fa fa-comb'></i>",
            slug: "comb",
            empresa_id: 8,

            subcategories: [],
            productsNormals: [
                {
                    price: 50,
                    discount: 0,
                    name: "Razor clip",
                    url: null,
                    description:
                        "Descripción del Producto: Razor-Clip\nEl Razor-Clip es la herramienta perfecta para quienes buscan un corte de cabello preciso y profesional en la comodidad de su hogar. Diseñado para barberos y aficionados, este dispositivo incorpora tecnología de última generación que garantiza resultados impecables.\n\nCaracterísticas Principales:\n\n\nEl Razor-Clip es más que un simple recortador; es un aliado indispensable para conseguir un acabado profesional en cada corte. ¡Transforma tu experiencia de peluquería hoy mismo!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Razor-clip",
                        },
                        {
                            name: "tipo",
                            value: "Accesorio de peluquería",
                        },
                        {
                            name: "material",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "color",
                            value: "Negro",
                        },
                        {
                            name: "peso",
                            value: "20 gramos",
                        },
                        {
                            name: "dimensiones",
                            value: "10 cm x 5 cm",
                        },
                        {
                            name: "uso",
                            value: "Recoger cabello durante cortes",
                        },
                        {
                            name: "comodidad",
                            value: "Diseño ergonómico",
                        },
                        {
                            name: "característica_1",
                            value: "Antideslizante",
                        },
                        {
                            name: "característica_2",
                            value: "Resistente a la corrosión",
                        },
                        {
                            name: "característica_3",
                            value: "Fácil de limpiar",
                        },
                        {
                            name: "característica_4",
                            value: "Clip de retención seguro",
                        },
                        {
                            name: "diseño",
                            value: "Compacto y portable",
                        },
                        {
                            name: "aplicación",
                            value: "Uso profesional y hogareño",
                        },
                        {
                            name: "compatibilidad",
                            value: "Todos los tipos de cabello",
                        },
                        {
                            name: "mantenimiento",
                            value: "Bajo",
                        },
                        {
                            name: "durabilidad",
                            value: "Alta",
                        },
                        {
                            name: "origen",
                            value: "Fabricado en EE.UU.",
                        },
                        {
                            name: "garantía",
                            value: "1 año por defectos de fabricación",
                        },
                        {
                            name: "recomendado_para",
                            value: "Peluqueros y estilistas",
                        },
                        {
                            name: "ventajas",
                            value: "Mejora la precisión y eficiencia en cortes",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/razor-clip110p5x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/razor-clip110p7x500.webp",
                        },
                    ],
                    slug: "razor-clip",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 24,
                    empresa_id: 8,
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 61,
                    discount: 5,
                    name: "Hairdryer Large  500W",
                    url: null,
                    description:
                        "Secadora de Cabello Mini 500W\nDescubre la nueva Secadora de Cabello Mini 500W, diseñada para ofrecer un rendimiento excepcional en un tamaño compacto y ligero. Ideal para llevar en tus viajes o para un uso diario en casa, esta secadora combina potencia y comodidad.\n\nCaracterísticas Principales\n\n\nBeneficios\n\n\nLa Secadora de Cabello Mini 500W es la solución perfecta para quienes buscan un producto eficiente sin sacrificar espacio. ¡Añádelo a tu rutina de belleza y disfruta de resultados profesionales en cualquier lugar!",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Hairdryer-Mini-500W",
                        },
                        {
                            name: "Potencia",
                            value: "500W",
                        },
                        {
                            name: "Tamaño",
                            value: "Mini",
                        },
                        {
                            name: "Peso",
                            value: "300 gramos",
                        },
                        {
                            name: "Estilo",
                            value: "Compacto y ligero",
                        },
                        {
                            name: "Fuentes de energía",
                            value: "Eléctrico",
                        },
                        {
                            name: "Voltaje",
                            value: "110-240V",
                        },
                        {
                            name: "Temperaturas",
                            value: "2 niveles de ajuste",
                        },
                        {
                            name: "Velocidades",
                            value: "2 velocidades",
                        },
                        {
                            name: "Accesorios",
                            value: "Boquilla concentradora",
                        },
                        {
                            name: "Uso",
                            value: "Secado y peinado en casa o viajes",
                        },
                        {
                            name: "Material",
                            value: "Plástico resistente",
                        },
                        {
                            name: "Funciones adicionales",
                            value: "Secado rápido",
                        },
                        {
                            name: "Tipo de motor",
                            value: "Motor DC",
                        },
                        {
                            name: "Cable",
                            value: "Cable ligero y flexible",
                        },
                        {
                            name: "Aislación",
                            value: "Protección contra sobrecalentamiento",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Varios colores",
                        },
                        {
                            name: "Diseño",
                            value: "Ergonómico",
                        },
                        {
                            name: "Ideal para",
                            value: "Viajes y uso diario",
                        },
                        {
                            name: "Ruido",
                            value: "Bajo nivel de ruido",
                        },
                        {
                            name: "Garantía",
                            value: "1 año de garantía",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hairdryer-large-500wvd3uox100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hairdryer-large-500wvd3urx500.webp",
                        },
                    ],
                    slug: "hairdryer-large-500w",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 23,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 57,
                    discount: 1,
                    name: "Hair trimmer set",
                    url: null,
                    description:
                        "Juego de Cortadoras de Cabello\nDescubre la precisión y el estilo con nuestro juego de cortadoras de cabello de alta calidad, diseñado para ofrecerte una experiencia de corte excepcional en la comodidad de tu hogar. Este set es perfecto tanto para barberos profesionales como para aquellos que desean mantener su look personal.\n\nCaracterísticas del Producto:\n\n\nBeneficios:\n\n\nEleva tu experiencia de cuidado personal con nuestro juego de cortadoras de cabello, la herramienta definitiva para lucir siempre impecable y a la moda.",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "Juego de recortadores de cabello",
                        },
                        {
                            name: "número de piezas",
                            value: "6",
                        },
                        {
                            name: "material de las cuchillas",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "longitud de corte ajustable",
                            value: "Sí, varias posiciones",
                        },
                        {
                            name: "tipo de alimentación",
                            value: "Inalámbrico y con cable",
                        },
                        {
                            name: "duración de batería",
                            value: "Hasta 60 minutos",
                        },
                        {
                            name: "tiempo de carga",
                            value: "1.5 horas",
                        },
                        {
                            name: "peso",
                            value: "300 g",
                        },
                        {
                            name: "accesorios incluidos",
                            value: "Peines guía, cepillo de limpieza, aceite",
                        },
                        {
                            name: "facilidad de limpieza",
                            value: "Cuchillas lavables",
                        },
                        {
                            name: "uso recomendado",
                            value: "Cortes de cabello y barba",
                        },
                        {
                            name: "garantía",
                            value: "2 años",
                        },
                        {
                            name: "color",
                            value: "Negro/plateado",
                        },
                        {
                            name: "diseño ergonómico",
                            value: "Sí",
                        },
                        {
                            name: "ruido de funcionamiento",
                            value: "Bajo",
                        },
                        {
                            name: "compatibilidad",
                            value: "Compatible con voltaje universal",
                        },
                        {
                            name: "indicador de batería",
                            value: "LED",
                        },
                        {
                            name: "velocidades ajustables",
                            value: "Sí, 2 velocidades",
                        },
                        {
                            name: "usos múltiples",
                            value: "Incluso para detalles y acabados",
                        },
                        {
                            name: "tecnología de corte",
                            value: "Corte de precisión",
                        },
                        {
                            name: "facilidad de manejo",
                            value: "Manguito antideslizante",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-trimmer-set0vdb7x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-trimmer-set0vdbax500.webp",
                        },
                    ],
                    slug: "hair-trimmer-set",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 22,
                    empresa_id: 8,
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 50,
                    discount: 0,
                    name: "Hairdryer Mini 500W",
                    url: null,
                    description:
                        "Secador de Pelo Mini 500W\nDescubre la potencia y la comodidad del Secador de Pelo Mini 500W, diseñado para aquellos que buscan un producto compacto y eficiente sin sacrificar el rendimiento.\n\nCaracterísticas Principales:\n\n\nBeneficios:\nEste secador mini es perfecto para quienes desean una herramienta práctica y eficiente que se adapte a cualquier estilo de vida. Con su tecnología avanzada, garantiza un secado uniforme y reduce el riesgo de daños por calor. ¡Llévalo contigo a todas partes y mantén tu cabello siempre perfecto!",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Hairdryer-Mini-500W",
                        },
                        {
                            name: "Potencia",
                            value: "500 W",
                        },
                        {
                            name: "Tamaño",
                            value: "Mini",
                        },
                        {
                            name: "Peso",
                            value: "300 g",
                        },
                        {
                            name: "Dimensiones",
                            value: "20 x 10 x 5 cm",
                        },
                        {
                            name: "Voltaje",
                            value: "220-240 V",
                        },
                        {
                            name: "Tipo de secador",
                            value: "Secador de viaje",
                        },
                        {
                            name: "Tecnología",
                            value: "Iónica",
                        },
                        {
                            name: "Configuraciones de calor",
                            value: "2 niveles",
                        },
                        {
                            name: "Configuraciones de velocidad",
                            value: "1 nivel",
                        },
                        {
                            name: "Accesorios incluidos",
                            value: "Boquilla concentradora",
                        },
                        {
                            name: "Función de aire frío",
                            value: "Sí",
                        },
                        {
                            name: "Cortacircuito de seguridad",
                            value: "Sí",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Viajes y uso doméstico",
                        },
                        {
                            name: "Material principalmente",
                            value: "Plástico",
                        },
                        {
                            name: "Color disponible",
                            value: "Negro, Rosa",
                        },
                        {
                            name: "Cable retráctil",
                            value: "No",
                        },
                        {
                            name: "Tipo de funcionamiento",
                            value: "Eléctrico",
                        },
                        {
                            name: "Garantía",
                            value: "1 año",
                        },
                        {
                            name: "Compatibilidad internacional",
                            value: "Sí",
                        },
                        {
                            name: "Ajustes de temperatura",
                            value: "Calor bajo y alto",
                        },
                        {
                            name: "Ruido en funcionamiento",
                            value: "Bajo",
                        },
                        {
                            name: "Fácil de almacenar",
                            value: "Sí",
                        },
                        {
                            name: "Uso profesional",
                            value: "No recomendado",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hairdryer-mini-500w145tsx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hairdryer-mini-500w145u0x500.webp",
                        },
                    ],
                    slug: "hairdryer-mini-500w",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 25,
                    empresa_id: 8,
                    options: [
                        {
                            option_id: 3,
                            features: [14],
                        },
                    ],
                },
                {
                    price: 60,
                    discount: 3,
                    name: "White trimmer",
                    url: null,
                    description:
                        "White-Trimmer\nTransforma tu experiencia de afeitado con el innovador White-Trimmer, diseñado para ofrecer un rendimiento excepcional y una precisión inigualable.\n\nCaracterísticas Destacadas:\n\n\nBeneficios de Utilizar White-Trimmer:\n\n\nDescubre la revolución en el cuidado personal con White-Trimmer y logra acabados perfectos en cada corte.",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "Trimmer de jardín",
                        },
                        {
                            name: "marca",
                            value: "White",
                        },
                        {
                            name: "modelo",
                            value: "White-trimmer",
                        },
                        {
                            name: "potencia",
                            value: "750W",
                        },
                        {
                            name: "longitud del cable",
                            value: "10 metros",
                        },
                        {
                            name: "peso",
                            value: "3.5 kg",
                        },
                        {
                            name: "sistema de corte",
                            value: "Hilo de nylon",
                        },
                        {
                            name: "ajuste de altura",
                            value: "Sí",
                        },
                        {
                            name: "ruedas",
                            value: "No",
                        },
                        {
                            name: "tipo de combustible",
                            value: "Eléctrico",
                        },
                        {
                            name: "facilidad de inicio",
                            value: "Arranque rápido",
                        },
                        {
                            name: "nivel de ruido",
                            value: "Moderado",
                        },
                        {
                            name: "uso recomendado",
                            value: "Jardines pequeños a medianos",
                        },
                        {
                            name: "garantía",
                            value: "2 años",
                        },
                        {
                            name: "accesorios incluidos",
                            value: "Rebobinador de hilo",
                        },
                        {
                            name: "tipo de usuario",
                            value: "Doméstico",
                        },
                        {
                            name: "diseño ergonómico",
                            value: "Sí",
                        },
                        {
                            name: "nivel de vibración",
                            value: "Bajo",
                        },
                        {
                            name: "color",
                            value: "Verde",
                        },
                        {
                            name: "durabilidad",
                            value: "Alta",
                        },
                        {
                            name: "mantenimiento",
                            value: "Bajo",
                        },
                        {
                            name: "calificación de seguridad",
                            value: "IPX4",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/white-trimmer12d9tx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/white-trimmer12da0x500.webp",
                        },
                    ],
                    slug: "white-trimmer",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 23,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 56,
                    discount: 2,
                    name: "Hair cutting comb scissors",
                    url: null,
                    description:
                        "Juego de Tijeras y Peine para Corte de Cabello\n\nDescubre el set perfecto para estilistas y barberos profesionales. Nuestro juego de tijeras y peine para corte de cabello incluye herramientas de alta calidad diseñadas para lograr cortes precisos y estilizados.\n\nCaracterísticas del producto:\n\n\nBeneficios:\n\n\nCon este set de tijeras y peine, estarás listo para ofrecer un servicio de calidad superior. Perfecto para cualquier profesional de la barbería que busca mejorar su kit de herramientas.",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "Set de herramientas para corte de cabello",
                        },
                        {
                            name: "material",
                            value: "Acero inoxidable y plástico",
                        },
                        {
                            name: "componentes",
                            value: "Tijeras, peine, y parte de corte",
                        },
                        {
                            name: "longitud tijeras",
                            value: "6.5 pulgadas",
                        },
                        {
                            name: "longitud peine",
                            value: "7.5 pulgadas",
                        },
                        {
                            name: "color",
                            value: "Negro y plateado",
                        },
                        {
                            name: "uso",
                            value: "Corte de cabello profesional y personal",
                        },
                        {
                            name: "corte de precisión",
                            value: "Sí",
                        },
                        {
                            name: "facilidad de uso",
                            value: "Diseño ergonómico",
                        },
                        {
                            name: "limpieza",
                            value: "Fácil de limpiar y mantener",
                        },
                        {
                            name: "peso",
                            value: "Ligero y portátil",
                        },
                        {
                            name: "resistente a la corrosión",
                            value: "Sí",
                        },
                        {
                            name: "para todo tipo de cabello",
                            value: "Sí",
                        },
                        {
                            name: "seguridad",
                            value: "Puntas redondeadas en tijeras",
                        },
                        {
                            name: "estilo",
                            value: "Ideal para profesionales y principiantes",
                        },
                        {
                            name: "almacenamiento",
                            value: "Viene con funda o estuche",
                        },
                        {
                            name: "garantía",
                            value: "Generalmente incluye garantía del fabricante",
                        },
                        {
                            name: "recomendado por",
                            value: "Estilistas y barberos",
                        },
                        {
                            name: "certificación",
                            value: "Cumple con estándares de calidad",
                        },
                        {
                            name: "adaptabilidad",
                            value: "Apropiado para cortes en seco y húmedo",
                        },
                        {
                            name: "comb",
                            value: "Peine de dientes finos y gruesos",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-cutting-comb-scissors8skc6x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-cutting-comb-scissors8skc8x500.webp",
                        },
                    ],
                    slug: "hair-cutting-comb-scissors",
                    category_id: 20,
                    subcategory_id: null,
                    brand_id: 22,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
            ],
            productsRestaurants: [],
            productsServicios: [],
        },
        {
            id: 21,
            category_code: "CAT-000002",
            name: "Hair Wax",
            isService: false,
            image: null,
            wallpaper: null,
            icon: "<i class='fa fa-grooming'></i>",
            slug: "hair-wax",
            empresa_id: 8,

            subcategories: [],
            productsNormals: [
                {
                    price: 60,
                    discount: 0,
                    name: "360 degree hair comb",
                    url: null,
                    description:
                        "Peine de Cabello 360 Grados\nDescubre la herramienta perfecta para el cuidado de tu cabello. El peine de 360 grados es un innovador accesorio que transforma la experiencia de peinar y estilizar, brindando un acabado profesional desde la comodidad de tu hogar.\n\nCaracterísticas Principales\n\n\nBeneficios\n\n\nNo esperes más para transformar tu rutina de cuidado capilar. Con el peine de 360 grados, ¡cada día es un buen día para lucir un cabello espectacular!",
                    characteristics: [
                        {
                            name: "nombre",
                            value: "Peine 360 Grados",
                        },
                        {
                            name: "material",
                            value: "Plástico ABS",
                        },
                        {
                            name: "dimensiones",
                            value: "15 cm x 5 cm x 2 cm",
                        },
                        {
                            name: "peso",
                            value: "50 g",
                        },
                        {
                            name: "colores",
                            value: "Variados",
                        },
                        {
                            name: "tipo",
                            value: "Cepillo/desenredador",
                        },
                        {
                            name: "uso",
                            value: "Uso en cabello seco y húmedo",
                        },
                        {
                            name: "diseño",
                            value: "Ergonómico y rotatorio",
                        },
                        {
                            name: "beneficios",
                            value: "Reduce el quiebre y el frizz",
                        },
                        {
                            name: "cuidado",
                            value: "Fácil de limpiar",
                        },
                        {
                            name: "adecuado_para",
                            value: "Todo tipo de cabello",
                        },
                        {
                            name: "tecnología",
                            value: "Tecnología de peinado 360°",
                        },
                        {
                            name: "tamaño_del_diente",
                            value: "Varía según el diseño",
                        },
                        {
                            name: "característica_adicional",
                            value: "Antiestático",
                        },
                        {
                            name: "marca",
                            value: "Marca no especificada",
                        },
                        {
                            name: "recomendaciones_de_uso",
                            value: "Usar con movimientos suaves",
                        },
                        {
                            name: "garantía",
                            value: "1 año",
                        },
                        {
                            name: "tipo_de_cabello",
                            value: "Largo, corto, rizado, lacio",
                        },
                        {
                            name: "uso_profesional",
                            value: "Recomendado para estilistas",
                        },
                        {
                            name: "compatibilidad",
                            value: "Compatible con productos de peinado",
                        },
                        {
                            name: "origen",
                            value: "Fabricado en China",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/360-degree-hair-comb190vgx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/360-degree-hair-comb190vmx500.webp",
                        },
                    ],
                    slug: "360-degree-hair-comb",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: 22,
                    empresa_id: 8,
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 25,
                    discount: 0,
                    name: "Trimmer brush",
                    url: null,
                    description:
                        "Trimmer-Brush para Barbería\nDescubre el revolucionario Trimmer-Brush, la herramienta perfecta para los profesionales de la barbería y los entusiastas del cuidado personal. Este producto combina la precisión de un trimmer con la funcionalidad de un cepillo, ofreciendo una experiencia única en el arte del afeitado y el estilizado de la barba.\n\nCaracterísticas Destacadas:\n\n\nBeneficios:\n\n\nCon el Trimmer-Brush, tu rutina de cuidado personal se transformará, logrando resultados excepcionales con facilidad. No dejes pasar la oportunidad de llevar tu estilo al siguiente nivel.",
                    characteristics: [
                        {
                            name: "Nombre del producto",
                            value: "Trimmer-brush",
                        },
                        {
                            name: "Tipo de producto",
                            value: "Herramienta de jardín",
                        },
                        {
                            name: "Peso",
                            value: "Varía según el modelo",
                        },
                        {
                            name: "Fuente de energía",
                            value: "Eléctrico, a batería o de gasolina",
                        },
                        {
                            name: "Uso",
                            value: "Corte y recorte de hierba y maleza",
                        },
                        {
                            name: "Características de la cuchilla",
                            value: "Cuchillas intercambiables para diferentes tareas",
                        },
                        {
                            name: "Ergonomía",
                            value: "Diseño ligero y fácil de manejar",
                        },
                        {
                            name: "Longitud del eje",
                            value: "Ajustable en algunos modelos",
                        },
                        {
                            name: "Sistema de corte",
                            value: "Hilo o cuchilla de metal",
                        },
                        {
                            name: "Accesorios incluidos",
                            value: "Cabezal de corte, protector de cuchilla, arnés",
                        },
                        {
                            name: "Niveles de velocidad",
                            value: "Multivelocidad en algunos modelos",
                        },
                        {
                            name: "Características de seguridad",
                            value: "Interruptor de seguridad y protector de manos",
                        },
                        {
                            name: "Garantía",
                            value: "Generalmente entre 1 a 3 años",
                        },
                        {
                            name: "Condiciones de uso",
                            value: "Adecuado para uso doméstico y profesional",
                        },
                        {
                            name: "Servicio de mantenimiento",
                            value: "Requiere mantenimiento regular para un rendimiento óptimo",
                        },
                        {
                            name: "Facilidad de almacenamiento",
                            value: "Diseño compacto y desmontable en algunos modelos",
                        },
                        {
                            name: "Compatibilidad con accesorios",
                            value: "Compatible con diversos accesorios de jardín",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Varía según el fabricante",
                        },
                        {
                            name: "Ruido",
                            value: "Niveles de ruido variables según la potencia",
                        },
                        {
                            name: "Aplicaciones",
                            value: "Ideal para bordes, caminos y áreas difíciles de alcanzar",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/trimmer-brush1e8erx100.webp",
                            dimension: 100,
                        },
                        {
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/trimmer-brush1e8esx500.webp",
                            dimension: 500,
                        },
                    ],
                    slug: "trimmer-brush",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 8,
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 30,
                    discount: 4,
                    name: "Water Spray",
                    url: null,
                    description:
                        "Water-Spray para Barbería\nDescubre nuestra innovadora botella de Water-Spray, diseñada especialmente para barberías y estilos de vida de grooming. Este producto es esencial para los barberos que buscan precisión y calidad en cada corte.\n\nCaracterísticas del Producto\n\n\nBeneficios\n\n\nNo te pierdas la oportunidad de mejorar tu rutina de barbería con nuestro Water-Spray. Ideal para profesionales que valoran la calidad en cada detalle.",
                    characteristics: [
                        {
                            name: "Tipo",
                            value: "Sistema de rociado de agua",
                        },
                        {
                            name: "Uso principal",
                            value: "Control de incendios",
                        },
                        {
                            name: "Método de operación",
                            value: "Rociado de agua a presión",
                        },
                        {
                            name: "Cobertura",
                            value: "Amplia, dependiendo del diseño",
                        },
                        {
                            name: "Componentes principales",
                            value: "Bomba, manguera, boquillas",
                        },
                        {
                            name: "Ventajas",
                            value: "Eficaz para múltiples tipos de incendios",
                        },
                        {
                            name: "Desventajas",
                            value: "Puede causar daños por agua",
                        },
                        {
                            name: "Requisitos de mantenimiento",
                            value: "Inspecciones regulares y pruebas",
                        },
                        {
                            name: "Clima operacional",
                            value: "Funciona en diversas condiciones climáticas",
                        },
                        {
                            name: "Normativas",
                            value: "Cumple con estándares de seguridad locales",
                        },
                        {
                            name: "Tipo de agua",
                            value: "Agua potable o tratada",
                        },
                        {
                            name: "Facilidad de instalación",
                            value: "Moderada, requiere planificación",
                        },
                        {
                            name: "Alcance",
                            value: "Puede llegar hasta varios cientos de pies",
                        },
                        {
                            name: "Consumo de agua",
                            value: "Variable según la presión y diseño",
                        },
                        {
                            name: "Entrenamiento requerido",
                            value: "Capacitación para el personal",
                        },
                        {
                            name: "Aplicaciones",
                            value: "Industria, edificios, áreas exteriores",
                        },
                        {
                            name: "Resiliencia",
                            value: "Puede ser afectado por condiciones extremas",
                        },
                        {
                            name: "Innovaciones recientes",
                            value: "Tecnología de control automático",
                        },
                        {
                            name: "Compatibilidad",
                            value: "Integrable con otros sistemas de seguridad",
                        },
                        {
                            name: "Historial de uso",
                            value: "Utilizado desde el siglo XIX",
                        },
                        {
                            name: "Impacto ambiental",
                            value: "Consideraciones sobre aguas residuales",
                        },
                        {
                            name: "Requerimientos de energía",
                            value: "Bomba eléctrica o diesel según el sistema",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/water-spray1fks0x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/water-spray1fks2x500.webp",
                        },
                    ],
                    slug: "water-spray",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: 23,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 45,
                    discount: 5,
                    name: "Hair  set",
                    url: null,
                    description:
                        "Set de Afeitado Eléctrico para Barberos\nDescubre la perfección en el cuidado personal con nuestro set de recortadora de cabello, diseñado especialmente para barberos profesionales y entusiastas del estilo. Este completo kit incluye todo lo necesario para lograr cortes precisos y acabados impecables.\n\nCaracterísticas del Producto:\n\n\nPor qué Elegir Nuestro Set:\nPerfecto tanto para uso doméstico como profesional, este set de recortadora de cabello garantiza precisión y facilidad en cada corte. Actualiza tu colección de herramientas de barbería y ofrece a tus clientes o a ti mismo la mejor experie",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "cortadora de cabello",
                        },
                        {
                            name: "número de piezas",
                            value: "7",
                        },
                        {
                            name: "uso",
                            value: "personal y profesional",
                        },
                        {
                            name: "material de cuchillas",
                            value: "acero inoxidable",
                        },
                        {
                            name: "ajuste de longitud",
                            value: "5 longitudes ajustables",
                        },
                        {
                            name: "función de carga",
                            value: "inalámbrico y con cable",
                        },
                        {
                            name: "batería",
                            value: "recargable de larga duración",
                        },
                        {
                            name: "peso",
                            value: "aproximadamente 200 gramos",
                        },
                        {
                            name: "tamaño",
                            value: "compacto y portátil",
                        },
                        {
                            name: "accesorios incluidos",
                            value: "peine, tijeras, cortapelos, cepillo de limpieza",
                        },
                        {
                            name: "ruido",
                            value: "bajo nivel de ruido",
                        },
                        {
                            name: "pantalla",
                            value: "indicador LED de carga",
                        },
                        {
                            name: "tipo de motor",
                            value: "motor de alta potencia",
                        },
                        {
                            name: "código IP",
                            value: "IPX4 (resistente al agua)",
                        },
                        {
                            name: "garantía",
                            value: "1 año para defectos de fabricación",
                        },
                        {
                            name: "color",
                            value: "negro y plata",
                        },
                        {
                            name: "ergonomía",
                            value: "diseño antideslizante",
                        },
                        {
                            name: "facilidad de limpieza",
                            value: "cuchillas desmontables y lavables",
                        },
                        {
                            name: "destinatario",
                            value: "hombres, mujeres y niños",
                        },
                        {
                            name: "usos adicionales",
                            value: "perfilado de barba y bigote",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-setv8jj7x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-setv8jj8x500.webp",
                        },
                    ],
                    slug: "hair-set",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 30,
                    discount: 4,
                    name: "Hair cutting comb scissors set",
                    url: null,
                    description:
                        "Set de Tijeras y Peine para Corte de Cabello\nTransforma tu experiencia de peluquería con nuestro exclusivo set de tijeras y peine para corte de cabello. Diseñado para barberos profesionales y aficionados, este conjunto te proporciona las herramientas esenciales para lograr el estilo deseado.\n\nCaracterísticas del Producto:\n\n\nVentajas del Set:\n\n\nYa seas un barbero experimentado o un entusiasta del cuidado personal, este set de tijeras y peine es la elección perfecta para lograr cortes impecables y estilos personalizados.",
                    characteristics: [
                        {
                            name: "set_type",
                            value: "Hair-cutting comb and scissors set",
                        },
                        {
                            name: "comb_material",
                            value: "High-quality plastic or stainless steel",
                        },
                        {
                            name: "scissor_material",
                            value: "Forged stainless steel",
                        },
                        {
                            name: "scissor_length",
                            value: "6.5 to 7 inches",
                        },
                        {
                            name: "comb_length",
                            value: "7 to 8 inches",
                        },
                        {
                            name: "features",
                            value: "Ergonomic design for comfort",
                        },
                        {
                            name: "scissor_blade_type",
                            value: "Straight or curved blades",
                        },
                        {
                            name: "comb_type",
                            value: "Fine-toothed and wide-toothed options",
                        },
                        {
                            name: "usage",
                            value: "Professional and home use",
                        },
                        {
                            name: "cutting_technique",
                            value: "Precision cutting",
                        },
                        {
                            name: "care_instructions",
                            value: "Clean after each use, dry thoroughly",
                        },
                        {
                            name: "brand_reputation",
                            value: "Renowned brands often included",
                        },
                        {
                            name: "user_experience",
                            value: "Smooth and efficient cutting",
                        },
                        {
                            name: "weight",
                            value: "Lightweight for ease of use",
                        },
                        {
                            name: "color_options",
                            value: "Various colors available",
                        },
                        {
                            name: "safety_features",
                            value: "Rounded tips for safety",
                        },
                        {
                            name: "target_audience",
                            value: "Barbers and hairstylists",
                        },
                        {
                            name: "packaging",
                            value: "Compact and durable storage cases",
                        },
                        {
                            name: "additional_tools",
                            value: "May include thinning shears or a razor",
                        },
                        {
                            name: "durability",
                            value: "Long-lasting materials",
                        },
                        {
                            name: "maintenance",
                            value: "Regular sharpening recommended",
                        },
                        {
                            name: "user_guide",
                            value: "Included for best practices",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-cutting-comb-scissors-set1aba3x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-cutting-comb-scissors-set1aba9x500.webp",
                        },
                    ],
                    slug: "hair-cutting-comb-scissors-set",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: 25,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 25,
                    discount: 5,
                    name: "Hair detangling comb",
                    url: null,
                    description:
                        "Peina Desenredante para Cabello\n\nDescubre la solución perfecta para desenredar tu cabello sin esfuerzo. Nuestra peina desenredante está diseñada para ofrecerte una experiencia de peinado suave y sin tirones, ideal para todo tipo de cabellos, desde finos hasta rizados.\n\nCaracterísticas Principales:\n\n\nBeneficios:\n\n\nAñade esta peina desenredante a tu rutina de cuidado capilar y disfruta de un cabello manejable y saludable todos los días. ¡Haz tu pedido ahora y transforma tu peinado!",
                    characteristics: [
                        {
                            name: "Material",
                            value: "Plástico, madera o metal",
                        },
                        {
                            name: "Tamaño",
                            value: "Varía, generalmente entre 20-25 cm",
                        },
                        {
                            name: "Diseño",
                            value: "Dientes anchos para desenredar",
                        },
                        {
                            name: "Usos",
                            value: "Desenredar el cabello húmedo o seco",
                        },
                        {
                            name: "Antiestático",
                            value: "Puede ser antiestático para evitar frizz",
                        },
                        {
                            name: "Ergonomía",
                            value: "Mango fácil de agarrar para mayor comodidad",
                        },
                        {
                            name: "Versatilidad",
                            value: "Adecuado para todo tipo de cabello",
                        },
                        {
                            name: "Resistente",
                            value: "Duradero y fácil de limpiar",
                        },
                        {
                            name: "Prevención de daños",
                            value: "Minimiza la ruptura del cabello",
                        },
                        {
                            name: "Uso profesional",
                            value: "Ideal para peluqueros y estilistas",
                        },
                        {
                            name: "Aconsejado por expertos",
                            value: "Recomendado por dermatólogos y estilistas",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Variedad de colores y acabados",
                        },
                        {
                            name: "Fácil mantenimiento",
                            value: "Simple de limpiar y mantener",
                        },
                        {
                            name: "Grupo de edad",
                            value: "Apropiado para todas las edades",
                        },
                        {
                            name: "Agujeros de drenaje",
                            value: "Puede tener agujeros para evitar la acumulación de agua",
                        },
                        {
                            name: "Diseño portátil",
                            value: "Ligero y fácil de llevar",
                        },
                        {
                            name: "Función terapéutica",
                            value: "Puede ayudar a estimular el cuero cabelludo",
                        },
                        {
                            name: "Adaptabilidad",
                            value: "Adecuado para cabellos rizados, lisos, o gruesos",
                        },
                        {
                            name: "Consejería de uso",
                            value: "Se recomienda usar desde las puntas hacia la raíz",
                        },
                        {
                            name: "Precio accesible",
                            value: "Generalmente asequible",
                        },
                        {
                            name: "Opciones biodegradables",
                            value: "Algunas versiones están hechas de materiales biodegradables",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-detangling-comb1bm9tx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/hair-detangling-comb1bma0x500.webp",
                        },
                    ],
                    slug: "hair-detangling-comb",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: 24,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
                {
                    price: 56,
                    discount: 0,
                    name: "Trimmer MIX R2",
                    url: null,
                    description:
                        "Descripción del Trimmer-MIX-R2\nDescubre el Trimmer-MIX-R2, la herramienta perfecta para lograr un acabado profesional en tu barbería. Diseñado para ofrecer precisión y comodidad, este recortador es ideal tanto para barberos experimentados como para principiantes.\n\nCaracterísticas Destacadas:\n\n\nCon el Trimmer-MIX-R2, tu creatividad no tendrá límites. Eleva tus servicios de barbería con herramientas que marcan la diferencia en cada corte.",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Trimmer-MIX-R2",
                        },
                        {
                            name: "Tipo",
                            value: "Trimmer",
                        },
                        {
                            name: "Uso",
                            value: "Afeitado y recorte",
                        },
                        {
                            name: "Fuente de energía",
                            value: "Batería recargable",
                        },
                        {
                            name: "Duración de la batería",
                            value: "Hasta 120 minutos",
                        },
                        {
                            name: "Tiempo de carga",
                            value: "60 minutos",
                        },
                        {
                            name: "Material de cuchillas",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Cuchillas ajustables",
                            value: "Sí",
                        },
                        {
                            name: "Accesorios incluidos",
                            value: "Peines de guía, cepillo de limpieza",
                        },
                        {
                            name: "Diseño",
                            value: "Ergonómico y ligero",
                        },
                        {
                            name: "Impermeable",
                            value: "Sí",
                        },
                        {
                            name: "Peso",
                            value: "280 gramos",
                        },
                        {
                            name: "Dimensiones",
                            value: "15 x 4 x 4 cm",
                        },
                        {
                            name: "Rango de longitud de corte",
                            value: "0.5 mm a 20 mm",
                        },
                        {
                            name: "Velocidades",
                            value: "2 ajustes de velocidad",
                        },
                        {
                            name: "Iluminación LED",
                            value: "Indicador de carga",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                        {
                            name: "Color",
                            value: "Negro con detalles en plata",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Doméstico y profesional",
                        },
                        {
                            name: "Función de bloqueo",
                            value: "Sí",
                        },
                        {
                            name: "Facilidad de limpieza",
                            value: "Sí, cuchillas desmontables",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/trimmer-mix-r28tvspx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/products/trimmer-mix-r28tvssx500.webp",
                        },
                    ],
                    slug: "trimmer-mix-r2",
                    category_id: 21,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 8,

                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                },
            ],
            productsRestaurants: [],
            productsServicios: [],
        },
    ],
    brands: [
        {
            id: 22,
            name: "Cafe Royale",
            brand_code: "BRAND-000001",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/cafe-royale3c1elx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/cafe-royale3c1esx500.webp",
                },
            ],
            slug: "cafe-royale",
            empresa_id: 8,
        },
        {
            id: 23,
            name: "GILLETE",
            brand_code: "BRAND-000002",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/gillete3cjimx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/gillete3cjiox500.webp",
                },
            ],
            slug: "gillete",
            empresa_id: 8,
        },
        {
            id: 24,
            name: "The Barber",
            brand_code: "BRAND-000003",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/the-barber3dgjhx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/the-barber3dgjix500.webp",
                },
            ],
            slug: "the-barber",
            empresa_id: 8,
        },
        {
            id: 25,
            name: "Delicious",
            brand_code: "BRAND-000004",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/delicious3e0hex100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/delicious3e0hfx500.webp",
                },
            ],
            slug: "delicious",
            empresa_id: 8,
        },
        {
            id: 26,
            name: "we re designers",
            brand_code: "BRAND-000005",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/we-re-designers3emsox100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-8.vigilio-services.com/empresas/demo-8/images/brands/we-re-designers3emssx500.webp",
                },
            ],
            slug: "we-re-designers",
            empresa_id: 8,
        },
    ],
};
