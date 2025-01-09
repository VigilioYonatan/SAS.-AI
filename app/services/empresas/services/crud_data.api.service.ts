import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@vigilio/express-core";
import type { Empresas } from "../entities/empresas.entity";
import { QueryTypes } from "sequelize";
import { sequelize } from "~/config/db.config";
import { capitalize, slug } from "@vigilio/express-core/helpers";
import { removeFile } from "@/uploads/libs/helpers";
import { Crud } from "../entities/crud.entity";
import { joins, relation } from "@/common/paginator/libs";

@Injectable()
export class CrudDateApiService {
    async index(empresa: Empresas, type: string) {
        const key = capitalize(type);
        const data = await sequelize.query(
            `SELECT * FROM "${key}" WHERE "${type}"."empresa_id" = :empresa_id`,
            {
                replacements: { empresa_id: empresa.id },
                type: QueryTypes.SELECT,
            }
        );
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, type: string, slug: string) {
        const cr = await Crud.findOne({
            where: {
                name: type,
                empresa_id: empresa.id,
            },
        });
        if (!cr) {
            throw new BadRequestException("no crud found");
        }
        const key = capitalize(type);
        const [attributes, join] = await joins(cr, empresa);

        const crud = await sequelize.query(
            `SELECT  "${cr.name}".* ${
                attributes?.length ? `, ${attributes}` : ""
            } FROM "${key}" ${join} WHERE "${key}"."empresa_id" = :empresa_id AND  "${key}"."id" = :id `,
            {
                replacements: { empresa_id: empresa.id, id: slug },
                type: QueryTypes.SELECT,
            }
        );
        if (!crud[0]) {
            throw new BadRequestException(`no se encontró ${key} - ${slug} `);
        }
        const c = relation(crud);
        return {
            success: true,
            [type]: c[0] as Record<string, unknown>,
        };
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async store(empresa: Empresas, type: string, body: Record<string, any>) {
        const keys = Object.keys({ ...body, slug: slug(body.slug) });
        const values = Object.keys({ ...body, slug: slug(body.slug) });
        const crud = await Crud.findOne({
            where: {
                name: type,
                empresa_id: empresa.id,
            },
        });
        if (!crud) {
            throw new NotFoundException("no se encontró sql");
        }
        const key = capitalize(type);
        await Promise.all(
            crud.data.map(async (c) => {
                if (c.options.unique) {
                    const crud = await sequelize.query(
                        `SELECT * FROM "${key}" WHERE "${key}"."empresa_id" = :empresa_id AND  "${key}"."${c.name}" = :${c.name} `,
                        {
                            replacements: {
                                empresa_id: empresa.id,
                                [c.name]: body[c.name],
                            },
                            type: QueryTypes.SELECT,
                        }
                    );
                    if (crud[0]) {
                        throw new BadRequestException(
                            `Ya existe - ${body[c.name]} ${c.name} `,
                            {
                                body: c.name,
                            }
                        );
                    }
                }
            })
        );

        try {
            const result = await sequelize.query(
                `INSERT INTO "${key}" ("empresa_id", ${keys
                    .map((val) => `"${val}"`)
                    .join(", ")})
                         VALUES (:empresa_id, ${values
                             .map((val) => `:${val}`)
                             .join(", ")})`,
                {
                    replacements: {
                        empresa_id: empresa.id,
                        ...body,
                    },
                    type: QueryTypes.INSERT,
                }
            );
            return {
                success: true,
                [type]: result,
            };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
    async update(
        empresa: Empresas,
        type: string,
        id: string,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        body: Record<string, any>
    ) {
        body.updatedAt = new Date();
        await this.show(empresa, type, id);

        const key = capitalize(type);
        const keys = Object.keys(body);
        await sequelize.query(
            `UPDATE "${key}" 
             SET ${keys.map((val) => `"${val}" = :${val}`).join(", ")} 
             WHERE "empresa_id" = :empresa_id AND "id" = :id`,
            {
                replacements: {
                    empresa_id: empresa.id, // ID de la empresa
                    id, // ID del registro a actualizar
                    ...body, // Datos dinámicos para los campos a actualizar
                },
                type: QueryTypes.UPDATE,
            }
        );

        return {
            success: true,
            message: "Editado correctamente crud",
        };
    }

    async destroy(empresa: Empresas, type: string, id: string) {
        const result = await this.show(empresa, type, id);

        await sequelize.query(
            `DELETE FROM "${capitalize(
                type
            )}" WHERE id = :id AND empresa_id = :empresa_id`,
            {
                replacements: {
                    id: (result[type] as { id: number }).id,
                    empresa_id: empresa.id,
                },
                type: QueryTypes.DELETE,
            }
        );
        const crud = await Crud.findOne({
            where: {
                name: type,
                empresa_id: empresa.id,
            },
        });
        if (!crud) {
            throw new NotFoundException("no se encontró sql");
        }

        for (const data of crud.data) {
            if (
                data.type === "FILE" &&
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (result as any)[type][data.name as keyof typeof result]
            ) {
                removeFile(
                    empresa.slug,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (result as any)[type][data.name as keyof typeof result]
                );
            }
        }

        return {
            success: true,
            message: "Reclamo eliminado",
        };
    }
}
