import {
	omitAsync,
	type Input,
	getPipeIssues,
	getOutput,
} from "@vigilio/valibot";
import { urlsSchema, type UrlsSchema } from "../schemas/urls.schema";
import { Urls } from "../entities/urls.entity";

export const urlsStoreDto = omitAsync(
	urlsSchema,
	["id"],
	[
		async (input) => {
			const [byName, byhash] = await Promise.all([
				Urls.findOne({
					where: {
						web: input.web,
					},
					raw: true,
				}),
				Urls.findOne({
					where: {
						hash: input.hash,
					},
					raw: true,
				}),
			]);
			if (byName) {
				return getPipeIssues(
					"web" as keyof UrlsSchema,
					`Ya existe un url con el web: ${input.web}`,
					input,
				);
			}
			if (byhash) {
				return getPipeIssues(
					"hash" as keyof UrlsSchema,
					`Ya existe un url con el web: ${input.hash}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type UrlsStoreDto = Input<typeof urlsStoreDto>;
