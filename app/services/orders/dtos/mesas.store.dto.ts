import { omitAsync, type Input, getPipeIssues, getOutput } from "valibot";
import { mesasSchema, type MesasSchema } from "../schemas/mesas.schema";
import { Floors } from "../entities/floors.entity";

export const mesasStoreDto = omitAsync(
	mesasSchema,
	["id", "mesa_code", "information_id"],
	[
		async (input) => {
			const [byFloor] = await Promise.all([Floors.findByPk(input.floor_id)]);
			if (!byFloor) {
				return getPipeIssues(
					"floor_id" as keyof MesasSchema,
					`No existe un floor con el id: ${input.floor_id}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type MesasStoreDto = Input<typeof mesasStoreDto>;
