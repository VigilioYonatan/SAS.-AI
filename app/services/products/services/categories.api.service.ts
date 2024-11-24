import { Injectable, Redirect } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity } from "~/libs/helpers";
import { Categories } from "../entities/categories.entity";
import type { CategoriesStoreDto } from "../dtos/categories.store.dto";
import type { CategoriesUpdateDto } from "../dtos/categories.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { removeFile } from "@/uploads/libs/helpers";
import { ProductKeys } from "../libs";

@Injectable()
export class CategoriesApiService {
    async index(empresa: Empresas, isService: boolean) {
        const data = await Categories.findAll({
            where: {
                empresa_id: empresa.id,
                isService,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, slug: string, isView = false) {
        let category = null;
        if (!Number.isNaN(Number(slug))) {
            category = await Categories.findOne({
                where: {
                    id: slug,
                    empresa_id: empresa.id,
                },
            });
        } else {
            category = await Categories.findOne({
                where: {
                    slug,
                    empresa_id: empresa.id,
                },
            });
        }

        if (!category) {
            if (!isView) {
                throw new NotFoundException("No se encontró categoría");
            }
            throw new Redirect("/404?message=Producto No encontrado");
        }

        return {
            success: true,
            category,
        };
    }
    async subcategories(empresa: Empresas, slug: string) {
        const { category } = await this.show(empresa, slug, false);
        const data = await category.$get("subcategories");
        return {
            success: true,
            data,
        };
    }
    async store(empresa: Empresas, categoriesStoreDto: CategoriesStoreDto) {
        const category = new Categories({
            ...categoriesStoreDto,
            empresa_id: empresa.id,
        });
        category.category_code = await generateCodeEntity(
            Categories,
            "category_code" as keyof Categories,
            "CAT",
            empresa
        );

        await category.save();
        return {
            success: true,
            category,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        categoriesUpdateDto: CategoriesUpdateDto
    ) {
        const { category } = await this.show(empresa, id);
        const [byName, bySlug] = await Promise.all([
            Categories.findOne({
                where: {
                    name: categoriesUpdateDto.name,
                    empresa_id: empresa.id,
                    id: { [Op.not]: id },
                },
                raw: true,
            }),
            Categories.findOne({
                where: {
                    slug: categoriesUpdateDto.slug,
                    empresa_id: empresa.id,
                    id: { [Op.not]: id },
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe la categoría con el nombre: ${categoriesUpdateDto.name}`,
                { body: "name" as keyof CategoriesUpdateDto }
            );
        }
        if (bySlug) {
            throw new BadRequestException(
                `Ya existe la categoría con el slug: ${categoriesUpdateDto.slug}`,
                { body: "slug" as keyof CategoriesUpdateDto }
            );
        }
        await category.update(categoriesUpdateDto);

        return {
            success: true,
            category,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { category } = await this.show(empresa, id);
        const [servicios, products] = await Promise.all([
            category.$get(ProductKeys(empresa, true) as keyof Categories, {
                raw: true,
            }),
            category.$get(ProductKeys(empresa, false) as keyof Categories, {
                raw: true,
            }),
        ]);
        if (servicios.length)
            throw new BadRequestException(
                `Existe servicios en la categoría ${category.category_code} - ${products.length} productos`
            );
        if (products.length)
            throw new BadRequestException(
                `Existe productos en la categoría ${category.category_code} - ${products.length} productos`
            );

        await category.destroy();
        if (category.image) {
            removeFile(empresa.slug, category.image);
        }
        return {
            success: true,
            message: `La categoría con el id: ${id} fue eliminado`,
        };
    }
}
