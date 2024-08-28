import {
    getOutput,
    getPipeIssues,
    mergeAsync,
    object,
    omitAsync,
    string,
    type Input,
} from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";
import { InformationEntity } from "../entities/information.entity";

export const informationStoreDto = mergeAsync([
    omitAsync(
        informationSchema,
        ["id"],
        [
            async (input) => {
                const [slug] = await Promise.all([
                    InformationEntity.findOne({
                        where: {
                            slug: input.slug,
                        },
                    }),
                ]);

                if (slug) {
                    return getPipeIssues(
                        "slug",
                        `ya existe ${input.slug}`,
                        input
                    );
                }
                return getOutput(input);
            },
        ]
    ),
    object({ fullname: string(), password: string() }),
]);

export type InformationStoreDto = Input<typeof informationStoreDto>;
