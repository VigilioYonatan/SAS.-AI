import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Crud } from "../entities/crud.entity";
import type { Empresas } from "../entities/empresas.entity";
import { CrudStoreDto } from "../dtos/crud.store.dto";
import { CrudUpdateDto } from "../dtos/crud.update.dto";
import { DataTypes, Op, QueryTypes, Sequelize } from "sequelize";
import cache from "@vigilio/express-core/cache";
import { sequelize } from "~/config/db.config";
import { capitalize } from "@vigilio/express-core/helpers";
import { PagesApiService } from "./pages.api.service";
import { PagesStoreDto } from "../dtos/pages.store.dto";
import { Page } from "../entities/page.entity";
import { paginatorHTML } from "../libs";

@Injectable()
export class CrudApiService {
    constructor(private readonly pagesApiService: PagesApiService) {}
    async index(empresa: Empresas) {
        const data = await Crud.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, slug: string) {
        let crud = null;
        if (!Number.isNaN(Number(slug))) {
            crud = await Crud.findOne({
                where: {
                    id: slug,
                    empresa_id: empresa.id,
                },
            });
        } else {
            crud = await Crud.findOne({
                where: {
                    name: slug,
                    empresa_id: empresa.id,
                },
            });
        }
        if (!crud) {
            throw new NotFoundException(
                `No se encontró un crud con el slug ${slug}`
            );
        }
        return {
            success: true,
            crud,
        };
    }

    async store(empresa: Empresas, body: CrudStoreDto) {
        try {
            const tables = JSON.parse(
                cache.get(`${empresa.slug}:TABLE`) || "[]"
            );
            console.log({ tables });

            if (
                (tables as { table_name: string }[])
                    .map((table) => table.table_name.toLowerCase())
                    .includes(body.name.toLowerCase())
            ) {
                throw new BadRequestException(
                    `Tabla ${body.name} ya existe en db`
                );
            }
            const data = {
                ...body,
                empresa_id: empresa.id,
                name: capitalize(body.name),
            };
            const crud = new Crud(data);
            cache.delete(`${empresa.slug}:TABLE`);
            await crud.save();
            const queryInterface = sequelize.getQueryInterface();

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const options: any = body.data.map((data) => {
                const { references, onDelete, onUpdate, ...rest } =
                    data.options;
                const options: Record<string, unknown> = {
                    ...rest,
                    defaultValue:
                        data.options.defaultValue === ""
                            ? null
                            : data.options.defaultValue,
                };
                if (data.type === "FOREIGNKEY") {
                    options.references = { model: references, key: "id" };
                    options.onDelete = onDelete;
                    options.onUpdate = onUpdate;
                }
                const fieldType =
                    data.type === "FILE"
                        ? DataTypes.JSON
                        : data.type === "FOREIGNKEY"
                        ? DataTypes.INTEGER
                        : DataTypes[data.type];

                return {
                    [data.name]: {
                        ...options,
                        type: fieldType,
                    },
                };
            });
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const result = options.reduce((acc: any, field: any) => {
                const fieldName = Object.keys(field)[0];
                acc[fieldName] = field[fieldName];
                return acc;
            }, {});

            // INTEGER,DECIMAL,BOOLEAN, STRING , TEXT, ARRAY, DATE, FILE
            await queryInterface.createTable(capitalize(body.name), {
                ...result,
                slug: result.slug,
                empresa_id: { type: DataTypes.INTEGER, references: "" },
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn("NOW"),
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn("NOW"),
                },
            });
            if (body.isCreatePage) {
                await this.pagesApiService.store(
                    empresa,
                    {
                        icon: body.icon,
                        queries: [],
                        slug: body.slug,
                        description: "",
                        empresa_id: empresa.id,
                        title: body.name,
                        isDinamic: false,
                        enabledHeaderPage: false,
                    } as PagesStoreDto,
                    body.paginator && body.paginator > 0
                        ? paginatorHTML
                        : undefined
                );
            }
            if (body.isDynamicPage) {
                await this.pagesApiService.store(empresa, {
                    icon: body.icon,
                    queries: [],
                    slug: `:${body.slug}`,
                    description: "",
                    empresa_id: empresa.id,
                    title: body.name,
                    enabledHeaderPage: false,
                    isDinamic: true,
                } as PagesStoreDto);
            }
            cache.delete(`EMPRESA:${empresa.slug}`);

            return {
                success: true,
                crud,
            };
        } catch (error) {
            console.log({ error: (error as Error).message });
        }
    }
    async update(empresa: Empresas, id: string, body: CrudUpdateDto) {
        const { crud } = await this.show(empresa, id);
        const [byName, bySlug] = await Promise.all([
            Crud.findOne({
                where: {
                    name: body.name,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                },
                raw: true,
            }),
            Crud.findOne({
                where: {
                    slug: body.slug,
                    id: { [Op.not]: id },
                    empresa_id: empresa.id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(`Ya existe un crud ${body.name}`, {
                body: "name",
            });
        }
        if (bySlug) {
            throw new BadRequestException(`Ya existe un crud ${body.slug}`, {
                body: "slug",
            });
        }

        await crud.update({ ...body, empresa_id: empresa.id });
        if (body.isCreatePage && !crud.isCreatePage) {
            const page = await Page.findOne({
                where: { empresa_id: empresa.id, slug: body.slug },
            });
            if (!page) {
                await this.pagesApiService.store(empresa, {
                    icon: body.icon,
                    queries: [],
                    slug: body.slug,
                    description: "",
                    empresa_id: empresa.id,
                    title: body.name,
                    isDinamic: body.isDynamicPage,
                    enabledHeaderPage: false,
                } as PagesStoreDto);
            }
        }
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Editado correctamente crud",
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { crud } = await this.show(empresa, id);
        let result: never[] | null = null;
        try {
            result = await sequelize.query(
                `SELECT * FROM "${capitalize(crud.name)}" LIMIT 1`,
                {
                    replacements: { id: empresa.id },
                    type: QueryTypes.SELECT,
                }
            );
        } catch (error) {}

        if (result?.length) {
            throw new BadRequestException(
                `Se encontraron columnas ${capitalize(crud.name)}.`
            );
        }
        cache.delete(`${empresa.slug}:TABLE`);
        // const crud = await Crud.findByPk(id);
        await crud.destroy();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropTable(capitalize(crud.name), {
            logging: true,
        });

        cache.delete(`EMPRESA:${empresa.slug}`);

        return {
            success: true,
            message: "Reclamo eliminado",
        };
    }
}
