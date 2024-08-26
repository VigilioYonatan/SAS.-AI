import { pick, type Input } from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";

export const informationIAUpdateDto = pick(informationSchema, [
	"inteligenceArtificial",
]);

export type InformationIAUpdateDto = Input<typeof informationIAUpdateDto>;
