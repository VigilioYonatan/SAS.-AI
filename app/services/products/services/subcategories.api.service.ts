import { Injectable, Redirect } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity } from "~/libs/helpers";
import { removeFile } from "@/uploads/libs/helpers";
import type { SubcategoriesStoreDto } from "../dtos/subcategories.store.dto";
import type { SubcategoriesUpdateDto } from "../dtos/subcategories.update.dto";
import { Subcategories } from "../entities/subcategories.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { ProductKeys } from "../libs";

@Injectable()
export class SubCategoriesApiService {
    async index(empresa: Empresas) {
        const data = await Subcategories.findAll({
            where: { empresa_id: empresa.id },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, slug: string, isView = true) {
        let subcategory = null;
        if (!Number.isNaN(Number(slug))) {
            subcategory = await Subcategories.findOne({
                where: { empresa_id: empresa.id, id: slug },
            });
        } else {
            subcategory = await Subcategories.findOne({
                where: {
                    slug,
                    empresa_id: empresa.id,
                },
            });
        }
        if (!subcategory) {
            if (isView) {
                throw new Redirect(
                    `/404?message=No se encontró subcategoría ${slug}`
                );
            }
            throw new NotFoundException(
                `No se encontró esta subcategoría con ${slug}`
            );
        }
        return {
            success: true,
            subcategory,
        };
    }

    async store(
        empresa: Empresas,
        subCategoriesStoreDto: SubcategoriesStoreDto
    ) {
        const subcategory = new Subcategories(subCategoriesStoreDto);
        subcategory.subcategory_code = await generateCodeEntity(
            Subcategories,
            "subcategory_code" as keyof Subcategories,
            "SUB",
            empresa
        );
        try {
            await subcategory.save();
        } catch (error) {
            console.log((error as Error).message);
        }

        return {
            success: true,
            subcategory,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        subCategoriesUpdateDto: SubcategoriesUpdateDto
    ) {
        const { subcategory } = await this.show(empresa, id);
        const [byName, bySlug] = await Promise.all([
            Subcategories.findOne({
                where: {
                    name: subCategoriesUpdateDto.name,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                    category_id: subCategoriesUpdateDto.category_id,
                },
                raw: true,
            }),
            Subcategories.findOne({
                where: {
                    slug: subCategoriesUpdateDto.slug,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                    category_id: subCategoriesUpdateDto.category_id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe esta subcategoría con el nombre: ${subCategoriesUpdateDto.name}.`,
                { body: "name" as keyof SubcategoriesUpdateDto }
            );
        }
        if (bySlug) {
            throw new BadRequestException(
                `Ya existe esta subcategoría con el slug: ${subCategoriesUpdateDto.slug}.`,
                { body: "slug" as keyof SubcategoriesUpdateDto }
            );
        }
        await subcategory.update(subCategoriesUpdateDto);

        return {
            success: true,
            subcategory,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { subcategory } = await this.show(empresa, id);
        const products = await subcategory.$get(
            ProductKeys(empresa, false) as keyof Subcategories,
            {
                raw: true,
            }
        );
        if (products.length)
            throw new BadRequestException(
                `Existe productos en esta subcategoría ${subcategory.subcategory_code} - ${products.length} productos.`
            );
        if (subcategory.image) {
            removeFile(empresa.slug, subcategory.image);
        }
        await subcategory.destroy();
        return {
            success: true,
            message: `Esta subcategoría con el id: ${id} fue eliminado.`,
        };
    }
}
