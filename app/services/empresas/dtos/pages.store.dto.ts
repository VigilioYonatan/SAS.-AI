import {
    getOutput,
    getPipeIssues,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { pagesSchema } from "../schemas/pages.schema";
import { Page } from "../entities/page.entity";

export const pagesStoreDto = omitAsync(
    pagesSchema,
    ["id", "isDinamic"],
    [
        async (input) => {
            const [byTitle, bySlug] = await Promise.all([
                Page.findOne({
                    where: {
                        title: input.title,
                        isDinamic: false,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
                Page.findOne({
                    where: {
                        slug: input.slug,
                        empresa_id: input.empresa_id,
                        isDinamic: false,
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
