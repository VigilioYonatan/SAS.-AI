import { Injectable, Redirect } from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { getProductAll } from "@/products/libs";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import type { Users } from "@/users/entities/users.entity";
import { WebApiService } from "./web.api.service";
import { Crud } from "@/empresas/entities/crud.entity";
import { RequestVigilio } from "~/config/types";
import { Page } from "@/empresas/entities/page.entity";
import { sequelize } from "~/config/db.config";
import { QueryTypes } from "sequelize";
import { capitalize } from "@vigilio/express-core/helpers";
import { GridBanner } from "@/empresas/entities/grid_banner.entity";
import { GridBannerPage } from "@/empresas/entities/grid_banner_page.entity";
import { getQueries, joins, relation } from "@/common/paginator/libs";

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
            description: !empresa.about
                ? `Bienvenido a ${empresa.name_empresa}`
                : empresa.about.slice(0, 100),
            theme_color: empresa.setting.bg_color,
            icons,
            form_factor: "wide",
        };
    }
    async home(empresa: Empresas, user: Users) {
        const result = await this.webApiService.home(empresa, user);
        return result;
    }
    async about(empresa: Empresas) {
        const result = await this.webApiService.about(empresa);
        return result;
    }
    async shop(empresa: Empresas, user: Users) {
        const result = await this.webApiService.shop(empresa, user);
        return result;
    }

    async servicio(slug: string, empresa: Empresas, user: Users) {
        const result = await this.webApiService.servicio(slug, empresa, user);
        return result;
    }
    async servicios(empresa: Empresas) {
        const result = await this.webApiService.servicios(empresa);
        return result;
    }
    async product(slug: string, req: RequestVigilio, user: Users) {
        const result = await this.webApiService.product(slug, req, user);
        return result;
    }

    async categories(category_slug: string, empresa: Empresas) {
        const result = await this.webApiService.categories(
            category_slug,
            empresa
        );
        return result;
    }
    async subcategories(
        category_slug: string,
        subcategory_slug: string,
        empresa: Empresas
    ) {
        const result = await this.webApiService.subcategories(
            category_slug,
            subcategory_slug,
            empresa,
            true
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
    async dynamic(page: string, slug: string, empresa: Empresas) {
        const crud = await Crud.findOne({
            where: {
                name: capitalize(page),
                empresa_id: empresa.id,
                isDynamicPage: true,
            },
        });
        if (!crud) {
            throw new Redirect(`/404?message=${"cr no encontrada"}`);
        }
        // const c = await this.crudDateApiService.show(empresa, crud.name, slug);
        const pageFind = await Page.findOne({
            where: {
                slug: `:${page}`,
                isDinamic: true,
            },
        });
        if (!pageFind) {
            throw new Redirect(`/404?message=${"pagina no encontrada"}`);
        }
        const queryFind = pageFind.queries.find((key) => key.key === "data");
        let data = [];
        if (queryFind) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const a = await getQueries(empresa, pageFind, { slug } as any);
            data = (a as { data: [] }).data;
        } else {
            const [attributes, join] = await joins(crud, empresa);
            data = await sequelize.query(
                `SELECT "${crud.name}".* ${
                    attributes?.length ? `, ${attributes}` : ""
                }  FROM "${crud.name}" ${join} WHERE "${
                    crud.name
                }"."empresa_id" = :empresa_id AND  "${
                    crud.name
                }"."slug" = :slug LIMIT 1`,
                {
                    replacements: { empresa_id: empresa.id, slug },
                    type: QueryTypes.SELECT,
                }
            );
        }

        if (!data[0]) {
            throw new Redirect(`/404?message=No se encontró ${page}-${slug}`);
        }
        const queries = await getQueries(
            empresa,
            pageFind,
            data[0] as Record<string, unknown>
        );
        const textoFinal = pageFind.description.replace(
            /{{(.*?)}}/g,
            (_, key: string) => {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                return (data[0] as any)[key.trim()] || `{{${key}}}`;
            }
        );
        const grid_banner_pages = (await pageFind.$get("grid_banner_pages", {
            order: [["id", "ASC"]],
            include: [GridBanner],
        })) as GridBannerPage[];
        return {
            title: (data[0] as { slug: string }).slug.split("-").join(" "),
            description: textoFinal,
            data: relation(data)[0],
            queries,
            grid_banner_pages,
        };
    }
    async fetchProductArrays(
        empresa: Empresas,
        products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][],
        users: Users | null
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
                products.map((product) =>
                    getProductAll(empresa, product, users, false)
                )
            );
        }
        return splitResults(allProductsMapped, arraysLengths);
    }
}
