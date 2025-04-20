import {
    Column,
    DataType,
    Model,
    Table,
    Index,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { CouponsSchema } from "../schemas/coupons.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Coupons extends Model implements Omit<CouponsSchema, "id"> {
    @Index
    @Column({ type: DataType.STRING(30), allowNull: false })
    coupon: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    discount: number;

    @Column({ type: DataType.DATE, allowNull: false })
    date: Date;

    @Column({ type: DataType.INTEGER, allowNull: false })
    max_use: number;

    @Column({ type: DataType.JSON, allowNull: false })
    categories: number[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
