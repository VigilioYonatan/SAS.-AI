import type { Input } from "valibot";
import {
	boolean,
	coerce,
	date,
	maxLength,
	minLength,
	nullable,
	number,
	object,
	picklist,
	string,
} from "valibot";

export const typeOfConsumptionSchema = picklist(
	["Producto", "Servicio"],
	"Tipo de consumo no válido",
);

export const typeComplaintSchema = picklist(
	["Queja", "Reclamo"],
	"Tipo de queja no válido",
);

export const complaintsSchema = object({
	id: number(),
	fullName: string("El nombre completo es requerido.", [
		minLength(3, "El nombre completo debe tener al menos 3 caracteres."),
		maxLength(100, "El nombre completo debe tener como máximo 100 caracteres."),
	]),
	phone: string("El número de teléfono es requerido.", [
		minLength(6, "El número de teléfono debe tener al menos 9 caracteres."),
		maxLength(15, "El número de teléfono debe tener como máximo 9 caracteres."),
	]),
	numberDocument: string("El número de documento es requerido.", [
		minLength(5, "El número de documento debe tener al menos 8 caracteres."),
		maxLength(
			15,
			"El número de documento debe tener como máximo 11 caracteres.",
		),
	]),
	email: string("El correo electrónico es requerido.", [
		minLength(3, "El correo electrónico debe tener al menos 3 caracteres."),
		maxLength(
			100,
			"El correo electrónico debe tener como máximo 100 caracteres.",
		),
	]),
	guardianName: nullable(string()),
	address: string("La dirección es requerida.", [
		minLength(3, "La dirección debe tener al menos 3 caracteres."),
		maxLength(100, "La dirección debe tener como máximo 100 caracteres."),
	]),
	typeComplaint: typeComplaintSchema,
	detailsOfComplaint: string("Los detalles de la queja son requeridos.", [
		minLength(3, "Los detalles de la queja deben tener al menos 3 caracteres."),
	]),
	typeOfConsumption: typeOfConsumptionSchema,
	detailsOfConsumption: string("Los detalles del consumo son requeridos.", [
		minLength(3, "Los detalles del consumo deben tener al menos 3 caracteres."),
	]),
	dateOfComplaint: coerce(date(), (value) => new Date(value as string)),
	declareempresaCorrect: boolean(
		"Debes declarar que la información es correcta",
	),
	declareReadedPrivacyPolicy: boolean(
		"Debes declarar que has leído la política de privacidad",
	),
});

export type ComplaintsSchema = Input<typeof complaintsSchema>;

export type ComplaintsSchemaFromServer = ComplaintsSchema & {
	createdAt: string;
	updatedAt: string;
};
