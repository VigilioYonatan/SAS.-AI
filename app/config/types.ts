import type { Empresas } from "@/empresas/entities/empresas.entity";
import type { Money } from "@/empresas/libs";
import type { Users } from "@/users/entities/users.entity";
import type { Request } from "express";

export type RequestVigilio = Request & {
    empresa: Empresas;
    user: Users;
    money: {
        money: Money;
        moneyValue: null | Record<Money, number>;
    };
    moneyConverter: number;
};
