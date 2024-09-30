import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import {
	array,
	boolean,
	coerce,
	custom,
	date,
	maxLength,
	minLength,
	nullable,
	number,
	object,
	string,
	type Input,
} from "@vigilio/valibot";
import { filesSchema } from "~/libs/upload";

export const hamburgers = [
	"fas fa-pizza-slice",
	"fas fa-soup",
	"fas fa-car",
	"fas fa-utensils-alt",
	"fas fa-gamepad-alt",
	"fas fa-hamburger",
	"fas fa-bars",
];
export const hostSchema = object({
	host: nullable(
		string([
			custom((val) => !val.startsWith("https://www"), "URL: empresa.com"),
			custom((val) => !val.endsWith("/"), "URL: empresa.com"),
		]),
	),
	nameserver_one: nullable(string()),
	nameserver_two: nullable(string()),
	time: nullable(coerce(date(), (value) => new Date(value as string))),
	enabled: boolean(),
});
export const settingsSchema = object({
	id: number(),
	host: hostSchema,
	about: nullable(string()), //  acerca de la empresa
	bg_color: string([minLength(2), maxLength(20)]),
	bg_color_responsive: string([minLength(2), maxLength(20)]),
	type_border: string([
		custom((val) => ["circle", "square"].includes(val), "Border no válido"),
	]),
	type_cart: string([
		custom(
			(val) =>
				[
					"fas fa-shopping-cart",
					"fas fa-shopping-bag",
					"fas fa-shopping-basket",
				].includes(val),
			"Border no válido",
		),
	]),
	isCoverImage: boolean(),
	isScrolling: boolean(),
	icon: nullable(array(filesSchema())), //obligatorio
	photo: nullable(array(filesSchema())),
	isDark: boolean(),
	isLogoImage: boolean(),
	empresa_id: number(),
	hamburger: string([
		custom((val) => hamburgers.includes(val), "Hamburguesa no válida"),
	]),
});
export type SettingsSchema = Input<typeof settingsSchema>;
export type SettingsSchemaFromServer = SettingsSchema & {
	city: CitiesSchemaFromServer;
};
