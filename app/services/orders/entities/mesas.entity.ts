import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { MesasSchema } from "../schemas/mesas.schema";
import { Orders } from "./orders.entity";
import { Floors } from "./floors.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Mesas extends Model implements Omit<MesasSchema, "id"> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    mesa_code: string;

    @ForeignKey(() => Floors)
    @Column({ type: DataType.INTEGER, allowNull: false })
    floor_id: number;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    // mesas - floor : one - to many
    @BelongsTo(() => Floors)
    floor: V<Floors>;

    // mesas - orders: one to many
    @HasMany(() => Orders)
    orders: V<Orders>[];

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
