import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Users } from "@/users/entities/users.entity";
import type { Request } from "express";

export type RequestVigilio = Request & {
    empresa: Empresas;
    user: Users;
};
