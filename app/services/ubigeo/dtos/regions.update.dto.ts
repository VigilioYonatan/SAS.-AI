import { pickAsync, type Input } from "@vigilio/valibot";
import { regionsEmpresaSchema } from "../schemas/regions_empresa.schema";
export const regionsUpdateDto = pickAsync(regionsEmpresaSchema, [
	"priceShipping",
	"enabled",
	"days",
]);
export type RegionsUpdateDto = Input<typeof regionsUpdateDto>;
