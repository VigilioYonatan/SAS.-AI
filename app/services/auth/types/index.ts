import type { Users } from "@/users/entities/users.entity";

export type AuthUserLogin = Pick<Users, "id">;
export type AuthUser = Omit<Users, "password">;
