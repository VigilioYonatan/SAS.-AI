import { Injectable } from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { getProductAll } from "@/products/libs";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { WebApiService } from "./web.api.service";

@Injectable()
export class WebService {
    constructor(private readonly webApiService: WebApiService) {}
    manifest(empresa: Empresas) {
        const icons = empresa.logo_pwa
            ? empresa.logo_pwa.map((pwa) => ({
                  src: `/empresas/${empresa.slug}/${pwa.file}`,
                  sizes: `${pwa.dimension}x${pwa.dimension}`,
                  type: "image/webp",
              }))
            : [
                  {
                      src: "/images/settings/others/logo.webp",
                      sizes: "96x96",
                      type: "image/webp",
                  },
                  {
                      src: "/images/settings/others/logo.webp",
                      sizes: "384x384",
                      type: "image/webp",
                  },
                  {
                      src: "/images/settings/others/logo.webp",
                      sizes: "512x512",
                      type: "image/webp",
                  },
              ];

        return {
            name: empresa.name_empresa,
            short_name: empresa.name_empresa,
            start_url: "/",
            display: "standalone",
            background_color: "#fff",
            lang: empresa.dial_code === "55" ? "pt" : "es",
            scope: "/dist/",
            description: !empresa.setting.about
                ? `Bienvenido a ${empresa.name_empresa}`
                : empresa.setting.about.slice(0, 100),
            theme_color: empresa.setting.bg_color,
            icons,
            form_factor: "wide",
        };
    }
    async home(empresa: Empresas) {
        const result = await this.webApiService.home(empresa);
        return result;
    }
    async about(empresa: Empresas) {
        const result = await this.webApiService.about(empresa);
        return result;
    }
    async shop(empresa: Empresas) {
        const result = await this.webApiService.shop(empresa);
        return result;
    }

    async product(slug: string, empresa: Empresas) {
        const result = await this.webApiService.product(slug, empresa);
        return result;
    }

    async categories(category_slug: string, empresa: Empresas) {
        const result = await this.webApiService.categories(
            category_slug,
            empresa
        );
        return result;
    }
    async marcas(brands: string, empresa: Empresas) {
        const result = await this.webApiService.marcas(brands, empresa);
        return result;
    }

    async admin() {
        return {
            success: true,
        };
    }
    async orders() {
        return {
            title: "Pedidos",
            description: "Nuestras pedidos.",
        };
    }

    async politica(empresa: Empresas) {
        return {
            title: "Politica y privacidad",
            description: `En ${empresa.name_empresa}, nos comprometemos a proteger tu privacidad. Recopilamos información personal, de pago y de uso para procesar pedidos, mejorar nuestro servicio y comunicarnos contigo. Protegemos tus datos mediante medidas de seguridad avanzadas. Para más detalles, visita nuestra Política de Privacidad.`,
        };
    }

    async terminos(empresa: Empresas) {
        return {
            title: "Terminos y condiciones",
            description: `Lee los Términos y Condiciones de ${empresa.name_empresa} para conocer los términos de uso de nuestro sitio web y servicios. Descubre nuestras políticas de compra, envío, devoluciones, y responsabilidades del usuario. Al usar nuestro sitio, aceptas cumplir con estos términos.`,
        };
    }

    async reclamaciones(empresa: Empresas) {
        return {
            title: "Libro de reclamaciones",
            description: `En ${empresa.name_empresa}, valoramos a nuestros clientes y nos comprometemos a resolver cualquier problema. Consulta nuestra página de Reclamaciones para conocer el proceso de presentación de quejas y cómo gestionamos las reclamaciones. Tu satisfacción es nuestra prioridad.`,
        };
    }
    async fetchProductArrays(
        empresa: Empresas,
        products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][]
    ) {
        const arraysLengths = products.map((arr) => arr.length);
        const allProducts = products.flat();

        const allProductsMapped = await fetchProducts(empresa, allProducts);

        function splitResults(
            allResults: (
                | ProductsNormal
                | ProductsServicio
                | ProductsRestaurant
            )[],
            arraysLengths: number[]
        ) {
            let index = 0;
            return arraysLengths.map((length) => {
                const result = allResults.slice(index, index + length);
                index += length;
                return result;
            });
        }
        async function fetchProducts(
            empresa: Empresas,
            products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[]
        ) {
            return await Promise.all(
                products.map((product) => getProductAll(empresa, product))
            );
        }
        return splitResults(allProductsMapped, arraysLengths);
    }
}
