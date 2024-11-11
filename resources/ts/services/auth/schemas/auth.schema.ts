import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";

export type AuthLogin = Omit<UsersSchemaFromServer, "password"> & {
	products_favorites_length: number;
};
