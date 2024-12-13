const a = {
    setting: {
        logo_width: 139,
        id: 1,
        web: null,
        host: {
            host: "vitaca.org",
            nameserver_one: "heather.ns.cloudflare.com",
            nameserver_two: "weston.ns.cloudflare.com",
            time: "2024-11-30T03:06:55.316Z",
            enabled: true,
        },
        bg_color: "#a07814",
        bg_color_header: "transparent",
        bg_color_aside: "transparent",
        bg_color_background: "#242424",
        bg_color_footer: "#1d1d1d",
        bg_color_secondary: "#dc2626",
        type_animation: "fade-up",
        background_auth: null,
        font_face: "Barlow",
        bg_color_paper: "#242424",
        bg_color_button: "#a8741a",
        isCoverImage: true,
        isScrolling: true,
        is_hidde_total_cart: false,
        isDark: false,
        isLogoImage: false,
        is_block_aside: false,
        is_subcategory: false,
        is_service_page: false,
        position_header: true,
        bg_color_responsive: "#242424",
        border_title_type: "normal",
        type_star: "star",
        background_position: "start",
        header_type: "normal",
        background_type: "first",
        type_icons: "normal",
        type_border: "circle",
        type_cart: "fas fa-shopping-bag",
        type_arrow: "third",
        type_map: "satelite",
        web_script:
            'const style = document.createElement("style")\r\nstyle.innerHTML =`\r\n.background-home \u003E div {\r\n   height:400px;\r\n}\r\n.background-home .background-home-container \u003E div{\r\n   height:400px;\r\n}\r\n@media screen and (min-width:800px ){\r\n   .background-home \u003E div {\r\n      height:550px;\r\n   }\r\n   .background-home .background-home-container \u003E div{\r\n      height:550px;\r\n   }\r\n\r\n}\r\n\r\n\r\n.background-home-container \u003E div {\r\n    gap: 2rem;\r\n}\r\n\r\n.background-home-container \u003E div \u003E div \u003E div  {\r\n   gap: 2rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E p {\r\n   color: #D3D3D3;\r\n}\r\n.background-home-container \u003E div  \u003E div \u003E div  \u003E a {\r\n   border: 2px solid var(--primary) !important;\r\n   background-color: transparent !important;\r\n   color: var(--primary)  !important;\r\n}\r\n.background-home-container \u003E div  \u003E div \u003E div  \u003E a:hover {\r\n   background-color: var(--primary) !important;\r\n   color: white !important;\r\n}\r\n\r\n\r\n\r\n.background-home-container \u003E div \u003E div \u003E div \u003E h2 {\r\n   position: relative;\r\n   font-size: 2rem;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E p {\r\n   font-size: 1rem;\r\n}\r\n\r\n.background-home-container \u003E div \u003E div \u003E div \u003E h2:after{\r\n   content:\'\';\r\n   width:30%;\r\n   height:2.5px;\r\n   left: 0px;\r\n   bottom: -10px;\r\n   position: absolute;\r\n   background-color: var(--primary);\r\n}\r\n.products-section \u003E a{\r\n   padding: 1.5rem;\r\n   background-color:#1E1E1E;\r\n}\r\n\r\n.categories-section{\r\n   display: none;\r\n}\r\n\r\n\r\n`;\r\ndocument.head.appendChild(style);\r\n\r\nconst  categoriesSection = document.querySelector(".categories-section")\r\nif(categoriesSection){\r\n   categoriesSection.remove()\r\n}\r\n\r\n// TIMER\r\nconst timer=document.querySelector(".container-banner-3 #timer");\r\nconst targetDate = new Date(`${timer.textContent}T00:00:00`).getTime();\r\nfunction updateTimer() {\r\n   const now = new Date().getTime();\r\n   const distance = targetDate - now;\r\n   const days = Math.floor(distance / (1000 * 60 * 60 * 24));\r\n   const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));\r\n   const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));\r\n   const seconds = Math.floor((distance % (1000 * 60)) / 1000);\r\n   document.querySelector(".container-banner-3 #days").textContent = days;\r\n   document.querySelector(".container-banner-3 #hours").textContent = hours;\r\n   document.querySelector(".container-banner-3 #minutes").textContent = minutes;\r\n   document.querySelector(".container-banner-3 #seconds").textContent = seconds;\r\n   if (distance \u003C 0) {\r\n      clearInterval(timerInterval);\r\n      document.getElementById("days").textContent = "EXPIRED";\r\n      document.getElementById("hours").textContent = "";\r\n      document.getElementById("minutes").textContent = "";\r\n      document.getElementById("seconds").textContent = "";\r\n   }\r\n}\r\n  const timerInterval = setInterval(updateTimer, 1000);\r\n  updateTimer();',
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
        type_icons_bars: "normal",
        is_hover_product: true,
        isProductWallpaper: false,
        hamburger: "fas fa-bars",
        shows: {
            map: true,
            about: true,
            cards: false,
            brands: true,
            android: true,
            offers_section: false,
            offers_user: true,
        },
        empresa_id: 1,
        createdAt: "2024-11-28T10:26:39.706Z",
        updatedAt: "2024-12-05T07:57:00.963Z",
    },
    gridBanners: [
        {
            id: 1,
            title: null,
            enabled: true,
            empresa_id: 1,
            createdAt: "2024-11-28T10:26:39.756Z",
            updatedAt: "2024-12-01T07:14:53.049Z",
            html: null,
        },
        {
            id: 2,
            title: null,
            enabled: true,
            empresa_id: 1,
            createdAt: "2024-11-28T10:26:39.756Z",
            html: null,
            updatedAt: "2024-11-29T10:31:16.323Z",
        },
        {
            id: 3,
            title: null,
            enabled: true,
            empresa_id: 1,
            createdAt: "2024-11-28T10:26:39.756Z",
            html: null,
            updatedAt: "2024-11-28T10:26:39.756Z",
        },
        {
            id: 4,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="flex flex-col justify-center items-center  absolute gap-3  top-0 left-0 m-3 container-banner-3  bottom-0 z-10"\u003E\r\n    \r\n    \u003Ch2 class="text-primary text-3xl md:text-4xl font-semibold" data-label="1"\u003EHungry Up !\u003C/h2\u003E\r\n    \u003Cdiv class="text-white text-3xl md:text-4xl font-semibold"  \u003E\r\n        \u003Cspan data-label="2"\u003EHot Deal ! Sale\u003C/span\u003E\r\n        \u003Cspan data-label="3" class="text-primary"\u003E20% Off\u003C/span\u003E\r\n    \u003C/div\u003E\r\n    \u003Cp  data-label="4"\u003EWe Believe That Good Design is Always in Season\u003C/p\u003E\r\n    \u003Cdiv class="grid grid-cols-4 gap-2"\u003E\r\n        \u003Cdiv class=" w-[60px] border flex justify-center items-center flex-col border-gray-600"\u003E\r\n            \u003Cspan class="border-b border-gray-600 w-full text-center py-2 text-primary font-semibold" id="days"\u003E29\u003C/span\u003E\r\n            \u003Cspan class="text-gray-600 text-xs py-2" \u003EDías\u003C/span\u003E\r\n        \u003C/div\u003E\u003Cdiv class=" w-[60px] border flex justify-center items-center flex-col border-gray-600"\u003E\r\n            \u003Cspan class="border-b border-gray-600 w-full text-center py-2  text-primary  font-semibold" id="hours"\u003E29\u003C/span\u003E\r\n            \u003Cspan class="text-gray-600 text-xs py-2"   \u003EHoras\u003C/span\u003E\r\n        \u003C/div\u003E\u003Cdiv class=" w-[60px] border flex justify-center items-center flex-col border-gray-600"\u003E\r\n            \u003Cspan class="border-b border-gray-600 w-full text-center py-2  text-primary  font-semibold" id="minutes"\u003E29\u003C/span\u003E\r\n            \u003Cspan class="text-gray-600 text-xs py-2"  \u003EMinutos\u003C/span\u003E\r\n        \u003C/div\u003E\u003Cdiv class=" w-[60px] border flex justify-center items-center flex-col border-gray-600"\u003E\r\n            \u003Cspan class="border-b border-gray-600 w-full text-center py-2  text-primary  font-semibold" id="seconds"\u003E29\u003C/span\u003E\r\n            \u003Cspan class="text-gray-600 text-xs py-2" \u003ESegundos\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n    \u003C!-- href puedes personalizar donde irá  link --\u003E\r\n    \u003Ca href="/" title="go" class="text-primary delay-custom-1 bg-transparent border-2 border-primary hover:bg-primary hover:text-black py-2 px-4" data-label="5"\u003EShopping Now\u003C/a\u003E\r\n    \u003Ch2 class="text-primary text-3xl md:text-4xl font-semibold hidden" data-label="0" id="timer"\u003E2024-12-25\u003C/h2\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    @media screen and (min-width : 600px){\r\n    .container-banner-3{\r\n        margin-left:4rem;\r\n    }\r\n\r\n    }\r\n\r\n\u003C/style\u003E\r\n',
            empresa_id: 1,
            createdAt: "2024-11-28T10:26:39.756Z",
            updatedAt: "2024-12-02T07:57:08.224Z",
        },
    ],
    files: [],
    gridBannersService: [],
    backgrounds: [
        {
            id: 2,
            title: "Barista Training",
            description:
                "You’ve leased the espresso machine,You’ve chosen your coffee",
            url: "https://www.demo-1.vigilio-services.com/",
            html: null,
            image: [
                {
                    dimension: 100,
                    file: "https://www.vitaca.org/empresas/demo-1/images/background/bac32885-1938-43e5-8a26-597203f5b8b254b2rx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.vitaca.org/empresas/demo-1/images/background/388792b6-937b-4d74-8eeb-9f1632460e8d54b30x1600.webp",
                },
            ],
            empresa_id: 1,
            createdAt: "2024-11-28T19:49:23.816Z",
            updatedAt: "2024-11-28T19:49:38.327Z",
        },
        {
            id: 1,
            title: "Jaquet-Droz Grande",
            description:
                "You’ve leased the espresso machine, You’ve your coffee",
            url: "https://www.demo-1.vigilio-services.com/",
            html: null,
            image: [
                {
                    file: "https://www.vitaca.org/empresas/demo-1/images/background/ad41e484-1ebe-45a9-9ae9-a2d00f0d5c17672s2x100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.vitaca.org/empresas/demo-1/images/background/3cab2aeb-ffb6-4320-9b95-7aa959f16fb9672s5x1600.webp",
                    dimension: 1600,
                },
            ],
            empresa_id: 1,
            createdAt: "2024-11-28T10:26:39.696Z",
            updatedAt: "2024-11-28T20:54:07.853Z",
        },
    ],
    categories: [
        {
            id: 1,
            category_code: "CAT-000001",
            name: "Audio",
            isService: false,
            icon: null,
            slug: "audio",
            empresa_id: 1,
            createdAt: "2024-11-28T10:35:44.590Z",
            updatedAt: "2024-11-28T10:35:44.590Z",
            subcategories: [],
            productsNormals: [
                {
                    price: 150,
                    discount: 5,
                    id: 2,
                    product_code: "PROD-000002",
                    name: "Hamilton Khaki King II Automatic Men’s Watch",
                    url: null,
                    description: null,
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Hamilton",
                        },
                        {
                            name: "Modelo",
                            value: "Khaki King II Automatic",
                        },
                        {
                            name: "Género",
                            value: "Hombres",
                        },
                        {
                            name: "Tipo de movimiento",
                            value: "Automático",
                        },
                        {
                            name: "Material de la caja",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Diámetro de la caja",
                            value: "40 mm",
                        },
                        {
                            name: "Grosor de la caja",
                            value: "11.5 mm",
                        },
                        {
                            name: "Color de la esfera",
                            value: "Negro",
                        },
                        {
                            name: "Manecillas",
                            value: "Luminosas",
                        },
                        {
                            name: "Cristal",
                            value: "Zafiro",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "50 metros",
                        },
                        {
                            name: "Correa",
                            value: "Piel",
                        },
                        {
                            name: "Cierre",
                            value: "Hebilla",
                        },
                        {
                            name: "Funciones",
                            value: "Fecha",
                        },
                        {
                            name: "Estilo",
                            value: "Deportivo/Clásico",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                        {
                            name: "Peso",
                            value: "aproximadamente 90 g",
                        },
                        {
                            name: "Características adicionales",
                            value: "Amortiguación de golpes",
                        },
                        {
                            name: "Origen",
                            value: "Suiza",
                        },
                        {
                            name: "Caja trasera",
                            value: "Sólida",
                        },
                        {
                            name: "Número de referencia",
                            value: "H70455533",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/hamilton-khaki-king-ii-automatic-mens-watch71rdhx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/hamilton-khaki-king-ii-automatic-mens-watch71rdmx500.webp",
                        },
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/hamilton-khaki-king-ii-automatic-mens-watch71rgjx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/hamilton-khaki-king-ii-automatic-mens-watch71rh5x500.webp",
                        },
                    ],
                    slug: "hamilton-khaki-king-ii-automatic-mens-watch",
                    category_id: 1,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 1,
                    createdAt: "2024-11-28T11:03:44.825Z",
                    updatedAt: "2024-11-28T11:03:44.825Z",
                    category: {
                        name: "Audio",
                        slug: "audio",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [19, 21],
                        },
                    ],
                    variants: [
                        {
                            id: 4,
                            sku: "SKU-002323",
                            stock: 3,
                            ilimit: false,
                            images: [2],
                            product_normal_id: 2,
                            empresa_id: 1,
                            createdAt: "2024-11-28T11:03:44.864Z",
                            updatedAt: "2024-11-28T11:04:13.249Z",
                            features: [
                                {
                                    id: 19,
                                    value: "#0000ff",
                                    description: "Azul",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 4,
                                        feature_id: 19,
                                        empresa_id: 1,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                        {
                            id: 5,
                            sku: "SKU-00034342",
                            stock: 0,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 2,
                            empresa_id: 1,
                            createdAt: "2024-11-28T11:03:44.865Z",
                            updatedAt: "2024-11-28T11:04:25.427Z",
                            features: [
                                {
                                    id: 21,
                                    value: "#ffa500",
                                    description: "Naranja",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 5,
                                        feature_id: 21,
                                        empresa_id: 1,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 2,
                        promedio: 4.5,
                        ratings: [
                            {
                                rating: 5,
                                percentage: 50,
                                length: 1,
                            },
                            {
                                rating: 4,
                                percentage: 50,
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
                        stars5: 1,
                        stars4: 0,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 13,
                    discount: 3,
                    id: 3,
                    product_code: "PROD-000003",
                    name: "Longines HydroConquest Automatic Blue Dial 41 mm Men’s Watch",
                    url: null,
                    description:
                        "El Longines HydroConquest Automatic Blue Dial es un reloj de buceo sofisticado diseñado para el hombre moderno. Con un diámetro de 41 mm, su caja de acero inoxidable garantiza durabilidad y resistencia al agua hasta 300 metros. La elegante esfera azul presenta marcadores luminosos y agujas contrastantes que aseguran una legibilidad óptima en cualquier condición. El bisel unidireccional permite medir el tiempo de inmersión de manera precisa, mientras que el movimiento automático suizo asegura un rendimiento fiable. Este reloj no solo es una herramienta funcional, sino también una declaración de",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Longines HydroConquest Automatic",
                        },
                        {
                            name: "Diámetro de la caja",
                            value: "41 mm",
                        },
                        {
                            name: "Género",
                            value: "Hombres",
                        },
                        {
                            name: "Material de la caja",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Color de la esfera",
                            value: "Azul",
                        },
                        {
                            name: "Tipo de movimiento",
                            value: "Automático",
                        },
                        {
                            name: "Cristal",
                            value: "Zafiro",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "300 metros",
                        },
                        {
                            name: "Bisel",
                            value: "Unidireccional",
                        },
                        {
                            name: "Correa",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Funciones",
                            value: "Fecha, cronógrafo",
                        },
                        {
                            name: "Estilo",
                            value: "Deportivo",
                        },
                        {
                            name: "Agujas",
                            value: "Luminosas",
                        },
                        {
                            name: "Fondo de la caja",
                            value: "Sólido",
                        },
                        {
                            name: "Tamaño de la correa",
                            value: "22 mm",
                        },
                        {
                            name: "Cierre",
                            value: "Desplegable",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                        {
                            name: "Peso",
                            value: "aproximadamente 200 g",
                        },
                        {
                            name: "Diseño",
                            value: "Contemporáneo y elegante",
                        },
                        {
                            name: "Número de referencia",
                            value: "L3.782.4.06.6",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/longines-hydroconquest-automatic-blue-dial-41-mm-mens-watcho4a7vx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/longines-hydroconquest-automatic-blue-dial-41-mm-mens-watcho4a87x500.webp",
                        },
                    ],
                    slug: "longines-hydroconquest-automatic-blue-dial-41-mm-mens-watch",
                    category_id: 1,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 1,
                    createdAt: "2024-11-29T10:40:39.875Z",
                    updatedAt: "2024-11-29T10:45:05.869Z",
                    category: {
                        name: "Audio",
                        slug: "audio",
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
                            id: 6,
                            sku: "000000232",
                            stock: 3,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 3,
                            empresa_id: 1,
                            createdAt: "2024-11-29T10:40:39.918Z",
                            updatedAt: "2024-11-29T10:41:23.596Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 6,
                                        feature_id: 1,
                                        empresa_id: 1,
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
                    price: 150,
                    discount: 0,
                    id: 5,
                    product_code: "PROD-000005",
                    name: "Tissot Le Locle Powermatic 80 Automatic Men’s Watch",
                    url: null,
                    description:
                        "El Tissot Le Locle Powermatic 80 es un reloj automático para hombres que combina elegancia y sofisticación. Con una caja de acero inoxidable de 39 mm, presenta un diseño clásico que se adapta a cualquier ocasión. Su esfera cuenta con índices y agujas luminosas, además de un calendario ubicado a las 6 en punto. Equipado con el movimiento Powermatic 80, ofrece una reserva de marcha de hasta 80 horas, lo que garantiza un rendimiento excepcional. Este modelo exhibe un vidrio de zafiro resistente a los arañazos y es sumergible hasta 30 metros, lo que lo convierte en una opción ideal para el uso dia",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Tissot Le Locle Powermatic 80",
                        },
                        {
                            name: "Género",
                            value: "Hombre",
                        },
                        {
                            name: "Movimiento",
                            value: "Automático",
                        },
                        {
                            name: "Calibre",
                            value: "Powermatic 80",
                        },
                        {
                            name: "Reserva de marcha",
                            value: "80 horas",
                        },
                        {
                            name: "Material de la caja",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Diámetro de la caja",
                            value: "39 mm",
                        },
                        {
                            name: "Espesor de la caja",
                            value: "9.75 mm",
                        },
                        {
                            name: "Esfera",
                            value: "Color plateado o negro",
                        },
                        {
                            name: "Cristal",
                            value: "Zafiro resistente a rayaduras",
                        },
                        {
                            name: "Fondo de la caja",
                            value: "Translúcido con cristal de zafiro",
                        },
                        {
                            name: "Correa",
                            value: "Cuero o acero inoxidable",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "30 metros",
                        },
                        {
                            name: "Funciones",
                            value: "Fecha y hora",
                        },
                        {
                            name: "Estilo",
                            value: "Clásico y elegante",
                        },
                        {
                            name: "Peso",
                            value: "Aproximadamente 85 gramos",
                        },
                        {
                            name: "Caja",
                            value: "Redonda",
                        },
                        {
                            name: "Color de la correa",
                            value: "Negro o plateado",
                        },
                        {
                            name: "Marcadores",
                            value: "Índices y números arábigos",
                        },
                        {
                            name: "Tratamiento de la superficie",
                            value: "Pulgado brillante",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/tissot-le-locle-powermatic-80-automatic-mens-watcho8al2x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/tissot-le-locle-powermatic-80-automatic-mens-watcho8al4x500.webp",
                        },
                    ],
                    slug: "tissot-le-locle-powermatic-80-automatic-mens-watch",
                    category_id: 1,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 1,
                    createdAt: "2024-11-29T10:42:51.322Z",
                    updatedAt: "2024-11-29T10:42:51.322Z",
                    category: {
                        name: "Audio",
                        slug: "audio",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [27],
                        },
                    ],
                    variants: [
                        {
                            id: 8,
                            sku: null,
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 5,
                            empresa_id: 1,
                            createdAt: "2024-11-29T10:42:51.359Z",
                            updatedAt: "2024-12-01T06:27:32.226Z",
                            features: [
                                {
                                    id: 27,
                                    value: "#008000",
                                    description: "Verde Oscuro",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 8,
                                        feature_id: 27,
                                        empresa_id: 1,
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
                    price: 2,
                    discount: 4,
                    id: 4,
                    product_code: "PROD-000004",
                    name: "Seiko 5 Sport Automatic Khaki Green Canvas Men’s Watch",
                    url: null,
                    description:
                        "Reloj Seiko 5 Sport Automático para Hombre en un elegante color verde caqui. Este reloj combina un diseño robusto y moderno con la tradición de la relojería japonesa. Cuenta con una correa de lona resistente que asegura comodidad y durabilidad en el uso diario. Su caja de acero inoxidable alberga un movimiento automático que proporciona precisión y fiabilidad. La esfera presenta marcadores luminosos y agujas de gran visibilidad, ideal para lecturas en condiciones de poca luz. Con resistencia al agua de hasta 100 metros, es perfecto para actividades al aire libre. Un accesorio esencial para los",
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Seiko",
                        },
                        {
                            name: "Modelo",
                            value: "5 Sport Automatic",
                        },
                        {
                            name: "Color de la esfera",
                            value: "Verde",
                        },
                        {
                            name: "Material de la correa",
                            value: "Lona",
                        },
                        {
                            name: "Género",
                            value: "Hombre",
                        },
                        {
                            name: "Tipo de movimiento",
                            value: "Automático",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "100 metros",
                        },
                        {
                            name: "Diámetro de la caja",
                            value: "42.5 mm",
                        },
                        {
                            name: "Material de la caja",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Cristal",
                            value: "Hardlex",
                        },
                        {
                            name: "Funciones",
                            value: "Fecha y hora",
                        },
                        {
                            name: "Estilo",
                            value: "Deportivo",
                        },
                        {
                            name: "Fondo de la caja",
                            value: "Cerrado",
                        },
                        {
                            name: "Movimiento",
                            value: "Calibre Seiko 4R36",
                        },
                        {
                            name: "Sistema de carga",
                            value: "Manual y automático",
                        },
                        {
                            name: "Marcadores de hora",
                            value: "Números arábigos",
                        },
                        {
                            name: "Tratamiento luminescente",
                            value: "Lumibrite",
                        },
                        {
                            name: "Tipo de cierre",
                            value: "Hebilla",
                        },
                        {
                            name: "Peso",
                            value: "aproximadamente 100 g",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/seiko-5-sport-automatic-khaki-green-canvas-mens-watcho6nujx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/seiko-5-sport-automatic-khaki-green-canvas-mens-watcho6nuox500.webp",
                        },
                    ],
                    slug: "seiko-5-sport-automatic-khaki-green-canvas-mens-watch",
                    category_id: 1,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 1,
                    createdAt: "2024-11-29T10:41:59.391Z",
                    updatedAt: "2024-11-30T05:16:42.034Z",
                    category: {
                        name: "Audio",
                        slug: "audio",
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
                            id: 7,
                            sku: "000000546",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 4,
                            empresa_id: 1,
                            createdAt: "2024-11-29T10:41:59.429Z",
                            updatedAt: "2024-12-01T06:29:36.083Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 7,
                                        feature_id: 28,
                                        empresa_id: 1,
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
                    price: 343,
                    discount: 0,
                    id: 8,
                    product_code: "PROD-000008",
                    name: "Seiko Automatic Black Dial Black Rubber Men’s Watch",
                    url: null,
                    description:
                        "Reloj Seiko automático con esfera negra y correa de caucho negra, diseñado para el hombre moderno que valora la elegancia y la funcionalidad. Su mecanismo automático garantiza precisión y fiabilidad, mientras que la esfera de fácil lectura cuenta con marcadores luminosos, lo que facilita la visualización en condiciones de poca luz. La correa de caucho ofrece comodidad y resistencia, ideal para actividades al aire libre o uso diario. Con un diseño robusto, este reloj es perfecto para quienes buscan un accesorio versátil que complemente cualquier atuendo.",
                    characteristics: [
                        {
                            name: "Marca",
                            value: "Seiko",
                        },
                        {
                            name: "Modelo",
                            value: "Automatic Black Dial",
                        },
                        {
                            name: "Tipo de movimiento",
                            value: "Automático",
                        },
                        {
                            name: "Color de la esfera",
                            value: "Negro",
                        },
                        {
                            name: "Material de la correa",
                            value: "Goma",
                        },
                        {
                            name: "Tamaño de la caja",
                            value: "42 mm",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "200 metros",
                        },
                        {
                            name: "Función de fecha",
                            value: "Sí",
                        },
                        {
                            name: "Tipo de cierre",
                            value: "Hebilla",
                        },
                        {
                            name: "Material de la caja",
                            value: "Acero inoxidable",
                        },
                        {
                            name: "Cristal",
                            value: "Hardlex",
                        },
                        {
                            name: "Estilo",
                            value: "Deportivo",
                        },
                        {
                            name: "Peso",
                            value: "100 gramos",
                        },
                        {
                            name: "Garantía",
                            value: "2 años",
                        },
                        {
                            name: "Número de referencia",
                            value: "SRPD55",
                        },
                        {
                            name: "Características especiales",
                            value: "Luminiscente",
                        },
                        {
                            name: "Género",
                            value: "Hombre",
                        },
                        {
                            name: "Escala de tiempo",
                            value: "Analógica",
                        },
                        {
                            name: "Elemento de diseño",
                            value: "Indices luminosos",
                        },
                        {
                            name: "Función adicional",
                            value: "Esfera giratoria",
                        },
                        {
                            name: "Clasificación de calidad",
                            value: "Seiko Caliber 4R35",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/seiko-automatic-black-dial-black-rubber-mens-watchegbhax100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.vitaca.org/empresas/demo-1/images/products/seiko-automatic-black-dial-black-rubber-mens-watchegbhjx500.webp",
                        },
                    ],
                    slug: "seiko-automatic-black-dial-black-rubber-mens-watch",
                    category_id: 1,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 1,
                    createdAt: "2024-12-01T06:28:40.818Z",
                    updatedAt: "2024-12-01T06:28:40.818Z",
                    category: {
                        name: "Audio",
                        slug: "audio",
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
                            id: 11,
                            sku: "00000045",
                            stock: 2,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 8,
                            empresa_id: 1,
                            createdAt: "2024-12-01T06:28:40.871Z",
                            updatedAt: "2024-12-01T06:29:00.119Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 11,
                                        feature_id: 28,
                                        empresa_id: 1,
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
            ],
            productsRestaurants: [],
            productsServicios: [],
        },
        {
            id: 2,
            category_code: "CAT-000002",
            name: "Interior",
            isService: false,
            icon: null,
            slug: "interior",
            empresa_id: 1,
            createdAt: "2024-11-28T10:36:04.281Z",
            updatedAt: "2024-11-28T10:36:04.281Z",
            subcategories: [],
            productsNormals: [],
            productsRestaurants: [],
            productsServicios: [],
        },
    ],
    brands: [],
};
