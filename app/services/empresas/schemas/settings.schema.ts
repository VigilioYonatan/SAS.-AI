import { filesSchema } from "@/uploads/schemas/uploads.schema";
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
	objectAsync,
	string,
	type Input,
} from "@vigilio/valibot";
const hamrguers = [
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
});
export const settingsSchema = objectAsync({
	id: number(),
	host: hostSchema,
	about: nullable(string()), //  acerca de la empresa
	bg_color: string([minLength(2), maxLength(10)]),
	bg_color_responsive: string([minLength(2), maxLength(10)]),
	isDark: boolean(),
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
	icon: nullable(array(filesSchema([100, 300]))), //obligatorio
	photo: nullable(array(filesSchema())),
	isLogoImage: boolean(),
	isScrolling: boolean(),
	hamburger: string([
		custom((val) => hamrguers.includes(val), "Hamburguesa no válida"),
	]),
	empresa_id: number(),
});
export type SettingsSchema = Input<typeof settingsSchema>;
