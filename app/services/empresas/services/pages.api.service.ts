import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { Page } from "../entities/page.entity";
import type { PagesStoreDto } from "../dtos/pages.store.dto";
import { GridBannerPage } from "../entities/grid_banner_page.entity";
import type { PagesUpdateDto } from "../dtos/pages.update.dto";
import { Op } from "sequelize";
import { GridBanner } from "../entities/grid_banner.entity";

@Injectable()
export class PagesApiService {
    async index(empresa: Empresas) {
        const data = await Page.findAll({
            where: {
                empresa_id: empresa.id,
            },
            order: [["id", "ASC"]],
        });

        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, slug: string) {
        let page = null;
        if (!Number.isNaN(Number(slug))) {
            page = await Page.findOne({
                where: {
                    id: slug,
                    empresa_id: empresa.id,
                },
            });
        } else {
            page = await Page.findOne({
                where: {
                    slug,
                    empresa_id: empresa.id,
                },
            });
        }

        if (!page) {
            throw new NotFoundException(
                `No se encontró una página con el ${slug}`
            );
        }
        const grid_banner_pages = await page.$get("grid_banner_pages", {
            order: [["id", "ASC"]],
            include: [GridBanner],
        });
        page.dataValues.grid_banner_pages = grid_banner_pages;

        return {
            success: true,
            page,
        };
    }

    async store(empresa: Empresas, body: PagesStoreDto) {
        const page = new Page({ ...body, empresa_id: empresa.id });
        await page.save();
        await GridBannerPage.bulkCreate(
            Array.from({ length: 10 }).map(() => ({
                html: null,
                enabled: false,
                empresa_id: empresa!.id,
                title: null,
            }))
        );
        return {
            success: true,
            page,
        };
    }

    async update(empresa: Empresas, id: string, body: PagesUpdateDto) {
        const { page } = await this.show(empresa, id);
        const [byName, bySlug] = await Promise.all([
            Page.findOne({
                where: {
                    title: body.title,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                },
                raw: true,
            }),
            Page.findOne({
                where: {
                    slug: body.slug,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe una página ${body.title}`,
                { body: "title" }
            );
        }
        if (bySlug) {
            throw new BadRequestException(
                `Ya existe una página ${body.title}`,
                { body: "title" }
            );
        }
        await page.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente gridBannerService",
        };
    }
    async destroy(empresa: Empresas, id: string) {
        const { page } = await this.show(empresa, id);
        await page.destroy();
        return {
            success: true,
            message: "Editado correctamente gridBannerService",
        };
    }
}
