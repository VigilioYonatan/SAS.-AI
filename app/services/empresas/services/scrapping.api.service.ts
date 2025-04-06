import { Injectable, NotFoundException } from "@vigilio/express-core";
import type { Empresas } from "../entities/empresas.entity";
import { Scrapping } from "../entities/scrapping.entity";
import { ScrappingUpdateDto } from "../dtos/scrapping.update.dto";
import cache from "@vigilio/express-core/cache";
import {
    CategoryIA,
    ProductIA,
    ScrappingSchema,
} from "../schemas/scrapping.schema";
import { getCategories, getPages, getProductsNoSSR } from "../libs/scrapping";

@Injectable()
export class ScrappingApiService {
    async index(empresa: Empresas) {
        const data = await Scrapping.findOne({
            where: {
                empresa_id: empresa.id,
            },
        });
        if (!data) throw new NotFoundException("no se encontró scrapping");
        return {
            success: true,
            data,
        };
    }

    async testCategories(body: Pick<ScrappingSchema, "categories">) {
        const categories = await getCategories({
            categories: body.categories,
        } as ScrappingSchema);
        return { success: true, data: categories };
    }
    async testProducts(
        body: Pick<ScrappingSchema, "products"> & {
            categories: { id: string | null; url: string }[];
            categoria_url: string | null;
            web_url: string;
        }
    ) {
        let data: ProductIA[][] = [];
        for await (const category of body.categories) {
            const categories = await getProductsNoSSR(
                {
                    products: body.products,
                    categories: { categoria_url: body.categoria_url },
                    web_url: body.web_url,
                } as ScrappingSchema,
                category as unknown as CategoryIA
            );
            data = [...data, categories];
        }

        return { success: true, data };
    }

    async testPages(body: Pick<ScrappingSchema, "pages">) {
        const pages = await getPages(body.pages);
        return { success: true, data: pages };
    }

    async update(empresa: Empresas, body: ScrappingUpdateDto) {
        const { data } = await this.index(empresa);
        await data.update(body);
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Actualizado correctamente",
        };
    }
}
