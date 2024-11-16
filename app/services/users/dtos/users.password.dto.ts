import {
	type Input,
	string,
	objectAsync,
	toTrimmed,
	minLength,
	maxLength,
	custom,
} from "@vigilio/valibot";

export const usersPasswordDto = objectAsync({
	passwordActual: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
		custom(
			(val) => /[a-zA-Z]/.test(val),
			"Deber tener por lo menos una letra.",
		),
		custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
	]),
	newPassword: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
		custom(
			(val) => /[a-zA-Z]/.test(val),
			"Deber tener por lo menos una letra.",
		),
		custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
	]),
	repeatNewPassword: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
		custom(
			(val) => /[a-zA-Z]/.test(val),
			"Deber tener por lo menos una letra.",
		),
		custom((val) => /\d/.test(val), "Deber tener por lo menos un número."),
	]),
});
export type UsersPasswordDto = Input<typeof usersPasswordDto>;
