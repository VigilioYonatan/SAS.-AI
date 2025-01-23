import { omitAsync, type Input, getPipeIssues, getOutput } from "valibot";
import { floorsSchema, type FloorsSchema } from "../schemas/floors.schema";
import { Floors } from "../entities/floors.entity";

export const floorsStoreDto = omitAsync(
    floorsSchema,
    ["id"],
    [
        async (input) => {
            const [by_name] = await Promise.all([
                Floors.unscoped().findOne({
                    where: {
                        name: input.name,
                        empresa_id: input.empresa_id,
                    },
                    raw: true,
                }),
            ]);

            if (by_name) {
                return getPipeIssues(
                    "name" as keyof FloorsSchema,
                    `Ya existe un floor con el nombre: ${input.name}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);
export type FloorsStoreDto = Input<typeof floorsStoreDto>;
