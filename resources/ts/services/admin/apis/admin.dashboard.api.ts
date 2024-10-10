import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import { useQuery } from "@vigilio/preact-fetching";
import { ClientSchema } from "../../../../../app/services/users/schemas/client.schema";

export function adminDashboardApi() {
	return useQuery<AdminDashboardAPI, unknown>(
		"/admin/dashboard",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface AdminDashboardAPI {
	success: boolean;
	results: Result;
}
export type UsersLimit30 = Pick<
	UsersSchemaFromServer,
	"id" | "username" | "email" | "slug" | "photo" | "createdAt"
>;
export interface Result {
	counts: Counts;
	usersLimit30: UsersLimit30[];
	ratingYearArray: RatingYearArray[];
	usersMostOrders: {
		cantidad: number;
		client: ClientSchema;
	}[];
}

export interface Counts {
	users: number;
	products: number;
	categories: number;
	gananciasMensual: number;
}

export interface RatingYearArray {
	value: number;
	time: string;
}

export interface Photo {
	dimension: number;
	file: string;
}

export interface Role {
	id: number;
	name: string;
	icon: string;
}
