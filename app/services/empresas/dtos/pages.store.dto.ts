import {
    getOutput,
    getPipeIssues,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";
import { Page } from "../entities/page.entity";
import { Op } from "sequelize";

export const pagesStoreDto = omitAsync(
    pagesSchema,
    ["id", "isDinamic"],
    [
        async (input) => {
            const [byTitle, bySlug] = await Promise.all([
                Page.findOne({
                    where: {
                        title: input.title,
                        [Op.or]: [
                            { isDinamic: { [Op.not]: false } },
                            { isDinamic: { [Op.is]: null } }, // Incluye registros donde isDinamic es NULL
                        ],
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                Page.findOne({
                    where: {
                        slug: input.slug,
                        empresa_id: input.empresa_id,
                        [Op.or]: [
                            { isDinamic: { [Op.not]: false } },
                            { isDinamic: { [Op.is]: null } }, // Incluye registros donde isDinamic es NULL
                        ],
                    },
                    raw: true,
                }),
            ]);

            if (byTitle) {
                return getPipeIssues(
                    "title" as keyof Page,
                    `Ya existe la página con el nombre: ${input.title}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof Page,
                    `Ya existe la página con el nombre: ${input.title}`,
                    input
                );
            }

            return getOutput(input);
        },
    ]
);
export type PagesStoreDto = Input<typeof pagesStoreDto>;
