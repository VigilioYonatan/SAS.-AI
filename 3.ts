export const a = {
    setting: {
        logo_width: 120,
        id: 3,
        web: null,
        host: {
            host: null,
            nameserver_one: null,
            nameserver_two: null,
            time: null,
            enabled: false,
        },
        bg_color: "#f03c3c",
        bg_color_header: "transparent",
        bg_color_aside: "transparent",
        bg_color_background: "#ffffff",
        bg_color_footer: "#333333",
        bg_color_secondary: "#f03c3c",
        type_animation: "fade-up",
        background_auth: null,
        font_face: "Barlow",
        bg_color_paper: "#ffffff",
        bg_color_button: "#f03c3c",
        isCoverImage: false,
        isScrolling: false,
        is_hidde_total_cart: false,
        isDark: false,
        isLogoImage: false,
        is_block_aside: false,
        is_subcategory: false,
        is_service_page: false,
        position_header: true,
        bg_color_responsive: "#ffffff",
        border_title_type: "null",
        type_star: "star",
        background_position: "center",
        header_type: "normal",
        background_type: "first",
        type_icons: "normal",
        type_border: "square",
        type_cart: "fas fa-shopping-cart",
        type_arrow: "second",
        type_map: "satelite",
        web_script:
            '\r\n/* \r\n    ----------------------------------\r\n    NO TOCAR, SI NO ERES DESARROLLADOR\r\n    ----------------------------------\r\n*/\r\nconst style = document.createElement("style")\r\n\r\nstyle.innerHTML=`\r\n.title-section h3 {\r\n    text-transform: capitalize;\r\n    font-family:cursive;\r\n}\r\nheader nav \u003E  a, header nav \u003E div  a, header nav \u003E div  button{\r\n    font-size: .85rem !important;\r\n    line-height: 1rem !important;\r\n    font-family: Font-Light, sans !important;\r\n  text-transform: capitalize !important;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div {\r\n    width: 100% !important;\r\n    gap: 2.5rem;\r\n \r\n}\r\n.background-home-container \u003E div, .background-home \u003E div  {\r\n    height: calc(100vh - 200px) !important;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E h2{\r\n    color: white !important;\r\n    font-size: 4rem;\r\n    font-family: serif;\r\n    width: 90% !important;\r\n    line-height: 3rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E p{\r\n    color: white !important;\r\n    font-size: 1.5rem;\r\n    width: 90% !important;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E a {\r\n    border-radius: 0px;\r\n    background: white;\r\n    border: 2px solid white;\r\n    padding: 1rem 2rem;\r\n    color: black !important;\r\n    position: relative;\r\n    display: inline-block;\r\n    overflow: hidden;\r\n    cursor: pointer;\r\n    transition: background-color 0.4s ease, color 0.4s ease; \r\n}\r\n\r\n/* Cambia el fondo y color de texto en el hover */\r\n.background-home-container \u003E div \u003E div \u003E div \u003E a:hover {\r\n    background-color: var(--primary);\r\n    color: white !important;\r\n}\r\n.categories-section{\r\n    display: none;\r\n}\r\n\r\n.users-section .slick-list {\r\n   height: auto !important;\r\n}\r\n.users-section .card-user  {\r\n    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\r\n}\r\n.users-section .card-user \u003E div:nth-child(1) img{\r\n    width:100%;\r\n    border-radius: 0rem;\r\n}\r\n.users-section .card-user \u003E div:nth-child(2) div{\r\n   display:none;\r\n}\r\n.users-section .card-user \u003E div:nth-child(2) h3{\r\n   font-size: 1.3rem;\r\n}\r\n.slick-arrow:hover{\r\n    background-color: var(--primary);\r\n}\r\n.slick-arrow:hover i{\r\n    background-color: var(--primary);\r\n    color: white;\r\n}\r\n`;\r\n\r\n\r\n\r\ndocument.head.appendChild(style);\r\n\r\n\r\n// click video\r\n\r\nconst video = document.querySelector(".grid-banner-0  .grid-banner-0-1  div:nth-child(2)")\r\nif(video){\r\n    const youtube = document.querySelector(".grid-banner-0  .grid-banner-0-1  div:nth-child(1) [data-label=\'youtube\']")\r\n    video.classList.replace("group-hover:scale-105","z-10")\r\n    video.addEventListener("click",()=\u003E{\r\n        sweetModal({html:`\u003Ciframe class="w-full" width="876" height="360" src=" https://www.youtube.com/embed/${youtube.textContent}" title="Video Placeholder" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen\u003E\u003C/iframe\u003E`,showCloseButton:true,sweetWidth:"700px",isCloseInBackground:false})\r\n    })\r\n}\r\n// remove effect\r\nconst usersSection =document.querySelector(".users-section");\r\nif(usersSection){\r\n    usersSection.removeAttribute("data-aos");\r\n}\r\n// remove class\r\nconst gridBanner2 =document.querySelector(".grid-banner-2")\r\nif(gridBanner2){\r\n    gridBanner2.classList.remove("max-w-6xl")\r\n}',
        sc: null,
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
            condiciones: true,
            categories: true,
            subcategories: true,
            services: true,
        },
        type_card: "eccomerce",
        type_product_buttons: "second",
        type_icons_bars: "light",
        is_hover_product: true,
        isProductWallpaper: true,
        hamburger: "fas fa-bars",
        shows: {
            map: false,
            about: true,
            cards: false,
            brands: true,
            android: true,
            offers_section: false,
            offers_user: true,
        },
        empresa_id: 3,
        createdAt: "2024-12-03T15:38:05.704Z",
        updatedAt: "2024-12-05T07:57:00.936Z",
    },
    gridBanners: [
        {
            id: 10,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.843Z",
            updatedAt: "2024-12-03T20:56:47.699Z",
            html: null,
        },
        {
            id: 11,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.843Z",
            updatedAt: "2024-12-03T15:38:05.843Z",
            banners: [],
        },
        {
            id: 12,
            html: '\u003Cdiv class="max-w-6xl mx-auto flex flex-col px-2 "\u003E\r\n    \u003Cdiv class="flex flex-col justify-center items-center" \u003E\r\n        \u003Ch3 class="text-2xl md:text-3xl capitalize pb-2 font-bold  dark:text-white flex justify-center flex-col items-center" data-label="0"\u003E\r\n            Nuevas colecciones\r\n        \u003C/h3\u003E\r\n        \u003Cp class="text-gray-500 dark:text-white mb-2" data-label="1"\u003E\r\n            Fancy and unique collections just launched\r\n        \u003C/p\u003E\r\n    \u003C/div\u003E\r\n\r\n    \u003Cdiv x-data="{\r\n        categories: JSON.parse(document.querySelector(\'home-page\').getAttribute(\':header\') || \'[]\').categories.slice(-3),\r\n        slug: JSON.parse(localStorage.getItem(\'empresa\')).slug,\r\n        card1Offset: 0,\r\n        card2Offset: 0,\r\n        card3Offset: 0,\r\n        maxOffset: 50, \r\n        lastScrollTop: 0,\r\n        isMdScreen: window.innerWidth \u003E= 700, \r\n        onScroll() {\r\n            if (!this.isMdScreen) return;\r\n            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;\r\n            if (scrollTop \u003E this.lastScrollTop) {\r\n                // Scroll hacia abajo\r\n                this.card1Offset = Math.min(this.maxOffset, this.card1Offset + 2);\r\n                this.card2Offset = Math.max(-this.maxOffset, this.card2Offset - 2);\r\n                this.card3Offset = Math.min(this.maxOffset, this.card3Offset + 2);\r\n            } else {\r\n                // Scroll hacia arriba\r\n                this.card1Offset = Math.max(-this.maxOffset, this.card1Offset - 2);\r\n                this.card2Offset = Math.min(this.maxOffset, this.card2Offset + 2);\r\n                this.card3Offset = Math.max(-this.maxOffset, this.card3Offset - 2);\r\n            }\r\n\r\n            this.lastScrollTop = scrollTop \u003C= 0 ? 0 : scrollTop; // Evitar valores negativos\r\n        }\r\n    }"\r\n    x-on:scroll.window="onScroll"\r\n    class="grid banner-2-container "\r\n    style=" gap:2rem"\u003E\r\n        \u003Ctemplate x-for="(category, index) of categories" :key="category.id"\u003E\r\n            \u003Cdiv\r\n                :style="`\r\n                    background-image: url(\'/empresas/${slug}/${category.image.filter(img =\u003E img.dimension === 800)[0].file}\');\r\n                    background-size: cover;\r\n                    background-repeat: no-repeat;\r\n                    width: 100%;\r\n                    height: 450px;\r\n                    transform: translateY(${index === 0 ? card1Offset : index === 1 ? card2Offset : card3Offset}px);\r\n                    align-items: end;\r\n                `"\r\n                class="delay-custom-1 flex justify-center pb-6"\r\n            \u003E\r\n                \u003Cdiv class="m-6 flex flex-col gap-4"\u003E\r\n                    \u003Ca :href="`/shop/${category.slug}`" class="bg-primary px-7 py-2 mt-2 font-semibold mb-2 hover:bg-black text-white delay-custom-1 self-start" x-text="category.name"\u003E\u003C/a\u003E\r\n                \u003C/div\u003E\r\n            \u003C/div\u003E\r\n        \u003C/template\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    .grid-banner-2{\r\n        background-color: #F5F5F5;\r\n        padding:4rem 0rem;\r\n    }\r\n    .grid-banner-2 h3{\r\n       font-family: cursive;\r\n    }\r\n    .banner-2-container {\r\n        grid-template-columns: repeat(1, minmax(0, 1fr));\r\n    }\r\n    .grid-banner-2-0 \u003E div \u003E div \u003E div:nth-child(1){\r\n        margin-bottom: 1.5rem ;\r\n\r\n    }\r\n    \r\n\r\n    @media screen and (min-width:700px){\r\n       .grid-banner-2-0 \u003E div \u003E div \u003E div:nth-child(1) {\r\n            margin-bottom: 3.2rem !important;\r\n        }\r\n        .banner-2-container {\r\n            grid-template-columns: repeat(3, minmax(0, 1fr));\r\n        }\r\n    }\r\n\u003C/style\u003E',
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.843Z",
            updatedAt: "2024-12-04T10:06:04.750Z",
        },
        {
            id: 13,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.843Z",
            updatedAt: "2024-12-04T10:18:14.492Z",
            banners: [
                {
                    id: 22,
                    title: null,
                    order: 0,
                    row: 1,
                    col: 1,
                    link: null,
                    button: null,
                    subtitle: null,
                    script: '\u003C!--  NO MODIFICAR ESTO, SI NO ERES DESARROLLADOR --\u003E\r\n\r\n\u003Cdiv class="grid  banner-4-container px-2"\u003E\r\n    \u003Cdiv class="flex flex-col gap-2 p-4 justify-center items-center border border-gray-400"\u003E\r\n        \u003Cimg\r\n             width="43" \r\n             height="45"\r\n            alt="" \r\n            src="https://demo-66.woovinapro.com/wp-content/uploads/2024/01/Icon_Shipping.png"/\u003E\r\n        \u003Cspan class="text-black font-semibold  text-center  dark:text-white" data-label="1"\u003EFree Shipping\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center  dark:text-white" data-label="2"\u003EOn all orders over $49.00\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="flex flex-col gap-2 p-4 justify-center items-center border border-gray-400"\u003E\r\n        \u003Cimg\r\n             width="43" \r\n             height="45"\r\n            alt="" \r\n            src="https://demo-66.woovinapro.com/wp-content/uploads/2024/01/Icon_Return.png"/\u003E\r\n        \u003Cspan class="text-black font-semibold  text-center  dark:text-white" data-label="3"\u003EEnvio gratuito\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center  dark:text-white" data-label="4"\u003E¡Aprovecha el envío gratuito en tu pedido!\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="flex flex-col gap-2 p-4 justify-center items-center border border-gray-400"\u003E\r\n        \u003Cimg\r\n             width="43" \r\n             height="45"\r\n            alt="" \r\n            src="https://demo-66.woovinapro.com/wp-content/uploads/2024/01/Icon_Security.png"/\u003E\r\n        \u003Cspan class="text-black font-semibold  text-center dark:text-white"  data-label="5"\u003ECompra segura\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="6"\u003E100% protegido\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="flex flex-col gap-2 p-4 justify-center items-center border border-gray-400"\u003E\r\n        \u003Cimg\r\n             width="43" \r\n             height="45"\r\n            alt="" \r\n            src="https://demo-66.woovinapro.com/wp-content/uploads/2024/01/Icon_Warranty.png"/\u003E\r\n        \u003Cspan class="text-black font-semibold  text-center dark:text-white" data-label="7"\u003EGarantía 100%\u003C/span\u003E\r\n        \u003Cp class="text-gray-600 font-semibold text-sm text-center dark:text-white" data-label="8"\u003EGarantía de devolución de dinero\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \r\n\u003C/div\u003E\r\n\r\n\u003Cstyle\u003E\r\n    .grid-banner-3{\r\n        padding:0rem 1.5rem;\r\n    }\r\n    .banner-4-container{\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n        gap: 0rem;\r\n    }\r\n    @media screen and (min-width:800px){\r\n        .banner-4-container{\r\n            height:220px;\r\n            padding: 2rem 0rem;\r\n            grid-template-columns: repeat(4, minmax(0, 1fr));\r\n            gap: 2rem;\r\n        }\r\n\r\n    }\r\n    \r\n\u003C/style\u003E',
                    enabled: true,
                    file: null,
                    date: null,
                    grid_banner_id: 13,
                    grid_banner_service_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-04T10:16:39.717Z",
                    updatedAt: "2024-12-04T13:55:28.866Z",
                },
            ],
        },
        {
            id: 14,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.843Z",
            updatedAt: "2024-12-03T15:38:05.843Z",
            banners: [],
        },
    ],
    files: [],
    gridBannersService: [
        {
            id: 6,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.879Z",
            updatedAt: "2024-12-03T15:38:05.879Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 7,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.879Z",
            updatedAt: "2024-12-03T15:38:05.879Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 8,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.879Z",
            updatedAt: "2024-12-03T15:38:05.879Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 9,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.879Z",
            updatedAt: "2024-12-03T15:38:05.879Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 10,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.879Z",
            updatedAt: "2024-12-03T15:38:05.879Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
    ],
    backgrounds: [
        {
            id: 4,
            title: " Love Story",
            description: "Fun And Flirty Piece For A Seamless Look",
            url: "https://www.demo-3.vigilio-services.com/",
            html: null,
            image: [
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/background/dce492c7-e26f-4a57-bc94-11ceb3d00a89jdq33x100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/background/e40ba2cc-3588-4395-ae2f-3b8620401015jdq36x1600.webp",
                    dimension: 1600,
                },
            ],
            empresa_id: 3,
            createdAt: "2024-12-03T15:38:05.684Z",
            updatedAt: "2024-12-03T15:50:09.041Z",
        },
        {
            id: 5,
            title: "exclusive sets",
            description: "Fun And Flirty Piece For A Seamless Look",
            url: "https://www.demo-3.vigilio-services.com/",
            html: null,
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/background/2f22f0ec-7087-4698-8fd1-45c709feaa5fjgcchx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/background/71dd2443-48cc-4167-a0e5-a1911de871d5jgccox1600.webp",
                },
            ],
            empresa_id: 3,
            createdAt: "2024-12-03T15:51:31.361Z",
            updatedAt: "2024-12-03T15:51:31.361Z",
        },
    ],
    categories: [
        {
            id: 9,
            category_code: "CAT-000003",
            name: "Essential",
            isService: false,
            image: [
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/essential5ul81x100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/essential5ul88x800.webp",
                    dimension: 800,
                },
            ],
            icon: null,
            slug: "essential",
            empresa_id: 3,
            createdAt: "2024-12-03T21:04:37.117Z",
            updatedAt: "2024-12-04T06:33:07.318Z",
            subcategories: [],
            productsNormals: [],
            productsRestaurants: [],
            productsServicios: [],
        },
        {
            id: 7,
            category_code: "CAT-000001",
            name: "Balcony",
            isService: false,
            image: [
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/balcony5vi4gx100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/balcony5vi4hx800.webp",
                    dimension: 800,
                },
            ],
            wallpaper: [
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/balcony6m830x100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/categories/balcony6m832x1200.webp",
                    dimension: 1200,
                },
            ],
            icon: null,
            slug: "balcony",
            empresa_id: 3,
            createdAt: "2024-12-03T21:04:06.425Z",
            updatedAt: "2024-12-04T06:33:36.846Z",
            subcategories: [],
            productsNormals: [
                {
                    price: 69,
                    discount: 0,
                    id: 14,
                    product_code: "PROD-000001",
                    name: "Beats by Dr. Dre Studio",
                    url: null,
                    description:
                        "Descubre la comodidad y el estilo con la ropa interior Beats by Dr. Dre Studio. Diseñada para ofrecer un ajuste perfecto, esta colección combina materiales suaves y transpirables que se adaptan a tu cuerpo, garantizando libertad de movimiento. Con un diseño moderno y elegante, cada pieza refleja la esencia de la marca, fusionando moda y funcionalidad. Ideal para el uso diario, esta ropa interior es la elección perfecta para quienes buscan calidad y confort en cada prenda. Disponible en diferentes tamaños y colores, eleva tu armario con la esencia distintiva de Beats.",
                    characteristics: [
                        {
                            name: "modelo",
                            value: "Beats by Dr. Dre Studio",
                        },
                        {
                            name: "tipo",
                            value: "auriculares over-ear",
                        },
                        {
                            name: "conectividad",
                            value: "inalámbrica y cableada",
                        },
                        {
                            name: "duración_batería",
                            value: "hasta 20 horas",
                        },
                        {
                            name: "peso",
                            value: "aproximadamente 260 gramos",
                        },
                        {
                            name: "cancelación_ruido",
                            value: "activa y pasiva",
                        },
                        {
                            name: "compatibilidad",
                            value: "iOS y Android",
                        },
                        {
                            name: "control_táctil",
                            value: "sí",
                        },
                        {
                            name: "micrófono_incorporado",
                            value: "sí",
                        },
                        {
                            name: "material_hormigón",
                            value: "plástico y metal",
                        },
                        {
                            name: "almohadillas",
                            value: "suaves y cómodas",
                        },
                        {
                            name: "colores_disponibles",
                            value: "negro, blanco, rojo, azul",
                        },
                        {
                            name: "tipo_de_conexión",
                            value: "Bluetooth",
                        },
                        {
                            name: "rango_de_frecuencia",
                            value: "20 Hz - 20 kHz",
                        },
                        {
                            name: "accesorios_incluidos",
                            value: "cable de 3.5 mm, estuche de transporte",
                        },
                        {
                            name: "control_volume",
                            value: "sí",
                        },
                        {
                            name: "compatibilidad_asistentes",
                            value: "Siri, Google Assistant",
                        },
                        {
                            name: "latencia",
                            value: "baja",
                        },
                        {
                            name: "personalización_sonido",
                            value: "sí",
                        },
                        {
                            name: "diseño_plegable",
                            value: "sí",
                        },
                        {
                            name: "garantía",
                            value: "1 año",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/beats-by-dr-dre-studio5gcbhx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/beats-by-dr-dre-studio5gcbsx500.webp",
                        },
                    ],
                    slug: "beats-by-dr-dre-studio",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:06:05.536Z",
                    updatedAt: "2024-12-03T21:06:05.536Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [28],
                        },
                    ],
                    variants: [
                        {
                            id: 17,
                            sku: "0000001",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 14,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:06:05.608Z",
                            updatedAt: "2024-12-03T21:08:24.223Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 17,
                                        feature_id: 28,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 3.5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 0,
                        stars4: 0,
                        stars3: 1,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 550,
                    discount: 0,
                    id: 15,
                    product_code: "PROD-000002",
                    name: "Fruit of the Loom Women’s beyondsoft Bikini Panties",
                    url: null,
                    description:
                        "Las braguitas bikini Beyondsoft de Fruit of the Loom para mujer ofrecen una comodidad excepcional y un ajuste perfecto. Confeccionadas con una suave mezcla de tejidos que se siente agradable al tacto, estas panties se adaptan a tu cuerpo sin restricciones. Su diseño de corte bajo y cintura elástica proporciona una sujeción segura y discreta, ideal para usar bajo cualquier prenda. Disponibles en una variedad de colores y tamaños, son perfectas para el uso diario, brindando una sensación de frescura y libertad. Además, son fáciles de cuidar, lo que las convierte en una elección práctica y cómoda",
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Fruit of the Loom",
                        },
                        {
                            name: "Modelo",
                            value: "Beyondsoft Bikini Panties",
                        },
                        {
                            name: "Material",
                            value: "95% poliéster, 5% spandex",
                        },
                        {
                            name: "Estilo",
                            value: "Bikini",
                        },
                        {
                            name: "Tamaño",
                            value: "XS a 3XL",
                        },
                        {
                            name: "Corte",
                            value: "Bajo",
                        },
                        {
                            name: "Tecnología",
                            value: "Ultra suave y cómodo",
                        },
                        {
                            name: "Cintura",
                            value: "Cintura elástica",
                        },
                        {
                            name: "Transpirabilidad",
                            value: "Alta",
                        },
                        {
                            name: "Fácil cuidado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "Durabilidad",
                            value: "Resistente al desgaste",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Variedad de colores y estampados",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Uso diario",
                        },
                        {
                            name: "Diseño",
                            value: "Diseño minimalista y moderno",
                        },
                        {
                            name: "Sensación",
                            value: "Suave al tacto",
                        },
                        {
                            name: "Ajuste",
                            value: "Ajuste cómodo",
                        },
                        {
                            name: "Propiedades",
                            value: "No se enrosca ni se desliza",
                        },
                        {
                            name: "Recomendación de talla",
                            value: "Consultar guía de tallas",
                        },
                        {
                            name: "Certificaciones",
                            value: "Materiales libres de químicos",
                        },
                        {
                            name: "Uso",
                            value: "Ideal para todas las estaciones",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/fruit-of-the-loom-womens-beyondsoft-bikini-panties5hr8sx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/fruit-of-the-loom-womens-beyondsoft-bikini-panties5hr90x500.webp",
                        },
                    ],
                    slug: "fruit-of-the-loom-womens-beyondsoft-bikini-panties",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:06:53.504Z",
                    updatedAt: "2024-12-03T21:37:35.884Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [28],
                        },
                    ],
                    variants: [
                        {
                            id: 18,
                            sku: "000005",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 15,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:06:53.602Z",
                            updatedAt: "2024-12-03T21:08:35.798Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 18,
                                        feature_id: 28,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 0,
                        promedio: null,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 0,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 560,
                    discount: 4,
                    id: 17,
                    product_code: "PROD-000004",
                    name: "Sexy Lingerie Set Lace",
                    url: null,
                    description:
                        "Descubre la elegancia y el seductor encanto de nuestro conjunto de lencería sexy de encaje. Este set cuenta con un diseño delicado que realza las curvas femeninas, confeccionado en un suave encaje que se adapta a tu piel. Con tirantes ajustables y detalles encantadores, se convierte en la elección perfecta para ocasiones especiales. Su estilo cautivador y su ajuste cómodo te harán sentir segura y atractiva. Ideal para una noche romántica o simplemente para consentirte a ti misma. Eleva tu intimidad con esta pieza irresistible.",
                    characteristics: [
                        {
                            name: "material",
                            value: "Encaje suave y elástico",
                        },
                        {
                            name: "tamaño",
                            value: "Disponible en S, M, L, XL",
                        },
                        {
                            name: "color",
                            value: "Rosa, negro, rojo, blanco",
                        },
                        {
                            name: "estilo",
                            value: "Conjunto de lencería sexy",
                        },
                        {
                            name: "incluye",
                            value: "Sujetador y tanga/boxer",
                        },
                        {
                            name: "transparencia",
                            value: "Semi-transparente",
                        },
                        {
                            name: "ajuste",
                            value: "Ajuste cómodo y ceñido",
                        },
                        {
                            name: "detalles",
                            value: "Encaje floral y tirantes ajustables",
                        },
                        {
                            name: "uso",
                            value: "Ideal para ocasiones especiales",
                        },
                        {
                            name: "cuidado",
                            value: "Lavado a mano recomendado",
                        },
                        {
                            name: "estación",
                            value: "Ideal para uso todo el año",
                        },
                        {
                            name: "diseño",
                            value: "Estilo seductor y elegante",
                        },
                        {
                            name: "marca",
                            value: "Varía según el proveedor",
                        },
                        {
                            name: "opciones adicionales",
                            value: "Puede incluir ligueros",
                        },
                        {
                            name: "comodidad",
                            value: "Alta, gracias a materiales suaves",
                        },
                        {
                            name: "regalo",
                            value: "Perfecto como regalo para ocasiones especiales",
                        },
                        {
                            name: "tendencia",
                            value: "Popular entre la moda íntima",
                        },
                        {
                            name: "sostenibilidad",
                            value: "Algunos modelos hechos con materiales reciclados",
                        },
                        {
                            name: "reseñas",
                            value: "Generalmente positivas por conforto y diseño",
                        },
                        {
                            name: "temática",
                            value: "Romántica y seductora",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-lingerie-set-lace5mgsqx100.webp",
                            dimension: 100,
                        },
                        {
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-lingerie-set-lace5mgstx500.webp",
                            dimension: 500,
                        },
                        {
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-lingerie-set-lace5mgvtx100.webp",
                            dimension: 100,
                        },
                        {
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-lingerie-set-lace5mgvtx500.webp",
                            dimension: 500,
                        },
                    ],
                    slug: "sexy-lingerie-set-lace",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:08:11.066Z",
                    updatedAt: "2024-12-03T21:37:14.386Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [14],
                        },
                    ],
                    variants: [
                        {
                            id: 20,
                            sku: "0000004",
                            stock: 0,
                            ilimit: true,
                            images: [1, 2],
                            product_normal_id: 17,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:08:11.129Z",
                            updatedAt: "2024-12-03T21:09:42.569Z",
                            features: [
                                {
                                    id: 14,
                                    value: "#000000",
                                    description: "Negro",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.537Z",
                                    updatedAt: "2024-11-28T10:16:44.537Z",
                                    VariantsFeatures: {
                                        variant_id: 20,
                                        feature_id: 14,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 3.5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 0,
                        stars4: 0,
                        stars3: 1,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 960,
                    discount: 2,
                    id: 19,
                    product_code: "PROD-000006",
                    name: "Simple Silk Nightgown Deco Lace",
                    url: null,
                    description:
                        "Descubre la elegancia y sutileza de nuestro camisón de seda simple con detalles de encaje. Confeccionado con materiales de alta calidad, este camisón ofrece una sensación suave y ligera contra la piel, ideal para noches de descanso y momentos de relax. Su diseño clásico y femenino resalta la figura, mientras que el delicado encaje añade un toque de sofisticación. Perfecto para regalar o para consentirte a ti misma, este camisón combina confort y estilo, convirtiéndose en una pieza esencial en tu armario nocturno. Disponible en varias tallas y colores, para que encuentres el que mejor se adapte",
                    characteristics: [
                        {
                            name: "material",
                            value: "seda natural",
                        },
                        {
                            name: "estilo",
                            value: "noche",
                        },
                        {
                            name: "fondo",
                            value: "liso",
                        },
                        {
                            name: "detalles",
                            value: "encaje decorativo",
                        },
                        {
                            name: "longitud",
                            value: "midi",
                        },
                        {
                            name: "mangas",
                            value: "sin mangas",
                        },
                        {
                            name: "cuello",
                            value: "en V",
                        },
                        {
                            name: "ajuste",
                            value: "suave y holgado",
                        },
                        {
                            name: "características adicionales",
                            value: "translúcido",
                        },
                        {
                            name: "cuidado",
                            value: "lavado a mano recomendado",
                        },
                        {
                            name: "temporada",
                            value: "primavera/verano",
                        },
                        {
                            name: "tamaño disponible",
                            value: "S, M, L, XL",
                        },
                        {
                            name: "uso recomendado",
                            value: "uso doméstico y ocasiones especiales",
                        },
                        {
                            name: "color",
                            value: "diversas opciones",
                        },
                        {
                            name: "puntos de venta",
                            value: "tiendas especializadas y online",
                        },
                        {
                            name: "marca",
                            value: "varias marcas disponibles",
                        },
                        {
                            name: "diseño",
                            value: "elegante y sofisticado",
                        },
                        {
                            name: "origen",
                            value: "hecho a mano en algunos casos",
                        },
                        {
                            name: "etiqueta",
                            value: "sostenible en algunas variantes",
                        },
                        {
                            name: "composición del encaje",
                            value: "generalmente poliéster o nylon",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/simple-silk-nightgown-deco-lace70r8cx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/simple-silk-nightgown-deco-lace70r8gx500.webp",
                        },
                    ],
                    slug: "simple-silk-nightgown-deco-lace",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:32:33.643Z",
                    updatedAt: "2024-12-03T21:36:59.315Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                    variants: [
                        {
                            id: 22,
                            sku: "000004",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 19,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:32:33.700Z",
                            updatedAt: "2024-12-03T21:40:11.500Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 22,
                                        feature_id: 1,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 0,
                        promedio: null,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 0,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 750,
                    discount: 1,
                    id: 18,
                    product_code: "PROD-000005",
                    name: "Sexy One Piece Lace Teddy",
                    url: null,
                    description:
                        "Descubre el sensual Sexy One Piece Lace Teddy, una pieza única que combina elegancia y seducción. Este body de encaje destaca por su diseño ajustado que realza la figura, con delicados detalles que añaden un toque de sofisticación. Ideal para ocasiones especiales o para sorprender a esa persona especial, su material suave y transpirable garantiza comodidad durante todo el día. Con tirantes ajustables y un cierre discreto en la parte posterior, este teddy es perfecto para resaltar tus curvas de manera irresistible. Atrévete a dejarte llevar por la pasión y la confianza con este sofisticado conj",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "teddy",
                        },
                        {
                            name: "material",
                            value: "encaje",
                        },
                        {
                            name: "transparente",
                            value: "sí",
                        },
                        {
                            name: "estilo",
                            value: "sexy",
                        },
                        {
                            name: "tamaño disponible",
                            value: "S, M, L, XL",
                        },
                        {
                            name: "color",
                            value: "negro, rojo, blanco",
                        },
                        {
                            name: "ajuste",
                            value: "ceñido al cuerpo",
                        },
                        {
                            name: "detalles",
                            value: "encaje floral, tirantes ajustables",
                        },
                        {
                            name: "uso",
                            value: "ropa íntima, lencería especial",
                        },
                        {
                            name: "ocasion",
                            value: "citas, aniversarios",
                        },
                        {
                            name: "cuidado",
                            value: "lavado a mano recomendado",
                        },
                        {
                            name: "holgura",
                            value: "corte favorecedor",
                        },
                        {
                            name: "diseño",
                            value: "con espalda descubierta",
                        },
                        {
                            name: "complementos",
                            value: "generalmente incluye tanga",
                        },
                        {
                            name: "objetivo",
                            value: "realzar la figura femenina",
                        },
                        {
                            name: "marca",
                            value: "varía según el fabricante",
                        },
                        {
                            name: "disponibilidad",
                            value: "en tiendas físicas y online",
                        },
                        {
                            name: "confort",
                            value: "ligero y suave al tacto",
                        },
                        {
                            name: "temporada",
                            value: "todas las estaciones",
                        },
                        {
                            name: "tendencia",
                            value: "moda íntima actual",
                        },
                        {
                            name: "target",
                            value: "adultos, mujeres",
                        },
                        {
                            name: "opciones adicionales",
                            value: "puede incluir accesorios",
                        },
                        {
                            name: "estilo de uso",
                            value: "solitario o bajo ropa",
                        },
                        {
                            name: "inspiración",
                            value: "lencería de alta costura",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-one-piece-lace-teddy6uvarx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/sexy-one-piece-lace-teddy6uvb0x500.webp",
                        },
                    ],
                    slug: "sexy-one-piece-lace-teddy",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:31:32.279Z",
                    updatedAt: "2024-12-03T21:37:07.415Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [26],
                        },
                    ],
                    variants: [
                        {
                            id: 21,
                            sku: "0000045",
                            stock: 0,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 18,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:31:32.344Z",
                            updatedAt: "2024-12-03T21:31:41.906Z",
                            features: [
                                {
                                    id: 26,
                                    value: "#ff00ff",
                                    description: "Fucsia",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 21,
                                        feature_id: 26,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 1,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 520,
                    discount: 0,
                    id: 16,
                    product_code: "PROD-000003",
                    name: "Jockey Generation™ Women’s Natural Beauty Hipster",
                    url: null,
                    description:
                        "Experimenta la comodidad y el estilo con el Jockey Generation™ Women’s Natural Beauty Hipster. Diseñado para la mujer moderna, este hipster ofrece una suave sensación al contacto con la piel gracias a su tejido de alta calidad. Su corte favorecedor se adapta perfectamente a la silueta, brindando soporte sin sacrificar la libertad de movimiento. Disponible en una variedad de colores elegantes, es ideal para el uso diario y se convierte en una pieza esencial en tu guardarropa. Disfruta de la mezcla perfecta de funcionalidad y moda con este imprescindible de Jockey Generation.",
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Jockey",
                        },
                        {
                            name: "Línea",
                            value: "Generation™",
                        },
                        {
                            name: "Modelo",
                            value: "Natural Beauty Hipster",
                        },
                        {
                            name: "Estilo",
                            value: "Hipster",
                        },
                        {
                            name: "Material",
                            value: "Algodón suave",
                        },
                        {
                            name: "Composición",
                            value: "Algodón, modal, spandex",
                        },
                        {
                            name: "Tamaño",
                            value: "Variedad de tallas",
                        },
                        {
                            name: "Elástico",
                            value: "Cintura elástica cómoda",
                        },
                        {
                            name: "Diseño",
                            value: "Sin costuras en las orillas",
                        },
                        {
                            name: "Transpirabilidad",
                            value: "Alta transpirabilidad",
                        },
                        {
                            name: "Sensación",
                            value: "Ligera y suave al tacto",
                        },
                        {
                            name: "Uso",
                            value: "Uso diario",
                        },
                        {
                            name: "Cuidado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "Color",
                            value: "Disponibles en varios colores",
                        },
                        {
                            name: "Ajuste",
                            value: "Ajuste flexible",
                        },
                        {
                            name: "Estilo de vida",
                            value: "Ideal para el día a día",
                        },
                        {
                            name: "Sostenibilidad",
                            value: "Compromiso con materiales sostenibles",
                        },
                        {
                            name: "Características adicionales",
                            value: "Bajo perfil",
                        },
                        {
                            name: "Origen",
                            value: "Fabricado éticamente",
                        },
                        {
                            name: "Durabilidad",
                            value: "Alta durabilidad",
                        },
                        {
                            name: "Restricción de tamaño",
                            value: "No hay costuras que incomoden",
                        },
                        {
                            name: "Popularidad",
                            value: "Muy valorado por clientes",
                        },
                        {
                            name: "Innovación",
                            value: "Diseño centrado en la comodidad",
                        },
                        {
                            name: "Recomendaciones",
                            value: "Perfecto para todas las actividades",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/jockey-generation-womens-natural-beauty-hipster5iqu5x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/jockey-generation-womens-natural-beauty-hipster5iqu8x500.webp",
                        },
                    ],
                    slug: "jockey-generation-womens-natural-beauty-hipster",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:07:25.917Z",
                    updatedAt: "2024-12-03T21:37:20.175Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [31],
                        },
                    ],
                    variants: [
                        {
                            id: 19,
                            sku: "0000004",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 16,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:07:25.991Z",
                            updatedAt: "2024-12-03T21:08:52.896Z",
                            features: [
                                {
                                    id: 31,
                                    value: "#4b0082",
                                    description: "Índigo",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 19,
                                        feature_id: 31,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 1,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 867,
                    discount: 1,
                    id: 20,
                    product_code: "PROD-000007",
                    name: "Women’s All Over Lace Cheeky Underwea",
                    url: null,
                    description:
                        "Descubre la sensualidad y la comodidad con la ropa interior femenina de encaje todo incluido. Este modelo de braguitas tipo cheeky presenta un diseño elegante con delicados detalles de encaje que se ajustan perfectamente a tu figura, brindando un acabado sofisticado. Su tejido suave y ligero asegura una experiencia de uso placentera durante todo el día. Ideal para cualquier ocasión, estas braguitas son una combinación perfecta de estilo y confort que te harán sentir segura y femenina. Disponibles en una variedad de colores para complementar tu guardarropa. Elegancia y frescura se unen en esta ",
                    characteristics: [
                        {
                            name: "producto",
                            value: "Women’s All Over Lace Cheeky Underwear",
                        },
                        {
                            name: "material",
                            value: "encaje",
                        },
                        {
                            name: "estilo",
                            value: "cheeky",
                        },
                        {
                            name: "color",
                            value: "varios colores disponibles",
                        },
                        {
                            name: "tamaños",
                            value: "XS a XL",
                        },
                        {
                            name: "ajuste",
                            value: "ajuste ceñido",
                        },
                        {
                            name: "cuidado",
                            value: "lavado a mano recomendado",
                        },
                        {
                            name: "transparente",
                            value: "sí, presenta detalles de encaje",
                        },
                        {
                            name: "ocultación",
                            value: "moderada",
                        },
                        {
                            name: "uso",
                            value: "ideal para ocasiones especiales",
                        },
                        {
                            name: "diseño",
                            value: "diseño elegante y femenino",
                        },
                        {
                            name: "elastano",
                            value: "puede contener elastano para mayor comodidad",
                        },
                        {
                            name: "nombre de la colección",
                            value: "colección de lencería",
                        },
                        {
                            name: "ambiente",
                            value: "cómodo y seductor",
                        },
                        {
                            name: "tipo de corte",
                            value: "corte bajo",
                        },
                        {
                            name: "parte trasera",
                            value: "diseño de encaje que muestra la piel",
                        },
                        {
                            name: "combinación",
                            value: "puede combinarse con sujetadores de encaje",
                        },
                        {
                            name: "occasiones",
                            value: "uso diario o citas",
                        },
                        {
                            name: "publico objetivo",
                            value: "mujeres",
                        },
                        {
                            name: "estilo de vida",
                            value: "moda femenina",
                        },
                        {
                            name: "temporada",
                            value: "todo el año",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/womens-all-over-lace-cheeky-underwea7ce86x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/womens-all-over-lace-cheeky-underwea7ce8cx500.webp",
                        },
                    ],
                    slug: "womens-all-over-lace-cheeky-underwea",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:38:53.516Z",
                    updatedAt: "2024-12-03T21:38:53.516Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [28],
                        },
                    ],
                    variants: [
                        {
                            id: 23,
                            sku: null,
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 20,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:38:53.599Z",
                            updatedAt: "2024-12-03T21:39:48.483Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 23,
                                        feature_id: 28,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 4,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 4,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 0,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 820,
                    discount: 0,
                    id: 21,
                    product_code: "PROD-000008",
                    name: "Women’s Cotton Bikini Underwear with Lace – Auden™",
                    url: null,
                    description:
                        "Descubre la comodidad y el estilo con las braguitas de bikini de algodón para mujer con encaje de Auden™. Diseñadas con una mezcla suave de algodón, estas braguitas ofrecen un ajuste perfecto y transpirabilidad para el uso diario. El delicado encaje añade un toque femenino y elegante, mientras que la elasticidad se adapta a tu figura sin perder la forma. Disponibles en una variedad de tonos, son ideales para combinar con tu ropa interior favorita y complementar tu estilo personal. Disfruta de la combinación de confort y diseño chic en cada uso.",
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Auden",
                        },
                        {
                            name: "Material",
                            value: "Algodón",
                        },
                        {
                            name: "Estilo",
                            value: "Bikini",
                        },
                        {
                            name: "Detalles",
                            value: "Encaje",
                        },
                        {
                            name: "Corte",
                            value: "Bajo",
                        },
                        {
                            name: "Comodidad",
                            value: "Suave y transpirable",
                        },
                        {
                            name: "Tallas disponibles",
                            value: "Variadas",
                        },
                        {
                            name: "Ajuste",
                            value: "Ceñido pero cómodo",
                        },
                        {
                            name: "Cuidado de lavado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "Ocasiones",
                            value: "Uso diario",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Diversos",
                        },
                        {
                            name: "Diseño",
                            value: "Femenino y elegante",
                        },
                        {
                            name: "Transpirabilidad",
                            value: "Alta",
                        },
                        {
                            name: "Durabilidad",
                            value: "Resistente al uso diario",
                        },
                        {
                            name: "Elástico",
                            value: "Cómodo e inclusivo",
                        },
                        {
                            name: "Sostenibilidad",
                            value: "Fabricado con materiales responsables",
                        },
                        {
                            name: "Cintura",
                            value: "Banda suave",
                        },
                        {
                            name: "Usabilidad",
                            value: "Perfecto para todas las edades",
                        },
                        {
                            name: "Características adicionales",
                            value: "Sin costuras visibles",
                        },
                        {
                            name: "Estilo de encaje",
                            value: "Diseño delicado y atractivo",
                        },
                        {
                            name: "Género",
                            value: "Femenino",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/womens-cotton-bikini-underwear-with-lace-auden7ds7px100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-3.vigilio-services.com/empresas/demo-3/images/products/womens-cotton-bikini-underwear-with-lace-auden7ds7rx500.webp",
                        },
                    ],
                    slug: "womens-cotton-bikini-underwear-with-lace-auden",
                    category_id: 7,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 3,
                    createdAt: "2024-12-03T21:39:40.626Z",
                    updatedAt: "2024-12-03T21:39:40.626Z",
                    category: {
                        name: "Balcony",
                        slug: "balcony",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [25],
                        },
                    ],
                    variants: [
                        {
                            id: 24,
                            sku: "0000004",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 21,
                            empresa_id: 3,
                            createdAt: "2024-12-03T21:39:40.699Z",
                            updatedAt: "2024-12-03T21:40:00.220Z",
                            features: [
                                {
                                    id: 25,
                                    value: "#00ffff",
                                    description: "Cian",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 24,
                                        feature_id: 25,
                                        empresa_id: 3,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 100,
                                length: 1,
                            },
                            {
                                rating: 4,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 3,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 2,
                                percentage: 0,
                                length: 0,
                            },
                            {
                                rating: 1,
                                percentage: 0,
                                length: 0,
                            },
                        ],
                        stars5: 1,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
            ],
            productsRestaurants: [],
            productsServicios: [],
        },
    ],
    brands: [],
};
