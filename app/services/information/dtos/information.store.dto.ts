import {
    getOutput,
    getPipeIssues,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";
import { InformationEntity } from "../entities/information.entity";

export const informationStoreDto = omitAsync(
    informationSchema,
    ["id"],
    [
        async (input) => {
            const [name_empresa, slug] = await Promise.all([
                InformationEntity.findOne({
                    where: {
                        name_empresa: input.name_empresa,
                    },
                }),
                InformationEntity.findOne({
                    where: {
                        slug: input.slug,
                    },
                }),
            ]);
            if (name_empresa) {
                return getPipeIssues(
                    "name_empresa",
                    `ya existe ${input.name_empresa}`,
                    input
                );
            }
            if (slug) {
                return getPipeIssues("slug", `ya existe ${input.slug}`, input);
            }
            return getOutput(input);
        },
    ]
);

export type InformationStoreDto = Input<typeof informationStoreDto>;
