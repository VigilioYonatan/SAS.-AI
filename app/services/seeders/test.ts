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
        id: 16,
        web: null,
        host: {
            enabled: false,
            host: null,
            nameserver_one: null,
            nameserver_two: null,
            time: null,
        },
        bg_color: "#f03c3c",
        bg_color_header: "transparent",
        bg_color_aside: "transparent",
        bg_color_background: "#ffffff",
        bg_color_footer: "#26292e",
        text_color: "transparent",
        bg_color_secondary: "#f03c3c",
        type_animation: "fade-up",
        background_auth: null,
        font_face: "Poppins",
        bg_color_paper: "#ffffff",
        bg_color_button: "#f03c3c",
        isCoverImage: true,
        isScrolling: false,
        is_hidde_total_cart: false,
        isDark: false,
        isLogoImage: false,
        is_block_aside: false,
        is_subcategory: false,
        is_service_page: false,
        position_header: true,
        bg_color_responsive: "#ffffff",
        border_title_type: "border",
        type_star: "star",
        background_position: "center",
        header_type: "search2",
        background_type: "first",
        type_icons: "normal",
        type_border: "circle",
        type_cart: "fas fa-shopping-cart",
        type_arrow: "first",
        type_map: "satelite",
        web_script:
            'const empresa = JSON.parse(localStorage.getItem("empresa"))\nconst style = document.createElement("style")\nstyle.innerHTML = `\n:root {\n    --secondary: #222222;\n}\nheader .navbar-search2{\n    background-color: var(--secondary);\n    padding: 1rem 0rem;\n}\nheader .navbar-search2 .header-nav \u003E a, \nheader .navbar-search2 .header-nav \u003E div \u003E a, \nheader .navbar-search2 .header-nav \u003E div \u003E button{\n    color: white;\n}\nheader .navbar-search2 .header-nav \u003E a:hover,\nheader .navbar-search2 .header-nav \u003E div \u003E a:hover, \nheader .navbar-search2 .header-nav \u003E div \u003E button:hover{\n    color: var(--primary);\n}\n.background-home \u003E div{\n    height: 400px !important;\n}\n.background-home .background-home-container \u003E div{\n    height: 400px !important;\n}\n@media (min-width: 700px){\n    .background-home \u003E div{\n        height: 550px !important;\n    }\n    .background-home .background-home-container \u003E div{\n        height: 550px !important;\n    }\n}\n.background-home-container \u003E div \u003E div{\n    display: flex;\n    justify-content:start;\n    align-items:center;\n    margin: 0 auto;\n    max-width: 75rem;\n}\n.background-home-container{\n    position: relative;\n}\n.background-home-container::before{\n    content:"";\n    position: absolute;\n    inset:0;\n    background-color: #ffffff52;\n}\n@media (min-width: 600px){\n    .background-home-container::before{\n        background-color: transparent;\n    }\n}\n.background-home-container .banner-custom {\n    display: flex;\n    flex-direction: column;\n    gap: 1.5rem;\n    align-items:center;\n    justify-content: center;\n    margin: 2rem;\n}\n@media (min-width: 600px){\n    .background-home-container .banner-custom {\n        align-items:start;\n        justify-content: start;\n        gap: 2.5rem;\n    }\n}\n.background-home-container .banner-custom span {\n    font-size: 1rem;\n    font-family: Font-Bold;\n    text-decoration: uppercase;\n}\n.background-home-container .banner-custom h3 {\n    font-size: 2.5rem;\n    font-family: Font-Bold;\n    text-decoration: uppercase;\n}\n.background-home-container .banner-custom p {\n    font-size: 1rem;\n    margin-bottom: 1rem;\n    font-family: Font-Regular;\n    text-decoration: uppercase;\n}\n\n@media (min-width: 700px){\n    .background-home-container .banner-custom span {\n        font-size: 1.5rem;\n    }\n    .background-home-container .banner-custom h3 {\n        font-size: 3.5rem;\n    }\n    .background-home-container .banner-custom p {\n        font-size: 1.5rem;\n    }\n}\n\n.background-home-container .banner-custom a {\n    padding: 0.6rem 2rem;\n    border: 2px solid var(--secondary);\n    border-radius: 0.5rem;\n    font-family: Font-Bold;\n    text-transform: uppercase;\n}\n.background-home-container .banner-custom a:hover{\n    border: 2px solid var(--primary);\n    background-color: var(--primary);\n    color: white;\n}\n/* animation */\n\n@keyframes fadeIn {\n    0% {\n        opacity: 0;\n    }\n    100% {\n        opacity: 1;\n    }\n}\n\n@keyframes slideInUp {\n    0% {\n        opacity: 0;\n        transform: translateY(20px);\n    }\n    100% {\n        opacity: 1;\n        transform: translateY(0);\n    }\n}\n\n.fade-in {\n    opacity: 0;\n    animation: fadeIn 0.7s ease-out forwards;\n}\n\n.slide-in-up {\n    opacity: 0;\n    transform: translateY(20px);\n    animation: slideInUp 0.7s ease-out forwards;\n}\n\n.delay-1 {\n    animation-delay: 0.3s;\n}\n\n.delay-2 {\n    animation-delay: 0.6s;\n}\n\n/* slider */\n .background-home .slick-arrow, .slick-arrow, .post-section .slick-arrow, .slick-arrow{\n       display: none !important;\n}\n@media (min-width: 600px){\n    .background-home .slick-arrow, .slick-arrow, .post-section .slick-arrow, .slick-arrow{\n        display: flex !important;\n        width: 50px !important;\n        height: 50px !important;\n        border-radius: 100% !important;\n        background-color: white;\n    }\n    .post-section .slick-arrow, .slick-arrow{\n        width: 30px !important;\n        height: 30px !important;\n    }\n\n}\n\n.offer-section \u003E div:nth-child(2) \u003E div:nth-child(1){\n    display: none;\n}\n.email-promotion{\n    height: 350px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background-image: url(\'/empresas/${empresa.slug}/images/files/news-promotion-1.webp\');\n    background-repeat: no-repeat;\n    background-size: cover;\n}\n.email-promotion \u003E div{\n    display: flex;\n    flex-direction: column;\n    gap: 1.6rem;\n}\n.email-promotion .news{\n    display: flex;\n    flex-direction: column;\n    gap:0.5rem;\n    align-items:center;\n    justify-content: center;\n}\n.email-promotion .news h3{\n    color: var(--primary);\n    font-size: 1.8rem;\n    font-family: \'Font-Bold\';\n    text-align:center;\n}\n.email-promotion .news p{\n    color: white;\n    font-size: 1rem;\n    font-family: \'Font-Regular\';\n    text-align:center;\n}\n\n.email-promotion form {\n    gap: 0rem;\n    align-items: normal;\n    padding: 0 0.5rem;\n}\n.email-promotion form \u003E div{\n    margin: 0;\n}\n.email-promotion form \u003E div \u003E div \u003E div{\n    border-radius: 0.5rem 0 0 0.5rem;\n    margin: 0;\n    height: 3rem;\n    background-color:white;\n    border-color: var(--border);\n}\n.email-promotion form \u003E div \u003E div{\n    border-radius: 0.5rem 0 0 0.5rem;\n}\n.email-promotion form \u003E button{\n    margin-top: 0;\n    border-radius: 0rem 0.5rem 0.5rem 0rem;\n    letter-spacing: 0.055em;\n}\n.email-promotion form  label{\n    display: none;\n}\nhome-page .find-section{\n    display:none;\n}\n.product-users-section \u003E div \u003E div \u003E div \u003E h3 {\n    width: 100%;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n.post-section::after {\n    content: "";\n    position: absolute;\n    width: 100%;\n    left: 0;\n    right: 0;\n    height: 300px;\n    background-color: var(--secondary);\n    z-index: -1;\n}\n.post-section \u003E div:nth-child(1) \u003E h2{\n    color: white !important;\n}\n`;\ndocument.head.appendChild(style);\n                    \nconst emailPromotion = document.querySelector(".email-promotion")\nconst findSection = document.querySelector("home-page .find-section")\nif(emailPromotion){\n   const containerEmailPromotion =  emailPromotion.children[0];\n   const div = h("div");\n    div.innerHTML = `\u003Cdiv class="news"\u003E\n    \u003Ch3\u003ESuscríbete al boletín\u003C/h3\u003E\n    \u003Cp\u003ERecibe las últimas noticias y promociones directamente en tu bandeja de entrada.\u003C/p\u003E\n   \u003C/div\u003E\n   `;\n   containerEmailPromotion.prepend(div.firstElementChild);\n}\nif(findSection){\n    findSection.innerHTML ="";\n}\n',
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
            services: false,
        },
        type_card: "eccomerce",
        type_loader: "one",
        type_product_buttons: "first",
        type_icons_bars: "light",
        is_hover_product: true,
        isProductWallpaper: false,
        hamburger: "fas fa-bars",
        products_limit: 5,
        products_limit_offer: 4,
        shows: {
            map: true,
            about: true,
            cards: false,
            brands: false,
            android: true,
            offers_section: false,
            offers_user: true,
            categories_slider: false,
            users: false,
        },
        empresa_id: 16,
        createdAt: "2024-12-30T07:24:04.638Z",
        updatedAt: "2025-01-03T14:22:55.301Z",
    },
    gridBanners: [
        {
            id: 75,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="features-container" x-data="{empresa:JSON.parse(localStorage.getItem(\'empresa\'))}"\u003E\r\n    \u003Cdiv class="feature-item"\u003E\r\n        \u003Cimg data-image="1" lazy="loading" width="200" height="200" :src="`/empresas/${empresa.slug}/images/files/banner-0-icon-1.webp`" alt="Free Shipping Icon" title="Free Shipping Icon" class="feature-icon" /\u003E\r\n        \u003Ch4 data-label="11"\u003EFree Shipping\u003C/h4\u003E\r\n        \u003Cp data-label="21"\u003EFree shipping on all US orders\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="feature-item"\u003E\r\n        \u003Cimg data-image="2" lazy="loading" width="200" height="200" :src="`/empresas/${empresa.slug}/images/files/banner-0-icon-2.webp`" alt="Online Support Icon" title="Online Support Icon" class="feature-icon" /\u003E\r\n        \u003Ch4 data-label="12"\u003EOnline Support 24/7\u003C/h4\u003E\r\n        \u003Cp data-label="22"\u003ESupport online 24 hours a day\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="feature-item"\u003E\r\n        \u003Cimg data-image="3" lazy="loading" width="200" height="200" :src="`/empresas/${empresa.slug}/images/files/banner-0-icon-3.webp`" alt="Money Return Icon" title="Money Return Icon" class="feature-icon" /\u003E\r\n        \u003Ch4 data-label="13"\u003EMoney Return\u003C/h4\u003E\r\n        \u003Cp data-label="23"\u003EBack guarantee under 7 days\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="feature-item"\u003E\r\n        \u003Cimg data-image="4" lazy="loading" width="200" height="200" :src="`/empresas/${empresa.slug}/images/files/banner-0-icon-4.webp`" alt="Member Discount Icon" title="Member Discount Icon" class="feature-icon" /\u003E\r\n        \u003Ch4 data-label="14"\u003EMember Discount\u003C/h4\u003E\r\n        \u003Cp data-label="24"\u003EOn every order over $120.00\u003C/p\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="feature-item"\u003E\r\n        \u003Cimg data-image="5" lazy="loading" width="200" height="200" :src="`/empresas/${empresa.slug}/images/files/banner-0-icon-5.webp`" alt="Secure Payment Icon" title="Secure Payment Icon" class="feature-icon" /\u003E\r\n        \u003Ch4 data-label="15"\u003ESecure Payment\u003C/h4\u003E\r\n        \u003Cp data-label="25"\u003EAll cards accepted\u003C/p\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n.grid-banner-0 .features-container, .grid-banner-1 .features-container {\r\n    display: grid;\r\n    grid-template-columns: repeat(2, minmax(0, 1fr));\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    gap: 1rem;\r\n    padding: 1rem 2rem;\r\n    background-color: #fff;\r\n    border: 1px solid #ddd;\r\n    border-radius: 8px;\r\n}\r\n.grid-banner-0 .form-html-editor .features-container, .grid-banner-1 .form-html-editor .features-container {\r\n    background-color: transparent;\r\n\r\n}\r\n@media (min-width:600px){\r\n    .grid-banner-0 .features-container, .grid-banner-1 .features-container{\r\n     grid-template-columns: repeat(5, minmax(0, 1fr));\r\n    }\r\n}\r\n\r\n.grid-banner-0 .feature-item, .grid-banner-1 .feature-item {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    text-align: center;\r\n    flex: 1;\r\n    padding: 0 1rem;\r\n    border-right: 1px solid #ddd;\r\n}\r\n.grid-banner-0 .feature-item:last-child, .grid-banner-1 .feature-item:last-child{\r\n    grid-column: span 2 / span 2;\r\n}\r\n@media (min-width:600px){\r\n    .grid-banner-0 .feature-item:last-child, .grid-banner-1 .feature-item:last-child{\r\n      grid-column: span 1 / span 1;\r\n    }\r\n}\r\n.grid-banner-0 .feature-item img, .grid-banner-1 .feature-item img{\r\n    object-fit: contain;\r\n\r\n}\r\n.grid-banner-0 .feature-item:last-child, .grid-banner-1 .feature-item:last-child {\r\n    border-right: none;\r\n}\r\n\r\n.grid-banner-0 .feature-icon, .grid-banner-1 .feature-icon {\r\n    width: 50px;\r\n    height: 50px;\r\n    margin-bottom: 0.5rem;\r\n}\r\n\r\n.grid-banner-0 .feature-item h4, .grid-banner-1 .feature-item h4 {\r\n    font-size: 1rem;\r\n    font-weight: bold;\r\n    margin: 0.5rem 0;\r\n    color: #333;\r\n}\r\n\r\n.grid-banner-0 .feature-item p, .grid-banner-1 .feature-item p {\r\n    font-size: 0.875rem;\r\n    color: #666;\r\n    margin: 0;\r\n}\r\n\r\n/* Responsiveness */\r\n@media (max-width: 768px) {\r\n    .grid-banner-0 .features-container, .grid-banner-1 .features-container {\r\n        flex-direction: column;\r\n        gap: 1rem;\r\n    }\r\n\r\n    .grid-banner-0 .feature-item, .grid-banner-1 .feature-item {\r\n        border-right: none;\r\n        border-bottom: 1px solid #ddd;\r\n        padding: 1rem 0;\r\n    }\r\n\r\n   .grid-banner-0  .feature-item:last-child, .grid-banner-1  .feature-item:last-child {\r\n        border-bottom: none;\r\n    }\r\n}\r\n\r\n\u003C/style\u003E',
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:04.970Z",
            updatedAt: "2024-12-30T17:26:35.175Z",
        },
        {
            id: 76,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="grid-container" x-data="{empresa:JSON.parse(localStorage.getItem(\'empresa\'))}"\u003E\r\n    \u003Cdiv class="grid-item"\u003E\r\n        \u003Cimg data-image="1" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-1.webp`" width="500" height="500" title="New Wing Sunglasses" alt="New Wing Sunglasses"\u003E\r\n        \u003Cdiv class="content" \u003E\r\n            \u003Ch4 data-label="11"\u003ENEW WING SUNGLASSES\u003C/h4\u003E\r\n            \u003Cdiv class="text"\u003E\r\n                \u003Cp  data-label="12"\u003E"A SINGLE DAY AT SPORTWEAR. SALE \u003C/p\u003E \u003Cspan data-label="13"\u003EOFF 20%\u003C/span\u003E \u003Cp data-label="14"\u003EFOR ALL PRODUCTS"\u003C/p\u003E\r\n            \u003C/div\u003E\r\n            \u003Ca :href="$refs.link1?.textContent"  data-label="15" aria-label="view"\u003EView All Collection\u003C/a\u003E\r\n            \u003Cspan x-ref="link1" data-link="1" class="hidden"\u003E/shop\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\u003Cdiv class="grid-item"\u003E\r\n        \u003Cimg data-image="3" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-3.webp`"  width="500" height="500" title="New Trending" alt="New Trending"\u003E\r\n        \u003Cdiv class="content"\u003E\r\n            \u003Ch4 data-label="21"\u003ENEW TRENDING 2018\u003C/h4\u003E\r\n            \u003Ch3 data-label="22"\u003EJACKET & COATS 2018\u003C/h3\u003E\r\n            \u003Cdiv class="text"\u003E\r\n                \u003Cp data-label="23"\u003EUSE CODE \u003C/p\u003E \u003Cspan data-label="24"\u003E"SNEAKER"\u003C/span\u003E \u003Cp data-label="25"\u003ETO SHOP ONLINE. SALE OFF \u003C/p\u003E \u003Cspan data-label="26"\u003E30%\u003C/span\u003E \u003Cp data-label="27"\u003E FOR ALL PRODUCTS\u003C/p\u003E\r\n            \u003C/div\u003E\r\n            \u003Ca :href="$refs.link2?.textContent" data-label="28"  aria-label="view"\u003EView All Collection\u003C/a\u003E\r\n            \u003Cspan x-ref="link2" data-link="12" class="hidden"\u003E/shop\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="grid-item"\u003E\r\n        \u003Cimg data-image="4" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-4.webp`"  width="500" height="500" title="Air Jordan 32" alt="Air Jordan 32"\u003E\r\n        \u003Cdiv class="content"\u003E\r\n            \u003Ch4 data-label="31"\u003EAIR JORDAN 32\u003C/h4\u003E\r\n            \u003Cdiv class="text"\u003E\r\n                \u003Cp data-label="32"\u003EDISCOUNT \u003C/p\u003E \u003Cspan data-label="33"\u003E10%\u003C/span\u003E \u003Cp data-label="34"\u003EFOR ALL CUSTOMERS BOOKED BEFORE \u003C/p\u003E\u003Cspan data-label="35"\u003E02/14/2018\u003C/span\u003E\r\n            \u003C/div\u003E\r\n            \u003Ca :href="$refs.link3?.textContent" data-label="36"  aria-label="view"\u003EView All Collection\u003C/a\u003E\r\n            \u003Cspan x-ref="link3" data-link="3" class="hidden"\u003E/shop\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="grid-item"\u003E\r\n        \u003Cimg data-image="2" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-2.webp`"  width="500" height="500" title="Jacket & Coats" alt="Jacket & Coats"\u003E\r\n        \u003Cdiv class="content"\u003E\r\n            \u003Ch4 data-label="41"\u003ETOP SELLING PRODUCT 2018\u003C/h4\u003E\r\n            \u003Cp data-label="42"\u003ELOOK REAL. DEFINE YOURSELF. ADD INTENSITY. BE QUICK TO RECEIVE THE BEST DEALS OF THE STORE.\u003C/p\u003E\r\n            \u003Ca :href="$refs.link4?.textContent" data-label="43"  aria-label="view"\u003EView All Collection\u003C/a\u003E\r\n            \u003Cspan x-ref="link4" data-link="4" class="hidden"\u003E/shop\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n    \u003Cdiv class="grid-item"\u003E\r\n        \u003Cimg data-image="5" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-1-image-5.webp`"  width="500" height="500" title="Explore Campaign" alt="Explore Campaign"\u003E\r\n        \u003Cdiv class="content"\u003E\r\n            \u003Ch4 data-label="51"\u003EEXPLORE CAMPAIGN\u003C/h4\u003E\r\n            \u003Cp data-label="52"\u003ETHE HOLIDAY 2018 NIKE TECH FLEECE AEROLOFT COLLECTION WILL ENSURE YOU NEVER GET COLD\u003C/p\u003E\r\n            \u003Ca :href="$refs.link5?.textContent" data-label="53"  aria-label="view"\u003EView All Collection\u003C/a\u003E\r\n            \u003Cspan x-ref="link54" data-link="54" class="hidden"\u003E/shop\u003C/span\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n.grid-container {\r\n    display: grid;\r\n    grid-template-columns: repeat(1, 1fr);\r\n    gap: 1rem;\r\n    padding: 1rem;\r\n}\r\n\r\n@media (min-width: 800px) {\r\n    .grid-container {\r\n        grid-template-columns: repeat(3, 1fr);\r\n        grid-template-rows: repeat(2, 1fr);\r\n        height: 600px;\r\n    }\r\n}\r\n.grid-item {\r\n    position: relative;\r\n    overflow: hidden;\r\n    border-radius: 8px;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r\n    height: 350px;    \r\n    display: flex;\r\n    justify-content: end;\r\n}\r\n@media (min-width: 800px) {\r\n    .grid-item {\r\n        height: auto;\r\n    }\r\n}\r\n.grid-item:nth-child(2){\r\n    grid-column: span 1 / span 1;\r\n    grid-row: span 2 / span 2;\r\n}\r\n.grid-item img {\r\n    width: 100%;\r\n    height: auto;\r\n    display: block;\r\n    object-fit: cover;\r\n    height: 100%;\r\n    object-fit: cover;\r\n    position: absolute;\r\n    inset:0;\r\n}\r\n\r\n\r\n.grid-item .content{\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 0.5rem;\r\n    position: relative;\r\n    z-index: 1;\r\n    justify-content: center;\r\n    align-items: end;\r\n    height: 100%;\r\n    margin: 1rem;\r\n    width: 60%;\r\n}\r\n.grid-item .content h4 {\r\n    font-size: 1rem;\r\n    font-family: Font-Bold;\r\n    text-transform: uppercase;\r\n    color: white;\r\n    text-align: end;\r\n}\r\n\r\n.grid-item h3 {\r\n    font-size: 1.5rem;\r\n    font-family: Font-Black;\r\n    color:white;\r\n    margin-bottom: 1rem;\r\n    text-align:end;\r\n}\r\n\r\n.grid-item .content p {\r\n    font-size: 0.875rem;\r\n    color: white;\r\n    line-height: 1.5;\r\n    text-align: end;\r\n}\r\n\r\n.grid-item .content  span {\r\n    color: #EBE111; /* Highlight color */\r\n    font-weight: bold;\r\n    font-size: 0.875rem;\r\n}\r\n\r\n.grid-item .content .text{\r\n   text-wrap: nowrap;display: flex;align-items: center;flex-wrap: wrap;justify-content: end;gap: 0.3rem;\r\n}\r\n.grid-item a {\r\n   font-size: 0.875rem;\r\n    color: #fff;\r\n    text-transform: uppercase;\r\n    text-decoration: none;\r\n    transition: background 0.3s ease, color 0.3s ease;\r\n    border-bottom: 2px solid #fff;\r\n}\r\n\r\n.grid-item a:hover {\r\n    color: var(--primary);\r\n    border-bottom: 2px solid var(--primary);\r\n}\r\n\r\n\r\n\u003C/style\u003E',
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:04.970Z",
            updatedAt: "2025-01-03T21:08:32.617Z",
        },
        {
            id: 77,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="banner-custom-2" x-data="{empresa:JSON.parse(localStorage.getItem(\'empresa\'))}"\u003E\r\n    \u003Cbutton \r\n        type="button"\r\n        aria-label="go"\r\n        x-on:click="()=\u003E{const path = window.location.pathname;if(path ===\'/admin/banners\'){return;}window.location.href = $refs.url1.textContent;}"\r\n     class="item"\r\n     \u003E\r\n        \u003Cimg data-image="1" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-2-tennis.webp`" width="500" height="500" alt="tennis1" title="tennis1" /\u003E\r\n        \u003Cdiv class="item-content"\u003E\r\n            \u003Cspan data-label="11"\u003ENew Collection 2018\u003C/span\u003E\r\n            \u003Cdiv style="display: flex; flex-direction: column; align-items: start;"\u003E\r\n                \u003Ch3 data-label="12"\u003ESales UP TO 50% OFF\u003C/h3\u003E\r\n                \u003Cp data-label="13"\u003EFOR MAN 2018\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cspan x-ref="url1" class="hidden" data-label="url1"\u003E/shop\u003C/span\u003E\r\n    \u003C/button\u003E\r\n    \u003Cbutton type="button"  aria-label="go"\r\n        x-on:click="()=\u003E{const path = window.location.pathname;if(path ===\'/admin/banners\'){return;}window.location.href = $refs.url2.textContent;}"\r\n         class="item"\r\n    \u003E\r\n        \u003Cimg data-image="2" lazy="loading" :src="`/empresas/${empresa.slug}/images/files/banner-2-tennis-2.webp`" width="500" height="500" alt="tennis2" title="tennis1" /\u003E\r\n         \u003Cdiv class="item-content"\u003E\r\n            \u003Cspan  data-label="21"\u003ENew Collection 2018\u003C/span\u003E\r\n            \u003Cdiv  style="display: flex; flex-direction: column; align-items: start;"\u003E\r\n                \u003Ch3 data-label="22"\u003ESales UP TO 20% OFF\u003C/h3\u003E\r\n                \u003Cp data-label="23"\u003EFOR WOMEN 2018\u003C/p\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cspan x-ref="url2" class="hidden" data-label="url2"\u003E/shop\u003C/span\u003E\r\n    \u003C/button\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n    home-page .banner-custom-2, app .banner-custom-2 {\r\n        display: grid;\r\n        grid-template-columns: repeat(1, minmax(0, 1fr));\r\n        gap: 1rem;\r\n        margin: 0rem 0.5rem;\r\n    }\r\n\r\n    home-page .banner-custom-2 .item, app .banner-custom-2 .item{\r\n        width: 100%;\r\n        height: 400px; \r\n        border-radius: 8px;\r\n        position: relative;\r\n        overflow: hidden;\r\n        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r\n        display: flex;\r\n    }\r\n    home-page .banner-custom-2 .item .item-content,\r\n    app .banner-custom-2 .item .item-content {\r\n        display:flex;\r\n        flex-direction: column;\r\n        gap: 0.5rem;\r\n        position: relative;\r\n        z-index:1;\r\n        margin: 2rem;\r\n        align-items: start;\r\n    }\r\n    home-page .banner-custom-2 .item .item-content h3,\r\n    app .banner-custom-2 .item .item-content h3 {\r\n        font-size: 2rem;\r\n        font-family: Font-Black;\r\n    }\r\n    home-page .banner-custom-2 .item .item-content span,\r\n    app .banner-custom-2 .item .item-content span {\r\n        font-size: 1rem;\r\n        font-family: Font-Bold;\r\n    }\r\n    home-page .banner-custom-2 .item .item-content p,\r\n    app .banner-custom-2 .item .item-content p {\r\n        font-size: 1rem;\r\n        font-family: Font-Bold;\r\n        padding-bottom: 0.5rem;\r\n        border-bottom: 2px solid var(--primary);\r\n        display: inline-block;\r\n    }\r\n\r\n    home-page .banner-custom-2 img,\r\n    app .banner-custom-2 img {\r\n        width: 100%;\r\n        height: 100%; \r\n        object-fit: cover;\r\n        overflow: hidden;\r\n        position: absolute;\r\n        inset:0;\r\n    }\r\n\r\n    @media (min-width: 700px) {\r\n        home-page .banner-custom-2, app .banner-custom-2\r\n        {\r\n            grid-template-columns: repeat(2, minmax(0, 1fr));\r\n            height: auto; \r\n        }\r\n    }\r\n\u003C/style\u003E',
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:04.970Z",
            updatedAt: "2025-01-03T17:03:49.596Z",
        },
        {
            id: 78,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="hero-banner" :style="`background: url(\'/empresas/${empresa.slug}/images/files/home1-large-banner.webp\') no-repeat center center/cover;`" x-data="{empresa:JSON.parse(localStorage.getItem(\'empresa\'))}"\u003E\r\n  \u003Cdiv class="banner-content"\u003E\r\n    \u003Ch4 data-label="11"\u003ENew Arrivals 2021\u003C/h4\u003E\r\n    \u003Ch2 data-label="12"\u003EJACKET SPORTWEAR\u003C/h2\u003E\r\n    \u003Cp data-label="13"\u003ELook real. Define yourself. Add intensity. Be quick to receive the best deals of the store.\u003C/p\u003E\r\n    \u003Ca :href="$refs.link.textContent" class="btn" aria-label="view" data-label="14"\u003EView Collection\u003C/a\u003E\r\n    \u003Cspan x-ref="link" class="hidden" data-link="1"\u003E/Shop\u003C/span\u003E\r\n  \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n.grid-banner-3, shop-page .grid-banner-2{\r\n  max-width: none !important;\r\n}\r\n.grid-banner-3 .hero-banner, .grid-banner-2 .hero-banner {\r\n  position: relative;\r\n  height: 500px;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n\r\n.grid-banner-3 .banner-content, .grid-banner-2 .banner-content {\r\n  text-align: center;\r\n  padding: 20px 40px;\r\n  border-radius: 10px;\r\n}\r\n\r\n.grid-banner-3 .banner-content h4, .grid-banner-2 .banner-content h4  {\r\n    font-size: 1rem;\r\n    margin-bottom: 1rem;\r\n    text-transform: uppercase;\r\n    color: #ffffff;\r\n    font-family: \'Font-Regular\';\r\n}\r\n@media (min-width: 700px){\r\n  .grid-banner-3 .banner-content h2, .grid-banner-2 .banner-content h4 {\r\n    font-size: 1.5rem;\r\n  }\r\n}\r\n\r\n.grid-banner-3 .banner-content h2, .grid-banner-2 .banner-content h2 {\r\n    font-size: 2.5rem;\r\n    margin: 0.5rem 0;\r\n    font-weight: bold;\r\n    text-transform: uppercase;\r\n    color: white;\r\n    font-family: \'Font-Bold\';\r\n}\r\n\r\n@media (min-width: 700px){\r\n  .grid-banner-3 .banner-content h2, .grid-banner-2 .banner-content h2 {\r\n      font-size: 4rem;\r\n  }\r\n}\r\n\r\n.grid-banner-3 .banner-content p, .grid-banner-2 .banner-content p {\r\n    font-size: 1rem;\r\n    margin: 1rem 0;\r\n    line-height: 1.5;\r\n    max-width: 600px;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    color: white;\r\n    font-family: \'Font-Regular\';\r\n}\r\n\r\n.grid-banner-3 .banner-content .btn, .grid-banner-2 .banner-content .btn  {\r\n    display: inline-block;\r\n    margin-top: 1rem;\r\n    padding: 10px 20px;\r\n    font-size: 0.9rem;\r\n    text-transform: uppercase;\r\n    text-decoration: none;\r\n    color: white;\r\n    border-radius: 5px;\r\n    transition: transform 0.3s, background-color 0.3s;\r\n    border: 1px solid white;\r\n    font-family: \'Font-Regular\';\r\n}\r\n\r\n.grid-banner-3 .banner-content .btn:hover, .grid-banner-2 .banner-content .btn:hover {\r\n  background-color: var(--primary);\r\n}\r\n\r\n\u003C/style\u003E',
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:04.970Z",
            updatedAt: "2025-01-03T17:05:40.604Z",
        },
        {
            id: 79,
            title: null,
            enabled: true,
            html: '\u003Cdiv class="slider" x-data="{\r\n    brands: document.querySelector(\'home-page\')||document.querySelector(\'about-page\') ? JSON.parse((document.querySelector(\'home-page\')||document.querySelector(\'about-page\')).getAttribute(\':header\') || \'{}\').brands :[],\r\n    empresa: JSON.parse(localStorage.getItem(\'empresa\')),\r\n    slidesToShow: 3,\r\n    initializeCarousel() {\r\n        const track = this.$refs.sliderTrack;\r\n        this.brands.forEach(slide =\u003E {\r\n            this.brands.push(slide); \r\n        });\r\n        track.style.animation = \'scroll 15s linear infinite\'; \r\n        this.updateSlidesToShow();\r\n        window.addEventListener(\'resize\', this.updateSlidesToShow.bind(this));\r\n    },\r\n     updateSlidesToShow() {\r\n      console.log(window.innerWidth);\r\n        if (window.innerWidth \u003C= 500) {\r\n            this.slidesToShow = 3;\r\n        } else if (window.innerWidth \u003E 500 && window.innerWidth \u003C= 700) {\r\n            this.slidesToShow = 5;\r\n        } else {\r\n            this.slidesToShow = 6;\r\n        }\r\n        console.log(this.slidesToShow);\r\n    },\r\n    \r\n}" x-init="initializeCarousel()"  \u003E\r\n  \u003Cdiv class="slider-track" x-ref="sliderTrack"\u003E\r\n    \u003C!-- Renderiza las marcas duplicadas --\u003E\r\n    \u003Ctemplate x-for="(brand, index) in brands" :key="index"\u003E\r\n        \u003Cdiv class="flex justify-center items-center grayscale slide" :style="`width: calc(100% / ${slidesToShow} - 10px);height: 100px;`"\u003E\r\n            \u003Cimg width="100" height="100" class="object-contain" :src="`/empresas/${empresa.slug}/${brand.image.filter((b) =\u003E b.dimension === 500)[0].file}`" :alt="brand.name" :title="brand.name"/\u003E\r\n        \u003C/div\u003E\r\n    \u003C/template\u003E\r\n  \u003C/div\u003E\r\n\u003C/div\u003E\r\n\u003Cstyle\u003E\r\n.slider {\r\n    overflow: hidden;\r\n    width: 100%;\r\n    position: relative;\r\n    padding: 3rem 0rem;\r\n}\r\n\r\n.slider-track {\r\n  display: flex;\r\n  animation: scroll 15s linear infinite; \r\n}\r\n\r\n.slide {\r\n  flex:   0 0 auto;\r\n    margin: 0rem 0.5rem;    \r\n  text-align: center;\r\n  padding: 20px;\r\n  border-radius: 5px;\r\n  font-size: 18px;\r\n}\r\n@media (min-width: 700px){\r\n  .slide {\r\n    margin: 0rem 2rem;    \r\n  }\r\n}\r\n\r\n@keyframes scroll {\r\n  from {\r\n    transform: translateX(0);\r\n  }\r\n  to {\r\n    transform: translateX(-50%); /* Ajusta según el tamaño total */\r\n  }\r\n}\r\n\u003C/style\u003E',
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:04.970Z",
            updatedAt: "2025-01-03T14:30:05.032Z",
        },
    ],
    files: [
        {
            id: 82,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-0-icon-1.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T08:52:13.523Z",
            updatedAt: "2024-12-30T08:52:13.523Z",
        },
        {
            id: 83,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-0-icon-2.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T08:53:24.728Z",
            updatedAt: "2024-12-30T08:53:24.728Z",
        },
        {
            id: 84,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-0-icon-3.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T08:53:45.513Z",
            updatedAt: "2024-12-30T08:53:45.513Z",
        },
        {
            id: 85,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-0-icon-4.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T08:53:55.604Z",
            updatedAt: "2024-12-30T08:53:55.604Z",
        },
        {
            id: 86,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-0-icon-5.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T08:54:09.103Z",
            updatedAt: "2024-12-30T08:54:09.103Z",
        },
        {
            id: 87,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-1-image-1.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T09:18:44.784Z",
            updatedAt: "2024-12-30T09:18:44.784Z",
        },
        {
            id: 88,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-1-image-2.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T09:21:28.968Z",
            updatedAt: "2024-12-30T09:21:28.968Z",
        },
        {
            id: 89,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-1-image-3.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T09:27:58.020Z",
            updatedAt: "2024-12-30T09:27:58.020Z",
        },
        {
            id: 90,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-1-image-4.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T09:30:19.145Z",
            updatedAt: "2024-12-30T09:30:19.145Z",
        },
        {
            id: 91,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-1-image-5.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T09:31:59.706Z",
            updatedAt: "2024-12-30T09:31:59.706Z",
        },
        {
            id: 92,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/news-promotion-1.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T16:04:51.993Z",
            updatedAt: "2024-12-30T16:04:51.993Z",
        },
        {
            id: 93,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/home1-large-banner.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T17:51:09.993Z",
            updatedAt: "2024-12-30T17:51:09.993Z",
        },
        {
            id: 94,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/about-banner-0-1.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T18:00:06.181Z",
            updatedAt: "2024-12-30T18:00:06.181Z",
        },
        {
            id: 95,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/about-banner-0-2.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T18:00:43.422Z",
            updatedAt: "2024-12-30T18:00:43.422Z",
        },
        {
            id: 96,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-2-tennis.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-31T02:39:27.140Z",
            updatedAt: "2024-12-31T02:39:27.140Z",
        },
        {
            id: 97,
            file: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/files/banner-2-tennis-2.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-31T02:39:36.467Z",
            updatedAt: "2024-12-31T02:39:36.467Z",
        },
    ],
    pages: [
        {
            id: 38,
            title: "Contacto",
            slug: "contacto",
            description:
                "En demo-10, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!",
            icon: "\u003Ci class='far fa-envelope-open'\u003E\u003C/i\u003E",
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:05.014Z",
            updatedAt: "2024-12-31T03:53:03.402Z",
            grid_banner_pages: [
                {
                    id: 183,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.048Z",
                    updatedAt: "2024-12-31T06:48:16.169Z",
                    page_id: 38,
                    grid_banner_id: null,
                },
                {
                    id: 184,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.048Z",
                    updatedAt: "2024-12-31T06:48:21.731Z",
                    page_id: 38,
                    grid_banner_id: null,
                },
                {
                    id: 185,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.048Z",
                    updatedAt: "2024-12-31T06:48:26.144Z",
                    page_id: 38,
                    grid_banner_id: null,
                },
                {
                    id: 181,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.048Z",
                    updatedAt: "2024-12-31T06:48:05.261Z",
                    page_id: 38,
                    grid_banner_id: null,
                },
                {
                    id: 182,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.048Z",
                    updatedAt: "2024-12-31T06:48:10.036Z",
                    page_id: 38,
                    grid_banner_id: null,
                },
            ],
        },
        {
            id: 36,
            title: "Nosotros",
            slug: "nosotros",
            description: "Bienvenidos a demo-10",
            icon: "\u003Ci class='far fa-users'\u003E\u003C/i\u003E",
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:05.013Z",
            updatedAt: "2024-12-31T03:52:48.381Z",
            grid_banner_pages: [
                {
                    id: 178,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.031Z",
                    updatedAt: "2024-12-31T06:48:37.017Z",
                    page_id: 36,
                    grid_banner_id: null,
                },
                {
                    id: 179,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.031Z",
                    updatedAt: "2024-12-31T06:48:46.268Z",
                    page_id: 36,
                    grid_banner_id: null,
                },
                {
                    id: 180,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.031Z",
                    updatedAt: "2024-12-31T06:48:51.497Z",
                    page_id: 36,
                    grid_banner_id: null,
                },
                {
                    id: 177,
                    title: null,
                    html: null,
                    enabled: true,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.031Z",
                    updatedAt: "2024-12-30T17:28:37.217Z",
                    page_id: 36,
                    grid_banner_id: 79,
                },
                {
                    id: 176,
                    title: null,
                    html: '  \u003Cdiv class="pet-store" x-data="{empresa:JSON.parse(localStorage.getItem(\'empresa\'))}"\u003E\r\n        \u003Cdiv class="content"\u003E\r\n            \u003Ch4 data-label="1"\u003E¿Quienes Somos?\u003C/h4\u003E\r\n            \u003Ch1 data-label="2"\u003EWe are the solution to making your pet happy.\u003C/h1\u003E\r\n            \u003Cp data-label="3"\u003E\r\n                Sed posuere sollicitudin sociosqu laoreet tempus ridiculus maximus ultricies. \r\n                Quisque eu donec auctor phasellus nibh. Ut urna dictum parturient penatibus habitasse condimentum.\r\n            \u003C/p\u003E\r\n            \u003Cdiv class="features"\u003E\r\n                \u003Cul\u003E\r\n                    \u003Cli data-label="4"\u003EZapatillas\u003C/li\u003E\r\n                    \u003Cli data-label="5"\u003EShorts\u003C/li\u003E\r\n                    \u003Cli data-label="6"\u003EPolos\u003C/li\u003E\r\n                    \u003Cli data-label="7"\u003EBowls & Feeders\u003C/li\u003E\r\n                \u003C/ul\u003E\r\n                \u003Cul\u003E\r\n                    \u003Cli data-label="8"\u003EShampoos & Conditioners\u003C/li\u003E\r\n                    \u003Cli data-label="9"\u003EBrushes & Combs\u003C/li\u003E\r\n                    \u003Cli data-label="10"\u003EVitamins & Supplements\u003C/li\u003E\r\n                    \u003Cli data-label="11"\u003ECrates & Kennels\u003C/li\u003E\r\n                \u003C/ul\u003E\r\n            \u003C/div\u003E\r\n            \u003Cdiv class="buttons"\u003E\r\n                \u003Ca href="/" class="btn discover" data-label="12"\u003EDiscover more\u003C/a\u003E\r\n                \u003Ca href="/shop" class="btn shop" data-label="14"\u003EShop Now!\u003C/a\u003E\r\n            \u003C/div\u003E\r\n        \u003C/div\u003E\r\n        \u003Cdiv class="images"\u003E\r\n            \u003Cimg data-image="1" loading="lazy" :src="`/empresas/${empresa.slug}/images/files/about-banner-0-1.webp`" width="500" height="500" alt="Dog and Owner" title="Dog and Owner" class="main-image"\u003E\r\n            \u003Cimg data-image="2" loading="lazy" :src="`/empresas/${empresa.slug}/images/files/about-banner-0-2.webp`" width="500" height="500" alt="Family Shopping" title="Family Shopping" class="secondary-image"\u003E\r\n        \u003C/div\u003E\r\n    \u003C/div\u003E\r\n\u003Cstyle\u003E\r\n.grid-banner-0 .pet-store {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    flex-direction: column;\r\n    padding: 1rem;\r\n    max-width: 1200px;\r\n    margin: auto;\r\n}\r\n@media (min-width: 700px){\r\n   .grid-banner-0 .pet-store {\r\n        padding: 50px;\r\n        flex-direction: row;\r\n   } \r\n}\r\n\r\n.grid-banner-0  .content {\r\n    max-width: 100%;\r\n}\r\n@media (min-width: 700px){\r\n   .grid-banner-0 .content {\r\n        max-width: 50%;\r\n   } \r\n}\r\n.grid-banner-0  .content h4 {\r\n    color: var(--secondary-color);\r\n    font-weight: bold;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.grid-banner-0  .content h1 {\r\n    font-size: 2.5rem;\r\n    color: #000;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.grid-banner-0  .content p {\r\n    color: var(--color-text-secondary);\r\n    line-height: 1.6;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.grid-banner-0  .features {\r\n    display: flex;\r\n    gap: 20px;\r\n    margin-bottom: 30px;\r\n}\r\n\r\n.grid-banner-0  .features ul {\r\n    list-style: none;\r\n    padding: 0;\r\n}\r\n\r\n.grid-banner-0 .features li {\r\n    color: var(--color-text-secondary);\r\n    font-weight: bold;\r\n    margin-bottom: 10px;\r\n    position: relative;\r\n}\r\n\r\n.grid-banner-0 .features li::before {\r\n    content: "✔";\r\n    color: var(--secondary-color);\r\n    margin-right: 10px;\r\n}\r\n\r\n.grid-banner-0 .buttons {\r\n    display: flex;\r\n    gap: 20px;\r\n}\r\n\r\n.grid-banner-0 .btn {\r\n    padding: 10px 20px;\r\n    border: none;\r\n    border-radius: 20px;\r\n    cursor: pointer;\r\n    font-size: 1rem;\r\n    font-weight: bold;\r\n}\r\n\r\n.grid-banner-0 .btn.discover {\r\n    background-color:var(--primary);\r\n    color: white;\r\n}\r\n\r\n.grid-banner-0 .btn.shop {\r\n    background-color: white;\r\n    color: var(--primary);\r\n    border: 2px solid var(--primary);\r\n}\r\n.grid-banner-0 .btn.shop:hover {\r\n    background-color: var(--primary);\r\n    color:white;\r\n}\r\n\r\n.grid-banner-0 .images {\r\n    max-width: 100%;\r\n    position: relative;\r\n    margin-top: 1rem;\r\n}\r\n@media (min-width: 700px){\r\n    .grid-banner-0 .images {\r\n        max-width: 50%;\r\n        margin-top: 0rem;\r\n    }\r\n}\r\n\r\n.grid-banner-0 .main-image {\r\n    width: 100%;\r\n    border-radius: 10px;\r\n    border: 6px solid white;\r\n}\r\n\r\n.grid-banner-0 .secondary-image {\r\n    position: absolute;\r\n    bottom: -20px;\r\n    left: -20px;\r\n    width: 50%;\r\n    border-radius: 10px;\r\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\r\n    border: 6px solid white;\r\n}\r\n\r\n\u003C/style\u003E',
                    enabled: true,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.031Z",
                    updatedAt: "2024-12-30T18:06:47.076Z",
                    page_id: 36,
                    grid_banner_id: null,
                },
            ],
        },
        {
            id: 39,
            title: "Shop",
            slug: "shop",
            description: "Bienvenidos a demo-10",
            icon: "\u003Ci class='far fa-store'\u003E\u003C/i\u003E",
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:05.014Z",
            updatedAt: "2024-12-31T03:53:11.265Z",
            grid_banner_pages: [
                {
                    id: 191,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.074Z",
                    updatedAt: "2024-12-31T06:49:36.860Z",
                    page_id: 39,
                    grid_banner_id: null,
                },
                {
                    id: 194,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.074Z",
                    updatedAt: "2024-12-31T06:49:42.533Z",
                    page_id: 39,
                    grid_banner_id: null,
                },
                {
                    id: 195,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.074Z",
                    updatedAt: "2024-12-31T06:49:46.796Z",
                    page_id: 39,
                    grid_banner_id: null,
                },
                {
                    id: 192,
                    title: null,
                    html: null,
                    enabled: true,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.074Z",
                    updatedAt: "2024-12-30T17:24:01.167Z",
                    page_id: 39,
                    grid_banner_id: 75,
                },
                {
                    id: 193,
                    title: null,
                    html: null,
                    enabled: true,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.074Z",
                    updatedAt: "2024-12-30T17:24:31.537Z",
                    page_id: 39,
                    grid_banner_id: 78,
                },
            ],
        },
        {
            id: 37,
            title: "Servicios",
            slug: "servicios",
            description:
                "En demo-10, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!",
            icon: "\u003Ci class='far fa-building'\u003E\u003C/i\u003E",
            empresa_id: 16,
            createdAt: "2024-12-30T07:24:05.014Z",
            updatedAt: "2024-12-31T03:52:58.311Z",
            grid_banner_pages: [
                {
                    id: 186,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.046Z",
                    updatedAt: "2024-12-31T06:46:17.219Z",
                    page_id: 37,
                    grid_banner_id: null,
                },
                {
                    id: 187,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.046Z",
                    updatedAt: "2024-12-31T06:47:04.163Z",
                    page_id: 37,
                    grid_banner_id: null,
                },
                {
                    id: 188,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.046Z",
                    updatedAt: "2024-12-31T06:47:34.930Z",
                    page_id: 37,
                    grid_banner_id: null,
                },
                {
                    id: 189,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.046Z",
                    updatedAt: "2024-12-31T06:47:40.931Z",
                    page_id: 37,
                    grid_banner_id: null,
                },
                {
                    id: 190,
                    title: null,
                    html: null,
                    enabled: false,
                    empresa_id: 16,
                    createdAt: "2024-12-30T07:24:05.046Z",
                    updatedAt: "2024-12-31T06:47:46.482Z",
                    page_id: 37,
                    grid_banner_id: null,
                },
            ],
        },
    ],
    backgrounds: [
        {
            id: 17,
            html: '\u003Cdiv class="banner-custom" x-data="{}"\u003E\r\n    \u003Cspan class="fade-in" data-label="1"\u003EBIG SALE UP TO 20% OFF\u003C/span\u003E\r\n    \u003Ch3 class="slide-in-up" data-label="2"\u003ENIKEBLACK\u003C/h3\u003E\r\n    \u003Cp  class="slide-in-up delay-1" data-label="3"\u003EHistory month collection 2019\u003C/p\u003E\r\n    \u003Ca :href="$refs.link.textContent" class="slide-in-up delay-2" aria-label="shop" data-label="4"\u003EShop Now\u003C/a\u003E\r\n    \u003Cspan x-ref="link" class="hidden" data-link="url"\u003E/shop\u003C/span\u003E\r\n\u003C/div\u003E',
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/e990fe3b-9e40-40a1-8834-b166b33c7e537i9c2x100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/93d5f799-d00b-4c95-adcf-e396928824d67i9c5x1600.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T07:30:26.604Z",
            updatedAt: "2025-01-03T14:26:37.515Z",
        },
        {
            id: 18,
            html: '\u003Cdiv class="banner-custom" x-data="{}"\u003E\r\n    \u003Cspan class="fade-in" data-label="1"\u003ETRENDING PRODUCT 2021\u003C/span\u003E\r\n    \u003Ch3 class="slide-in-up" data-label="2"\u003ENEW LOOKBOOK\u003C/h3\u003E\r\n    \u003Cp  class="slide-in-up delay-1" data-label="3"\u003ESneaker store | clothing & sport equipment\u003C/p\u003E\r\n    \u003Ca :href="$refs.link.textContent" class="slide-in-up delay-2" aria-label="shop" data-label="4"\u003EShop Now\u003C/a\u003E\r\n    \u003Cspan x-ref="link" class="hidden" data-link="url"\u003E/shop\u003C/span\u003E\r\n\u003C/div\u003E',
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/3e14f31b-62ef-4a9a-95bf-e1b196d15bd07j60kx100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/50471fb5-cda7-48f0-8e7a-dba9b3fe39517j60lx1600.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T07:30:55.895Z",
            updatedAt: "2025-01-03T14:27:03.608Z",
        },
        {
            id: 16,
            html: '\u003Cdiv class="banner-custom" x-data="{}"\u003E\r\n    \u003Cspan class="fade-in" data-label="1"\u003ETOP JACKET OF SNEAKER\u003C/span\u003E\r\n    \u003Ch3 class="slide-in-up" data-label="2"\u003ENEW JACKETS\u003C/h3\u003E\r\n    \u003Cp  class="slide-in-up delay-1" data-label="3"\u003EAurora shell jacket is ready for any adventure\u003C/p\u003E\r\n    \u003Ca :href="$refs.link.textContent" class="slide-in-up delay-2" aria-label="shop" data-label="4"\u003EShop Now\u003C/a\u003E\r\n    \u003Cspan x-ref="link" class="hidden" data-link="url"\u003E/shop\u003C/span\u003E\r\n\u003C/div\u003E',
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/0f5835cc-ec8e-4662-80a5-a55ab02a5b397hlc8x100.webp",
                },
                {
                    dimension: 1600,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/background/712d3d56-5835-4334-83a6-902515a659eb7hlchx1600.webp",
                },
            ],
            empresa_id: 16,
            createdAt: "2024-12-30T07:30:06.203Z",
            updatedAt: "2025-01-03T14:28:00.359Z",
        },
    ],
    categories: [
        {
            id: 27,
            category_code: "CAT-000003",
            name: "Shorts Deportivos",
            isService: false,
            image: [
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/categories/shorts-deportivoskk72lx100.webp",
                    dimension: 100,
                },
                {
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/categories/shorts-deportivoskk72rx800.webp",
                    dimension: 800,
                },
            ],
            wallpaper: null,
            icon: null,
            slug: "shorts-deportivos",
            empresa_id: 16,
            createdAt: "2024-12-30T11:13:48.591Z",
            updatedAt: "2024-12-30T11:18:42.060Z",
            subcategories: [],
            productsNormals: [
                {
                    price: 1554,
                    discount: 2,
                    id: 89,
                    product_code: "PROD-000007",
                    name: "Man swimwear V2",
                    url: null,
                    description:
                        "Descripción\nMan-swimwear-V2 es la elección perfecta para quienes buscan ropa deportiva de alta calidad y estilo. Diseñada para ofrecer comodidad y libertad de movimiento, esta línea de trajes de baño es ideal para nadadores y amantes de los deportes acuáticos. Con tejidos que ofrecen resistencia al cloro y secado rápido, te sentirás fresco y ligero en el agua.\n\nCaracterísticas Principales\nTejido de secado rápido que proporciona comodidad durante todo el día.Estilo moderno y diseño atractivo para un look elegante en la piscina o la playa.Protección UV para disfrutar del sol sin preocupaciones.C",
                    characteristics: [
                        {
                            name: "Modelo",
                            value: "Man-swimwear-V2",
                        },
                        {
                            name: "Tipo",
                            value: "Bañador",
                        },
                        {
                            name: "Material",
                            value: "Poliéster con spandex",
                        },
                        {
                            name: "Estilo",
                            value: "Moderno",
                        },
                        {
                            name: "Diseño",
                            value: "Estampado tropical",
                        },
                        {
                            name: "Cintura",
                            value: "Elástica",
                        },
                        {
                            name: "Forro",
                            value: "Completamente forrado",
                        },
                        {
                            name: "Secado",
                            value: "Rápido",
                        },
                        {
                            name: "Tamaño",
                            value: "S, M, L, XL",
                        },
                        {
                            name: "Uso",
                            value: "Nadar y recreativo",
                        },
                        {
                            name: "Características adicionales",
                            value: "Bolsillo trasero con velcro",
                        },
                        {
                            name: "Recomendación de cuidado",
                            value: "Lavar a mano",
                        },
                        {
                            name: "Origen del material",
                            value: "Sostenible",
                        },
                        {
                            name: "Género",
                            value: "Hombre",
                        },
                        {
                            name: "Ajuste",
                            value: "Ajuste cómodo",
                        },
                        {
                            name: "Ocasión",
                            value: "Playa y piscina",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/man-swimwear-v2nleafx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/man-swimwear-v2nleakx500.webp",
                        },
                    ],
                    slug: "man-swimwear-v2",
                    category_id: 27,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T12:11:47.023Z",
                    updatedAt: "2024-12-30T12:11:47.023Z",
                    category: {
                        name: "Shorts Deportivos",
                        slug: "shorts-deportivos",
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
                            id: 101,
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            product_normal_id: 89,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:11:47.062Z",
                            updatedAt: "2024-12-30T12:11:47.062Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 101,
                                        feature_id: 1,
                                        empresa_id: 16,
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
                    price: 6665,
                    discount: 5,
                    id: 91,
                    product_code: "PROD-000009",
                    name: "Man swimwear",
                    url: null,
                    description:
                        "Descripción\nLa ropa deportiva de Man-swimwear está diseñada para proporcionar comodidad y funcionalidad. Fabricada con materiales de alta calidad, esta colección está pensada para acompañarte en tus actividades acuáticas y deportivas, ofreciendo un ajuste perfecto y estilos modernos que se adaptan a tu personalidad.\n\nCaracterísticas Principales\nMateriales de secado rápido que garantizan confort.Diseños ergonómicos que se ajustan al cuerpo sin restringir el movimiento.Resistencia al cloro y a la sal, ideal para piscina y mar.Variedad de estilos y colores para todos los gustos.Tecnología de prot",
                    characteristics: [
                        {
                            name: "Material",
                            value: "Poliéster de secado rápido",
                        },
                        {
                            name: "Estilo",
                            value: "Bañador de corte ajustado",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Variantes brillantes y neutras",
                        },
                        {
                            name: "Tamaño",
                            value: "Desde S hasta XXL",
                        },
                        {
                            name: "Uso recomendado",
                            value: "Natación y actividades acuáticas",
                        },
                        {
                            name: "Cintura",
                            value: "Cintura elástica con cordón ajustable",
                        },
                        {
                            name: "Forro",
                            value: "Forro interior suave para mayor comodidad",
                        },
                        {
                            name: "Secado",
                            value: "Tecnología de secado rápido",
                        },
                        {
                            name: "Diseño",
                            value: "Con estampados modernos y gráficos",
                        },
                        {
                            name: "Protección UV",
                            value: "Protección contra los rayos UV",
                        },
                        {
                            name: "Bolsillos",
                            value: "Bolsillos laterales con malla",
                        },
                        {
                            name: "Género",
                            value: "Masculino",
                        },
                        {
                            name: "Estampados",
                            value: "De rayas, florales o sólidos",
                        },
                        {
                            name: "Cuidado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "Uso versátil",
                            value: "Ideal para playa y piscina",
                        },
                        {
                            name: "Ajuste",
                            value: "Ajuste cómodo y flexible",
                        },
                        {
                            name: "Estilo de pierna",
                            value: "Pierna corta o media",
                        },
                        {
                            name: "Sostenibilidad",
                            value: "Opciones fabricadas con materiales reciclables",
                        },
                        {
                            name: "Durabilidad",
                            value: "Resistente a cloro y sal",
                        },
                        {
                            name: "Temporada",
                            value: "Primavera-Verano",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/man-swimwearnppftx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/man-swimwearnppg0x500.webp",
                        },
                    ],
                    slug: "man-swimwear",
                    category_id: 27,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T12:14:09.514Z",
                    updatedAt: "2024-12-30T12:14:09.514Z",
                    category: {
                        name: "Shorts Deportivos",
                        slug: "shorts-deportivos",
                        icon: null,
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [29],
                        },
                    ],
                    variants: [
                        {
                            id: 103,
                            sku: null,
                            stock: 2,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 91,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:14:09.542Z",
                            updatedAt: "2024-12-30T12:14:25.834Z",
                            features: [
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 103,
                                        feature_id: 29,
                                        empresa_id: 16,
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
                    price: 343,
                    discount: 0,
                    id: 94,
                    product_code: "PROD-000012",
                    name: "Shorts",
                    url: null,
                    description:
                        "Descripción\nLos shorts de ropa deportiva están diseñados para proporcionar comodidad y libertad de movimiento durante cualquier actividad física. Confeccionados con materiales ligeros y transpirables, estos shorts son ideales para correr, entrenar en el gimnasio o disfrutar de un día en el parque. Su estilo moderno y versátil permite combinarlos fácilmente con diversas prendas deportivas.\n\nCaracterísticas Principales\nMaterial: Tejido ligero y de secado rápidoCintura elástica con cordón ajustableBolsillos laterales para mayor funcionalidadDiseño cómodo que permite una amplia gama de movimientos",
                    characteristics: [
                        {
                            name: "Tipo de prenda",
                            value: "Pantalón corto",
                        },
                        {
                            name: "Materiales comunes",
                            value: "Algodón, poliéster, mezclilla, lycra",
                        },
                        {
                            name: "Estilos",
                            value: "Casual, deportivo, elegante, de baño",
                        },
                        {
                            name: "Longitud",
                            value: "Por encima de la rodilla",
                        },
                        {
                            name: "Cintura",
                            value: "Elástica o con botones",
                        },
                        {
                            name: "Uso",
                            value: "Verano, actividades al aire libre, deportes",
                        },
                        {
                            name: "Tamaño",
                            value: "Varía desde XS hasta XXL",
                        },
                        {
                            name: "Bolsillos",
                            value: "Bonitos, prácticos o inexistentes",
                        },
                        {
                            name: "Colores",
                            value: "Sólidos, estampados, colores brillantes",
                        },
                        {
                            name: "Género",
                            value: "Masculino, femenino, unisex",
                        },
                        {
                            name: "Cuidado",
                            value: "Lavado a máquina, secado al aire",
                        },
                        {
                            name: "Estampados populares",
                            value: "Rayas, flores, camuflaje",
                        },
                        {
                            name: "Detalles adicionales",
                            value: "Cintura ajustable, cremalleras, cordones",
                        },
                        {
                            name: "Temporada",
                            value: "Primavera-verano",
                        },
                        {
                            name: "Influencias culturales",
                            value: "Surf, skate, athleisure",
                        },
                        {
                            name: "Ajuste",
                            value: "Corte recto, ajustado o suelto",
                        },
                        {
                            name: "Origen",
                            value: "Popularizado en la moda occidental",
                        },
                        {
                            name: "Accesorios relacionados",
                            value: "Cinturones, sandalias, camisetas",
                        },
                        {
                            name: "Comfort",
                            value: "Diseñados para libertad de movimiento",
                        },
                        {
                            name: "Sostenibilidad",
                            value: "Opciones de materiales reciclados disponibles",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/shorts5jkngx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/shorts5jknkx500.webp",
                        },
                    ],
                    slug: "shorts",
                    category_id: 27,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T16:15:28.125Z",
                    updatedAt: "2024-12-30T16:15:28.125Z",
                    category: {
                        name: "Shorts Deportivos",
                        slug: "shorts-deportivos",
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
                            id: 106,
                            sku: null,
                            stock: 3,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 94,
                            empresa_id: 16,
                            createdAt: "2024-12-30T16:15:28.162Z",
                            updatedAt: "2024-12-30T16:15:38.798Z",
                            features: [
                                {
                                    id: 14,
                                    value: "#000000",
                                    description: "Negro",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.537Z",
                                    updatedAt: "2024-11-28T10:16:44.537Z",
                                    VariantsFeatures: {
                                        variant_id: 106,
                                        feature_id: 14,
                                        empresa_id: 16,
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
                    price: 343,
                    discount: 0,
                    id: 95,
                    product_code: "PROD-000013",
                    name: "Short Nik",
                    url: null,
                    description: null,
                    characteristics: [],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/short-nik5lmbix100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/short-nik5lmbjx500.webp",
                        },
                    ],
                    slug: "short-nik",
                    category_id: 27,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T16:16:35.342Z",
                    updatedAt: "2024-12-30T16:16:35.342Z",
                    category: {
                        name: "Shorts Deportivos",
                        slug: "shorts-deportivos",
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
                            id: 107,
                            sku: null,
                            stock: 4,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 95,
                            empresa_id: 16,
                            createdAt: "2024-12-30T16:16:35.371Z",
                            updatedAt: "2024-12-30T16:16:53.747Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 107,
                                        feature_id: 1,
                                        empresa_id: 16,
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
                    price: 3334,
                    discount: 0,
                    id: 96,
                    product_code: "PROD-000014",
                    name: "Short tiny",
                    url: null,
                    description:
                        "Descripción\nLa ropa deportiva de Shor-tiny está diseñada para brindar comodidad y estilo en cada actividad física. Fabricada con materiales de alta calidad, esta línea de ropa ofrece transpirabilidad y flexibilidad, ideal para entrenamientos intensos o actividades al aire libre. Con un enfoque en la funcionalidad, cada prenda se ajusta a las necesidades del deportista moderno.\n\nCaracterísticas Principales\nMateriales transpirables y de secado rápido.Corte ergonómico que favorece el movimiento.Diseños modernos y variados para todos los gustos.Resistencia al desgaste y facilidad de mantenimiento.",
                    characteristics: [
                        {
                            name: "Nombre",
                            value: "Shor-tiny",
                        },
                        {
                            name: "Tipo",
                            value: "Cámara sport",
                        },
                        {
                            name: "Resolución máxima",
                            value: "12 MP",
                        },
                        {
                            name: "Video",
                            value: "4K a 30fps",
                        },
                        {
                            name: "Pantalla",
                            value: "Pantalla táctil de 2.0 pulgadas",
                        },
                        {
                            name: "Conectividad",
                            value: "Wi-Fi y Bluetooth",
                        },
                        {
                            name: "Ángulo de visión",
                            value: "170 grados",
                        },
                        {
                            name: "Batería",
                            value: "1500 mAh, duración de 90 minutos",
                        },
                        {
                            name: "Resistencia al agua",
                            value: "Clasificación IP68",
                        },
                        {
                            name: "Accesorios incluidos",
                            value: "Soporte para casco, clip de liberación rápida",
                        },
                        {
                            name: "Modos de grabación",
                            value: "Modo timelapse, modo loop",
                        },
                        {
                            name: "Estabilización",
                            value: "Estabilización electrónica de imagen (EIS)",
                        },
                        {
                            name: "Formato de grabación",
                            value: "MP4",
                        },
                        {
                            name: "Dimensiones",
                            value: "60 x 40 x 30 mm",
                        },
                        {
                            name: "Peso",
                            value: "100 g",
                        },
                        {
                            name: "Colores disponibles",
                            value: "Negro, azul, rojo",
                        },
                        {
                            name: "Compatibilidad con aplicaciones",
                            value: "Compatible con app móvil para edición",
                        },
                        {
                            name: "Función de control remoto",
                            value: "Control remoto mediante app",
                        },
                        {
                            name: "Formatos de imagen",
                            value: "JPEG, RAW",
                        },
                        {
                            name: "Almacenamiento",
                            value: "Tarjetas microSD hasta 256 GB",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/short-tiny5oi48x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/short-tiny5oi4cx500.webp",
                        },
                    ],
                    slug: "short-tiny",
                    category_id: 27,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T16:18:09.286Z",
                    updatedAt: "2024-12-30T16:18:09.286Z",
                    category: {
                        name: "Shorts Deportivos",
                        slug: "shorts-deportivos",
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
                            id: 108,
                            sku: null,
                            stock: 5,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 96,
                            empresa_id: 16,
                            createdAt: "2024-12-30T16:18:09.315Z",
                            updatedAt: "2024-12-30T16:18:19.412Z",
                            features: [
                                {
                                    id: 1,
                                    value: "-",
                                    description: "-",
                                    option_id: 1,
                                    createdAt: "2024-11-28T10:16:44.590Z",
                                    updatedAt: "2024-11-28T10:16:44.590Z",
                                    VariantsFeatures: {
                                        variant_id: 108,
                                        feature_id: 1,
                                        empresa_id: 16,
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
            id: 26,
            category_code: "CAT-000002",
            name: "Polos Deportivos",
            isService: false,
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/categories/polos-deportivosk9fgjx100.webp",
                },
                {
                    dimension: 800,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/categories/polos-deportivosk9fgkx800.webp",
                },
            ],
            wallpaper: null,
            icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
            slug: "polos-deportivos",
            empresa_id: 16,
            createdAt: "2024-12-30T11:12:49.397Z",
            updatedAt: "2024-12-31T03:52:01.418Z",
            subcategories: [],
            productsNormals: [
                {
                    price: 15431.18,
                    discount: 0,
                    id: 83,
                    product_code: "PROD-000001",
                    name: "Polo",
                    url: null,
                    description:
                        "Descripción\nLa Yellow-T-shirt es la elección perfecta para quienes buscan comodidad y estilo en su ropa deportiva. Fabricada con materiales ligeros y transpirables, esta camiseta permite un óptimo rango de movimiento, haciendo que cada entrenamiento sea más placentero. Su vibrante color amarillo no solo ilumina tu atuendo, sino que también te mantiene visible durante actividades al aire libre.\n\nCaracterísticas Principales\nMaterial: Composición de poliéster y elastano que proporciona elasticidad y durabilidad.Diseño: Corte moderno con costuras planas que evitan rozaduras.Transpirabilidad: Tecno",
                    characteristics: [
                        {
                            name: "color",
                            value: "amarillo",
                        },
                        {
                            name: "tipo",
                            value: "camiseta",
                        },
                        {
                            name: "material",
                            value: "100% algodón",
                        },
                        {
                            name: "tamaño disponible",
                            value: "S, M, L, XL",
                        },
                        {
                            name: "estilo",
                            value: "casual",
                        },
                        {
                            name: "manga",
                            value: "corta",
                        },
                        {
                            name: "cuello",
                            value: "redondo",
                        },
                        {
                            name: "unisex",
                            value: "sí",
                        },
                        {
                            name: "durabilidad",
                            value: "alta",
                        },
                        {
                            name: "transpirabilidad",
                            value: "alta",
                        },
                        {
                            name: "lavado",
                            value: "máquina",
                        },
                        {
                            name: "diseño",
                            value: "sencillo",
                        },
                        {
                            name: "uso recomendado",
                            value: "diario, deportes",
                        },
                        {
                            name: "disponibilidad",
                            value: "en stock",
                        },
                        {
                            name: "sostenibilidad",
                            value: "fabricado con algodón orgánico",
                        },
                        {
                            name: "origen",
                            value: "fabricado localmente",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/poloknldpx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/poloknldsx500.webp",
                        },
                    ],
                    slug: "polo",
                    category_id: 26,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T11:20:34.077Z",
                    updatedAt: "2024-12-30T11:20:34.077Z",
                    category: {
                        name: "Polos Deportivos",
                        slug: "polos-deportivos",
                        icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [30],
                        },
                        {
                            option_id: 2,
                            features: [5, 7, 3],
                        },
                    ],
                    variants: [
                        {
                            id: 90,
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            product_normal_id: 83,
                            empresa_id: 16,
                            createdAt: "2024-12-30T11:20:34.126Z",
                            updatedAt: "2024-12-30T11:20:34.126Z",
                            features: [
                                {
                                    id: 30,
                                    value: "#ffd700",
                                    description: "Dorado",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 90,
                                        feature_id: 30,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 7,
                                    value: "L",
                                    description: "Large",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 90,
                                        feature_id: 7,
                                        empresa_id: 16,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                        {
                            id: 91,
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            product_normal_id: 83,
                            empresa_id: 16,
                            createdAt: "2024-12-30T11:20:34.126Z",
                            updatedAt: "2024-12-30T11:20:34.126Z",
                            features: [
                                {
                                    id: 30,
                                    value: "#ffd700",
                                    description: "Dorado",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 91,
                                        feature_id: 30,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 3,
                                    value: "XXS",
                                    description: "Extra Extra Small",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 91,
                                        feature_id: 3,
                                        empresa_id: 16,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                        {
                            id: 92,
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            product_normal_id: 83,
                            empresa_id: 16,
                            createdAt: "2024-12-30T11:20:34.126Z",
                            updatedAt: "2024-12-30T11:20:34.126Z",
                            features: [
                                {
                                    id: 30,
                                    value: "#ffd700",
                                    description: "Dorado",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 92,
                                        feature_id: 30,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 5,
                                    value: "S",
                                    description: "Small",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 92,
                                        feature_id: 5,
                                        empresa_id: 16,
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
                    price: 63782.2,
                    discount: 5,
                    id: 85,
                    product_code: "PROD-000003",
                    name: "Tank top",
                    url: null,
                    description:
                        "Descripción\nEl tank-top es una prenda esencial en el armario de cualquier amante del deporte. Diseñada para brindar comodidad y libertad de movimiento, esta camiseta sin mangas es ideal para entrenamientos intensos, actividades al aire libre y días calurosos. Su tejido ligero y transpirable ayuda a regular la temperatura corporal, manteniéndote fresco y seco en todo momento.\n\nCaracterísticas Principales\nConfeccionado en tejidos técnicos que favorecen la transpiraciónDiseño de corte relajado que permite mayor movilidadCosturas planas que evitan irritaciones durante el ejercicioDisponibilidad en",
                    characteristics: [
                        {
                            name: "tipo",
                            value: "Prenda sin mangas",
                        },
                        {
                            name: "material",
                            value: "Algodón, poliéster, mezclas sintéticas",
                        },
                        {
                            name: "uso",
                            value: "Casual, deportiva, de verano",
                        },
                        {
                            name: "ajuste",
                            value: "Holgado o ajustado",
                        },
                        {
                            name: "estilo",
                            value: "Versátil, informal",
                        },
                        {
                            name: "cuello",
                            value: "Redondo, en V, o sin cuello",
                        },
                        {
                            name: "tamaños",
                            value: "Variedad de tallas (XS a XXL)",
                        },
                        {
                            name: "colores",
                            value: "Sólidos, estampados, combinaciones",
                        },
                        {
                            name: "temporada",
                            value: "Primavera y verano",
                        },
                        {
                            name: "ventilación",
                            value: "Alta, ideal para climas cálidos",
                        },
                        {
                            name: "uso de interior",
                            value: "Puede usarse como fondo o pijama",
                        },
                        {
                            name: "facilidad de cuidado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "combinación",
                            value: "Se puede llevar con shorts, jeans o faldas",
                        },
                        {
                            name: "diseño",
                            value: "Puede tener gráficos o ser liso",
                        },
                        {
                            name: "público objetivo",
                            value: "Unisex, para todas las edades",
                        },
                        {
                            name: "origen",
                            value: "Popular en Estados Unidos desde los años 80",
                        },
                        {
                            name: "uso en eventos",
                            value: "Ideal para actividades al aire libre",
                        },
                        {
                            name: "accesorios",
                            value: "Se puede combinar con chaquetas o bufandas",
                        },
                        {
                            name: "marca favorita",
                            value: "Disponible de múltiples marcas",
                        },
                        {
                            name: "sostenibilidad",
                            value: "Opciones de algodón orgánico disponibles",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/tank-topmfo18x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/tank-topmfo1hx500.webp",
                        },
                    ],
                    slug: "tank-top",
                    category_id: 26,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T11:51:11.797Z",
                    updatedAt: "2024-12-30T11:51:11.797Z",
                    category: {
                        name: "Polos Deportivos",
                        slug: "polos-deportivos",
                        icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
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
                            id: 95,
                            sku: null,
                            stock: 0,
                            ilimit: true,
                            images: [1],
                            product_normal_id: 85,
                            empresa_id: 16,
                            createdAt: "2024-12-30T11:51:11.836Z",
                            updatedAt: "2024-12-30T11:51:22.206Z",
                            features: [
                                {
                                    id: 14,
                                    value: "#000000",
                                    description: "Negro",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.537Z",
                                    updatedAt: "2024-11-28T10:16:44.537Z",
                                    VariantsFeatures: {
                                        variant_id: 95,
                                        feature_id: 14,
                                        empresa_id: 16,
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
                    price: 63782.2,
                    discount: 5,
                    id: 86,
                    product_code: "PROD-000004",
                    name: "Women’s sunscreen",
                    url: null,
                    description:
                        "Descripción\nTank-Down es una línea de ropa deportiva diseñada para brindar comodidad y rendimiento en cada actividad. Con featuras innovadoras, esta colección está pensada para aquellos que buscan mantenerse activos sin sacrificar estilo. Los materiales ligeros y transpirables aseguran que te sientas fresco y seco durante tus entrenamientos más exigentes.\n\nCaracterísticas Principales\nMateriales técnicos que regulan la temperatura y la humedad.Diseños ergonómicos que permiten mayor libertad de movimiento.Estilos modernos y atractivos para un look deportivo y urbano.Disponibles en una amplia gam",
                    characteristics: [
                        {
                            name: "Tipo",
                            value: "Tanque de combustible",
                        },
                        {
                            name: "Capacidad",
                            value: "Varía entre 50 y 1000 litros",
                        },
                        {
                            name: "Material",
                            value: "Acero al carbono, acero inoxidable o plástico",
                        },
                        {
                            name: "Forma",
                            value: "Cilíndrica o rectangular",
                        },
                        {
                            name: "Uso",
                            value: "Almacenamiento de combustibles, aceites o líquidos químicos",
                        },
                        {
                            name: "Instalación",
                            value: "Requiere nivelación y soporte adecuado",
                        },
                        {
                            name: "Consideraciones de seguridad",
                            value: "Equipado con válvulas de seguridad y sistemas de ventilación",
                        },
                        {
                            name: "Mantenimiento",
                            value: "Inspecciones regulares y limpieza",
                        },
                        {
                            name: "Regulación",
                            value: "Cumplir con normativas ambientales y de seguridad",
                        },
                        {
                            name: "Transporte",
                            value: "Posibilidad de ser transportable o fijo",
                        },
                        {
                            name: "Accesorios opcionales",
                            value: "Medidores de nivel, bombas de transferencia",
                        },
                        {
                            name: "Aplicaciones",
                            value: "Estaciones de servicio, industrias, agricultura",
                        },
                        {
                            name: "Ventajas",
                            value: "Almacenamiento seguro y eficiente de líquidos",
                        },
                        {
                            name: "Desventajas",
                            value: "Requiere espacio y cumplimiento de normativas",
                        },
                        {
                            name: "Vida útil",
                            value: "Generalmente de 10 a 30 años dependiendo del material y mantenimiento",
                        },
                        {
                            name: "Resistencia",
                            value: "Resistente a la corrosión y condiciones climáticas variables",
                        },
                        {
                            name: "Certificaciones",
                            value: "Certificaciones petroleras o de construcción para asegurar calidad",
                        },
                        {
                            name: "Diseño",
                            value: "Posibilidad de personalización según necesidades específicas",
                        },
                        {
                            name: "Tamaño",
                            value: "Varía según la capacidad y requerimientos del usuario",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/tank-downmhqu7x100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/tank-downmhqucx500.webp",
                        },
                    ],
                    slug: "womens-sunscreen",
                    category_id: 26,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T11:52:20.269Z",
                    updatedAt: "2024-12-30T12:05:28.873Z",
                    category: {
                        name: "Polos Deportivos",
                        slug: "polos-deportivos",
                        icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [29],
                        },
                    ],
                    variants: [
                        {
                            id: 96,
                            sku: null,
                            stock: 5,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 86,
                            empresa_id: 16,
                            createdAt: "2024-12-30T11:52:20.295Z",
                            updatedAt: "2024-12-30T12:05:36.054Z",
                            features: [
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 96,
                                        feature_id: 29,
                                        empresa_id: 16,
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
                    price: 65565,
                    discount: 0,
                    id: 88,
                    product_code: "PROD-000006",
                    name: "Men’s sunscreen",
                    url: null,
                    description:
                        "Descripción\nEl protector solar para hombres es un producto esencial para quienes buscan proteger su piel de los daños causados por la exposición al sol durante actividades deportivas al aire libre. Formulado con ingredientes de alta calidad, este protector solar ofrece una protección eficiente contra los rayos UVA y UVB, ayudando a prevenir quemaduras solares y el envejecimiento prematuro de la piel.\n\nCaracterísticas Principales\nProtección de amplio espectro contra rayos UVA y UVB.Resistente al agua y al sudor durante 80 minutos.Textura ligera y de rápida absorción.Sin fragancias artificiales ",
                    characteristics: [
                        {
                            name: "marca",
                            value: "Mens Sunscreen",
                        },
                        {
                            name: "tipo",
                            value: "Protector solar masculino",
                        },
                        {
                            name: "factor_protección_solar",
                            value: "SPF 30",
                        },
                        {
                            name: "textura",
                            value: "Ligera y no grasa",
                        },
                        {
                            name: "acabado",
                            value: "Mate",
                        },
                        {
                            name: "uso_recomendado",
                            value: "Diario",
                        },
                        {
                            name: "resistente_al_agua",
                            value: "Sí, hasta 80 minutos",
                        },
                        {
                            name: "ingredientes_principales",
                            value: "Óxido de zinc, Dióxido de titanio",
                        },
                        {
                            name: "sin_parabenos",
                            value: "Sí",
                        },
                        {
                            name: "aplicación",
                            value: "Aplicar generosamente y uniformemente antes de la exposición al sol",
                        },
                        {
                            name: "dermatológicamente_probado",
                            value: "Sí",
                        },
                        {
                            name: "ideal_para",
                            value: "Piel sensible",
                        },
                        {
                            name: "aroma",
                            value: "Fragancia ligera",
                        },
                        {
                            name: "tamaño_envase",
                            value: "100 ml",
                        },
                        {
                            name: "uso_apropiado",
                            value: "Todo tipo de piel",
                        },
                        {
                            name: "cuidado_adicional",
                            value: "Hidratación y protección contra daños ambientales",
                        },
                        {
                            name: "fecha_caducidad",
                            value: "3 años",
                        },
                        {
                            name: "envase_reciclable",
                            value: "Sí",
                        },
                        {
                            name: "presencia_en_mercados",
                            value: "Global",
                        },
                        {
                            name: "certificaciones",
                            value: "Cruelty-free",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/mens-sunscreenn99pmx100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/mens-sunscreenn99psx500.webp",
                        },
                    ],
                    slug: "mens-sunscreen",
                    category_id: 26,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T12:05:09.158Z",
                    updatedAt: "2024-12-30T12:05:09.158Z",
                    category: {
                        name: "Polos Deportivos",
                        slug: "polos-deportivos",
                        icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [29],
                        },
                        {
                            option_id: 2,
                            features: [6, 7, 5],
                        },
                    ],
                    variants: [
                        {
                            id: 98,
                            sku: null,
                            stock: 3,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 88,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:05:09.204Z",
                            updatedAt: "2024-12-30T12:07:47.957Z",
                            features: [
                                {
                                    id: 6,
                                    value: "M",
                                    description: "Medium",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 98,
                                        feature_id: 6,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 98,
                                        feature_id: 29,
                                        empresa_id: 16,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                        {
                            id: 99,
                            sku: null,
                            stock: 5,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 88,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:05:09.205Z",
                            updatedAt: "2024-12-30T12:07:43.259Z",
                            features: [
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 99,
                                        feature_id: 29,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 5,
                                    value: "S",
                                    description: "Small",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 99,
                                        feature_id: 5,
                                        empresa_id: 16,
                                    },
                                },
                            ],
                            totalSold: 0,
                        },
                        {
                            id: 100,
                            sku: null,
                            stock: 1,
                            ilimit: false,
                            images: [1],
                            product_normal_id: 88,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:05:09.204Z",
                            updatedAt: "2024-12-30T12:07:54.983Z",
                            features: [
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 100,
                                        feature_id: 29,
                                        empresa_id: 16,
                                    },
                                },
                                {
                                    id: 7,
                                    value: "L",
                                    description: "Large",
                                    option_id: 2,
                                    createdAt: "2024-11-28T10:16:44.554Z",
                                    updatedAt: "2024-11-28T10:16:44.554Z",
                                    VariantsFeatures: {
                                        variant_id: 100,
                                        feature_id: 7,
                                        empresa_id: 16,
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
                    price: 26566,
                    discount: 0,
                    id: 90,
                    product_code: "PROD-000008",
                    name: "T-shirt",
                    url: null,
                    description:
                        "Descripción\nLa T-shirt deportiva está diseñada para brindar comodidad y funcionalidad durante tus actividades físicas. Confeccionada en materiales transpirables, esta camiseta ayuda a mantener la piel seca y fresca, incluso en los entrenamientos más intensos. Su diseño moderno y ligero se adapta perfectamente al cuerpo, permitiendo una gran libertad de movimiento.\n\nCaracterísticas Principales\nMaterial transpirable y de secado rápidoCosturas planas para mayor comodidadDiseño ergonómico que permite libertad de movimientoVariedad de colores y tallas disponiblesIdeal para todo tipo de deportes y a",
                    characteristics: [
                        {
                            name: "Material",
                            value: "100% algodón",
                        },
                        {
                            name: "Estilo",
                            value: "Casual",
                        },
                        {
                            name: "Tamaño",
                            value: "S, M, L, XL, XXL",
                        },
                        {
                            name: "Género",
                            value: "Unisex",
                        },
                        {
                            name: "Tipo de cuello",
                            value: "Cuello redondo",
                        },
                        {
                            name: "Estampado",
                            value: "Variedad de diseños (gráfico, liso, rayas)",
                        },
                        {
                            name: "Manga",
                            value: "Corta",
                        },
                        {
                            name: "Transpirabilidad",
                            value: "Alta",
                        },
                        {
                            name: "Usos",
                            value: "Diario, deportes, ocio",
                        },
                        {
                            name: "Durabilidad",
                            value: "Resistente al desgaste",
                        },
                        {
                            name: "Cuidado",
                            value: "Lavable a máquina",
                        },
                        {
                            name: "Ajuste",
                            value: "Estandard o slim fit",
                        },
                        {
                            name: "Color",
                            value: "Multitud de colores disponibles",
                        },
                        {
                            name: "Impresión",
                            value: "Serigrafía o bordado",
                        },
                        {
                            name: "Eco-amigable",
                            value: "Opciones de algodón orgánico",
                        },
                        {
                            name: "Origen",
                            value: "Fabricado en diversos países",
                        },
                        {
                            name: "Estacionalidad",
                            value: "Uso todo el año",
                        },
                        {
                            name: "Accesorios",
                            value: "Compatible con chaquetas y sudaderas",
                        },
                        {
                            name: "Comodidad",
                            value: "Suave y cómodo al tacto",
                        },
                        {
                            name: "Estilo de vida",
                            value: "Actividades cotidianas",
                        },
                        {
                            name: "Target",
                            value: "Adolescentes y adultos",
                        },
                        {
                            name: "Inspiración",
                            value: "Cultura pop, arte y música",
                        },
                    ],
                    enabled: true,
                    images: [
                        {
                            dimension: 100,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/t-shirtnnd1ox100.webp",
                        },
                        {
                            dimension: 500,
                            file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/products/t-shirtnnd1qx500.webp",
                        },
                    ],
                    slug: "t-shirt",
                    category_id: 26,
                    subcategory_id: null,
                    brand_id: null,
                    empresa_id: 16,
                    createdAt: "2024-12-30T12:12:51.291Z",
                    updatedAt: "2024-12-30T12:12:51.291Z",
                    category: {
                        name: "Polos Deportivos",
                        slug: "polos-deportivos",
                        icon: '\u003Ci class="far fa-tshirt"\u003E\u003C/i\u003E',
                    },
                    brand: null,
                    options: [
                        {
                            option_id: 3,
                            features: [29],
                        },
                    ],
                    variants: [
                        {
                            id: 102,
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            product_normal_id: 90,
                            empresa_id: 16,
                            createdAt: "2024-12-30T12:12:51.349Z",
                            updatedAt: "2024-12-30T12:12:51.349Z",
                            features: [
                                {
                                    id: 29,
                                    value: "#000080",
                                    description: "Azul Marino",
                                    option_id: 3,
                                    createdAt: "2024-11-28T10:16:44.538Z",
                                    updatedAt: "2024-11-28T10:16:44.538Z",
                                    VariantsFeatures: {
                                        variant_id: 102,
                                        feature_id: 29,
                                        empresa_id: 16,
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
    ],
    brands: [
        {
            id: 33,
            name: "Nike",
            brand_code: "BRAND-000001",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/nike69dp6x100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/nike69dpdx500.webp",
                },
            ],
            slug: "nike",
            empresa_id: 16,
            createdAt: "2024-12-30T16:27:22.109Z",
            updatedAt: "2024-12-30T16:27:22.109Z",
        },
        {
            id: 34,
            name: "Puma",
            brand_code: "BRAND-000002",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/puma69vmvx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/puma69vn1x500.webp",
                },
            ],
            slug: "puma",
            empresa_id: 16,
            createdAt: "2024-12-30T16:27:40.533Z",
            updatedAt: "2024-12-30T16:27:40.533Z",
        },
        {
            id: 35,
            name: "Adidas",
            brand_code: "BRAND-000003",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/adidas6alkhx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/adidas6alkqx500.webp",
                },
            ],
            slug: "adidas",
            empresa_id: 16,
            createdAt: "2024-12-30T16:28:02.920Z",
            updatedAt: "2024-12-30T16:28:02.920Z",
        },
        {
            id: 36,
            name: "Converse",
            brand_code: "BRAND-000004",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/converse6c6p2x100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/converse6c6p5x500.webp",
                },
            ],
            slug: "converse",
            empresa_id: 16,
            createdAt: "2024-12-30T16:28:53.230Z",
            updatedAt: "2024-12-30T16:28:53.230Z",
        },
        {
            id: 37,
            name: "Reebok",
            brand_code: "BRAND-000005",
            image: [
                {
                    dimension: 100,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/reebok6d22fx100.webp",
                },
                {
                    dimension: 500,
                    file: "https://www.demo-10.vigilio-services.com/empresas/demo-10/images/brands/reebok6d22hx500.webp",
                },
            ],
            slug: "reebok",
            empresa_id: 16,
            createdAt: "2024-12-30T16:29:21.144Z",
            updatedAt: "2024-12-30T16:29:21.144Z",
        },
    ],
};
