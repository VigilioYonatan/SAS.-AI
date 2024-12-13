export const a = {
    setting: {
        logo_width: 120,
        id: 5,
        web: null,
        host: {
            host: null,
            nameserver_one: null,
            nameserver_two: null,
            time: null,
            enabled: false,
        },
        bg_color: "#e50001",
        bg_color_header: "#000000",
        bg_color_aside: "#000000",
        bg_color_background: "#FFFFFF",
        bg_color_footer: "#ffffff",
        bg_color_secondary: "#e50001",
        type_animation: "fade-up",
        background_auth: null,
        font_face: "Barlow",
        bg_color_paper: "#ffffff",
        bg_color_button: "#e50001",
        isCoverImage: false,
        isScrolling: false,
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
        background_position: "start",
        header_type: "transparent",
        background_type: "first",
        type_icons: "normal",
        type_border: "circle",
        type_cart: "fas fa-shopping-cart",
        type_arrow: "third",
        type_map: "satelite",
        web_script:
            'const style = document.createElement("style")\r\n\r\nstyle.innerHTML = `\r\n.background-home .slick-slide \u003E div{\r\n    padding: 0px 0px !important;\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div{\r\n    gap:4rem;\r\n}\r\n\r\n.background-home-container \u003E div \u003E div \u003E div \u003E h2,.background-home-container \u003E div \u003E div \u003E div \u003E p{\r\n    color: white !important;\r\n     font-size: 3rem !important;\r\n    line-height: 0rem;\r\n    text-transform: uppercase;\r\n    width:100% !important;\r\n    font-family: Font-Bold, sans  !important;\r\n\r\n}\r\n.offer-section \u003E div \u003E div{\r\n    display: grid !important;\r\n    grid-template-columns: repeat(1, minmax(0, 1fr));\r\n}\r\n@media screen and (min-width: 800px){\r\n   .offer-section{\r\n        position: relative;\r\n        top: -8rem;\r\n      \r\n\r\n    }\r\n    .offer-section \u003E div \u003E div{\r\n          grid-template-columns: repeat(3, minmax(0, 1fr));\r\n    }\r\n    .products-section{\r\n        position: relative;\r\n        top: -3rem;\r\n    }\r\n}\r\n.background-home-container \u003E div \u003E div \u003E div \u003E a{\r\n    display: none;\r\n}\r\n/* botón login */\r\nheader [href=\'/auth/login\']{  \r\n position: relative;\r\n     position: relative;\r\n    display: inline-block;\r\n    padding: 0.8rem 1.3rem;\r\n    background-color: white; /* Fondo del botón */\r\n    color: black; /* Color del texto */\r\n    text-decoration: none;\r\n    text-tranform: uppercase;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    border: none;\r\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra para efecto 3D */\r\n    clip-path: polygon(\r\n        0% 0%,       /* Esquina superior izquierda (normal) */\r\n        90% 0%,      /* Lado superior */\r\n        100% 15%,    /* Esquina superior derecha (recortada) */\r\n        100% 100%,   /* Lado derecho */\r\n        15% 100%,    /* Esquina inferior derecha (normal) */\r\n        0% 85%       /* Esquina inferior izquierda (recortada) */\r\n    );\r\n}\r\n.categories-section{\r\n    display:none;\r\n}\r\n\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div \u003E div {\r\n    display: none;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div  {\r\n    position: relative;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div:nth-child(2)  {\r\n    transform: translateY(6rem);\r\n    transition: transform 0.5s ease;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div:hover \u003E div:nth-child(2) {\r\n     transform: translateY(0rem);\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div:nth-child(2)  {\r\n    position: absolute;\r\n    bottom:0;\r\n    right:0;\r\n    left:0;\r\n    background-color: #F2F1F0;\r\n    padding: 1rem;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div \u003E img {\r\n    height:400px;\r\n    width: 100%;\r\n    border-radius: 0rem;\r\n    object-fit: cover;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div \u003E h3 {\r\n    font-size: 2rem;\r\n    line-height: 2rem;\r\n    color: black;\r\n}\r\n.users-section .users-section-slide .slick-track \u003E div \u003E div \u003E div \u003E div \u003E div  {\r\n    display: none  !important;\r\n}\r\n.servicios-section {\r\n    display: none;\r\n}\r\n\r\n\r\n\r\n.offer-section \u003E div:nth-child(2) \u003E div:nth-child(1){\r\n     display: none !important;\r\n}\r\n\r\n.products-section {\r\n    padding-top: 0rem !important;\r\n}\r\n.products-section \u003E a{\r\n    background-color: #FBFBFB;\r\n}\r\n.post-section h2{\r\n    color:white;\r\n\r\n}\r\n.post-section::after{\r\n    content:"";\r\n    position: absolute;\r\n    width:100%;\r\n    left:0;\r\n    right:0;\r\n    height:300px;\r\n    background-color: black;\r\n    z-index:-1;\r\n}\r\n\r\n.categories-products-section::after{\r\n    content:"";\r\n    position: absolute;\r\n    width:100%;\r\n    left:0;\r\n    right:0;\r\n    height:300px;\r\n    background-color: black;\r\n    z-index:-1;\r\n}\r\n.categories-products-section h2{\r\n    color: white;\r\n}\r\n\r\n`\r\n\r\ndocument.head.appendChild(style);\r\n\r\n\r\n\r\n// change login\r\n\r\nconst headerLogin = document.querySelector("header [href=\'/auth/login\']")\r\nif(headerLogin){\r\n    headerLogin.className="flex gap-1 items-center justify-center uppercase text-xs font-bold";\r\n    const buttonLink = `\u003Cspan\u003EIniciar Sesión\u003C/span\u003E`\r\n    headerLogin.innerHTML = buttonLink;\r\n}\r\n\r\n// footer\r\nconst footer = document.getElementById("footer")\r\nif(footer){\r\n    \r\n    const empresa = JSON.parse(localStorage.getItem("empresa")||"null")\r\n    const direccion = empresa.address.direccion;\r\n    const li4 = footer.querySelector("ul:nth-child(5)")\r\n    const li42=li4.querySelector("li:nth-child(2)")\r\n    const li43=li4.querySelector("li:nth-child(3)")\r\n    const li1Content = `\r\n                    \u003Cli class="flex flex-col gap-4 uppercase h-full"\u003E\r\n                        \u003Cspan class="font-bold text-2xl"\u003E${empresa.name_empresa}\u003C/span\u003E\r\n                        \u003Cdiv class="flex gap-2 items-center  text-sm"\u003E ${li42.innerHTML}\u003C/div\u003E\r\n                        ${li43.innerHTML}\r\n                    \u003C/li\u003E\r\n                `;\r\n    const li1 = footer.querySelector("ul:nth-child(1)")\r\n    const li2 = footer.querySelector("ul:nth-child(2)")\r\n    li2.innerHTML = li1.innerHTML;\r\n    li1.innerHTML = li1Content;\r\n    const li3 = footer.querySelector("ul:nth-child(3)")\r\n    li3.remove();\r\n    console.log(li4);\r\n    li4.innerHTML = `\r\n        \u003Cdiv class="flex flex-col gap-2 items-center justify-center"\u003E\r\n            \u003Ch3 class="uppercase inline-block dark:text-white  font-bold my-4  title-container-2"\u003EMINI GALLERY\u003C/h3\u003E\r\n            \u003Cdiv class="grid grid-cols-3 gap-2"\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-1.webp" /\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-2.webp" /\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-3.webp" /\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-4.webp" /\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-5.webp" /\u003E\r\n                \u003Cimg width="100" height="100" alt="gym-thump" title="gym-thump" src="/empresas/${empresa.slug}/images/files/gym-thump-6.webp" /\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n    `\r\n    \r\n\r\n    \r\n\r\n}',
        sc: null,
        header_position: {
            logo: 1,
            navbar: 2,
            icons: 3,
        },
        header: {
            home: true,
            shop: true,
            profile: false,
            about: true,
            pedidos: false,
            condiciones: true,
            categories: true,
            subcategories: true,
            services: true,
        },
        type_card: "normal",
        type_product_buttons: "first",
        type_icons_bars: "normal",
        is_hover_product: true,
        isProductWallpaper: false,
        hamburger: "fas fa-bars",
        shows: {
            map: false,
            about: true,
            cards: false,
            brands: true,
            android: true,
            offers_section: true,
            offers_user: true,
            categories_slider: false,
        },
        empresa_id: 5,
        createdAt: "2024-12-05T21:26:08.619Z",
        updatedAt: "2024-12-10T14:27:30.895Z",
    },
    gridBanners: [
        {
            id: 20,
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.740Z",
            updatedAt: "2024-12-06T10:14:29.257Z",
            html: '\u003Cdiv x-data="{\r\n    slug: JSON.parse(localStorage.getItem(\'empresa\')).slug\r\n}" class="flex flex-col" style=""\u003E\r\n    \u003C!-- Grid de imágenes con contenido --\u003E\r\n    \u003Cdiv class="grid-container  gap-4 max-w-6xl mx-auto" style=""\u003E\r\n        \u003Cdiv class="flex gap-4"\u003E\r\n            \u003Cimg \r\n                width="100" height="100" \r\n                class="rounded-full w-[100px] h-[100px] " style="min-width:100px" \r\n                alt="gym" \r\n                title="gym" \r\n               :src="`/empresas/${slug}/images/files/gym-1.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="flex flex-col gap-2"\u003E\r\n                \u003Ch3 class="font-bold uppercase text-white" data-label="01"\u003EBUTTERFLY\u003C/h3\u003E\r\n                \u003Cp class="font-semibold text-gray-400  line-clamp-2" style="font-size: 0.8rem;"  data-label="02"\u003E\r\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n                \u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex gap-4"\u003E\r\n            \u003Cimg \r\n                width="100" height="100" \r\n                class="rounded-full w-[100px] h-[100px] " style="min-width:100px" \r\n                alt="gym" \r\n                title="gym" \r\n                :src="`/empresas/${slug}/images/files/gym-2.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="flex flex-col gap-2"\u003E\r\n                \u003Ch3 class="font-bold uppercase text-white" data-label="11"\u003ELIFTING\u003C/h3\u003E\r\n                \u003Cp class="font-semibold text-gray-400 line-clamp-2" style="font-size: 0.8rem;" data-label="12"\u003E\r\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n                \u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex gap-4"\u003E\r\n            \u003Cimg \r\n                width="100" height="100" \r\n                class="rounded-full w-[100px] h-[100px] " style="min-width:100px" \r\n                alt="gym" \r\n                title="gym" \r\n                :src="`/empresas/${slug}/images/files/gym-3.webp`"\r\n            /\u003E\r\n             \r\n            \u003Cdiv class="flex flex-col gap-2"\u003E\r\n                \u003Ch3 class="font-bold uppercase text-white" data-label="21"\u003EBURNING\u003C/h3\u003E\r\n                \u003Cp class="font-semibold text-gray-400  line-clamp-2" style="font-size: 0.8rem;" data-label="22"\u003E\r\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\r\n                \u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003C!-- Cuarto bloque con imagen grande --\u003E\r\n        \u003Cdiv class="relative" style="height: 200px;"\u003E\r\n            \u003Cimg \r\n                alt="gym"\r\n                class="object-cover h-full"\r\n                title="gym"\r\n                width="300" height="300" \r\n                :src="`/empresas/${slug}/images/files/gym-4.webp`"\r\n            /\u003E\r\n            \u003Cb data-label="youtube" class="hidden" x-ref="youtube"\u003EXHOmBV4js_E\u003C/b\u003E\r\n            \u003Cbutton x-on:click="()=\u003E{\r\n                    sweetModal({\r\n                        html:`\u003Ciframe class=\'w-full\' width=\'876\' height=\'360\' src=\'https://www.youtube.com/embed/${$refs.youtube.textContent}\' title=\'Video Placeholder\' frameborder=\'0\' allow=\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\' referrerpolicy=\'strict-origin-when-cross-origin\' allowfullscreen\u003E\u003C/iframe\u003E`,\r\n                        showCloseButton:true,\r\n                        sweetWidth:\'700px\',\r\n                        isCloseInBackground:false\r\n                        })\r\n                }" type="button" aria-label="opn" class="absolute" style="top: 50%; right: 40%;z-index:10;" type="button" aria-label="on"\u003E\r\n                \u003Cimg width="80" style="width: 40px; height: 40px" height="80" src="https://ibeydesign.com/zeus/wp-content/uploads/2021/05/play-button-white.png"/\u003E\r\n            \u003C/button\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\r\n    \u003C!-- Espaciador negro --\u003E\r\n    \u003Cdiv class="w-full bg-black separate" style="z-index:-1;height:100px;"\u003E\u003C/div\u003E\r\n\r\n    \u003C!-- Slider --\u003E\r\n    \u003Cdiv \r\n        x-data="{}" \r\n        x-init="() =\u003E { \r\n            var slider = tns({\r\n                container: \'.my-slider\',\r\n                items: 4.5,\r\n                slideBy: \'page\',\r\n                autoplay: true,\r\n                controls: true,\r\n                nav: false,\r\n                loop: true,\r\n                responsive: {\r\n                    350: { items: 2  },\r\n                    500: { items: 3 },\r\n                    800: { items: 4.5 }\r\n                }\r\n            });\r\n\r\n            document.querySelector(\'.grid-banner-0 [data-controls=\\\'prev\\\']\').innerHTML = \r\n                \'\u003Ci class=\\\'fas fa-chevron-left\\\'\u003E\u003C/i\u003E\';\r\n            document.querySelector(\'.grid-banner-0 [data-controls=\\\'next\\\']\').innerHTML = \r\n                \'\u003Ci class=\\\'fas fa-chevron-right\\\'\u003E\u003C/i\u003E\';\r\n        }" \r\n        class="my-slider" \r\n        style="height:600px;"\r\n    \u003E\r\n        \u003C!-- Imágenes del slider --\u003E\r\n        \u003Cdiv class="relative h-full"\u003E\r\n            \u003Cimg \r\n                width="500" height="500" style="min-width:100px" \r\n                class="absolute inset-0 w-full h-full object-cover" \r\n                 :src="`/empresas/${slug}/images/files/gym-slider-1.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="absolute bottom-0" style="margin: 2rem;"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase" data-label="21"\u003EFor Man\u003C/span\u003E\r\n                \u003Cp class="text-gray-400 text-sm" data-label="22"\u003ELorem ipsum dolor sit amet, dolor sit amet\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="relative h-full"\u003E\r\n            \u003Cimg \r\n                width="500" height="500" style="min-width:100px" \r\n                alt="gym slide"\r\n                title="gym slide"\r\n                class="absolute inset-0 w-full h-full object-cover" \r\n                :src="`/empresas/${slug}/images/files/gym-slider-2.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="absolute bottom-0" style="margin: 2rem;"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase" data-label="23"\u003EFor Man\u003C/span\u003E\r\n                \u003Cp class="text-gray-400 text-sm" data-label="24"\u003ELorem ipsum dolor sit amet, dolor sit amet\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="relative h-full"\u003E\r\n            \u003Cimg \r\n                width="500" height="500" style="min-width:100px"   alt="gym slide" title="gym slide"\r\n                class="absolute inset-0 w-full h-full object-cover" \r\n                :src="`/empresas/${slug}/images/files/gym-slider-3.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="absolute bottom-0" style="margin: 2rem;"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase" data-label="26"\u003EFor Man\u003C/span\u003E\r\n                \u003Cp class="text-gray-400 text-sm" data-label="27"\u003ELorem ipsum dolor sit amet, dolor sit amet\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="relative h-full"\u003E\r\n            \u003Cimg \r\n                width="500" height="500" style="min-width:100px" \r\n                class="absolute inset-0 w-full h-full object-cover" alt="gym slide" title="gym slide" \r\n                :src="`/empresas/${slug}/images/files/gym-slider-4.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="absolute bottom-0" style="margin: 2rem;"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase"data-label="28"\u003EFor Man\u003C/span\u003E\r\n                \u003Cp class="text-gray-400 text-sm" data-label="29"\u003ELorem ipsum dolor sit amet, dolor sit amet\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="relative h-full"\u003E\r\n            \u003Cimg \r\n                width="500" height="500" style="min-width:100px"  alt="gym slide" title="gym slide"\r\n                class="absolute inset-0 w-full h-full object-cover" \r\n                :src="`/empresas/${slug}/images/files/gym-slider-5.webp`"\r\n            /\u003E\r\n            \u003Cdiv class="absolute bottom-0" style="margin: 2rem;"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase" data-label="30"\u003EFor Man\u003C/span\u003E\r\n                \u003Cp class="text-gray-400 text-sm" data-label="31"\u003ELorem ipsum dolor sit amet, dolor sit amet\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    home-page .grid-banner-0 {\r\n        max-width: none !important;\r\n    }\r\n\r\n    .grid-banner-0 .my-slider {\r\n        height: 300px;\r\n        margin: 0 auto;\r\n    }\r\n\r\n    .grid-banner-0 .tns-controls {\r\n        position: absolute;\r\n        top: 60%;\r\n        width: 100%;\r\n        display: flex;\r\n        justify-content: space-between;\r\n        transform: translateY(-50%);\r\n        z-index: 1;\r\n    }\r\n\r\n    .grid-banner-0 .tns-outer [data-action="stop"],\r\n    .grid-banner-0 .tns-outer [data-action="start"] {\r\n        display: none;\r\n    }\r\n\r\n    .grid-banner-0 .tns-controls button {\r\n        background-color: #ddd;\r\n        width: 30px;\r\n        height: 30px;\r\n        border-radius: 1rem;\r\n        margin: 0px 0.5rem;\r\n    }\r\n\r\n    .grid-banner-0 .tns-controls .tns-prev i,\r\n    .grid-banner-0 .tns-controls .tns-next i {\r\n        font-size: 12px;\r\n        color: black;\r\n    }\r\n\r\n    @media screen and (max-width:800px){\r\n        .grid-banner-0 .separate{\r\n            display: none;\r\n        }\r\n        .grid-banner-0 .my-slider{\r\n            height:400px !important;\r\n        }\r\n    }\r\n     .grid-banner-0 .tns-outer{\r\n        position: relative;\r\n    }   \r\n     .grid-banner-0 .tns-outer .tns-controls{\r\n        top: 50%;\r\n    }   \r\n     .grid-banner-0 .grid-container{\r\n        display: grid;\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n        gap:0rem;\r\n        align-items: start;\r\n    }   \r\n     .grid-banner-0 .grid-container \u003E div{\r\n        flex-direction: column;\r\n        align-items: center;\r\n        justify-content: center;\r\n        padding: 1rem;\r\n        \r\n    }   \r\n     .grid-banner-0 .grid-container \u003E div \u003E div{\r\n      gap: 0rem !important;\r\n    }   \r\n     .grid-banner-0 .grid-container div h3{\r\n        color: var(--primary);\r\n        text-align: center;\r\n    }   \r\n     .grid-banner-0 .grid-container div p{\r\n        text-align: center;\r\n    }   \r\n     .grid-banner-0 .grid-container div img{\r\n        height: 100%;\r\n        object-fit: cover;\r\n    }   \r\n     .grid-banner-0 .grid-container div:nth-child(4) {\r\n        height: 100%;\r\n    }   \r\n     .grid-banner-0 .grid-container div:nth-child(4) \u003E div  img{\r\n        height: 100%;\r\n        object-fit: cover;\r\n    }   \r\n    @media screen and (min-width:800px){\r\n        .grid-banner-0 .grid-container div {\r\n            width: 300px;\r\n        }   \r\n        \r\n        home-page .grid-banner-0 {\r\n            max-width: none !important;\r\n            top: -12rem;\r\n        }\r\n         /* editor */\r\n        .grid-banner-0 .form-html-editor .grid-container{\r\n            display: grid;\r\n            grid-template-columns: repeat(2, minmax(0, 1fr)) ;\r\n            height: 150px;\r\n        }   \r\n        .grid-banner-0 .grid-container{\r\n            display: grid;\r\n            grid-template-columns: repeat(4, minmax(0, 1fr));\r\n            height: 150px;\r\n        }   \r\n       \r\n        .grid-banner-0 .grid-container \u003E div{\r\n            flex-direction: row;\r\n        } \r\n        .grid-banner-0 .grid-container div h3{\r\n            color: white;\r\n            text-align: center;\r\n        }   \r\n    }\r\n   \r\n\u003C/style\u003E',
        },
        {
            id: 21,
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.740Z",
            updatedAt: "2024-12-05T21:26:08.740Z",
            banners: [],
            html: null,
        },
        {
            id: 22,

            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.740Z",
            updatedAt: "2024-12-05T21:26:08.740Z",
            banners: [],
        },
        {
            id: 23,

            title: "Nuestros Partners",
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.740Z",
            updatedAt: "2024-12-06T22:33:37.545Z",
            html: '\u003Cdiv class="partner" x-data="{\r\n    slug: JSON.parse(localStorage.getItem(\'empresa\')).slug\r\n}"\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-1.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-2.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-3.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-4.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-5.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-6.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-7.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-8.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-9.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-10.webp`"/\u003E\r\n        \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    .grid-banner-3{\r\n        padding: 0rem 2rem;\r\n    }\r\n    .grid-banner-3 .partner{\r\n        display: grid;\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n        gap: 1rem;\r\n    }\r\n    @media screen and (min-width: 800px){\r\n        .grid-banner-3 .partner{\r\n            grid-template-columns: repeat(5, minmax(0, 1fr));\r\n            gap: 2rem;\r\n        }\r\n    }\r\n    .grid-banner-3 .partner img{\r\n            filter: brightness(0%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);\r\n    }\r\n\u003C/script\u003E',
        },
        {
            id: 24,
            responsive: [
                {
                    width: 0,
                    cols: 1,
                    rows: 1,
                    height: 0,
                    gap: 1,
                },
                {
                    width: 300,
                    cols: 1,
                    rows: 1,
                    height: 0,
                    gap: 1,
                },
                {
                    width: 600,
                    cols: 1,
                    rows: 1,
                    height: 0,
                    gap: 1,
                },
                {
                    width: 800,
                    cols: 1,
                    rows: 1,
                    height: 0,
                    gap: 1,
                },
                {
                    width: 1200,
                    cols: 1,
                    rows: 1,
                    height: 0,
                    gap: 1,
                },
            ],
            title: "Membresías",
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.740Z",
            updatedAt: "2024-12-06T22:07:54.846Z",
            banners: [
                {
                    id: 32,
                    title: null,
                    order: 0,
                    row: 1,
                    col: 1,
                    link: null,
                    button: null,
                    subtitle: null,
                    script: '\u003Cdiv x-data="{\r\n   header: JSON.parse(((document.querySelector(\'home-page\') || document.querySelector(\'servicios-page\'))?.getAttribute(\':header\')) || \'{}\'),\r\n   subtotalIgv(product, showWithDiscount = true, moreDiscount = null) {\r\n        const empresaStore = JSON.parse(localStorage.getItem(\'empresa\'));\r\n        const prod = JSON.parse(JSON.stringify(product));\r\n        let price = prod.price;\r\n\r\n        function formatMoney(value, forceLocal = false) {\r\n            const moneyStore = JSON.parse(localStorage.getItem(\'money\'));\r\n            function subtotalDolar(value) {\r\n                const converter = moneyStore.moneyValue[moneyStore.money];\r\n                return value * converter;\r\n            }\r\n\r\n            function formatDolares(number) {\r\n                return number.toLocaleString(\'en-US\', {\r\n                    style: \'currency\',\r\n                    currency: \'USD\',\r\n                });\r\n            }\r\n\r\n            return moneyStore.money === \'LOCAL\' || forceLocal\r\n                ? `${empresaStore.isDolar ? `${empresaStore.money.simbolo} ` : \'\'}${\r\n                    value.toLocaleString(empresaStore.money.international_simbolo, {\r\n                        style: \'currency\',\r\n                        currency: empresaStore.money.simbolo,\r\n                    })\r\n                }`\r\n                : formatDolares(subtotalDolar(value));\r\n        }\r\n\r\n        function subtotal(price, discount, increase = false) {\r\n            if (increase) {\r\n                return price + (discount * price) / 100;\r\n            }\r\n            return price - (discount * price) / 100;\r\n        }\r\n\r\n        if (showWithDiscount) {\r\n            price = subtotal(price, prod.discount ?? 0);\r\n        }\r\n        if (moreDiscount) {\r\n            price = subtotal(price, moreDiscount);\r\n        }\r\n\r\n        return formatMoney(\r\n            empresaStore.enabled_igv\r\n                ? subtotal(price, empresaStore.igv, true)\r\n                : price\r\n        );\r\n    }\r\n}" class="grid grid-cols-1 md:grid-cols-3 shadow " style="gap: 2rem; min-height: 300px;"\u003E\r\n    \u003Ctemplate x-if="header.categoriesServices"\u003E\r\n       \u003Ctemplate  x-for="servicio of (header.categoriesServices)[0].products"\u003E\r\n            \u003Cdiv class="flex flex-col gap-2 card"\u003E\r\n                \u003Cspan class="text-black text-2xl font-bold text-center block uppercase" x-text="`${subtotalIgv(servicio)}/${servicio.days[0].name}`"\u003E\u003C/span\u003E\r\n                \u003Ch3 class="bg-black py-3 px-4 text-center text-white font-bold text-xl" x-text="servicio.name"\u003E\u003C/h3\u003E\r\n                \u003Cul class="flex flex-col justify-center items-center w-full  px-6 py-4"\u003E\r\n                    \u003Ctemplate x-for="char of servicio.characteristics"\u003E\r\n                        \u003Cli class="py-3 border-b border-gray-400 w-full text-center font-semibold" x-text="char.value||\'\'"\u003E\u003C/li\u003E\r\n                    \u003C/template\u003E\r\n                \u003C/ul\u003E\r\n                \u003Ca :href="`/servicio/${servicio.slug}`"  class="uppercase font-bold" data-label="0"\u003EMás información\u003C/span\u003E\r\n            \u003C/div\u003E\r\n        \u003C/template\u003E     \r\n    \u003C/template\u003E\r\n    \r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n\r\n    .grid-banner-4 .card{\r\n        background-color:#FBFBFB; \r\n        padding: 2rem 1rem;\r\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra para efecto 3D */\r\n        clip-path: polygon(\r\n            0% 0%,       \r\n            90% 0%,      \r\n            100% 15%,    \r\n            100% 100%,   \r\n            15% 100%,    \r\n            0% 85%       \r\n        );\r\n    }\r\n    @media screen and(min-width:800px){   padding: 4rem 2rem;}\r\n    .grid-banner-4 .banners-4 a {\r\n        position: relative;\r\n        position: relative;\r\n        display: inline-block;\r\n        padding: 0.8rem 2rem;\r\n        background-color: black; /* Fondo del botón */\r\n        color: white; /* Color del texto */\r\n        text-decoration: none;\r\n        text-tranform: uppercase;\r\n        font-weight: bold;\r\n        text-align: center;\r\n        border: none;\r\n        align-self: center;\r\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra para efecto 3D */\r\n        clip-path: polygon(\r\n            0% 0%,       \r\n            90% 0%,      \r\n            100% 15%,    \r\n            100% 100%,   \r\n            15% 100%,    \r\n            0% 85%       \r\n        );\r\n        transition: all 0.5s ease;\r\n    }\r\n    .grid-banner-4 .banners-4 a:hover {\r\n        background-color:#EAEAEA; \r\n        color:black;\r\n    }\r\n\r\n\u003C/style\u003E',
                    enabled: true,
                    file: null,
                    date: null,
                    grid_banner_id: 24,
                    grid_banner_service_id: null,
                    empresa_id: 5,
                    createdAt: "2024-12-06T19:46:11.455Z",
                    updatedAt: "2024-12-10T14:32:31.603Z",
                },
            ],
        },
    ],
    files: [
        {
            id: 8,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-1.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:39:59.893Z",
            updatedAt: "2024-12-07T09:39:57.243Z",
        },
        {
            id: 9,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-2.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:40:21.195Z",
            updatedAt: "2024-12-07T09:41:37.637Z",
        },
        {
            id: 10,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-3.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:40:41.513Z",
            updatedAt: "2024-12-07T09:41:48.092Z",
        },
        {
            id: 11,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-4.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:40:53.644Z",
            updatedAt: "2024-12-07T09:41:56.786Z",
        },
        {
            id: 12,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-5.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:41:28.220Z",
            updatedAt: "2024-12-07T09:42:04.708Z",
        },
        {
            id: 13,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-6.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:42:05.663Z",
            updatedAt: "2024-12-07T09:42:11.666Z",
        },
        {
            id: 14,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-7.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:43:03.911Z",
            updatedAt: "2024-12-07T09:42:32.209Z",
        },
        {
            id: 15,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-8.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:45:43.607Z",
            updatedAt: "2024-12-07T09:42:39.267Z",
        },
        {
            id: 16,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-9.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:47:34.027Z",
            updatedAt: "2024-12-07T09:42:46.223Z",
        },
        {
            id: 17,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/partner-10.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-06T22:48:08.794Z",
            updatedAt: "2024-12-07T09:42:54.545Z",
        },
        {
            id: 19,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-1.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:09:27.507Z",
            updatedAt: "2024-12-07T16:09:27.507Z",
        },
        {
            id: 20,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-2.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:09:57.127Z",
            updatedAt: "2024-12-07T16:09:57.127Z",
        },
        {
            id: 21,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-3.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:10:15.997Z",
            updatedAt: "2024-12-07T16:10:15.997Z",
        },
        {
            id: 22,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-4.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:10:50.337Z",
            updatedAt: "2024-12-07T16:10:50.337Z",
        },
        {
            id: 23,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-1.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:11:30.685Z",
            updatedAt: "2024-12-07T16:11:30.685Z",
        },
        {
            id: 24,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-2.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:11:47.937Z",
            updatedAt: "2024-12-07T16:11:47.937Z",
        },
        {
            id: 25,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-3.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:12:26.584Z",
            updatedAt: "2024-12-07T16:12:26.584Z",
        },
        {
            id: 26,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-4.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:12:52.242Z",
            updatedAt: "2024-12-07T16:12:52.242Z",
        },
        {
            id: 27,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-5.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:13:23.868Z",
            updatedAt: "2024-12-07T16:13:23.868Z",
        },
        {
            id: 28,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-slider-6.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:13:56.045Z",
            updatedAt: "2024-12-07T16:13:56.045Z",
        },
        {
            id: 29,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-1.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:15:23.315Z",
            updatedAt: "2024-12-07T16:15:23.315Z",
        },
        {
            id: 30,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-2.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:25:44.980Z",
            updatedAt: "2024-12-07T16:25:44.980Z",
        },
        {
            id: 31,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-3.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:26:05.472Z",
            updatedAt: "2024-12-07T16:26:05.472Z",
        },
        {
            id: 32,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-5.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:28:32.294Z",
            updatedAt: "2024-12-07T16:28:32.294Z",
        },
        {
            id: 33,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-4.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:29:30.983Z",
            updatedAt: "2024-12-07T16:29:30.983Z",
        },
        {
            id: 34,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/gym-thump-6.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-07T16:29:56.379Z",
            updatedAt: "2024-12-07T16:29:56.379Z",
        },
        {
            id: 35,
            file: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/files/servicio-1.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-08T12:54:59.673Z",
            updatedAt: "2024-12-08T12:54:59.673Z",
        },
    ],
    gridBannersService: [
        {
            id: 16,
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.767Z",
            updatedAt: "2024-12-07T21:23:44.408Z",
            grid_banner_id: null,
            html: '\u003Cdiv class="parent"\u003E\r\n    \u003Cdiv class="grid grid-cols-2  max-w-6xl mx-auto px-2" \r\n        x-data="{ \r\n            scrollPosition: 50,  \r\n            updateScroll(direction) {\r\n                if (direction === \'up\' && this.scrollPosition \u003E 0) {\r\n                    this.scrollPosition = Math.max(this.scrollPosition - 10, 0); // Baja el valor al subir, pero no menos de 0\r\n                } else if (direction === \'down\' && this.scrollPosition \u003C 100) {\r\n                    this.scrollPosition = Math.min(this.scrollPosition + 10, 100); // Sube el valor al bajar, pero no más de 100\r\n                }\r\n            },\r\n            onScroll() {\r\n                const currentScroll = window.scrollY;\r\n                this.isGoingUp = currentScroll \u003C this.prevScrollPosition;\r\n                this.updateScroll(this.isGoingUp ? \'up\' : \'down\'); // Actualiza el valor según la dirección\r\n                this.prevScrollPosition = currentScroll; // Actualiza la posición previa\r\n            },\r\n            prevScrollPosition: 0, // Posición de scroll anterior\r\n            slug:JSON.parse(localStorage.getItem(\'empresa\')).slug\r\n        }"\r\n        x-init="\r\n            prevScrollPosition = window.scrollY;\r\n            window.addEventListener(\'scroll\', () =\u003E onScroll());"\r\n            \r\n            \u003E\r\n        \r\n        \u003C!-- Columna 1 --\u003E\r\n        \u003Cdiv class="flex flex-col gap-2" style="align-items: flex-start;"\u003E\r\n            \u003Cspan class="text-xl my-6 md:text-2xl uppercase pb-2 title-parent-1 relative   font-bold  dark:text-white flex inline flex-col  text-white " data-label="title"\u003ENuestros Objetivos\u003C/span\u003E\r\n            \u003Cp class="text-white  font-semibold"  data-label="description"\u003ELorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\u003C/p\u003E\r\n            \u003Cimg width="500" height="500" alt="gym" title="gym"  style="margin-top: 2rem;" :src="`/empresas/${slug}/images/files/gym-2.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \r\n        \u003C!-- Columna 2 --\u003E\r\n        \u003Cdiv class="grid grid-cols-2 relative" style="gap: 1rem;"\u003E\r\n            \u003C!-- Barra central --\u003E\r\n            \u003Cdiv class="absolute h-full top bottom rounded-md overflow-hidden" \r\n                style="left: 50%; width: 6px; background-color: white;"\u003E\r\n                \u003Cdiv class="barra-inner" \r\n                    :style="{ \r\n                        height: scrollPosition + \'%\', \r\n                        position: \'absolute\', \r\n                        inset: 0, \r\n                        backgroundColor: \'var(--primary)\' \r\n                    }"\u003E\r\n                \u003C/div\u003E\r\n            \u003C/div\u003E\r\n\r\n            \u003C!-- Elementos de la timeline --\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center" style=""\u003E\r\n                \u003Cspan class="text-white text-xl font-bold  uppercase self-end" data-label="0"\u003E2010\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold  uppercase self-end" data-label="1"\u003EGRAND OPENING\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-end"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold  uppercase self-end" data-label="2"\u003E2018\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold  uppercase self-end" data-label="3"\u003EAWARD WINNING GYM\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase self-end" data-label="4"\u003E2012\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold uppercase self-end" data-label="5"\u003EFAMOUS GYM IN CITY\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase self-end" data-label="6"\u003E2020\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold uppercase self-end" data-label="7"\u003EOPENING TOURNAMENT\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase self-end" data-label="8"\u003E2010\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold uppercase self-end" data-label="9"\u003EGRAND OPENING\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center"\u003E\r\n                \u003Cspan class="text-white text-xl font-bold uppercase self-end" data-label="10"\u003E2010\u003C/span\u003E\r\n                \u003Cspan class="text-white text-xl font-semibold uppercase self-end" data-label="11"\u003EGRAND OPENING\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv class="flex flex-col justify-center items-center"\u003E\r\n                \u003Cspan class="text-black text-xl font-bold uppercase self-end" data-label="12"\u003E2010\u003C/span\u003E\r\n                \u003Cspan class="text-black text-xl font-semibold uppercase self-end" data-label="13"\u003EGRAND OPENING\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n            \u003Cdiv\u003E\u003C/div\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\r\n\u003Cstyle\u003E\r\n     .grid-banner-0{\r\n        max-width: none;\r\n     }\r\n    .grid-banner-0 .parent{\r\n        padding: 6rem 0rem;\r\n    }\r\n    .grid-banner-0 .parent .title-parent-1::before {\r\n        content: "";\r\n        position: absolute;\r\n        display: inline-block;\r\n        bottom: -9px;\r\n        left: 0;\r\n        width: 50%;\r\n        height: 4px;\r\n        background-color: #e50001;\r\n    }\r\n\r\n\r\n    .grid-banner-0 .parent::before{\r\n        content:"";\r\n        z-index:-1; \r\n        padding: 6rem 2rem;\r\n        width:100%;\r\n        height: 75%;\r\n        position:absolute;\r\n        top:0;\r\n        background-color: black;\r\n\r\n    }\r\n\u003C/style\u003E',
            grid_banner: null,
        },
        {
            id: 17,
            html: null,
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.767Z",
            updatedAt: "2024-12-05T21:26:08.767Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 18,
            responsive: [
                {
                    width: 0,
                    height: 200,
                    rows: 1,
                    cols: 3,
                    gap: 1,
                    title: null,
                },
                {
                    width: 300,
                    height: 200,
                    rows: 1,
                    cols: 3,
                    gap: 1,
                    title: null,
                },
                {
                    width: 600,
                    height: 200,
                    rows: 1,
                    cols: 3,
                    gap: 1,
                    title: null,
                },
                {
                    width: 800,
                    height: 200,
                    rows: 1,
                    cols: 3,
                    gap: 1,
                    title: null,
                },
                {
                    width: 1200,
                    height: 200,
                    rows: 1,
                    cols: 3,
                    gap: 1,
                    title: null,
                },
            ],
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.767Z",
            updatedAt: "2024-12-05T21:26:08.767Z",
            grid_banner_id: null,
            banners: [],
            grid_banner: null,
        },
        {
            id: 19,
            responsive: [
                {
                    width: 0,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 300,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 600,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 800,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 1200,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
            ],
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.767Z",
            updatedAt: "2024-12-07T20:21:11.594Z",
            grid_banner_id: 23,
            banners: [],
            grid_banner: {
                id: 23,
                title: "Nuestros Partners",
                enabled: true,
                empresa_id: 5,
                createdAt: "2024-12-05T21:26:08.740Z",
                updatedAt: "2024-12-06T22:33:37.545Z",
                html: '\u003Cdiv class="partner" x-data="{\r\n    slug: JSON.parse(localStorage.getItem(\'empresa\')).slug\r\n}"\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-1.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-2.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-3.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-4.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-5.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-6.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-7.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-8.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-9.webp`"/\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="flex justify-center items-center"\u003E\r\n            \u003Cimg width="100" height="100" alt="partner" title="partner"  :src="`/empresas/${slug}/images/files/partner-10.webp`"/\u003E\r\n        \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    .grid-banner-3{\r\n        padding: 0rem 2rem;\r\n    }\r\n    .grid-banner-3 .partner{\r\n        display: grid;\r\n        grid-template-columns: repeat(2, minmax(0, 1fr));\r\n        gap: 1rem;\r\n    }\r\n    @media screen and (min-width: 800px){\r\n        .grid-banner-3 .partner{\r\n            grid-template-columns: repeat(5, minmax(0, 1fr));\r\n            gap: 2rem;\r\n        }\r\n    }\r\n    .grid-banner-3 .partner img{\r\n            filter: brightness(0%) contrast(100%) saturate(100%) blur(0px) hue-rotate(0deg);\r\n    }\r\n\u003C/script\u003E',
            },
        },
        {
            id: 20,
            responsive: [
                {
                    width: 0,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 300,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 600,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 800,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
                {
                    width: 1200,
                    cols: 3,
                    rows: 1,
                    gap: 1,
                    height: 200,
                },
            ],
            title: null,
            enabled: true,
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.767Z",
            updatedAt: "2024-12-07T20:21:23.417Z",
            grid_banner_id: 24,
            banners: [],
            grid_banner: {
                id: 24,
                responsive: [
                    {
                        width: 0,
                        cols: 1,
                        rows: 1,
                        height: 0,
                        gap: 1,
                    },
                    {
                        width: 300,
                        cols: 1,
                        rows: 1,
                        height: 0,
                        gap: 1,
                    },
                    {
                        width: 600,
                        cols: 1,
                        rows: 1,
                        height: 0,
                        gap: 1,
                    },
                    {
                        width: 800,
                        cols: 1,
                        rows: 1,
                        height: 0,
                        gap: 1,
                    },
                    {
                        width: 1200,
                        cols: 1,
                        rows: 1,
                        height: 0,
                        gap: 1,
                    },
                ],
                title: "Membresías",
                enabled: true,
                empresa_id: 5,
                createdAt: "2024-12-05T21:26:08.740Z",
                updatedAt: "2024-12-06T22:07:54.846Z",
                banners: [
                    {
                        id: 32,
                        title: null,
                        order: 0,
                        row: 1,
                        col: 1,
                        link: null,
                        button: null,
                        subtitle: null,
                        script: '\u003Cdiv x-data="{\r\n   header: JSON.parse(((document.querySelector(\'home-page\') || document.querySelector(\'servicios-page\'))?.getAttribute(\':header\')) || \'{}\'),\r\n   subtotalIgv(product, showWithDiscount = true, moreDiscount = null) {\r\n        const empresaStore = JSON.parse(localStorage.getItem(\'empresa\'));\r\n        const prod = JSON.parse(JSON.stringify(product));\r\n        let price = prod.price;\r\n\r\n        function formatMoney(value, forceLocal = false) {\r\n            const moneyStore = JSON.parse(localStorage.getItem(\'money\'));\r\n            function subtotalDolar(value) {\r\n                const converter = moneyStore.moneyValue[moneyStore.money];\r\n                return value * converter;\r\n            }\r\n\r\n            function formatDolares(number) {\r\n                return number.toLocaleString(\'en-US\', {\r\n                    style: \'currency\',\r\n                    currency: \'USD\',\r\n                });\r\n            }\r\n\r\n            return moneyStore.money === \'LOCAL\' || forceLocal\r\n                ? `${empresaStore.isDolar ? `${empresaStore.money.simbolo} ` : \'\'}${\r\n                    value.toLocaleString(empresaStore.money.international_simbolo, {\r\n                        style: \'currency\',\r\n                        currency: empresaStore.money.simbolo,\r\n                    })\r\n                }`\r\n                : formatDolares(subtotalDolar(value));\r\n        }\r\n\r\n        function subtotal(price, discount, increase = false) {\r\n            if (increase) {\r\n                return price + (discount * price) / 100;\r\n            }\r\n            return price - (discount * price) / 100;\r\n        }\r\n\r\n        if (showWithDiscount) {\r\n            price = subtotal(price, prod.discount ?? 0);\r\n        }\r\n        if (moreDiscount) {\r\n            price = subtotal(price, moreDiscount);\r\n        }\r\n\r\n        return formatMoney(\r\n            empresaStore.enabled_igv\r\n                ? subtotal(price, empresaStore.igv, true)\r\n                : price\r\n        );\r\n    }\r\n}" class="grid grid-cols-1 md:grid-cols-3 shadow " style="gap: 2rem; min-height: 300px;"\u003E\r\n    \u003Ctemplate x-if="header.categoriesServices"\u003E\r\n       \u003Ctemplate  x-for="servicio of (header.categoriesServices)[0].products"\u003E\r\n            \u003Cdiv class="flex flex-col gap-2 card"\u003E\r\n                \u003Cspan class="text-black text-2xl font-bold text-center block uppercase" x-text="`${subtotalIgv(servicio)}/${servicio.days[0].name}`"\u003E\u003C/span\u003E\r\n                \u003Ch3 class="bg-black py-3 px-4 text-center text-white font-bold text-xl" x-text="servicio.name"\u003E\u003C/h3\u003E\r\n                \u003Cul class="flex flex-col justify-center items-center w-full  px-6 py-4"\u003E\r\n                    \u003Ctemplate x-for="char of servicio.characteristics"\u003E\r\n                        \u003Cli class="py-3 border-b border-gray-400 w-full text-center font-semibold" x-text="char.value||\'\'"\u003E\u003C/li\u003E\r\n                    \u003C/template\u003E\r\n                \u003C/ul\u003E\r\n                \u003Ca :href="`/servicio/${servicio.slug}`"  class="uppercase font-bold" data-label="0"\u003EMás información\u003C/span\u003E\r\n            \u003C/div\u003E\r\n        \u003C/template\u003E     \r\n    \u003C/template\u003E\r\n    \r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n\r\n    .grid-banner-4 .card{\r\n        background-color:#FBFBFB; \r\n        padding: 2rem 1rem;\r\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra para efecto 3D */\r\n        clip-path: polygon(\r\n            0% 0%,       \r\n            90% 0%,      \r\n            100% 15%,    \r\n            100% 100%,   \r\n            15% 100%,    \r\n            0% 85%       \r\n        );\r\n    }\r\n    @media screen and(min-width:800px){   padding: 4rem 2rem;}\r\n    .grid-banner-4 .banners-4 a {\r\n        position: relative;\r\n        position: relative;\r\n        display: inline-block;\r\n        padding: 0.8rem 2rem;\r\n        background-color: black; /* Fondo del botón */\r\n        color: white; /* Color del texto */\r\n        text-decoration: none;\r\n        text-tranform: uppercase;\r\n        font-weight: bold;\r\n        text-align: center;\r\n        border: none;\r\n        align-self: center;\r\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Sombra para efecto 3D */\r\n        clip-path: polygon(\r\n            0% 0%,       \r\n            90% 0%,      \r\n            100% 15%,    \r\n            100% 100%,   \r\n            15% 100%,    \r\n            0% 85%       \r\n        );\r\n        transition: all 0.5s ease;\r\n    }\r\n    .grid-banner-4 .banners-4 a:hover {\r\n        background-color:#EAEAEA; \r\n        color:black;\r\n    }\r\n\r\n\u003C/style\u003E',
                        enabled: true,
                        file: null,
                        date: null,
                        grid_banner_id: 24,
                        grid_banner_service_id: null,
                        empresa_id: 5,
                        createdAt: "2024-12-06T19:46:11.455Z",
                        updatedAt: "2024-12-10T14:32:31.603Z",
                    },
                ],
            },
        },
    ],
    backgrounds: [
        {
            id: 7,
            title: "Weight ",
            description: "Burn Mass",
            url: "https://www.demo-5.vigilio-services.com",
            html: null,
            image: [
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/dfbfa91b-011c-4722-8a36-c5bf6f076deeci7vqx100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/fe2da6ac-b87e-46e4-bba9-5991a04cb7c2ci803x1600.webp",
                    dimension: 1600,
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-05T21:26:08.606Z",
            updatedAt: "2024-12-05T21:45:38.403Z",
        },
        {
            id: 8,
            title: "Get Burn",
            description: "With Zeus",
            url: "https://www.demo-5.vigilio-services.com/",
            html: null,
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/d641e1ac-24ed-41d6-865b-6a06517631d5d7edpx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/1726ab76-524c-4a36-a433-c5ee6fb2a7ccd7ee1x1600.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-05T21:57:13.675Z",
            updatedAt: "2024-12-05T21:57:13.675Z",
        },
        {
            id: 9,
            title: "Weight ",
            description: "Burn Mass",
            url: "https://www.demo-5.vigilio-services.com/",
            html: null,
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/9ac485d8-19a6-4afb-886b-857755a5e573d8f0lx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/background/96e20818-54b5-4f71-8f86-427874ef61bed8f0mx1600.webp",
                },
            ],
            empresa_id: 5,
            createdAt: "2024-12-05T21:57:46.969Z",
            updatedAt: "2024-12-05T21:57:46.969Z",
        },
    ],
    categories: [
        {
            id: 13,
            category_code: "CAT-000001",
            name: "Suplementos de Proteínas",
            isService: false,
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/categories/suplementos-de-protenaskcifkx100.webp",
                },
                {
                    dimension: 800,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/categories/suplementos-de-protenaskcifox800.webp",
                },
            ],
            icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
            slug: "suplementos-de-protenas",
            empresa_id: 5,
            createdAt: "2024-12-06T09:21:36.022Z",
            updatedAt: "2024-12-07T12:10:14.676Z",
            subcategories: [],
            productsNormals: [
                {
                    price: 78,
                    discount: 5,
                    id: 35,
                    product_code: "PROD-000005",
                    name: "MuscleBlaze Whey Gold 100% Whey Protein Isolate",
                    url: null,
                    description: "this is a description",
                    characteristics: [],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/muscleblaze-whey-gold-100-whey-protein-isolatekoup6x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/muscleblaze-whey-gold-100-whey-protein-isolatekoupbx500.webp",
                        },
                    ],
                    slug: "muscleblaze-whey-gold-100-whey-protein-isolate",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: 11,
                    empresa_id: 5,
                    createdAt: "2024-12-06T09:28:21.649Z",
                    updatedAt: "2024-12-06T10:08:57.262Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
                    },
                    brand: {
                        id: 11,
                        name: "Optimum Nutrition",
                        brand_code: "BRAND-000001",
                        image: [
                            {
                                dimension: 100,
                                file: "images/brands/optimum-nutritionkfv4ox100.webp",
                            },
                            {
                                dimension: 500,
                                file: "images/brands/optimum-nutritionkfv4sx500.webp",
                            },
                        ],
                        slug: "optimum-nutrition",
                        empresa_id: 5,
                        createdAt: "2024-12-06T09:23:27.213Z",
                        updatedAt: "2024-12-06T09:23:27.213Z",
                    },
                    options: [
                        {
                            option_id: 3,
                            features: [24],
                        },
                    ],
                    variants: [
                        {
                            id: 38,
                            sku: "000002",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 35,
                            empresa_id: 5,
                            createdAt: "2024-12-06T09:28:21.679Z",
                            updatedAt: "2024-12-06T09:28:40.506Z",
                            features: [
                                {
                                    id: 24,
                                    value: "#808080",
                                    description: "Gris",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 38,
                                        feature_id: 24,
                                        empresa_id: 5,
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
                    price: 20,
                    discount: 0,
                    id: 32,
                    product_code: "PROD-000002",
                    name: "Advance Musclemass Mass Gainer Supplement Powder (Chocolate Flavour | 3 Kg",
                    url: null,
                    description:
                        "Advance Musclemass Mass Gainer Supplement Powder es un suplemento en polvo de alta calidad diseñado para ayudar a aumentar la masa muscular de manera efectiva. Con un delicioso sabor a chocolate, este gainer de 3 kg proporciona una mezcla equilibrada de proteínas, carbohidratos y grasas, ideal para quienes buscan desarrollar su masa muscular y mejorar su rendimiento físico. Su fórmula está enriquecida con vitaminas y minerales esenciales que favorecen una recuperación óptima después del ejercicio. Perfecto para quienes tienen un alto requerimiento energético, este producto es ideal para ser co",
                    characteristics: [
                        {
                            name: "Nombre",
                            value: "Advance Musclemass Mass Gainer Supplement Powder",
                        },
                        {
                            name: "Sabor",
                            value: "Chocolate",
                        },
                        {
                            name: "Peso neto",
                            value: "3 Kg",
                        },
                        {
                            name: "Tipo de suplemento",
                            value: "Mass Gainer",
                        },
                        {
                            name: "Objetivo",
                            value: "Aumento de masa muscular",
                        },
                        {
                            name: "Proteínas por porción",
                            value: "30 g",
                        },
                        {
                            name: "Carbohidratos por porción",
                            value: "75 g",
                        },
                        {
                            name: "Contiene creatina",
                            value: "Sí",
                        },
                        {
                            name: "Aminoácidos",
                            value: "Incluye aminoácidos esenciales",
                        },
                        {
                            name: "Vitamínico",
                            value: "Fortificado con vitaminas y minerales",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Mezclar con agua o leche",
                        },
                        {
                            name: "Frecuencia de consumo",
                            value: "1-3 porciones al día",
                        },
                        {
                            name: "Aditivos",
                            value: "sin gluten",
                        },
                        {
                            name: "Fabricante",
                            value: "Advance",
                        },
                        {
                            name: "Uso ideal",
                            value: "Ideal para deportistas y culturistas",
                        },
                        {
                            name: "Textura",
                            value: "Polvo fino",
                        },
                        {
                            name: "Sabores disponibles",
                            value: "Chocolate, vainilla y fresa",
                        },
                        {
                            name: "Almacenamiento",
                            value: "Conservar en un lugar fresco y seco",
                        },
                        {
                            name: "Caducidad",
                            value: "Consultar fecha en el envase",
                        },
                        {
                            name: "Recomendación médica",
                            value: "Consultar a un profesional de salud antes de usar",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/advance-musclemass-mass-gainer-supplement-powder-chocolate-flavour-3-kgkkkopx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/advance-musclemass-mass-gainer-supplement-powder-chocolate-flavour-3-kgkkkosx500.webp",
                        },
                    ],
                    slug: "advance-musclemass-mass-gainer-supplement-powder-chocolate-flavour-3-kg",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: 11,
                    empresa_id: 5,
                    createdAt: "2024-12-06T09:26:00.357Z",
                    updatedAt: "2024-12-06T09:26:00.357Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
                    },
                    brand: {
                        id: 11,
                        name: "Optimum Nutrition",
                        brand_code: "BRAND-000001",
                        image: [
                            {
                                dimension: 100,
                                file: "images/brands/optimum-nutritionkfv4ox100.webp",
                            },
                            {
                                dimension: 500,
                                file: "images/brands/optimum-nutritionkfv4sx500.webp",
                            },
                        ],
                        slug: "optimum-nutrition",
                        empresa_id: 5,
                        createdAt: "2024-12-06T09:23:27.213Z",
                        updatedAt: "2024-12-06T09:23:27.213Z",
                    },
                    options: [
                        {
                            option_id: 1,
                            features: [1],
                        },
                    ],
                    variants: [
                        {
                            id: 35,
                            sku: "0000078",
                            stock: 8,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 32,
                            empresa_id: 5,
                            createdAt: "2024-12-06T09:26:00.453Z",
                            updatedAt: "2024-12-06T09:29:42.566Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 35,
                                        feature_id: 1,
                                        empresa_id: 5,
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
                    price: 76,
                    discount: 0,
                    id: 34,
                    product_code: "PROD-000004",
                    name: "Ripped Up Nutrition Whey Pro – Rich Chocolate",
                    url: null,
                    description:
                        "Ripped Up Nutrition Whey Pro – Rich Chocolate es un deliciousísimo suplemento de proteína de suero que ofrece una fórmula de alta calidad diseñada para apoyar tus objetivos de fitness y aumentar tu ingesta de proteínas de manera efectiva. Con un sabor intenso a chocolate rico, cada porción te proporciona una excelente fuente de proteínas para ayudar en la construcción y recuperación muscular. Su preparada mezcla se disuelve fácilmente en agua o leche, permitiéndote disfrutar de un batido suave y cremoso en cualquier momento del día. Ideal para atletas, personas activas o cualquier persona que ",
                    characteristics: [
                        {
                            name: "product_name",
                            value: "Ripped Up Nutrition Whey Pro – Rich Chocolate",
                        },
                        {
                            name: "flavor",
                            value: "Rich Chocolate",
                        },
                        {
                            name: "serving_size",
                            value: "30g",
                        },
                        {
                            name: "protein_per_serving",
                            value: "24g",
                        },
                        {
                            name: "calories_per_serving",
                            value: "120",
                        },
                        {
                            name: "carbohydrates_per_serving",
                            value: "3g",
                        },
                        {
                            name: "sugars_per_serving",
                            value: "1g",
                        },
                        {
                            name: "fat_per_serving",
                            value: "2g",
                        },
                        {
                            name: "brand",
                            value: "Ripped Up Nutrition",
                        },
                        {
                            name: "type",
                            value: "Whey Protein Isolate",
                        },
                        {
                            name: "instantized",
                            value: "Yes",
                        },
                        {
                            name: "amino_acid_profile",
                            value: "Complete profile with BCAAs",
                        },
                        {
                            name: "gluten_free",
                            value: "Yes",
                        },
                        {
                            name: "lactose_free",
                            value: "Low lactose content",
                        },
                        {
                            name: "mixability",
                            value: "Highly mixable",
                        },
                        {
                            name: "usage_instructions",
                            value: "Mix with water or milk",
                        },
                        {
                            name: "ideal_for",
                            value: "Post-workout recovery",
                        },
                        {
                            name: "additives",
                            value: "No artificial flavors or colors",
                        },
                        {
                            name: "packaging",
                            value: "Resealable bag",
                        },
                        {
                            name: "sustainability",
                            value: "Eco-friendly packaging",
                        },
                        {
                            name: "storage_conditions",
                            value: "Store in a cool, dry place",
                        },
                        {
                            name: "expiration",
                            value: "Check packaging for date",
                        },
                        {
                            name: "target_audience",
                            value: "Athletes and fitness enthusiasts",
                        },
                        {
                            name: "certifications",
                            value: "Made in a GMP-certified facility",
                        },
                        {
                            name: "disclaimer",
                            value: "Consult with a healthcare provider before use",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/ripped-up-nutrition-whey-pro-rich-chocolateknju0x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/ripped-up-nutrition-whey-pro-rich-chocolateknju2x500.webp",
                        },
                    ],
                    slug: "ripped-up-nutrition-whey-pro-rich-chocolate",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: 11,
                    empresa_id: 5,
                    createdAt: "2024-12-06T09:27:37.835Z",
                    updatedAt: "2024-12-06T09:27:37.835Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
                    },
                    brand: {
                        id: 11,
                        name: "Optimum Nutrition",
                        brand_code: "BRAND-000001",
                        image: [
                            {
                                dimension: 100,
                                file: "images/brands/optimum-nutritionkfv4ox100.webp",
                            },
                            {
                                dimension: 500,
                                file: "images/brands/optimum-nutritionkfv4sx500.webp",
                            },
                        ],
                        slug: "optimum-nutrition",
                        empresa_id: 5,
                        createdAt: "2024-12-06T09:23:27.213Z",
                        updatedAt: "2024-12-06T09:23:27.213Z",
                    },
                    options: [
                        {
                            option_id: 3,
                            features: [28],
                        },
                    ],
                    variants: [
                        {
                            id: 37,
                            sku: "000009",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 34,
                            empresa_id: 5,
                            createdAt: "2024-12-06T09:27:37.925Z",
                            updatedAt: "2024-12-06T09:28:58.713Z",
                            features: [
                                {
                                    id: 28,
                                    value: "#800000",
                                    description: "Granate",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 37,
                                        feature_id: 28,
                                        empresa_id: 5,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 4.5,
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
                        stars4: 1,
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 45,
                    discount: 4,
                    id: 33,
                    product_code: "PROD-000003",
                    name: "MuscleXP Instantized BCAA 6000 with L-Alanine & Taurine",
                    url: null,
                    description: "this is a description",
                    characteristics: [
                        {
                            name: "Nombre",
                            value: "MuscleXP Instantized BCAA 6000",
                        },
                        {
                            name: "Cantidad",
                            value: "6000 mg por porción",
                        },
                        {
                            name: "Aminoácidos Ramificados",
                            value: "Leucina, Isoleucina y Valina",
                        },
                        {
                            name: "Proporción de BCAA",
                            value: "2:1:1",
                        },
                        {
                            name: "Adición de L-Alanina",
                            value: "Sí",
                        },
                        {
                            name: "Adición de Taurina",
                            value: "Sí",
                        },
                        {
                            name: "Modo de uso",
                            value: "Mezclar con agua o bebida de su elección",
                        },
                        {
                            name: "Sabor",
                            value: "Variedades disponibles",
                        },
                        {
                            name: "Objetivo principal",
                            value: "Recuperación muscular",
                        },
                        {
                            name: "Instantización",
                            value: "Sí, para mejor disolución",
                        },
                        {
                            name: "Libre de azúcar",
                            value: "Sí",
                        },
                        {
                            name: "Libre de gluten",
                            value: "Sí",
                        },
                        {
                            name: "Sin aditivos artificiales",
                            value: "Sí",
                        },
                        {
                            name: "Marca",
                            value: "MuscleXP",
                        },
                        {
                            name: "Formato",
                            value: "Polvo",
                        },
                        {
                            name: "Vegetariano",
                            value: "Sí",
                        },
                        {
                            name: "Aumenta la resistencia",
                            value: "Sí",
                        },
                        {
                            name: "Efecto anticatabólico",
                            value: "Sí",
                        },
                        {
                            name: "Satisfacción del cliente",
                            value: "Altas reseñas en general",
                        },
                        {
                            name: "Certificaciones",
                            value: "Fabricado en instalaciones registradas",
                        },
                        {
                            name: "Usos recomendados",
                            value: "Antes y después del entrenamiento",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/musclexp-instantized-bcaa-6000-with-l-alanine-taurinekmdsfx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/musclexp-instantized-bcaa-6000-with-l-alanine-taurinekmdshx500.webp",
                        },
                    ],
                    slug: "musclexp-instantized-bcaa-6000-with-l-alanine-taurine",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: 11,
                    empresa_id: 5,
                    createdAt: "2024-12-06T09:26:58.835Z",
                    updatedAt: "2024-12-06T10:09:11.837Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
                    },
                    brand: {
                        id: 11,
                        name: "Optimum Nutrition",
                        brand_code: "BRAND-000001",
                        image: [
                            {
                                dimension: 100,
                                file: "images/brands/optimum-nutritionkfv4ox100.webp",
                            },
                            {
                                dimension: 500,
                                file: "images/brands/optimum-nutritionkfv4sx500.webp",
                            },
                        ],
                        slug: "optimum-nutrition",
                        empresa_id: 5,
                        createdAt: "2024-12-06T09:23:27.213Z",
                        updatedAt: "2024-12-06T09:23:27.213Z",
                    },
                    options: [
                        {
                            option_id: 3,
                            features: [27],
                        },
                    ],
                    variants: [
                        {
                            id: 36,
                            sku: "000007",
                            stock: 5,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 33,
                            empresa_id: 5,
                            createdAt: "2024-12-06T09:26:58.921Z",
                            updatedAt: "2024-12-06T09:29:27.886Z",
                            features: [
                                {
                                    id: 27,
                                    value: "#008000",
                                    description: "Verde Oscuro",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 36,
                                        feature_id: 27,
                                        empresa_id: 5,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                    ],
                    rating: {
                        quantity: 1,
                        promedio: 3,
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
                        stars3: 0,
                        stars2: 0,
                        stars1: 0,
                    },
                },
                {
                    price: 75,
                    discount: 0,
                    id: 31,
                    product_code: "PROD-000001",
                    name: "Advance MuscleMass",
                    url: null,
                    description: "this is a description",
                    characteristics: [
                        {
                            name: "Nombre del producto",
                            value: "Advance MuscleMass BCAA 2:1:1",
                        },
                        {
                            name: "Tipo de producto",
                            value: "BCAA",
                        },
                        {
                            name: "Relación BCAA",
                            value: "2:1:1",
                        },
                        {
                            name: "Contenido total de BCAA",
                            value: "7.6 g",
                        },
                        {
                            name: "Contenido de Leucina",
                            value: "3.8 g",
                        },
                        {
                            name: "Contenido de Iso-Leucina",
                            value: "1.9 g",
                        },
                        {
                            name: "Contenido de Valina",
                            value: "1.9 g",
                        },
                        {
                            name: "Instantizado con",
                            value: "Aceite de girasol",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Antes y/o después del entrenamiento",
                        },
                        {
                            name: "Beneficios",
                            value: "Ayuda a la recuperación muscular",
                        },
                        {
                            name: "Sabor",
                            value: "Variedades disponibles (especificar según producto)",
                        },
                        {
                            name: "Formato",
                            value: "Polvo",
                        },
                        {
                            name: "Contenido por porción",
                            value: "Una medida indicada",
                        },
                        {
                            name: "Sin azúcares añadidos",
                            value: "Sí",
                        },
                        {
                            name: "Libre de gluten",
                            value: "Sí",
                        },
                        {
                            name: "Aporte energético",
                            value: "Diseñado para mejorar el rendimiento durante el ejercicio",
                        },
                        {
                            name: "Mezcla",
                            value: "Fácil disolución",
                        },
                        {
                            name: "Fabricante",
                            value: "Advance",
                        },
                        {
                            name: "Destinado a",
                            value: "Atletas y personas activas",
                        },
                        {
                            name: "Sin aditivos artificiales",
                            value: "Sí",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/advance-musclemass-bcaa-211-energy-drink-for-workout-76-g-bcaa-38-g-leucine-19-g-iso-leucine-19-g-valine-instantized-with-sunflowerl29jex100.webp",
                            dimension: 100,
                        },
                        {
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/advance-musclemass-bcaa-211-energy-drink-for-workout-76-g-bcaa-38-g-leucine-19-g-iso-leucine-19-g-valine-instantized-with-sunflowerl29jhx500.webp",
                            dimension: 500,
                        },
                    ],
                    slug: "advance-musclemass",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: 11,
                    empresa_id: 5,
                    createdAt: "2024-12-06T09:23:57.782Z",
                    updatedAt: "2024-12-06T09:33:49.406Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
                    },
                    brand: {
                        id: 11,
                        name: "Optimum Nutrition",
                        brand_code: "BRAND-000001",
                        image: [
                            {
                                dimension: 100,
                                file: "images/brands/optimum-nutritionkfv4ox100.webp",
                            },
                            {
                                dimension: 500,
                                file: "images/brands/optimum-nutritionkfv4sx500.webp",
                            },
                        ],
                        slug: "optimum-nutrition",
                        empresa_id: 5,
                        createdAt: "2024-12-06T09:23:27.213Z",
                        updatedAt: "2024-12-06T09:23:27.213Z",
                    },
                    options: [
                        {
                            option_id: 3,
                            features: [20],
                        },
                    ],
                    variants: [
                        {
                            id: 34,
                            sku: "000003",
                            stock: 5,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 31,
                            empresa_id: 5,
                            createdAt: "2024-12-06T09:23:57.815Z",
                            updatedAt: "2024-12-06T09:56:18.429Z",
                            features: [
                                {
                                    id: 20,
                                    value: "#ffff00",
                                    description: "Amarillo",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 34,
                                        feature_id: 20,
                                        empresa_id: 5,
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
                    price: 98,
                    discount: 6,
                    id: 36,
                    product_code: "PROD-000006",
                    name: "Fitspire 100% Plant Protein Based With Pea With Shaker, Lean Protein",
                    url: null,
                    description:
                        "Proteína vegetal Fitspire 100% basada en guisante, ideal para quienes buscan una opción saludable y efectiva para complementar su dieta. Este producto es perfecto para promover la recuperación muscular y el desarrollo de una masa muscular magra. Su fórmula limpia y natural es rica en aminoácidos esenciales, lo que la convierte en una excelente alternativa para veganos y vegetarianos. Además, viene con un práctico shaker que facilita su preparación en cualquier momento. Su delicioso sabor y fácil disolución lo hacen ideal para batidos, smoothies o mezclas en tus recetas favoritas. Mejora tu ren",
                    characteristics: [
                        {
                            name: "Nombre del producto",
                            value: "Fitspire 100 Plant Protein Based With Pea",
                        },
                        {
                            name: "Tipo de proteína",
                            value: "Proteína vegetal",
                        },
                        {
                            name: "Fuente principal",
                            value: "Guisante",
                        },
                        {
                            name: "Cantidad de proteína por porción",
                            value: "24 g",
                        },
                        {
                            name: "Contiene BCAAs",
                            value: "Sí",
                        },
                        {
                            name: "Objetivo",
                            value: "Mejorar la recuperación muscular",
                        },
                        {
                            name: "Sabor",
                            value: "Natural o con sabores disponibles",
                        },
                        {
                            name: "Libre de lactosa",
                            value: "Sí",
                        },
                        {
                            name: "Aditivos",
                            value: "Sin aditivos artificiales",
                        },
                        {
                            name: "Envase incluido",
                            value: "Shaker",
                        },
                        {
                            name: "Apto para veganos",
                            value: "Sí",
                        },
                        {
                            name: "Carbohidratos por porción",
                            value: "Bajo en carbohidratos",
                        },
                        {
                            name: "Grasas por porción",
                            value: "Bajo en grasas",
                        },
                        {
                            name: "Presentación",
                            value: "Polvo",
                        },
                        {
                            name: "Modo de preparación",
                            value: "Mezclar con agua o leche vegetal",
                        },
                        {
                            name: "Beneficios adicionales",
                            value: "Promueve el aumento de masa muscular magra",
                        },
                        {
                            name: "Certificaciones",
                            value: "Libre de gluten",
                        },
                        {
                            name: "Recomendación de uso",
                            value: "Post-entrenamiento o como suplemento de proteína",
                        },
                        {
                            name: "Duración",
                            value: "Usar como parte de una dieta equilibrada",
                        },
                        {
                            name: "Información nutricional",
                            value: "Alto contenido en fibra",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/fitspire-100-plant-protein-based-with-pea-with-shaker-lean-proteinmisn9x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/products/fitspire-100-plant-protein-based-with-pea-with-shaker-lean-proteinmisnfx500.webp",
                        },
                    ],
                    slug: "fitspire-100-plant-protein-based-with-pea-with-shaker-lean-protein",
                    category_id: 13,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 5,
                    createdAt: "2024-12-06T10:00:00.152Z",
                    updatedAt: "2024-12-06T10:00:00.152Z",
                    category: {
                        name: "Suplementos de Proteínas",
                        slug: "suplementos-de-protenas",
                        icon: '\u003Ci class="fas fa-jug"\u003E\u003C/i\u003E',
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
                            id: 39,
                            sku: "000005",
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 36,
                            empresa_id: 5,
                            createdAt: "2024-12-06T10:00:00.206Z",
                            updatedAt: "2024-12-06T10:00:15.395Z",
                            features: [
                                {
                                    id: 31,
                                    value: "#4b0082",
                                    description: "Índigo",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 39,
                                        feature_id: 31,
                                        empresa_id: 5,
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
            ],
            productsRestaurants: [],
            productsServicios: [],
        },
        {
            id: 14,
            category_code: "CAT-000002",
            name: "Membresía",
            isService: true,
            icon: '\u003Ci class="fa-solid fa-dumbbell"\u003E\u003C/i\u003E',
            slug: "membresa",
            empresa_id: 5,
            createdAt: "2024-12-06T19:21:45.576Z",
            updatedAt: "2024-12-07T12:12:16.286Z",
            subcategories: [],
            productsNormals: [],
            productsRestaurants: [],
            productsServicios: [
                {
                    price: 19,
                    discount: 0,
                    id: 1,
                    product_code: "SERV-000001",
                    name: "ONE DAY TRAINING",
                    url: null,
                    description: "\u003Cp\u003E\u003Cbr\u003E\u003C/p\u003E",
                    days: [
                        {
                            days: 1,
                            cantidad: 1,
                            name: "Día",
                        },
                    ],
                    showHorario: false,
                    characteristics: [
                        {
                            name: "-",
                            value: "Regular Gym",
                        },
                        {
                            name: "-",
                            value: "Free Trainer",
                        },
                        {
                            name: "-",
                            value: "Modern Facility",
                        },
                    ],
                    enabled: true,
                    slug: "one-day-training",
                    category_id: 14,
                    empresa_id: 5,
                    createdAt: "2024-12-06T19:28:35.400Z",
                    updatedAt: "2024-12-06T19:31:59.878Z",
                    category: {
                        name: "Membresía",
                        slug: "membresa",
                        icon: '\u003Ci class="fa-solid fa-dumbbell"\u003E\u003C/i\u003E',
                    },
                },
                {
                    price: 49,
                    discount: 3,
                    id: 2,
                    product_code: "SERV-000002",
                    name: "regular member",
                    url: null,
                    description: null,
                    days: [
                        {
                            days: 30,
                            cantidad: 1,
                            name: "Mensual",
                        },
                    ],
                    showHorario: false,
                    characteristics: [
                        {
                            name: "-",
                            value: "Regular Gym",
                        },
                        {
                            name: "-",
                            value: "Free Trainer",
                        },
                        {
                            name: "-",
                            value: "Modern Facility",
                        },
                    ],
                    enabled: true,
                    slug: "regular-member",
                    category_id: 14,
                    empresa_id: 5,
                    createdAt: "2024-12-06T19:33:01.649Z",
                    updatedAt: "2024-12-06T19:33:01.649Z",
                    category: {
                        name: "Membresía",
                        slug: "membresa",
                        icon: '\u003Ci class="fa-solid fa-dumbbell"\u003E\u003C/i\u003E',
                    },
                },
                {
                    price: 69,
                    discount: 9,
                    id: 3,
                    product_code: "SERV-000003",
                    name: "VIP Member",
                    url: null,
                    description: null,
                    days: [
                        {
                            days: 30,
                            cantidad: 1,
                            name: "Mensual",
                        },
                    ],
                    showHorario: false,
                    characteristics: [
                        {
                            name: "-",
                            value: "Regular Gym",
                        },
                        {
                            name: "-",
                            value: "Free Trainer",
                        },
                        {
                            name: "-",
                            value: "Modern Facility",
                        },
                    ],
                    enabled: true,
                    slug: "vip-member",
                    category_id: 14,
                    empresa_id: 5,
                    createdAt: "2024-12-06T19:33:44.553Z",
                    updatedAt: "2024-12-06T19:33:44.553Z",
                    category: {
                        name: "Membresía",
                        slug: "membresa",
                        icon: '\u003Ci class="fa-solid fa-dumbbell"\u003E\u003C/i\u003E',
                    },
                },
            ],
        },
    ],
    brands: [
        {
            id: 11,
            name: "Optimum Nutrition",
            brand_code: "BRAND-000001",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/optimum-nutritionkfv4ox100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/optimum-nutritionkfv4sx500.webp",
                },
            ],
            slug: "optimum-nutrition",
            empresa_id: 5,
            createdAt: "2024-12-06T09:23:27.213Z",
            updatedAt: "2024-12-06T09:23:27.213Z",
        },
        {
            id: 12,
            name: "MyProtein",
            brand_code: "BRAND-000002",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/myproteingl18lx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/myproteingl19bx500.webp",
                },
            ],
            slug: "myprotein",
            empresa_id: 5,
            createdAt: "2024-12-07T12:14:02.618Z",
            updatedAt: "2024-12-07T12:14:02.618Z",
        },
        {
            id: 13,
            name: "Dymatize",
            brand_code: "BRAND-000003",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/dymatizegnv6qx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/dymatizegnv71x500.webp",
                },
            ],
            slug: "dymatize",
            empresa_id: 5,
            createdAt: "2024-12-07T12:15:38.649Z",
            updatedAt: "2024-12-07T12:15:38.649Z",
        },
        {
            id: 14,
            name: "Muscletetech",
            brand_code: "BRAND-000004",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/muscletetechgqftox100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/muscletetechgqftqx500.webp",
                },
            ],
            slug: "muscletetech",
            empresa_id: 5,
            createdAt: "2024-12-07T12:17:01.097Z",
            updatedAt: "2024-12-07T12:17:01.097Z",
        },
        {
            id: 15,
            name: "BSN",
            brand_code: "BRAND-000005",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/bsngs32ex100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/bsngs32nx500.webp",
                },
            ],
            slug: "bsn",
            empresa_id: 5,
            createdAt: "2024-12-07T12:17:53.438Z",
            updatedAt: "2024-12-07T12:17:53.438Z",
        },
        {
            id: 16,
            name: "Isopure",
            brand_code: "BRAND-000006",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/isopuregu6opx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-5.vigilio-services.com/empresas/demo-5/images/brands/isopuregu6p4x500.webp",
                },
            ],
            slug: "isopure",
            empresa_id: 5,
            createdAt: "2024-12-07T12:19:02.884Z",
            updatedAt: "2024-12-07T12:19:02.884Z",
        },
    ],
};
