import {
    getOutput,
    getPipeIssues,
    omitAsync,
    type Input,
} from "@vigilio/valibot";
import { type ClientSchema, clientsSchema } from "../schemas/client.schema";
import { Clients } from "../entities/clients.entity";

export const clientsStoreDto = omitAsync(
    clientsSchema,
    ["id"],
    [
        async (input) => {
            const [telephone] = await Promise.all([
                Clients.findOne({
                    where: {
                        dni: input.telephone,
                        information_id: input.information_id,
                    },
                    raw: true,
                }),
            ]);

            if (telephone) {
                return getPipeIssues(
                    "telephone" as keyof ClientSchema,
                    `Ya existe un usuario con el username: ${input.telephone}`,
                    input
                );
            }

            return getOutput(input);
        },
    ]
);

export type ClientsStoreDto = Input<typeof clientsStoreDto>;
