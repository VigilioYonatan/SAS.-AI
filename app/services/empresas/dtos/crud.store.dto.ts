import {
    getOutput,
    getPipeIssues,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { crudSchema } from "../schemas/crud.schema";
import { Page } from "../entities/page.entity";
import { Crud } from "../entities/crud.entity";

export const crudStoreDto = omitAsync(
    crudSchema,
    ["id"],
    [
        async (input) => {
            const [byName, bySlug] = await Promise.all([
                Crud.findOne({
                    where: {
                        name: input.name,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                Crud.findOne({
                    where: {
                        slug: input.slug,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
            ]);

            if (byName) {
                return getPipeIssues(
                    "title" as keyof Page,
                    `Ya existe la crud con el nombre: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof Page,
                    `Ya existe el crud con el nombre: ${input.slug}`,
                    input
                );
            }

            return getOutput(input);
        },
    ]
);
export type CrudStoreDto = Input<typeof crudStoreDto>;
