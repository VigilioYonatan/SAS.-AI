import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { FloorsSchema } from "../schemas/floors.schema";
import { Mesas } from "./mesas.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { V } from "~/libs/helpers";

@Table
export class Floors extends Model implements Omit<FloorsSchema, "id"> {
    @Column({ type: DataType.STRING(100) })
    name: string;

    @HasMany(() => Mesas)
    mesas: Mesas[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
