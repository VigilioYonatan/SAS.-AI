import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
	array,
	boolean,
	custom,
	maxLength,
	minLength,
	nullable,
	number,
	objectAsync,
	string,
	type Input,
} from "@vigilio/valibot";

export const settingsSchema = objectAsync({
	id: number(),
	host: nullable(
		string([
			custom((val) => !val.startsWith("https://www"), "URL: empresa.com"),
			custom((val) => !val.endsWith("/"), "URL: empresa.com"),
		]),
	),
	about: nullable(string()), //  acerca de la empresa
	bg_color: string([minLength(2), maxLength(10)]),
	bg_color_responsive: string([minLength(2), maxLength(10)]),
	type_border: string([
		custom((val) => ["circle", "square"].includes(val), "Border no válido"),
	]),
	type_cart: string([
		custom(
			(val) =>
				[
					"far fa-shopping-cart",
					"far fa-shopping-bag",
					"far fa-shopping-basket",
				].includes(val),
			"Border no válido",
		),
	]),
	isCoverImage: boolean(),
	icon: nullable(array(filesSchema([100, 300]))), //obligatorio
	photo: nullable(array(filesSchema())),
	empresa_id: number(),
});
export type SettingsSchema = Input<typeof settingsSchema>;
