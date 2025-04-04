import { Injectable, NotFoundException } from "@vigilio/express-core";
import type { Empresas } from "../entities/empresas.entity";
import { Scrapping } from "../entities/scrapping.entity";
import { ScrappingUpdateDto } from "../dtos/scrapping.update.dto";
import cache from "@vigilio/express-core/cache";
import { ScrappingSchema } from "../schemas/scrapping.schema";
import { getCategories } from "../libs/scrapping";

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
