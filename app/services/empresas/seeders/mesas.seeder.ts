import type { FloorsSchema } from "@/orders/schemas/floors.schema";
import type { MesasSchema } from "@/orders/schemas/mesas.schema";

export const mesasSeeder: (Omit<FloorsSchema, "empresa_id"> & {
	mesas: Omit<MesasSchema, "id" | "floor_id" | "empresa_id">[];
})[] = [
	{
		id: 1,
		name: "Piso 1",
		mesas: [
			{ mesa_code: "MESA-000001" },
			{ mesa_code: "MESA-000002" },
			{ mesa_code: "MESA-000003" },
			{ mesa_code: "MESA-000004" },
		],
	},
];
