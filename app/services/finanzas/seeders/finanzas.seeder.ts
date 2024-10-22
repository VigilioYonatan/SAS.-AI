import type {
	CategoryFinanzasSchema,
	TipoFinanzasSchema,
} from "@/finanzas/schemas/tipo.schema";

export const finanzasSeeder: (Omit<TipoFinanzasSchema, "id" | "empresa_id"> & {
	categories: Omit<
		CategoryFinanzasSchema,
		"id" | "empresa_id" | "tipo_finanza_id"
	>[];
})[] = [
	{
		name: "Ingresos",
		categories: [
			{
				value: "Sueldo mensual",
				icon: "<i class='fa-solid fa-sack-dollar'></i>",
			},
			{
				value: "Otro",
				icon: "",
			},
		],
	},
	{
		name: "Egresos",
		categories: [
			{
				value: "Vivienda",
				icon: "<i class='fa-solid fa-house'></i>",
			},
			{
				value: "Alimentación",
				icon: "<i class='fa-solid fa-utensils'></i>",
			},
			{
				value: "Transporte",
				icon: "<i class='fa-solid fa-cars'></i>",
			},
			{
				value: "Recibo de Luz",
				icon: "<i class='fa-solid fa-lightbulb'></i>",
			},
			{
				value: "Recibo de Agua",
				icon: "<i class='fa-solid fa-droplet'></i>",
			},
			{
				value: "Gastos personales",
				icon: "<i class='fa-solid fa-face-tongue-money'></i>",
			},
			{
				value: "Otro",
				icon: "",
			},
		],
	},
];
